import {Rectangle} from './rectangle.js'

class Leaf {
    static MIN_LEAF_SIZE = 6;

    leftChild = null; // левый дочерний Leaf нашего листа
    rightChild = null; // правый дочерний Leaf нашего листа
    room = new Rectangle() // комната, находящаяся внутри листа
    halls = []; // коридоры, соединяющие этот лист с другими листьями

    // положение и размер этого листа
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    split() {
        // начинаем разрезать лист на два дочерних листа
        if (this.leftChild !== null || this.rightChild !== null) {
            return false; // мы уже его разрезали! прекращаем!
        }

        // определяем направление разрезания
        // если ширина более чем на 25% больше высоты, то разрезаем вертикально
        // если высота более чем на 25% больше ширины, то разрезаем горизонтально
        // иначе выбираем направление разрезания случайным образом
        let splitH = Math.random() > 0.5;
        if (this.width > this.height && this.width / this.height >= 1.25) {
            splitH = false;
        } else if (this.height > this.width && this.height / this.width >= 1.25) {
            splitH = true;
        }

        const max = (splitH ? this.height : this.width) - Leaf.MIN_LEAF_SIZE; // определяем максимальную высоту или ширину
        if (max <= Leaf.MIN_LEAF_SIZE) {
            return false; // область слишком мала, больше её делить нельзя...
        }

        const split = Math.floor(Math.random() * (max - Leaf.MIN_LEAF_SIZE + 1) + Leaf.MIN_LEAF_SIZE);// определяемся, где будем разрезать

        // создаём левый и правый дочерние листы на основании направления разрезания
        if (splitH) {
            this.leftChild = new Leaf(this.x, this.y, this.width, split);
            this.rightChild = new Leaf(this.x, this.y + split, this.width, this.height - split);
        } else {
            this.leftChild = new Leaf(this.x, this.y, split, this.height);
            this.rightChild = new Leaf(this.x + split, this.y, this.width - split, this.height);
        }

        return true; // разрезание выполнено!
    }
}