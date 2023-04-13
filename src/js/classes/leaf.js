import {Rectangle} from './rectangle.js'
import {Point} from './point.js'

function randomNumber(from = 0, to = 100){
    //Registry.randomNumber(a, b) == Math.floor(Math.random() * (b - a + 1) + a)
    return Math.floor(Math.random() * (to - from + 1) + from);
}

export class Leaf {
    static MIN_LEAF_SIZE = 200; // начальное 60

    leftChild = null; // левый дочерний Leaf нашего листа
    rightChild = null; // правый дочерний Leaf нашего листа
    room = null// комната, находящаяся внутри листа
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

        const split = randomNumber(Leaf.MIN_LEAF_SIZE, max)// определяемся, где будем разрезать

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
            if (this.leftChild){
                this.leftChild.createRooms()

            }

            if (this.rightChild){
                this.rightChild.createRooms()

            }

            // если у этого листа есть и левый, и правый дочерние листья, то создаём между ними коридор
            if (this.leftChild && this.rightChild)
            {
                this.createHall(this.leftChild.getRoom(), this.rightChild.getRoom());
            }

        } else {
            // этот лист готов к созданию комнаты
            let roomSize = null;
            let roomPos = null;

            // размер комнаты может находиться в промежутке от 30px x 30px до размера листа - 5px.
            let min = 100; // начальное 30
            let tempWidth = this.width - 20 // начальное 10
            let tempHeight = this.height - 20 // начальное 10

            roomSize = new Point(randomNumber(min, tempWidth), randomNumber(min, tempHeight));

            // располагаем комнату внутри листа, но не помещаем её прямо
            // рядом со стороной листа (иначе комнаты сольются)
            let minLeftTop = 5;
            let maxLeft = this.width - roomSize.x - 5;
            let maxTop = this.height - roomSize.y - 5;

            roomPos = new Point(randomNumber(minLeftTop, maxLeft), randomNumber(minLeftTop, maxTop));

            //создаем комнату
            //this.room = new Rectangle(roomPos.x, roomPos.y, roomSize.x, roomSize.y);

            //для абсолютного позиционирования room от root
            this.room = new Rectangle(this.x + roomPos.x, this.y + roomPos.y, roomSize.x, roomSize.y);
        }
    }

    //Поиск какой-то комнаты
    getRoom(){
        // итеративно проходим весь путь по этим листьям, чтобы найти комнату, если она существует.
        if (this.room)
            return this.room;
        else
        {
            let lRoom = null;
            let rRoom = null;

            if (this.leftChild)
            {
                lRoom = this.leftChild.getRoom();
            }

            if (this.rightChild)
            {
                rRoom = this.rightChild.getRoom();
            }

            if (lRoom == null && rRoom == null){
                return null;
            } else if (rRoom == null){
                return lRoom;
            } else if (lRoom == null){
                return rRoom;
            } else if (Math.random() > 0.5){
                return lRoom;
            } else {
                return rRoom;
            }
        }
    }

    //создание коридора между 2-мя комнатами
    createHall(l, r){
        // Теперь мы соединяем эти две комнаты коридорами.
        // Выглядит довольно сложно, но здесь мы просто выясняем, где какая точка находится, а затем отрисовываем прямую линию или пару линий,
        // чтобы создать правильный угол для их соединения.
        // При желании можно добавить логику, делающую коридоры более извилистыми, или реализующую другое сложное поведение.

        //this.halls = [];

        let point1 = new Point(randomNumber(l.left + 10, l.right - 20), randomNumber(l.top + 10, l.bottom - 20));
        let point2 = new Point(randomNumber(r.left + 10, r.right - 20), randomNumber(r.top + 10, r.bottom - 20));

        let w = point2.x - point1.x;
        let h = point2.y - point1.y;

        let autoWH = 10;

        if (w < 0)
        {
            if (h < 0)
            {
                if (Math.random() < 0.5) {
                    this.halls.push(new Rectangle(point2.x, point1.y, Math.abs(w), autoWH));
                    this.halls.push(new Rectangle(point2.x, point2.y, autoWH, Math.abs(h)));
                } else {
                    this.halls.push(new Rectangle(point2.x, point2.y, Math.abs(w), autoWH));
                    this.halls.push(new Rectangle(point1.x, point2.y, autoWH, Math.abs(h)));
                }
            } else if (h > 0) {
                if (Math.random() < 0.5) {
                    this.halls.push(new Rectangle(point2.x, point1.y, Math.abs(w), autoWH));
                    this.halls.push(new Rectangle(point2.x, point1.y, autoWH, Math.abs(h)));
                } else {
                    this.halls.push(new Rectangle(point2.x, point2.y, Math.abs(w), autoWH));
                    this.halls.push(new Rectangle(point1.x, point1.y, autoWH, Math.abs(h)));
                }
            } else {
                this.halls.push(new Rectangle(point2.x, point2.y, Math.abs(w), autoWH));
            }
        } else if (w > 0) {
            if (h < 0) {
                if (Math.random() < 0.5) {
                    this.halls.push(new Rectangle(point1.x, point2.y, Math.abs(w), autoWH));
                    this.halls.push(new Rectangle(point1.x, point2.y, autoWH, Math.abs(h)));
                } else {
                    this.halls.push(new Rectangle(point1.x, point1.y, Math.abs(w), autoWH));
                    this.halls.push(new Rectangle(point2.x, point2.y, autoWH, Math.abs(h)));
                }
            } else if (h > 0) {
                if (Math.random() < 0.5) {
                    this.halls.push(new Rectangle(point1.x, point1.y, Math.abs(w), autoWH));
                    this.halls.push(new Rectangle(point2.x, point1.y, autoWH, Math.abs(h)));
                } else {
                    this.halls.push(new Rectangle(point1.x, point2.y, Math.abs(w), autoWH));
                    this.halls.push(new Rectangle(point1.x, point1.y, autoWH, Math.abs(h)));
                }
            } else {
                this.halls.push(new Rectangle(point1.x, point1.y, Math.abs(w), autoWH));
            }
        } else {
            if (h < 0) {
                this.halls.push(new Rectangle(point2.x, point2.y, autoWH, Math.abs(h)));
            } else if (h > 0) {
                this.halls.push(new Rectangle(point1.x, point1.y, autoWH, Math.abs(h)));
            }
        }
    }
}