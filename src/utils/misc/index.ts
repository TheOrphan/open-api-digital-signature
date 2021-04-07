import { Logger } from '@nestjs/common';

const logger = new Logger('MISC');

export function remapFilter(filter) {
  let newFilter = '';
  filter.forEach(element => {
    console.log(element);
    newFilter = element + ' AND ' + newFilter;
  });
  newFilter = newFilter.substring(0, newFilter.lastIndexOf('AND'));

  return newFilter;
}
