import {uniqueByShape} from '../src/utils';

describe('uniqueByShape', () => {
  it('filters duplicates', () => {
    expect(
      uniqueByShape([
        {name: 'hello'},
        {name: 'hello'},
        {name: 'hello', enabled: false},
        {name: 'hello2'},
      ]),
    ).toEqual([
      {name: 'hello'},
      {name: 'hello', enabled: false},
      {name: 'hello2'},
    ]);
  });
});
