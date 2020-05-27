import { Response } from "express";

export class HttpError extends Error {
  body: { status: number; message: unknown };

  respond(res: Response) {
    res.status(this.body.status).json(this.body);
  }
}

export class Http400Error extends HttpError {
  constructor(message: unknown) {
    super();
    this.body = { status: 400, message };
  }
}

export class Http403Error extends HttpError {
  constructor(message: unknown = "access denied") {
    super();
    this.body = { status: 403, message };
  }
}

export class Http404Error extends HttpError {
  constructor(message: unknown = "not found") {
    super();
    this.body = { status: 404, message };
  }
}

export class Http409Error extends HttpError {
  constructor(message: unknown) {
    super();
    this.body = { status: 409, message };
  }
}
