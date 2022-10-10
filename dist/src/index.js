"use strict";
exports.__esModule = true;
exports.plugin = void 0;
var plugin_helpers_1 = require("@graphql-codegen/plugin-helpers");
var getSchemaVisitor_1 = require("./getSchemaVisitor");
var schema_ast_1 = require("@graphql-codegen/schema-ast");
var plugin = function (schema, _documents, config) {
    var _a = (0, schema_ast_1.transformSchemaAST)(schema, config), _schema = _a.schema, ast = _a.ast;
    var visitor = (0, getSchemaVisitor_1["default"])(_schema, config);
    var result = (0, plugin_helpers_1.oldVisit)(ast, {
        leave: visitor
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    var generated = result.definitions.filter(function (def) { return typeof def === 'string'; });
    return {
        prepend: ["import * as yup from 'yup';"],
        content: generated.join('\n')
    };
};
exports.plugin = plugin;
