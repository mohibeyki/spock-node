import { Response } from "express";

export class HttpError extends Error {
  code: number;
  body: { msg: unknown };

  respond(res: Response) {
    res.status(this.code).json(this.body);
  }
}

export class Http400Error extends HttpError {
  constructor(body: { msg: unknown } = { msg: "bad request" }) {
    super();
    this.code = 400;
    this.body = body;
  }
}

export class Http401Error extends HttpError {
  constructor(body: { msg: unknown } = { msg: "unauthorized" }) {
    super();
    this.code = 401;
    this.body = body;
  }
}

export class Http403Error extends HttpError {
  constructor(body: { msg: unknown } = { msg: "access denied" }) {
    super();
    this.code = 403;
    this.body = body;
  }
}

export class Http404Error extends HttpError {
  constructor(body: { msg: unknown } = { msg: "not found" }) {
    super();
    this.code = 404;
    this.body = body;
  }
}

export class Http409Error extends HttpError {
  constructor(body: { msg: unknown } = { msg: "conflict" }) {
    super();
    this.code = 409;
    this.body = body;
  }
}

export class Http500Error extends HttpError {
  constructor(body: { msg: unknown } = { msg: "internal server error" }) {
    super();
    this.code = 500;
    this.body = body;
  }
}

export class Http501Error extends HttpError {
  constructor(body: { msg: unknown } = { msg: "not implemented" }) {
    super();
    this.code = 501;
    this.body = body;
  }
}

export class Http503Error extends HttpError {
  constructor(body: { msg: unknown } = { msg: "service unavailable" }) {
    super();
    this.code = 503;
    this.body = body;
  }
}
