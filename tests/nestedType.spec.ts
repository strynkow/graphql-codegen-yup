import { buildSchema } from 'graphql';
import { plugin } from '../src/index';

describe('Nested types', () => {
  it('compiles inputs', async () => {
    const schema = buildSchema(/* GraphQL */ `
      input Something {
        str: String!
      }
      input OtherThing {
        something: Something!
      }
    `);
    const result = await plugin(schema, [], {}, {});
    expect(result.content).toContain('str: yup.string().defined()');
    expect(result.content).toContain('something: SomethingSchema().defined()');
    expect(result.content).toMatchSnapshot();
  });

  it('compiles types', async () => {
    const schema = buildSchema(/* GraphQL */ `
      type Whatever {
        str: String!
        num: Float!
      }

      type RunningOutOfNames {
        whateverParam: Whatever!
        num: Float!
      }
    `);
    const result = await plugin(schema, [], {}, {});
    expect(result.content).toContain('whateverParam: WhateverSchema().defined()');
    expect(result.content).toContain('num: yup.number().defined()');
    expect(result.content).toMatchSnapshot();
  });
});
