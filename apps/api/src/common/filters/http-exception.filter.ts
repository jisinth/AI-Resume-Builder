import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiErrorBody } from '@ai-resume-builder/types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;
    const message = extractMessage(exceptionResponse, exception);

    if (!isHttpException) {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }

    const body: ApiErrorBody = {
      statusCode,
      message,
      error: isHttpException ? exception.name : 'InternalServerError',
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(body);
  }
}

function extractMessage(exceptionResponse: unknown, exception: unknown): string {
  if (
    exceptionResponse &&
    typeof exceptionResponse === 'object' &&
    'message' in exceptionResponse
  ) {
    const { message } = exceptionResponse as { message: string | string[] };
    return Array.isArray(message) ? message.join(', ') : message;
  }
  if (typeof exceptionResponse === 'string') return exceptionResponse;
  if (exception instanceof Error) return exception.message;
  return 'Internal server error';
}
