import { DeclarationBlock, indent } from '@graphql-codegen/visitor-plugin-common';
import {
  EnumTypeDefinitionNode,
  GraphQLSchema,
  InputObjectTypeDefinitionNode,
  InterfaceTypeDefinitionNode,
  ObjectTypeDefinitionNode,
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
  };
}
