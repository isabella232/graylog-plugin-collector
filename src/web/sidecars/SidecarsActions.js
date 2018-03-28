import Reflux from 'reflux';

const SidecarsActions = Reflux.createActions({
  list: { asyncResult: true },
  getSidecar: { asyncResult: true },
  getSidecarActions: { asyncResult: true },
  restartCollector: { asyncResult: true },
  assignConfigurations: { asyncResult: true },
});

export default SidecarsActions;
