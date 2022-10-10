import { FieldDefinitionNode, GraphQLSchema, InputValueDefinitionNode } from 'graphql';

import { TsVisitor } from '@graphql-codegen/typescript';
import { ValidationSchemaPluginConfig } from '../../types';
import getFieldTypeSchema from '../getFieldTypeSchema';
import { indent } from '@graphql-codegen/visitor-plugin-common';
import { maybeLazy } from '../../utils';

interface Props {
  config: ValidationSchemaPluginConfig;
  tsVisitor: TsVisitor;
  schema: GraphQLSchema;
  field: InputValueDefinitionNode | FieldDefinitionNode;
  indentCount: number;
}

export default function getFieldSchema({ config, tsVisitor, schema, field, indentCount }: Props): string {
  const fieldTypeSchema = getFieldTypeSchema({ config, tsVisitor, schema, type: field.type });
  return indent(`${field.name.value}: ${maybeLazy(field.type, fieldTypeSchema)}`, indentCount);
}
