import {Rectangle} from './classes/rectangle.js'

class Leaf {
    static MIN_LEAF_SIZE = 6;

    leftChild = null;
    rightChild = null;
    room = new Rectangle()
    halls = [];

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    split() {
        if (this.leftChild !== null || this.rightChild !== null) {
            return false;
        }

        let splitH = Math.random() > 0.5;
        if (this.width > this.height && this.width / this.height >= 1.25) {
            splitH = false;
        } else if (this.height > this.width && this.height / this.width >= 1.25) {
            splitH = true;
        }

        const max = (splitH ? this.height : this.width) - Leaf.MIN_LEAF_SIZE;
        if (max <= Leaf.MIN_LEAF_SIZE) {
            return false;
        }

        const split = Math.floor(Math.random() * (max - Leaf.MIN_LEAF_SIZE + 1) + Leaf.MIN_LEAF_SIZE);

        if (splitH) {
            this.leftChild = new Leaf(this.x, this.y, this.width, split);
            this.rightChild = new Leaf(this.x, this.y + split, this.width, this.height - split);
        } else {
            this.leftChild = new Leaf(this.x, this.y, split, this.height);
            this.rightChild = new Leaf(this.x + split, this.y, this.width - split, this.height);
        }

        return true;
    }
}