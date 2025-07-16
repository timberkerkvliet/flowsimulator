class PositiveInteger {
    public readonly value: number;

    constructor(value: number) {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error("Value must be a positive integer: " + value);
        }
        this.value = value;
    }

    public static fromNumber(value: number): PositiveInteger {
        return new PositiveInteger(value);
    }

    public previous(): PositiveInteger {
        return new PositiveInteger(this.value - 1);
    }

    public next(): PositiveInteger {
        return new PositiveInteger(this.value + 1);
    }

    public add(value: PositiveInteger) {
        return new PositiveInteger(this.value + value.value);
    }

    public multiply(value: PositiveInteger) {
        return new PositiveInteger(this.value * value.value);
    }

    public minus(value: PositiveInteger) {
        return new PositiveInteger(this.value - value.value);
    }

    equals(other: PositiveInteger): boolean {
        if (!(other instanceof PositiveInteger)) {
            return false;
        }
        return this.value === other.value;
    }

    lessThan(other: PositiveInteger): boolean {
        if (!(other instanceof PositiveInteger)) {
            return false;
        }
        return this.value < other.value;
    }

    geq(other: PositiveInteger): boolean {
        if (!(other instanceof PositiveInteger)) {
            return false;
        }
        return this.value >= other.value;
    }

    leq(other: PositiveInteger): boolean {
        if (!(other instanceof PositiveInteger)) {
            return false;
        }
        return this.value <= other.value;
    }

    isZero(): boolean {
        return this.value === 0;
    }

    toString(): string {
        return this.value.toString();
    }
}

export { PositiveInteger }
