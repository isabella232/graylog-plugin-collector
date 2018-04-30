import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import lodash from 'lodash';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { naturalSortIgnoreCase } from 'util/SortUtils';
import { SelectPopover } from 'components/common';
import CollectorIndicator from '../sidecars/CollectorIndicator';
import ColorLabel from '../common/ColorLabel';

const CollectorsAdministrationFilters = createReactClass({
  propTypes: {
    collectors: PropTypes.array.isRequired,
    configurations: PropTypes.array.isRequired,
    filter: PropTypes.func.isRequired,
  },

  getCollectorsFilter() {
    const collectors = this.props.collectors
      .sort((c1, c2) => naturalSortIgnoreCase(c1.name, c2.name))
      // Hack to be able to filter in SelectPopover. We should change that to avoid this hack.
      .map(collector => `${collector.id};${collector.name}`);

    const collectorFormatter = (collectorId) => {
      const [id] = collectorId.split(';');
      const collector = lodash.find(this.props.collectors, { id: id });
      return <CollectorIndicator collector={collector.name} operatingSystem={collector.node_operating_system} />;
    };

    const filter = ([collectorId]) => {
      const [id] = collectorId ? collectorId.split(';') : [];
      this.props.filter('backend', id);
    };

    return (
      <SelectPopover id="collector-filter"
                     title="Filter by collector"
                     triggerNode={<Button bsSize="small" bsStyle="link">Collector <span className="caret" /></Button>}
                     items={collectors}
                     itemFormatter={collectorFormatter}
                     onItemSelect={filter}
                     filterPlaceholder="Filter by collector" />
    );
  },

  getConfigurationFilter() {
    const configurations = this.props.configurations
      .sort((c1, c2) => naturalSortIgnoreCase(c1.name, c2.name))
      // Hack to be able to filter in SelectPopover. We should change that to avoid this hack.
      .map(configuration => `${configuration.id};${configuration.name}`);

    const configurationFormatter = (configurationId) => {
      const [id] = configurationId.split(';');
      const configuration = lodash.find(this.props.configurations, { id: id });
      return <span><ColorLabel color={configuration.color} size="xsmall" /> {configuration.name}</span>;
    };

    const filter = ([configurationId]) => {
      const [id] = configurationId ? configurationId.split(';') : [];
      this.props.filter('configuration', id);
    };

    return (
      <SelectPopover id="configuration-filter"
                     title="Filter by configuration"
                     triggerNode={<Button bsSize="small" bsStyle="link">Configuration <span className="caret" /></Button>}
                     items={configurations}
                     itemFormatter={configurationFormatter}
                     onItemSelect={filter}
                     filterPlaceholder="Filter by configuration" />
    );
  },

  getOSFilter() {
    const operatingSystems = lodash
      .uniq(this.props.collectors.map(collector => lodash.upperFirst(collector.node_operating_system)))
      .sort(naturalSortIgnoreCase);

    const filter = ([os]) => this.props.filter(({ sidecar }) => sidecar.node_details.operating_system.match(os, 'i'));

    return (
      <SelectPopover id="os-filter"
                     title="Filter by OS"
                     triggerNode={<Button bsSize="small" bsStyle="link">OS <span className="caret" /></Button>}
                     items={operatingSystems}
                     onItemSelect={filter}
                     filterPlaceholder="Filter by OS" />
    );
  },

  getStatusFilter() {
    // TODO Implement this filter
    return (
      <SelectPopover id="status-filter"
                     title="Filter by status"
                     triggerNode={<Button bsSize="small" bsStyle="link">Status <span className="caret" /></Button>}
                     items={[]}
                     onItemSelect={() => {}}
                     filterPlaceholder="Filter by status" />
    );
  },

  render() {
    return (
      <ButtonToolbar>
        {this.getCollectorsFilter()}
        {this.getConfigurationFilter()}
        {this.getOSFilter()}
        {this.getStatusFilter()}
      </ButtonToolbar>
    );
  },
});

export default CollectorsAdministrationFilters;
