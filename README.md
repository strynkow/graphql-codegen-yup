# graphql-codegen-yup
Graphql codegen plugin for yup schema generation

```yml
generates:
  path/to/graphql.ts:
    plugins:
      - typescript
      - graphql-codegen-yup
    config:
      # For overwriting any schemas with specific values.
      scalarSchemas:
        JSON: yup.object()
        Date: yup.date()
        Email: yup.string().email()
```
