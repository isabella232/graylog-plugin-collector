import React from 'react';
import { Button, ButtonToolbar, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import DocsHelper from 'util/DocsHelper';
import DocumentationLink from 'components/support/DocumentationLink';
import { DocumentTitle, PageHeader } from 'components/common';
import Routes from 'routing/Routes';

import ConfigurationList from './ConfigurationList';
import CollectorListContainer from './CollectorListContainer';

const ConfigurationPage = React.createClass({
  render() {
    return (
      <DocumentTitle title="Collectors Configuration">
        <span>
          <PageHeader title="Collectors Configuration">
            <span>
              The Collector Sidecar runs next to your favourite log collector and configures it for you. Here you can
              manage the Sidecar configurations.
            </span>

            <span>
              Read more about the collector sidecar in the{' '}
              <DocumentationLink page={DocsHelper.PAGES.COLLECTOR_SIDECAR} text="Graylog documentation" />.
            </span>

            <ButtonToolbar>
              <LinkContainer to={Routes.pluginRoute('SYSTEM_SIDECARS')}>
                <Button bsStyle="info">Overview</Button>
              </LinkContainer>
              <LinkContainer to={Routes.pluginRoute('SYSTEM_SIDECARS_ADMINISTRATION')}>
                <Button bsStyle="info">Administration</Button>
              </LinkContainer>
              <LinkContainer to={Routes.pluginRoute('SYSTEM_SIDECARS_CONFIGURATION')}>
                <Button bsStyle="info" className="active">Configuration</Button>
              </LinkContainer>
            </ButtonToolbar>
          </PageHeader>

          <Row className="content">
            <Col md={12}>
              <ConfigurationList />
            </Col>
          </Row>
          <Row className="content">
            <Col md={12}>
              <CollectorListContainer />
            </Col>
          </Row>
        </span>
      </DocumentTitle>
    );
  },
});

export default ConfigurationPage;
