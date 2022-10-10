import { EnumTypeDefinitionNode, GraphQLSchema, InputObjectTypeDefinitionNode, InterfaceTypeDefinitionNode, ObjectTypeDefinitionNode, UnionTypeDefinitionNode } from 'graphql';
import { ValidationSchemaPluginConfig } from '../types';
export default function getSchemaVisitor(schema: GraphQLSchema, config: ValidationSchemaPluginConfig): {
    InputObjectTypeDefinition: (node: InputObjectTypeDefinitionNode) => string;
    ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => string;
    EnumTypeDefinition: (node: EnumTypeDefinitionNode) => string;
    InterfaceTypeDefinition: (node: InterfaceTypeDefinitionNode) => string;
    UnionTypeDefinition: (node: UnionTypeDefinitionNode) => string;
};
