export class BasicResponse {
  code: number;
  title: string;
  message: string;

  constructor(code: number, title: string, message: string) {
    this.code = code;
    this.title = title;
    this.message = message;
  }
}
