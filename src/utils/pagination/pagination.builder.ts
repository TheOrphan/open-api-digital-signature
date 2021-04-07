import { Pagination } from './pagination';

export class PaginationBuilder {
  _page: number;
  _size: number;
  _totalContent: number;

  page(page: number) {
    this._page = page;
    return this;
  }

  size(size: number) {
    this._size = size;
    return this;
  }

  totalContent(totalContent: number) {
    this._totalContent = totalContent;
    return this;
  }

  build() {
    return new Pagination(this);
  }
}
