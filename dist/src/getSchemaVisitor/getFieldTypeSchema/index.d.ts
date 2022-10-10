import { GraphQLSchema, TypeNode } from 'graphql';
import { TsVisitor } from '@graphql-codegen/typescript';
import { ValidationSchemaPluginConfig } from '../../types';
interface Props {
    config: ValidationSchemaPluginConfig;
    tsVisitor: TsVisitor;
    schema: GraphQLSchema;
    type: TypeNode;
    parentType?: TypeNode;
}
export default function getFieldTypeSchema({ config, tsVisitor, schema, type, parentType }: Props): string;
export {};
