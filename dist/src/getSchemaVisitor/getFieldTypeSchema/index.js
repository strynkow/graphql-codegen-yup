"use strict";
exports.__esModule = true;
var graphql_1 = require("graphql");
var utils_1 = require("../../utils");
var getNameNodeSchema_1 = require("../getNameNodeSchema");
function appendIfNoCurrentEndingExists(initial, appendage) {
    if ((initial === null || initial === void 0 ? void 0 : initial.endsWith('.optional()')) || (initial === null || initial === void 0 ? void 0 : initial.endsWith('.defined()')) || (initial === null || initial === void 0 ? void 0 : initial.endsWith('.required()'))) {
        return initial;
    }
    return "".concat(initial).concat(appendage);
}
function getFieldTypeSchema(_a) {
    var config = _a.config, tsVisitor = _a.tsVisitor, schema = _a.schema, type = _a.type, parentType = _a.parentType;
    if ((type === null || type === void 0 ? void 0 : type.kind) === graphql_1.Kind.LIST_TYPE) {
        var gen = getFieldTypeSchema({ config: config, tsVisitor: tsVisitor, schema: schema, type: type.type, parentType: type });
        if (!(0, utils_1.isNonNullType)(parentType)) {
            return "yup.array().of(".concat((0, utils_1.maybeLazy)(type.type, gen), ").optional()");
        }
        return "yup.array().of(".concat((0, utils_1.maybeLazy)(type.type, gen), ")");
    }
    if ((type === null || type === void 0 ? void 0 : type.kind) === graphql_1.Kind.NON_NULL_TYPE) {
        var gen = getFieldTypeSchema({ config: config, tsVisitor: tsVisitor, schema: schema, type: type.type, parentType: type });
        return (0, utils_1.maybeLazy)(type.type, appendIfNoCurrentEndingExists(gen, '.defined()'));
    }
    if ((type === null || type === void 0 ? void 0 : type.kind) === graphql_1.Kind.NAMED_TYPE) {
        var gen = (0, getNameNodeSchema_1["default"])({ config: config, tsVisitor: tsVisitor, schema: schema, node: type.name });
        if ((parentType === null || parentType === void 0 ? void 0 : parentType.kind) && (parentType === null || parentType === void 0 ? void 0 : parentType.kind) !== graphql_1.Kind.NON_NULL_TYPE) {
            return appendIfNoCurrentEndingExists(gen, '.optional()');
        }
        return gen;
    }
    return '';
}
exports["default"] = getFieldTypeSchema;
