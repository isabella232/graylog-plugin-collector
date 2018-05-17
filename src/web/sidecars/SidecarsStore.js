import Reflux from 'reflux';
import URI from 'urijs';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import fetch, { fetchPeriodically } from 'logic/rest/FetchProvider';

import SidecarsActions from './SidecarsActions';

const SidecarsStore = Reflux.createStore({
  listenables: [SidecarsActions],
  sourceUrl: '/plugins/org.graylog.plugins.collector/sidecar/collectors',
  sidecars: undefined,
  onlyActive: undefined,
  pagination: {
    count: undefined,
    page: undefined,
    pageSize: undefined,
    total: undefined,
  },
  query: undefined,
  sort: {
    field: undefined,
    order: undefined,
  },

  init() {
    this.propagateChanges();
  },

  propagateChanges() {
    this.trigger({
      sidecars: this.sidecars,
      query: this.query,
      onlyActive: this.onlyActive,
      pagination: this.pagination,
      sort: this.sort,
    });
  },

  listPaginated({ query = '', page = 1, pageSize = 50, onlyActive = false, sortField = 'node_name', order = 'asc' }) {
    const search = {
      query: query,
      page: page,
      per_page: pageSize,
      only_active: onlyActive,
      sort: sortField,
      order: order,
    };

    const uri = URI(this.sourceUrl).search(search).toString();
    const promise = fetchPeriodically('GET', URLUtils.qualifyUrl(uri));

    promise.then(
      (response) => {
        this.sidecars = response.collectors;
        this.query = response.query;
        this.onlyActive = response.only_active;
        this.pagination = {
          total: response.total,
          count: response.count,
          page: response.page,
          pageSize: response.per_page,
        };
        this.sort = {
          field: response.sort,
          order: response.order,
        };
        this.propagateChanges();

        return response;
      },
      (error) => {
        UserNotification.error(`Fetching Sidecars failed with status: ${error}`,
          'Could not retrieve Sidecars');
      });

    SidecarsActions.listPaginated.promise(promise);
  },

  getSidecar(sidecarId) {
    const promise = fetchPeriodically('GET', URLUtils.qualifyUrl(`${this.sourceUrl}/${sidecarId}`));
    promise
      .catch(
        error => {
          UserNotification.error(`Fetching Sidecar failed with status: ${error}`,
            'Could not retrieve Sidecar');
        });
    SidecarsActions.getSidecar.promise(promise);
  },

  restartCollector(sidecarId, collector) {
    const action = {};
    action.backend = collector;
    action.properties = {};
    action.properties.restart = true;
    const promise = fetch('PUT', URLUtils.qualifyUrl(`${this.sourceUrl}/${sidecarId}/action`), [action]);
    promise
      .catch(
        error => {
          UserNotification.error(`Restarting Sidecar failed with status: ${error}`,
            'Could not restart Sidecar');
        });
    SidecarsActions.restartCollector.promise(promise);
  },

  getSidecarActions(sidecarId) {
    const promise = fetchPeriodically('GET', URLUtils.qualifyUrl(`${this.sourceUrl}/${sidecarId}/action`));
    promise
      .catch(
        error => {
          UserNotification.error(`Fetching Sidecar actions failed with status: ${error}`,
            'Could not retrieve Sidecar actions');
        });
    SidecarsActions.getSidecarActions.promise(promise);
  },

  toConfigurationAssignmentDto(nodeId, backendId, configurationId) {
    return {
      node_id: nodeId,
      backend_id: backendId,
      configuration_id: configurationId,
    };
  },

  assignConfigurations(sidecars, configurations) {
    const nodes = sidecars.map(({ sidecar, collector }) => {
      // Add all previous assignments, but the one that was changed
      const assignments = sidecar.assignments.filter(assignment => assignment.backend_id !== collector.id);

      // Add new assignments
      configurations.forEach((configuration) => {
        assignments.push({ backend_id: collector.id, configuration_id: configuration.id });
      });

      return { node_id: sidecar.node_id, assignments: assignments };
    });

    const promise = fetch('PUT', URLUtils.qualifyUrl(`${this.sourceUrl}/configurations`), { nodes: nodes })
      .then(
        (response) => {
          UserNotification.success('Collectors will change their configurations shortly.',
            `Configuration change for ${sidecars.length} collectors requested`);
          this.list();
          return response;
        },
        (error) => {
          UserNotification.error(`Fetching Sidecar actions failed with status: ${error}`,
            'Could not retrieve Sidecar actions');
        },
      );
    SidecarsActions.assignConfigurations.promise(promise);
  },
});

export default SidecarsStore;
