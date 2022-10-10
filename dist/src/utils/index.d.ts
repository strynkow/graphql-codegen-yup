import { ListTypeNode, NamedTypeNode, NonNullTypeNode, TypeNode } from 'graphql';
export declare function isListType(typ?: TypeNode): typ is ListTypeNode;
export declare function isNonNullType(typ?: TypeNode): typ is NonNullTypeNode;
export declare function isNamedType(typ?: TypeNode): typ is NamedTypeNode;
export declare function isInput(kind: string): boolean;
export declare function maybeLazy(type: TypeNode, schema: string): string;
