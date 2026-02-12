export class Timestamp {
  constructor(public readonly value: string) {}
}

export class TimestampMother {
  static random(): Timestamp {
    const start = new Date(2020, 0, 1).getTime();
    const end = new Date().getTime();
    const randomTime = new Date(start + Math.random() * (end - start));
    return new Timestamp(randomTime.toISOString());
  }
}
