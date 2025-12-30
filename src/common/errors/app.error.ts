export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: Record<string, any>;
  public timestamp: Date;
  public readonly errorType!: 'client' | 'server';

  constructor(
    message: string,
    statusCode: number = 500,
    errorType: 'client' | 'server' = 'server',
    isOperational: boolean = true,
    details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.isOperational = isOperational;
    this.details = details ?? {};
    this.timestamp = new Date();

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, 'client', true, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(
    message: string = 'You are not authorized',
    details?: Record<string, any>,
  ) {
    super(message, 401, 'client', true, details);
  }
}

export class AuthorizationError extends AppError {
  constructor(
    message: string = 'Access forbidden',
    details?: Record<string, any>,
  ) {
    super(message, 403, 'client', true, details);
  }
}

export class NotFoundError extends AppError {
  constructor(
    message: string = 'Resource not found',
    details?: Record<string, any>,
  ) {
    super(message, 404, 'client', true, details);
  }
}

export class ConflictError extends AppError {
  constructor(
    message: string = 'Conflict occurred',
    details?: Record<string, any>,
  ) {
    super(message, 409, 'client', true, details);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message: string = 'Internal server error',
    details?: Record<string, any>,
  ) {
    super(message, 500, 'server', true, details);
  }
}
