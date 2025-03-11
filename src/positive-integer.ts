class PositiveInteger {
    private readonly value: number;

    constructor(value: number) {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error("Value must be a positive integer.");
        }
        this.value = value;
    }

    public static fromNumber(value: number): PositiveInteger {
        return new PositiveInteger(value);
    }

    public next(): PositiveInteger {
        return new PositiveInteger(this.value + 1);
    }

    public add(value: PositiveInteger) {
        return new PositiveInteger(this.value + value.getValue());
    }

    public minus(value: PositiveInteger) {
        return new PositiveInteger(this.value - value.getValue());
    }

    getValue(): number {
        return this.value;
    }

    equals(other: PositiveInteger): boolean {
        if (!(other instanceof PositiveInteger)) {
            return false;
        }
        return this.value === other.value;
    }

    toString(): string {
        return this.value.toString();
    }
}

export { PositiveInteger }
