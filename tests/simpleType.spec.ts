import { buildSchema } from 'graphql';
import { plugin } from '../src/index';

describe('Simple types', () => {
  it('compiles inputs', async () => {
    const schema = buildSchema(/* GraphQL */ `
      input Something {
        str: String!
      }
    `);
    const result = await plugin(schema, [], {}, {});
    expect(result.content).toContain('str: yup.string().defined()');
    expect(result.content).toMatchSnapshot();
  });

  it('compiles types', async () => {
    const schema = buildSchema(/* GraphQL */ `
      type Whatever {
        str: String!
        num: Float!
      }
    `);
    const result = await plugin(schema, [], {}, {});
    expect(result.content).toContain('str: yup.string().defined()');
    expect(result.content).toContain('num: yup.number().defined()');
    expect(result.content).toMatchSnapshot();
  });

  it('compiles custom scalars', async () => {
    const schema = buildSchema(/* GraphQL */ `
      scalar JSON
      scalar Date

      input SomethingInput {
        jsonObject: JSON!
        date: Date!
      }
    `);
    const result = await plugin(
      schema,
      [],
      {
        scalarSchemas: {
          JSON: 'yup.object()',
          Date: 'yup.date()',
        },
      },
      {}
    );
    expect(result.content).toContain('jsonObject: yup.object().defined()');
    expect(result.content).toContain('date: yup.date().defined()');
  });
});
