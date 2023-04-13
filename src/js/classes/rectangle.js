import {Point} from './point.js'

export class Rectangle {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.width;
    }

    get top() {
        return this.y;
    }

    get bottom() {
        return this.y + this.height;
    }

    set left(value) {
        this.width += this.x - value;
        this.x = value;
    }

    set right(value) {
        this.width = value - this.x;
    }

    set top(value) {
        this.height += this.y - value;
        this.y = value;
    }

    set bottom(value) {
        this.height = value - this.y;
    }

    get topLeft() {
        return new Point(this.x, this.y);
    }

    get bottomRight() {
        return new Point(this.right, this.bottom);
    }

    set topLeft(point) {
        this.left = point.x;
        this.top = point.y;
    }

    set bottomRight(point) {
        this.right = point.x;
        this.bottom = point.y;
    }

    contains(x, y) {
        return x >= this.left && x < this.right && y >= this.top && y < this.bottom;
    }

    containsRect(rect) {
        return rect.left >= this.left && rect.right <= this.right && rect.top >= this.top && rect.bottom <= this.bottom;
    }

    intersects(rect) {
        return this.left < rect.right && this.right > rect.left && this.top < rect.bottom && this.bottom > rect.top;
    }

    intersection(rect) {
        const x1 = Math.max(this.left, rect.left);
        const y1 = Math.max(this.top, rect.top);
        const x2 = Math.min(this.right, rect.right);
        const y2 = Math.min(this.bottom, rect.bottom);
        return new Rectangle(x1, y1, x2 - x1, y2 - y1);
    }

    union(rect) {
        const x1 = Math.min(this.left, rect.left);
        const y1 = Math.min(this.top, rect.top);
        const x2 = Math.max(this.right, rect.right);
        const y2 = Math.max(this.bottom, rect.bottom);
        return new Rectangle(x1, y1, x2 - x1, y2 - y1);
    }

    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    toString() {
        return `[Rectangle(x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height})]`;
    }
}
