import { BasicResponse } from './basic.response';
import { Pagination } from '../pagination/pagination';

export class BaseResponse<T> extends BasicResponse {
  data: T;
  pagination: Pagination;

  constructor(
    code: number,
    title: string,
    message: string,
    data?: T,
    pagination?: Pagination,
  ) {
    super(code, title, message);

    this.code = code;
    this.title = title;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
  }
}
