import { WithConnectionHelpers } from '@syndesis/api';
import { AutoForm, IFormDefinition } from '@syndesis/auto-form';
import { Connector } from '@syndesis/models';
import {
  ConnectionCreatorLayout,
  ConnectorConfigurationForm,
} from '@syndesis/ui';
import { WithRouteData } from '@syndesis/utils';
import * as React from 'react';
import { PageTitle } from '../../../../shared';
import { ConnectionCreatorBreadcrumbs } from '../../components';
import resolvers from '../../resolvers';

export interface ISaveForm {
  name: string;
  description?: string;
}

export interface IReviewPageRouteState {
  connector: Connector;
  configuredProperties: { [key: string]: string };
}

export default class ReviewPage extends React.Component {
  public render() {
    return (
      <WithRouteData<null, IReviewPageRouteState>>
        {(_, { connector, configuredProperties }, { history }) => (
          <WithConnectionHelpers>
            {({ createConnection, saveConnection }) => {
              const onSave = async (
                { name, description }: ISaveForm,
                actions: any
              ) => {
                const connection = createConnection(
                  connector,
                  name,
                  description || '',
                  configuredProperties
                );
                await saveConnection(connection);
                actions.setSubmitting(false);
                // TODO: toast notification
                history.push(resolvers.connections());
              };
              const definition: IFormDefinition = {
                name: {
                  defaultValue: '',
                  displayName: 'Name',
                  required: true,
                },
                /* tslint:disable-next-line:object-literal-sort-keys */
                description: {
                  defaultValue: '',
                  displayName: 'Description',
                  type: 'textarea',
                },
              };
              return (
                <AutoForm<ISaveForm>
                  i18nRequiredProperty={'* Required field'}
                  definition={definition}
                  initialValue={{
                    description: '',
                    name: '',
                  }}
                  onSave={onSave}
                >
                  {({
                    fields,
                    handleSubmit,
                    isSubmitting,
                    isValid,
                    submitForm,
                  }) => (
                    <ConnectionCreatorLayout
                      header={<ConnectionCreatorBreadcrumbs step={3} />}
                      content={
                        <>
                          <PageTitle title={'Name connection'} />
                          <ConnectorConfigurationForm
                            i18nFormTitle={'Name connection'}
                            handleSubmit={handleSubmit}
                          >
                            {fields}
                          </ConnectorConfigurationForm>
                        </>
                      }
                      cancelHref={resolvers.connections()}
                      backHref={resolvers.create.configureConnector({
                        connector,
                      })}
                      onNext={submitForm}
                      isNextDisabled={!isValid}
                      isNextLoading={isSubmitting}
                      isLastStep={true}
                    />
                  )}
                </AutoForm>
              );
            }}
          </WithConnectionHelpers>
        )}
      </WithRouteData>
    );
  }
}
