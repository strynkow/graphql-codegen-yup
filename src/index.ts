import { PluginFunction, Types, oldVisit } from '@graphql-codegen/plugin-helpers';

import { GraphQLSchema } from 'graphql';
import { ValidationSchemaPluginConfig } from './types';
import getSchemaVisitor from './getSchemaVisitor';
import { transformSchemaAST } from '@graphql-codegen/schema-ast';

export const plugin: PluginFunction<ValidationSchemaPluginConfig, Types.ComplexPluginOutput> = (
  schema: GraphQLSchema,
  _documents: Types.DocumentFile[],
  config: ValidationSchemaPluginConfig
): Types.ComplexPluginOutput => {
  const { schema: _schema, ast } = transformSchemaAST(schema, config);
  const visitor = getSchemaVisitor(_schema, config);

  const result = oldVisit(ast, {
    leave: visitor,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const generated = result.definitions.filter((def) => typeof def === 'string');

  return {
    prepend: [`import * as yup from 'yup';`],
    content: generated.join('\n'),
  };
};
