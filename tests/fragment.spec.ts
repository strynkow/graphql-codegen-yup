import { buildSchema } from 'graphql';
import { plugin } from '../src/index';

describe('Nested types', () => {
  it('compiles inputs', async () => {
    const schema = buildSchema(/* GraphQL */ `
      interface Question {
        str: String!
      }
      type WhyQuestion implements Question {
        str: String!
        something: String!
      }
      type QuestionAnswer {
        question: Question!
        answer: String!
      }
    `);
    const result = await plugin(schema, [], {}, {});
    expect(result.content).toContain('question: QuestionSchema().defined()');
    expect(result.content).toContain('answer: yup.string().defined()');
    expect(result.content).toMatchSnapshot();
  });
});
