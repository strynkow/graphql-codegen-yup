import { ListTypeNode, NamedTypeNode, NonNullTypeNode, TypeNode } from 'graphql';

export function isListType(typ?: TypeNode): typ is ListTypeNode {
  return typ?.kind === 'ListType';
}

export function isNonNullType(typ?: TypeNode): typ is NonNullTypeNode {
  return typ?.kind === 'NonNullType';
}

export function isNamedType(typ?: TypeNode): typ is NamedTypeNode {
  return typ?.kind === 'NamedType';
}

export function isInput(kind: string): boolean {
  return kind.includes('Input');
}

export function maybeLazy(type: TypeNode, schema: string): string {
  if (isNamedType(type) && isInput(type.name.value)) {
    // TODO (orange): We have the tech to change this, after getting problems solved.
    return `yup.lazy(() => ${schema}) as never`;
  }
  return schema;
}
