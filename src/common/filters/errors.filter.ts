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

    console.error('[ERROR DETAILS]', exception);

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
      if (exception instanceof Error && exception.stack) {
        console.error(exception.stack);
      }
    }

    // Client errors
    if (error.errorType === 'client') {
      return response.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
        statusCode: error.statusCode,
        data: error.details,
      });
    }

    // Server errors
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      statusCode: error.statusCode,
      data: error.details,
    });
  }
}
