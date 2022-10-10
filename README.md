# graphql-codegen-yup

Graphql codegen plugin for yup schema generation.

## Links

Github: https://github.com/strynkow/graphql-codegen-yup/tree/master
NPM: https://www.npmjs.com/package/graphql-codegen-yup

## Overview

The TLDR here is that I was looking at `graphql-codegen-typescript-validation-schema`, but it didn't really support fragments, and that caused it to break on object types. I was going to add that, but zod was incorrectly erroring on types (seemed to be a zod issue), so I just added my own project for yup.

I plan on actively maintaining this. Feel free to contribute.

## Use

```yml
generates:
  path/to/graphql.ts:
    plugins:
      - typescript
      - graphql-codegen-yup # add this line.
    config:
      # For overwriting any schemas with specific values.
      scalarSchemas:
        JSON: yup.object()
        Date: yup.date()
        Email: yup.string().email()
```

You can see test cases and examples by browsing around the `/tests` folder. `/tests/__snapshots__` contains the outputs of running this on those schemas.
