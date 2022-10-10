"use strict";
exports.__esModule = true;
var graphql_1 = require("graphql");
function getNameNodeSchema(_a) {
    var _b, _c, _d, _e;
    var config = _a.config, tsVisitor = _a.tsVisitor, schema = _a.schema, node = _a.node;
    var typ = schema.getType(node.value);
    if (((_b = typ === null || typ === void 0 ? void 0 : typ.astNode) === null || _b === void 0 ? void 0 : _b.kind) === 'InputObjectTypeDefinition') {
        var enumName = tsVisitor.convertName(typ.astNode.name.value);
        return "".concat(enumName, "Schema()");
    }
    if (((_c = typ === null || typ === void 0 ? void 0 : typ.astNode) === null || _c === void 0 ? void 0 : _c.kind) === 'ObjectTypeDefinition') {
        var enumName = tsVisitor.convertName(typ.astNode.name.value);
        return "".concat(enumName, "Schema()");
    }
    if (((_d = typ === null || typ === void 0 ? void 0 : typ.astNode) === null || _d === void 0 ? void 0 : _d.kind) === 'EnumTypeDefinition') {
        var enumName = tsVisitor.convertName(typ.astNode.name.value);
        return "".concat(enumName, "Schema");
    }
    if (((_e = typ === null || typ === void 0 ? void 0 : typ.astNode) === null || _e === void 0 ? void 0 : _e.kind) === 'InterfaceTypeDefinition') {
        var enumName = tsVisitor.convertName(typ.name);
        return "".concat(enumName, "Schema()");
    }
    var primitive = getScalar(config, tsVisitor, node.value, schema);
    return primitive;
}
exports["default"] = getNameNodeSchema;
var getScalar = function (config, tsVisitor, scalarName, schema) {
    var _a, _b, _c;
    if ((_a = config.scalarSchemas) === null || _a === void 0 ? void 0 : _a[scalarName]) {
        return config.scalarSchemas[scalarName];
    }
    var tsType = tsVisitor.scalars[scalarName];
    switch (tsType) {
        case 'string':
            return "yup.string()";
        case 'number':
            return "yup.number()";
        case 'boolean':
            return "yup.boolean()";
    }
    if (((_c = (_b = schema.getType(scalarName)) === null || _b === void 0 ? void 0 : _b.astNode) === null || _c === void 0 ? void 0 : _c.kind) === graphql_1.Kind.UNION_TYPE_DEFINITION) {
        return "".concat(scalarName, "Schema()");
    }
    console.warn("Unable to find matching type for: ".concat(scalarName, ". Defaulting to yup.mixed()."));
    return "yup.mixed()";
};
