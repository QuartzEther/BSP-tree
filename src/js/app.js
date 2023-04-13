import {Leaf} from './classes/leaf.js'

const MAX_LEAF_SIZE = 200;

let parent = document.querySelector('.root');//родитель
const parentHeight = parseInt(getComputedStyle(parent).height.split('px')[0]);
const parentWidth = parseInt(getComputedStyle(parent).width.split('px')[0]);

let margin = 4;//отступы элементов

let _leafs = [];

let l = new Leaf() //вспомогательный лист

// сначала создаём лист, который будет "корнем" для всех остальных листьев.
let root = new Leaf(0,0, parentWidth - margin, parentHeight - margin);
_leafs.push(root);

let didSplit = true;
// циклически снова и снова проходим по каждому листу в нашем Vector, пока больше не останется листьев, которые можно разрезать.
while (didSplit){
    didSplit = false;
    for (l of _leafs){
        if (l.leftChild == null && l.rightChild == null){ // если лист ещё не разрезан
            // если этот лист слишком велик, или есть вероятность 75%
            if (l.width > MAX_LEAF_SIZE || l.height > MAX_LEAF_SIZE || Math.random() > 0.25) {
                if (l.split()) // разрезаем лист!
                {
                    // если мы выполнили разрезание, передаём дочерние листья в Vector, чтобы в дальнейшем можно было в цикле обойти и их
                    _leafs.push(l.leftChild);
                    _leafs.push(l.rightChild);
                    didSplit = true;
                }
            }

        }
    }
}


//отображение областей на root
for (l of _leafs){
    if(!l.leftChild && !l.rightChild){
        let box = document.createElement('div');

        box.classList.add('root__leaf');

        box.style.width = l.width - margin + 'px';
        box.style.height = l.height - margin + 'px';

        box.style.top = l.y + margin + 'px'
        box.style.left = l.x + margin + 'px'

        parent.appendChild(box);
    }
}