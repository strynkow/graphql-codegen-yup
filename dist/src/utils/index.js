"use strict";
exports.__esModule = true;
exports.maybeLazy = exports.isInput = exports.isNamedType = exports.isNonNullType = exports.isListType = void 0;
function isListType(typ) {
    return (typ === null || typ === void 0 ? void 0 : typ.kind) === 'ListType';
}
exports.isListType = isListType;
function isNonNullType(typ) {
    return (typ === null || typ === void 0 ? void 0 : typ.kind) === 'NonNullType';
}
exports.isNonNullType = isNonNullType;
function isNamedType(typ) {
    return (typ === null || typ === void 0 ? void 0 : typ.kind) === 'NamedType';
}
exports.isNamedType = isNamedType;
function isInput(kind) {
    return kind.includes('Input');
}
exports.isInput = isInput;
function maybeLazy(type, schema) {
    if (isNamedType(type) && isInput(type.name.value)) {
        // TODO (orange): We have the tech to change this, after getting problems solved.
        return "yup.lazy(() => ".concat(schema, ") as never");
    }
    return schema;
}
exports.maybeLazy = maybeLazy;
