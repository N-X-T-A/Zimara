"use strcit";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  CREATED: "created",
  OK: "Success",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    options,
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata = {},
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    // this.options = options;
  }
}

class DELETED extends SuccessResponse {
  constructor({ message, options = {} }) {
    super({ message, options });
  }

  send(res) {
    return res.status(200).json({
      status: "success",
      message: this.message,
      ...this.options,
    });
  }
}

module.exports = {
  OK,
  CREATED,
  DELETED,
  SuccessResponse,
};
