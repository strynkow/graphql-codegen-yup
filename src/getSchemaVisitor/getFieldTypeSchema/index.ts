import { GraphQLSchema, TypeNode } from 'graphql';
import { isNonNullType, maybeLazy } from '../../utils';

import { TsVisitor } from '@graphql-codegen/typescript';
import { ValidationSchemaPluginConfig } from '../../types';
import getNameNodeSchema from '../getNameNodeSchema';

interface Props {
  config: ValidationSchemaPluginConfig;
  tsVisitor: TsVisitor;
  schema: GraphQLSchema;
  type: TypeNode;
  parentType?: TypeNode;
}

export default function getFieldTypeSchema({ config, tsVisitor, schema, type, parentType }: Props): string {
  if (type?.kind === 'ListType') {
    // @ts-ignore duck-typing
    const gen = getFieldTypeSchema({ config, tsVisitor, schema, type: type.type, parentType: type });
    if (!isNonNullType(parentType)) {
      return `yup.array().of(${maybeLazy(type.type, gen)}).optional()`;
    }
    return `yup.array().of(${maybeLazy(type.type, gen)})`;
  }

  if (type?.kind === 'NonNullType') {
    const gen = getFieldTypeSchema({ config, tsVisitor, schema, type: type.type, parentType: type });
    return `${gen}.defined()`;
  }

  if (type?.kind === 'NamedType') {
    const gen = getNameNodeSchema({ config, tsVisitor, schema, node: type.name });
    const typ = schema.getType(type.name.value);
    if (typ?.astNode?.kind === 'ObjectTypeDefinition') {
      // @ts-ignore duck-typing If this has fields, it corresponds to InterfaceTypeDefinition.
      if (typeof typ?.getFields === 'function') {
        return gen;
      }
      return `${gen}.optional()`;
    }
    return gen;
  }
  return '';
}
