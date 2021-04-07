export class FilterDto {
  page: number = 1;
  size: number = 10;
  filter?: string[];
  orderBy?: {};
  query?: string;

  constructor(
    page: number,
    size: number,
    orderBy?: {},
    filter?: string[],
    query?: string,
  ) {
    this.page = page;
    this.size = size;
    this.orderBy = orderBy;
    this.filter = filter;
    this.query = query;
  }
}
