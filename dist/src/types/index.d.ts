import { TypeScriptPluginConfig } from '@graphql-codegen/typescript';
export interface ValidationSchemaPluginConfig extends TypeScriptPluginConfig {
    scalarSchemas?: {
        [typeName: string]: string;
    };
}
