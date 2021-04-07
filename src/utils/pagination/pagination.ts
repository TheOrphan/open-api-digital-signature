import { PaginationBuilder } from './pagination.builder';

export class Pagination {
  page: number;
  size: number;
  totalPage: number;
  totalContent: number;

  constructor(paginationBuilder: PaginationBuilder) {
    this.page = paginationBuilder._page;
    this.size = paginationBuilder._size;
    this.totalContent = paginationBuilder._totalContent;
    this.totalPage = Math.ceil(
      paginationBuilder._totalContent / paginationBuilder._size,
    );
  }
}
