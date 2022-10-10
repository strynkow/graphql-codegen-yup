import { GraphQLSchema, NameNode } from 'graphql';
import { TsVisitor } from '@graphql-codegen/typescript';
import { ValidationSchemaPluginConfig } from '../../types';
interface Props {
    config: ValidationSchemaPluginConfig;
    tsVisitor: TsVisitor;
    schema: GraphQLSchema;
    node: NameNode;
}
export default function getNameNodeSchema({ config, tsVisitor, schema, node }: Props): string;
export {};
