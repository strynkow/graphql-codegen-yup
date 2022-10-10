import { FieldDefinitionNode, GraphQLSchema, InputValueDefinitionNode } from 'graphql';
import { TsVisitor } from '@graphql-codegen/typescript';
import { ValidationSchemaPluginConfig } from '../../types';
interface Props {
    config: ValidationSchemaPluginConfig;
    tsVisitor: TsVisitor;
    schema: GraphQLSchema;
    field: InputValueDefinitionNode | FieldDefinitionNode;
    indentCount: number;
}
export default function getFieldSchema({ config, tsVisitor, schema, field, indentCount }: Props): string;
export {};
