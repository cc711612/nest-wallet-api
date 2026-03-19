import {
  ApiResponseOptions,
} from '@nestjs/swagger';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function wrappedOk(description: string, data: JsonValue): ApiResponseOptions {
  return {
    description,
    schema: {
      example: {
        status: true,
        code: 200,
        message: '',
        data,
      },
    },
  };
}

export function wrappedUnauthorized(message = '缺少或無效 JWT'): ApiResponseOptions {
  return {
    description: message,
    schema: {
      example: {
        status: false,
        code: 401,
        message,
        data: [],
      },
    },
  };
}

export function wrappedBadRequest(message: string): ApiResponseOptions {
  return {
    description: message,
    schema: {
      example: {
        status: false,
        code: 400,
        message,
        data: [],
      },
    },
  };
}
