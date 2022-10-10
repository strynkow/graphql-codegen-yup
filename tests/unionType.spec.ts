import { buildSchema } from 'graphql';
import { plugin } from '../src/index';

describe('Nested types', () => {
  it('compiles inputs', async () => {
    const schema = buildSchema(/* GraphQL */ `
      type BlueEyesWhiteDragon0 {
        str: String!
      }
      type BlueEyesWhiteDragon1 {
        num: Int!
      }
      type BlueEyesWhiteDragon2 {
        num: Float!
      }
      # I play polymerization.
      union BlueEyesUltimateDragon = BlueEyesWhiteDragon0 | BlueEyesWhiteDragon1 | BlueEyesWhiteDragon2
    `);
    const result = await plugin(schema, [], {}, {});
    expect(result.content).toMatchSnapshot();
  });

  it('compiles inputs', async () => {
    const schema = buildSchema(/* GraphQL */ `
      type BlueEyesWhiteDragon0 {
        str: String!
      }
      type BlueEyesWhiteDragon1 {
        num: Int!
      }
      type BlueEyesWhiteDragon2 {
        num: Float!
      }
      # I play polymerization.
      union BlueEyesUltimateDragon = BlueEyesWhiteDragon0 | BlueEyesWhiteDragon1 | BlueEyesWhiteDragon2

      type Board {
        slot0: BlueEyesUltimateDragon!
        slot1: BlueEyesWhiteDragon1!
        slot2: BlueEyesWhiteDragon0!
      }
    `);
    const result = await plugin(schema, [], {}, {});
    expect(result.content).toMatchSnapshot();
  });
});
