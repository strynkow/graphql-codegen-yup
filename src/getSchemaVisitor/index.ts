import { DeclarationBlock, indent } from '@graphql-codegen/visitor-plugin-common';
import {
  EnumTypeDefinitionNode,
  GraphQLSchema,
  InputObjectTypeDefinitionNode,
  InterfaceTypeDefinitionNode,
  ObjectTypeDefinitionNode,
  UnionTypeDefinitionNode,
} from 'graphql';

import { TsVisitor } from '@graphql-codegen/typescript';
import { ValidationSchemaPluginConfig } from '../types';
import getFieldSchema from './getFieldSchema';

export default function getSchemaVisitor(schema: GraphQLSchema, config: ValidationSchemaPluginConfig) {
  const tsVisitor = new TsVisitor(schema, config);

  const importTypes: string[] = [];

  return {
    InputObjectTypeDefinition: (node: InputObjectTypeDefinitionNode) => {
      const name = tsVisitor.convertName(node.name.value);
      importTypes.push(name);

      const shape = node.fields
        ?.map((field) => getFieldSchema({ config, tsVisitor, schema, field, indentCount: 2 }))
        .join(',\n');

      return new DeclarationBlock({})
        .export()
        .asKind('function')
        .withName(`${name}Schema(): yup.SchemaOf<${name}>`)
        .withBlock([indent(`return yup.object({`), shape, indent('})')].join('\n')).string;
    },
    ObjectTypeDefinition: (node: ObjectTypeDefinitionNode) => {
      const name = tsVisitor.convertName(node.name.value);
      importTypes.push(name);

      const shape = node.fields
        ?.map((field) => getFieldSchema({ config, tsVisitor, schema, field, indentCount: 2 }))
        .join(',\n');

      return new DeclarationBlock({})
        .export()
        .asKind('function')
        .withName(`${name}Schema(): yup.SchemaOf<${name}>`)
        .withBlock(
          [
            indent(`return yup.object({`),
            indent(`__typename: yup.mixed().oneOf(['${node.name.value}', undefined]),`, 2),
            shape,
            indent('})'),
          ].join('\n')
        ).string;
    },
    EnumTypeDefinition: (node: EnumTypeDefinitionNode) => {
      const enumname = tsVisitor.convertName(node.name.value);
      importTypes.push(enumname);

      if (config.enumsAsTypes) {
        return new DeclarationBlock({})
          .export()
          .asKind('const')
          .withName(`${enumname}Schema`)
          .withContent(
            `yup.mixed().oneOf([${node.values?.map((enumOption) => `'${enumOption.name.value}'`).join(', ')}])`
          ).string;
      }

      const values = node.values
        ?.map(
          (enumOption) =>
            `${enumname}.${tsVisitor.convertName(enumOption.name, {
              useTypesPrefix: false,
              transformUnderscore: true,
            })}`
        )
        .join(', ');
      return new DeclarationBlock({})
        .export()
        .asKind('const')
        .withName(`${enumname}Schema`)
        .withContent(`yup.mixed().oneOf([${values}])`).string;
    },
    InterfaceTypeDefinition: (node: InterfaceTypeDefinitionNode) => {
      const name = tsVisitor.convertName(node.name.value);
      importTypes.push(name);

      const shape = node.fields
        ?.map((field) => getFieldSchema({ config, tsVisitor, schema, field, indentCount: 2 }))
        .join(',\n');

      return new DeclarationBlock({})
        .export()
        .asKind('function')
        .withName(`${name}Schema(): yup.SchemaOf<${name}>`)
        .withBlock(
          [
            indent(`return yup.object({`),
            indent(`__typename: yup.mixed().oneOf(['${node.name.value}', undefined]),`, 2),
            shape,
            indent('})'),
          ].join('\n')
        ).string;
    },
    UnionTypeDefinition: (node: UnionTypeDefinitionNode) => {
      const name = tsVisitor.convertName(node.name.value);
      importTypes.push(name);

      const shape = [];
      node.types.forEach((type) => {
        shape.push(indent(`case '${type?.name?.value}':`, 3));
        shape.push(indent(`return ${type?.name?.value}Schema();`, 4));
      });

      return new DeclarationBlock({})
        .export()
        .asKind('function')
        .withName(`${name}Schema(): any`)
        .withBlock(
          [
            indent(`return yup.lazy((value) => {`),
            indent('switch (value?.__typename) {', 2),
            ...shape,
            indent(`default:`, 3),
            indent(`throw new Error('Type not found.');`, 4),
            indent('}', 3),
            indent('})'),
          ].join('\n')
        ).string;
    },
    // Skip. These refer to top level op types, like mutation and query.
    // OperationTypeDefinition: (node: InterfaceTypeDefinitionNode) => {},
  };
}
