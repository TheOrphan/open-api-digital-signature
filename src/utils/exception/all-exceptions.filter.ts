import { Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  logger = new Logger('Exception');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    try {
      const code = exception.getStatus();
      const message =
        exception instanceof Error
          ? exception.message
          : exception.message.error;
      response.status(code).json({
        code: message.statusCode,
        title: message.error,
        message: message.message,
      });
    } catch (e) {
      this.logger.debug(e);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        title: 'ERROR',
        message: exception.message,
      });
    }
  }
}
