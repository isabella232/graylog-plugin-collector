import Reflux from 'reflux';

const CollectorConfigurationsActions = Reflux.createActions({
  list: { asyncResult: true },
  getConfiguration: { asyncResult: true },
  createConfiguration: { asyncResult: true },
  updateConfiguration: { asyncResult: true },
  renderPreview: { asyncResult: true },
  saveSnippet: { asyncResult: true },
  copyConfiguration: { asyncResult: true },
  delete: { asyncResult: true },
});

export default CollectorConfigurationsActions;
