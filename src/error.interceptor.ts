import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 'error';
    const message =
      exception instanceof Error
        ? exception.message
        : 'Unexpected error occurred';

    response.status(500).json({ status, message });
  }
}
