export class GetAllDataDto {
  page: number = 1;
  size: number = 10;
  where?: any;
  orderBy: string = 'DESC';

  constructor(page: number, size: number, orderBy: string, where?: any) {
    this.page = page;
    this.size = size;
    this.where = where;
    this.orderBy = orderBy;
  }
}
