import {uniqueByShape} from '../src/utils';

const date = new Date();
const element = document.body;

describe('uniqueByShape', () => {
  it('filters duplicates', () => {
    expect(
      uniqueByShape([
        {name: 'hello'},
        {name: 'hello'},
        {name: 'hello', enabled: false, options: {date, element}},
        {name: 'hello', enabled: false, options: {date, element}},
        {name: 'hello', options: {element, x: true}},
        {name: 'hello2'},
      ]),
    ).toEqual([
      {name: 'hello'},
      {name: 'hello', enabled: false, options: {date, element}},
      {name: 'hello', options: {x: true, element}},
      {name: 'hello2'},
    ]);
  });
});
