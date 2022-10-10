import { GraphQLSchema, Kind, TypeNode } from 'graphql';
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

function appendIfNoCurrentEndingExists(initial: string, appendage: string) {
  if (initial?.endsWith('.optional()') || initial?.endsWith('.defined()') || initial?.endsWith('.required()')) {
    return initial;
  }
  return `${initial}${appendage}`;
}

export default function getFieldTypeSchema({ config, tsVisitor, schema, type, parentType }: Props): string {
  if (type?.kind === Kind.LIST_TYPE) {
    const gen = getFieldTypeSchema({ config, tsVisitor, schema, type: type.type, parentType: type });
    if (!isNonNullType(parentType)) {
      return `yup.array().of(${maybeLazy(type.type, gen)}).optional()`;
    }
    return `yup.array().of(${maybeLazy(type.type, gen)})`;
  }

  if (type?.kind === Kind.NON_NULL_TYPE) {
    const gen = getFieldTypeSchema({ config, tsVisitor, schema, type: type.type, parentType: type });
    return maybeLazy(type.type, appendIfNoCurrentEndingExists(gen, '.defined()'));
  }

  if (type?.kind === Kind.NAMED_TYPE) {
    const gen = getNameNodeSchema({ config, tsVisitor, schema, node: type.name });
    if (parentType?.kind && parentType?.kind !== Kind.NON_NULL_TYPE) {
      return appendIfNoCurrentEndingExists(gen, '.optional()');
    }
    return gen;
  }
  return '';
}
