"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
var typescript_1 = require("@graphql-codegen/typescript");
var getFieldSchema_1 = require("./getFieldSchema");
function getSchemaVisitor(schema, config) {
    var tsVisitor = new typescript_1.TsVisitor(schema, config);
    var importTypes = [];
    return {
        InputObjectTypeDefinition: function (node) {
            var _a;
            var name = tsVisitor.convertName(node.name.value);
            importTypes.push(name);
            var shape = (_a = node.fields) === null || _a === void 0 ? void 0 : _a.map(function (field) { return (0, getFieldSchema_1["default"])({ config: config, tsVisitor: tsVisitor, schema: schema, field: field, indentCount: 2 }); }).join(',\n');
            return new visitor_plugin_common_1.DeclarationBlock({})["export"]()
                .asKind('function')
                .withName("".concat(name, "Schema(): yup.SchemaOf<").concat(name, ">"))
                .withBlock([(0, visitor_plugin_common_1.indent)("return yup.object({"), shape, (0, visitor_plugin_common_1.indent)('})')].join('\n')).string;
        },
        ObjectTypeDefinition: function (node) {
            var _a;
            var name = tsVisitor.convertName(node.name.value);
            importTypes.push(name);
            var shape = (_a = node.fields) === null || _a === void 0 ? void 0 : _a.map(function (field) { return (0, getFieldSchema_1["default"])({ config: config, tsVisitor: tsVisitor, schema: schema, field: field, indentCount: 2 }); }).join(',\n');
            return new visitor_plugin_common_1.DeclarationBlock({})["export"]()
                .asKind('function')
                .withName("".concat(name, "Schema(): yup.SchemaOf<").concat(name, ">"))
                .withBlock([
                (0, visitor_plugin_common_1.indent)("return yup.object({"),
                (0, visitor_plugin_common_1.indent)("__typename: yup.mixed().oneOf(['".concat(node.name.value, "', undefined]),"), 2),
                shape,
                (0, visitor_plugin_common_1.indent)('})'),
            ].join('\n')).string;
        },
        EnumTypeDefinition: function (node) {
            var _a, _b;
            var enumname = tsVisitor.convertName(node.name.value);
            importTypes.push(enumname);
            if (config.enumsAsTypes) {
                return new visitor_plugin_common_1.DeclarationBlock({})["export"]()
                    .asKind('const')
                    .withName("".concat(enumname, "Schema"))
                    .withContent("yup.mixed().oneOf([".concat((_a = node.values) === null || _a === void 0 ? void 0 : _a.map(function (enumOption) { return "'".concat(enumOption.name.value, "'"); }).join(', '), "])")).string;
            }
            var values = (_b = node.values) === null || _b === void 0 ? void 0 : _b.map(function (enumOption) {
                return "".concat(enumname, ".").concat(tsVisitor.convertName(enumOption.name, {
                    useTypesPrefix: false,
                    transformUnderscore: true
                }));
            }).join(', ');
            return new visitor_plugin_common_1.DeclarationBlock({})["export"]()
                .asKind('const')
                .withName("".concat(enumname, "Schema"))
                .withContent("yup.mixed().oneOf([".concat(values, "])")).string;
        },
        InterfaceTypeDefinition: function (node) {
            var _a;
            var name = tsVisitor.convertName(node.name.value);
            importTypes.push(name);
            var shape = (_a = node.fields) === null || _a === void 0 ? void 0 : _a.map(function (field) { return (0, getFieldSchema_1["default"])({ config: config, tsVisitor: tsVisitor, schema: schema, field: field, indentCount: 2 }); }).join(',\n');
            return new visitor_plugin_common_1.DeclarationBlock({})["export"]()
                .asKind('function')
                .withName("".concat(name, "Schema(): yup.SchemaOf<").concat(name, ">"))
                .withBlock([
                (0, visitor_plugin_common_1.indent)("return yup.object({"),
                (0, visitor_plugin_common_1.indent)("__typename: yup.mixed().oneOf(['".concat(node.name.value, "', undefined]),"), 2),
                shape,
                (0, visitor_plugin_common_1.indent)('})'),
            ].join('\n')).string;
        },
        UnionTypeDefinition: function (node) {
            var name = tsVisitor.convertName(node.name.value);
            importTypes.push(name);
            var shape = [];
            node.types.forEach(function (type) {
                var _a, _b;
                shape.push((0, visitor_plugin_common_1.indent)("case '".concat((_a = type === null || type === void 0 ? void 0 : type.name) === null || _a === void 0 ? void 0 : _a.value, "':"), 3));
                shape.push((0, visitor_plugin_common_1.indent)("return ".concat((_b = type === null || type === void 0 ? void 0 : type.name) === null || _b === void 0 ? void 0 : _b.value, "Schema();"), 4));
            });
            return new visitor_plugin_common_1.DeclarationBlock({})["export"]()
                .asKind('function')
                .withName("".concat(name, "Schema(): any"))
                .withBlock(__spreadArray(__spreadArray([
                (0, visitor_plugin_common_1.indent)("return yup.lazy((value) => {"),
                (0, visitor_plugin_common_1.indent)('switch (value?.__typename) {', 2)
            ], shape, true), [
                (0, visitor_plugin_common_1.indent)("default:", 3),
                (0, visitor_plugin_common_1.indent)("throw new Error('Type not found.');", 4),
                (0, visitor_plugin_common_1.indent)('}', 3),
                (0, visitor_plugin_common_1.indent)('})'),
            ], false).join('\n')).string;
        }
    };
}
exports["default"] = getSchemaVisitor;
