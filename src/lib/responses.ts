import { NextResponse } from 'next/server';
import { withCors } from './cors';
import { ApiSuccess, ApiError } from './types';

export function successResponse<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  // @ts-expect-error
  return withCors(
    NextResponse.json(
      {
        success: true,
        data,
      },
      { status },
    ),
  );
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: any,
): NextResponse<ApiError> {
  // @ts-expect-error
  return withCors(
    NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          ...(details && { details }),
        },
      },
      { status },
    ),
  );
}

export function validationErrorResponse(error: any): NextResponse<ApiError> {
  return errorResponse('BAD_REQUEST', 'Validation failed', 400, error.errors || error);
}

export function notFoundResponse(resource = 'Resource'): NextResponse<ApiError> {
  return errorResponse('NOT_FOUND', `${resource} not found`, 404);
}

export function internalErrorResponse(message = 'Internal server error'): NextResponse<ApiError> {
  return errorResponse('INTERNAL_ERROR', message, 500);
}
