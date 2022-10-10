"use strict";
exports.__esModule = true;
var getFieldTypeSchema_1 = require("../getFieldTypeSchema");
var visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
var utils_1 = require("../../utils");
function getFieldSchema(_a) {
    var config = _a.config, tsVisitor = _a.tsVisitor, schema = _a.schema, field = _a.field, indentCount = _a.indentCount;
    var fieldTypeSchema = (0, getFieldTypeSchema_1["default"])({ config: config, tsVisitor: tsVisitor, schema: schema, type: field.type });
    return (0, visitor_plugin_common_1.indent)("".concat(field.name.value, ": ").concat((0, utils_1.maybeLazy)(field.type, fieldTypeSchema)), indentCount);
}
exports["default"] = getFieldSchema;
