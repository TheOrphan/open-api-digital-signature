import { BasicResponse } from './basic.response';

export class LoginResponse<T> extends BasicResponse {
  accessToken: string;
  data: {};

  constructor(
    code: number,
    title: string,
    message: string,
    accessToken: string,
    data?: {},
  ) {
    super(code, title, message);

    this.code = code;
    this.title = title;
    this.message = message;
    this.accessToken = accessToken;
    this.data = data;
  }
}
