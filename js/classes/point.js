export class Point {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    setTo(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Point(this.x, this.y);
    }

    copyFrom(point) {
        this.x = point.x;
        this.y = point.y;
    }

    add(point) {
        return new Point(this.x + point.x, this.y + point.y);
    }

    subtract(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }

    equals(point) {
        return this.x === point.x && this.y === point.y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
