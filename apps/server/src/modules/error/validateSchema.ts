import { Schema } from "zod";

interface CustomErrorResponseProps {
  message: string;
  paramsErrors?: {
    property: string | number;
    error: string;
  }[];
  statusCode: number;
}

export class CustomErrorResponse extends Error {
  paramsErrors?: {
    property: string | number;
    error: string;
  }[];
  message: string;
  statusCode: number;

  constructor({
    message,
    statusCode = 500,
    paramsErrors,
  }: CustomErrorResponseProps) {
    super(message);

    const objectErrorStringfy = JSON.stringify({
      message: paramsErrors
        ? message + "\n " + JSON.stringify(paramsErrors, null, 2)
        : message,
      statusCode: statusCode,
    });

    this.message = objectErrorStringfy;
  }

  get_statusCode() {
    return this.statusCode;
  }

  get_objectOfResponse() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      paramsErrors: this.paramsErrors,
    };
  }
}


export function validateSchema(data: any, schema: Schema) {
  const eventValidate = schema.safeParse(data);

  if (!eventValidate.success) {
    const errors = eventValidate.error.errors.map((error) => {
      return {
        property: error.path[error.path.length - 1],
        error: error.message,
      };
    });

    throw new CustomErrorResponse({
      message: "parameters are invalid",
      statusCode: 400,
      paramsErrors: errors,
    });
  }
}
