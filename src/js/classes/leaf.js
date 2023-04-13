import {Rectangle} from './rectangle.js'
import {Point} from './point.js'

export class Leaf {
    static MIN_LEAF_SIZE = 200; // начальное 60

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

    createRooms(){
        // эта функция генерирует все комнаты и коридоры для этого листа и всех его дочерних листьев.
        if (this.leftChild || this.rightChild){
            // этот лист был разрезан, поэтому переходим к его дочерним листьям
            if(this.leftChild) this.leftChild.createRooms()
            if(this.rightChild) this.rightChild.createRooms()

        } else {
            // этот лист готов к созданию комнаты
            let roomSize = null;
            let roomPos = null;

            //Registry.randomNumber(a, b) == Math.floor(Math.random() * (b - a + 1) + a)
            // размер комнаты может находиться в промежутке от 30px x 30px до размера листа - 5px.
            let min = 100; // начальное 30
            let tempWidth = this.width - 20 // начальное 10
            let tempHeight = this.height - 20 // начальное 10

            roomSize = new Point(Math.floor(Math.random() * (tempWidth - min + 1) + min), Math.floor(Math.random() * (tempHeight - min + 1) + min));

            // располагаем комнату внутри листа, но не помещаем её прямо
            // рядом со стороной листа (иначе комнаты сольются)
            let minLeftTop = 5;
            let maxLeft = this.width - roomSize.x - 5;
            let maxTop = this.height - roomSize.y - 5;

            roomPos = new Point(Math.floor(Math.random() * (maxLeft - minLeftTop + 1) + minLeftTop), Math.floor(Math.random() * (maxTop - minLeftTop + 1) + minLeftTop));

            //создаем комнату
            this.room = new Rectangle(roomPos.x, roomPos.y, roomSize.x, roomSize.y);

            //для абсолютного позиционирования room от root
            //this.room = new Rectangle(this.x + roomPos.x, this.y + roomPos.y, roomSize.x, roomSize.y);
        }
    }
}