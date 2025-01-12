let count = 10;
let body = document.querySelector('body');
let input = document.querySelector('input');
let lightOn;
let elem;
let cardCollection = new Set();

input.focus();

document.addEventListener('mousedown', mouseDown);

//эта функция удаляет начальный экран, создает борд в левом верхнем углу
let remSt = document.querySelector('.go')
remSt.onclick = rem;

function mouseDown(event) {

    if (!(event.target.className == 'card' || event.target.className == 'figure'))
        return

    elem = event.target;

    lightOn = false;

    elem.ondragstart = function() {
        return false
    }

    event.preventDefault();
    elem.style.position = 'absolute';
    elem.style.zIndex = 1000;

    let shiftX = event.clientX - elem.getBoundingClientRect().left - window.pageXOffset;
    let shiftY = event.clientY - elem.getBoundingClientRect().top - window.pageYOffset;

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stopMove);

    function move(event) {

        //определяем центр переносимой фигуры
        let elemC = elem.getBoundingClientRect();
        let elemCX = elemC.left + elemC.width / 2;
        let elemCY = elemC.top + elemC.height / 2;

        //посвечивает жёлтой рамкой фигуру, если она помещена в целевой квадрат
        function light() {

            //определяем центр цели
            let belowC = below.getBoundingClientRect();
            let belowCX = belowC.left + belowC.width / 2;
            let belowCY = belowC.top + belowC.height / 2;

            //определяю попадание в целевой квадрат
            if (((elemCX >= belowCX - 10) && (elemCX <= belowCX + 10)) && ((elemCY >= belowCY - 10) && (elemCY <= belowCY + 10))) {

                below.style.boxShadow = '0px 0px 21px 5px lime';
                lightOn = true
            } else {
                below.style.boxShadow = ''
                lightOn = false
            }
        }

        //во время переноса элемент находится выше всех остальных
        elem.style.zIndex = 20000;

        //определяю цель для переноса, т.е. на нужную ли нам карточку наведена фигура
        elem.hidden = true;

        let below = document.elementFromPoint(event.clientX, event.clientY);

        if (below == null) {
            elem.hidden = false;
        } else {
            if ((elem.id.indexOf(below.id) != -1) && below.tagName != 'BODY') {
                light();
            }
        }

        elem.hidden = false;

        //координаты для дальнейшего ограничения перемещения карточки рамками документа
        let elemCoord = {
            left: event.clientX - shiftX,
            top: event.clientY - shiftY
        }

        //ограничиваю пермещение слева
        if (elemCoord.left < 0)
            elemCoord.left = 0;

        //ограничиваю пермещение справа
        if (elemCoord.left > (document.documentElement.clientWidth - elem.clientWidth - 5 + window.pageXOffset)) {
            elemCoord.left = document.documentElement.clientWidth - elem.clientWidth - 5 + window.pageXOffset
        }
        ;
        //сверху
        if (elemCoord.top < 0)
            elemCoord.top = 0;

        //снизу
        if (elemCoord.top > (document.documentElement.clientHeight - elem.clientHeight - 5 + window.pageYOffset)) {
            elemCoord.top = document.documentElement.clientHeight - elem.clientHeight - 5 + window.pageYOffset
        }
        ;
        elem.style.left = elemCoord.left + 'px';
        elem.style.top = elemCoord.top + 'px';

    }

    function stopMove(event) {
        elem = event.target;
        elem.style.position = 'absolute';

        elem.style.zIndex = 20000;

        //нахожу карточку, куда планируется перенос фигуры для дальнейшего автоподтягивания
        elem.hidden = true;
        let below = document.elementFromPoint(event.clientX, event.clientY);
        elem.hidden = false;

        //определяю координаты цели-карточки
        let belowC = below.getBoundingClientRect();
        let belowCX = belowC.left + belowC.width / 2;
        let belowCY = belowC.top + belowC.height / 2;

        let elemCoord = {
            left: event.clientX - shiftX,
            top: event.clientY - shiftY
        }

        //если подсветка горит, т.е. фигура над правильной карточкой и отпускается лкм, то фигура автоматически подтянется к центру карточки
        if (lightOn) {
            elemCoord.left = belowCX - elem.offsetWidth / 2;
            elemCoord.top = belowCY - elem.offsetHeight / 2;

            //если в сете нет карточки, то добавляем в сет и уменьшаем счетчик
            if ((!cardCollection.has(elem.id)) && count > 0)
                count = count - 1

            let span = document.querySelector('span');

            span.innerHTML = count;
            cardCollection.add(elem.id);

        }

        //корректный перенос фигуры или карточки
        elem.style.left = elemCoord.left + 'px';
        elem.style.top = elemCoord.top + 'px';

        elem.style.zIndex = 1000;

        below.style.boxShadow = ''
        document.removeEventListener('mousemove', move);

        document.removeEventListener('mouseup', stopMove);

    }
}

//удаляет начальный экран, создает борд в левом верхнем углу
function rem(e) {
    body.firstElementChild.remove()

    body.insertAdjacentHTML('afterbegin', `

<div class='board'>
<div><p><b>Ход игры</b></p></div>
<div><p>Играет: ${input.value}</p></div>
<div><p>Осталось карточек: <span>10</span> из 10</p></div>
<div class='time'><div>
</div>

`)
}

window.addEventListener('scroll', scr)

let start = document.querySelector('.start');

//если во время стартового окна скроллить, то темный экран будет расширяться
function scr(e) {

    start.style.width = window.pageXOffset + document.documentElement.clientWidth + 'px'
    start.style.height = window.pageYOffset + document.documentElement.clientHeight + 'px'

    if (!start) {
        window.removeEventListener('scroll', scr)
    }
}

//если нажать энтер за место кнопки тоже удалится начальный экран, создасться борд
document.addEventListener('keydown', function(e) {
    let start = document.querySelector('.start');
    if (!start)
        return

    if (e.key == 'Enter') {
        let board = document.querySelector('.board');
        rem(e)
    }
})
