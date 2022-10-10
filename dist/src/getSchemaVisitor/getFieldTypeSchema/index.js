"use strict";
exports.__esModule = true;
var utils_1 = require("../../utils");
var getNameNodeSchema_1 = require("../getNameNodeSchema");
function getFieldTypeSchema(_a) {
    var _b;
    var config = _a.config, tsVisitor = _a.tsVisitor, schema = _a.schema, type = _a.type, parentType = _a.parentType;
    if ((type === null || type === void 0 ? void 0 : type.kind) === 'ListType') {
        // @ts-ignore duck-typing
        var gen = getFieldTypeSchema({ config: config, tsVisitor: tsVisitor, schema: schema, type: type.type, parentType: type });
        if (!(0, utils_1.isNonNullType)(parentType)) {
            return "yup.array().of(".concat((0, utils_1.maybeLazy)(type.type, gen), ").optional()");
        }
        return "yup.array().of(".concat((0, utils_1.maybeLazy)(type.type, gen), ")");
    }
    if ((type === null || type === void 0 ? void 0 : type.kind) === 'NonNullType') {
        var gen = getFieldTypeSchema({ config: config, tsVisitor: tsVisitor, schema: schema, type: type.type, parentType: type });
        return "".concat(gen, ".defined()");
    }
    if ((type === null || type === void 0 ? void 0 : type.kind) === 'NamedType') {
        var gen = (0, getNameNodeSchema_1["default"])({ config: config, tsVisitor: tsVisitor, schema: schema, node: type.name });
        var typ = schema.getType(type.name.value);
        if (((_b = typ === null || typ === void 0 ? void 0 : typ.astNode) === null || _b === void 0 ? void 0 : _b.kind) === 'ObjectTypeDefinition') {
            // @ts-ignore duck-typing If this has fields, it corresponds to InterfaceTypeDefinition.
            if (typeof (typ === null || typ === void 0 ? void 0 : typ.getFields) === 'function') {
                return gen;
            }
            return "".concat(gen, ".optional()");
        }
        return gen;
    }
    return '';
}
exports["default"] = getFieldTypeSchema;
