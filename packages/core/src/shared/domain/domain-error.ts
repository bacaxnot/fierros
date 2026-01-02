export type DomainErrorPrimitives = {
  type: string;
  description: string;
  data: Record<string, unknown>;
};

export abstract class DomainError extends Error {
  abstract readonly type: string;
  abstract readonly message: string;

  toPrimitives(): DomainErrorPrimitives {
    const props = Object.entries(this).filter(
      ([key, _]) => key !== "type" && key !== "message",
    );

    return {
      type: this.type,
      description: this.message,
      data: props.reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value,
        };
      }, {}),
    };
  }
}

export class InvalidArgumentError extends DomainError {
  readonly type = "InvalidArgumentError";
  readonly message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}
