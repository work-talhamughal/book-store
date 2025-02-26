import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ValidationError } from "class-validator";
import winston from "winston";

const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log" }),
    new winston.transports.Console(),
  ],
});

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = ((
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error({
      message: err.message,
      details: err.details,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      details: err.details,
    });
    return;
  }

  if (err instanceof Error) {
    logger.error({
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
  return;
}) as ErrorRequestHandler;
