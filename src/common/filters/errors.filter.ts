import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError, InternalServerError } from '../errors/app.error';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let error: AppError;

    if (exception instanceof AppError) {
      error = exception;
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      error = new AppError(
        exception.message,
        status,
        status < 500 ? 'client' : 'server',
      );
    } else {
      error = new InternalServerError();
      console.error('[SERVER ERROR]', exception);
    }

    if (error.errorType === 'client') {
      return response.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
        statusCode: error.statusCode,
        data: error.details,
      });
    }

    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      statusCode: error.statusCode,
      data: error.details,
    });
  }
}
