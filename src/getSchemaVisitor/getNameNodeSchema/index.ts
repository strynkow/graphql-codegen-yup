import { GraphQLSchema, NameNode } from 'graphql';

import { TsVisitor } from '@graphql-codegen/typescript';
import { ValidationSchemaPluginConfig } from '../../types';

interface Props {
  config: ValidationSchemaPluginConfig;
  tsVisitor: TsVisitor;
  schema: GraphQLSchema;
  node: NameNode;
}

export default function getNameNodeSchema({ config, tsVisitor, schema, node }: Props): string {
  const typ = schema.getType(node.value);

  if (typ?.astNode?.kind === 'InputObjectTypeDefinition') {
    const enumName = tsVisitor.convertName(typ.astNode.name.value);
    return `${enumName}Schema()`;
  }

  if (typ?.astNode?.kind === 'ObjectTypeDefinition') {
    const enumName = tsVisitor.convertName(typ.astNode.name.value);
    return `${enumName}Schema()`;
  }

  if (typ?.astNode?.kind === 'EnumTypeDefinition') {
    const enumName = tsVisitor.convertName(typ.astNode.name.value);
    return `${enumName}Schema`;
  }

  if (typ?.astNode?.kind === 'InterfaceTypeDefinition') {
    const enumName = tsVisitor.convertName(typ.name);
    return `${enumName}Schema()`;
  }

  const primitive = getScalar(config, tsVisitor, node.value);
  return primitive;
}

const getScalar = (config: ValidationSchemaPluginConfig, tsVisitor: TsVisitor, scalarName: string): string => {
  if (config.scalarSchemas?.[scalarName]) {
    return config.scalarSchemas[scalarName];
  }
  const tsType = tsVisitor.scalars[scalarName];
  switch (tsType) {
    case 'string':
      return `yup.string()`;
    case 'number':
      return `yup.number()`;
    case 'boolean':
      return `yup.boolean()`;
  }
  console.warn(`Unable to find matching type for: ${scalarName}. Defaulting to yup.mixed().`);
  return `yup.mixed()`;
};
