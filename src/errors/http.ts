import { Response } from "express";

export class HttpError extends Error {
  body: { status: number; message: unknown };

  respond(res: Response) {
    res.status(this.body.status).json(this.body);
  }
}

export class Http400Error extends HttpError {
  constructor(message: unknown = "bad request") {
    super();
    this.body = { status: 400, message };
  }
}

export class Http401Error extends HttpError {
  constructor(message: unknown = "unauthorized") {
    super();
    this.body = { status: 401, message };
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
  constructor(message: unknown = "conflict") {
    super();
    this.body = { status: 409, message };
  }
}

export class Http500Error extends HttpError {
  constructor(message: unknown = "internal server error") {
    super();
    this.body = { status: 500, message };
  }
}

export class Http501Error extends HttpError {
  constructor(message: unknown = "not implemented") {
    super();
    this.body = { status: 501, message };
  }
}

export class Http503Error extends HttpError {
  constructor(message: unknown = "service unavailable") {
    super();
    this.body = { status: 503, message };
  }
}
