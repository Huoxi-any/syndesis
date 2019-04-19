import { getSteps, WithConnections } from '@syndesis/api';
import {
  ButtonLink,
  IntegrationEditorChooseConnection,
  IntegrationEditorConnectionsListItem,
  IntegrationEditorLayout,
  IntegrationsListSkeleton,
} from '@syndesis/ui';
import { WithLoader, WithRouteData } from '@syndesis/utils';
import * as React from 'react';
import { PageTitle } from '../../../../../../shared';
import {
  IntegrationCreatorBreadcrumbs,
  IntegrationEditorSidebar,
} from '../../../../components';
import resolvers from '../../../../resolvers';
import {
  ISelectConnectionRouteParams,
  ISelectConnectionRouteState,
} from '../../../editorInterfaces';

/**
 * This page shows the list of connections containing actions with a **to**
 * pattern.
 * It's supposed to be used for 3.add.1 of the creation wizard.
 *
 * This component expects some [params]{@link ISelectConnectionRouteParams} and
 * [state]{@link ISelectConnectionRouteState} to be properly set in the route
 * object.
 *
 * **Warning:** this component will throw an exception if the route state is
 * undefined.
 */
export class SelectConnectionPage extends React.Component {
  public render() {
    return (
      <WithRouteData<ISelectConnectionRouteParams, ISelectConnectionRouteState>>
        {({ flow, position }, { integration }) => {
          const positionAsNumber = parseInt(position, 10);
          return (
            <>
              <PageTitle title={'Choose a connection'} />
              <IntegrationEditorLayout
                header={<IntegrationCreatorBreadcrumbs step={3} />}
                sidebar={
                  <IntegrationEditorSidebar
                    steps={getSteps(integration, 0)}
                    addAtIndex={positionAsNumber}
                    addI18nTitle={`${positionAsNumber + 1}. Start`}
                    addI18nTooltip={'Start'}
                    addI18nDescription={'Choose a connection'}
                  />
                }
                content={
                  <WithConnections>
                    {({ data, hasData, error }) => (
                      <IntegrationEditorChooseConnection
                        i18nTitle={'Choose a connection'}
                        i18nSubtitle={
                          'Click the connection that completes the integration. If the connection you need is not available, click Create Connection.'
                        }
                      >
                        <WithLoader
                          error={error}
                          loading={!hasData}
                          loaderChildren={<IntegrationsListSkeleton />}
                          errorChildren={<div>TODO</div>}
                        >
                          {() => (
                            <>
                              {data.connectionsWithToAction.map((c, idx) => (
                                <IntegrationEditorConnectionsListItem
                                  key={idx}
                                  integrationName={c.name}
                                  integrationDescription={
                                    c.description || 'No description available.'
                                  }
                                  icon={
                                    <img src={c.icon} width={24} height={24} />
                                  }
                                  actions={
                                    <ButtonLink
                                      href={resolvers.create.configure.addStep.selectAction(
                                        {
                                          connection: c,
                                          flow,
                                          integration,
                                          position,
                                        }
                                      )}
                                    >
                                      Select
                                    </ButtonLink>
                                  }
                                />
                              ))}
                              <IntegrationEditorConnectionsListItem
                                integrationName={''}
                                integrationDescription={''}
                                icon={''}
                                actions={
                                  <ButtonLink href={'#'}>
                                    Create connection
                                  </ButtonLink>
                                }
                              />
                            </>
                          )}
                        </WithLoader>
                      </IntegrationEditorChooseConnection>
                    )}
                  </WithConnections>
                }
                cancelHref={resolvers.create.configure.index({
                  flow,
                  integration,
                })}
              />
            </>
          );
        }}
      </WithRouteData>
    );
  }
}
