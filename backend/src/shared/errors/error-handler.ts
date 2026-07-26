import { FastifyInstance } from "fastify";

import { AppError } from "./app-error.js";


export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }


    request.log.error(error);


    return reply.status(500).send({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error interno del servidor",
      },
    });
  });
}