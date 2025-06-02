// let path = [];
// const maxLength = 30; // Максимальная длина хвоста
// const fadeSpeed = 10; // Скорость исчезновения

// function setup() {
//   const canvas = createCanvas(windowWidth, windowHeight);
//   canvas.parent('drawing-canvas');
//   strokeWeight(8); // Толщина линии
//   noFill();
//   stroke(255, 100, 0, 100)
// }

// function draw() {
//   clear();
//   background(0, 0, 0, 0); // Полная прозрачность
  
//   // Добавляем текущую позицию мыши
//   path.push({
//     x: mouseX,
//     y: mouseY,
//     alpha: 255 // Начальная прозрачность
//   });
  
//   // // Удаляем лишние точки
//   if (path.length > maxLength) {
//     path.shift();
//   }
  
//   // Рисуем линию
//   beginShape();
//   curveVertex(path[0].x, path[0].y); // Дублируем первую точку
//   path.forEach(p => curveVertex(p.x, p.y));
//   curveVertex(path[path.length-1].x, path[path.length-1].y); // Дублируем последнюю
//   endShape();
  
//   // // Уменьшаем прозрачность всех точек
//   path.forEach(p => p.alpha -= fadeSpeed);
  
//   // // Удаляем полностью прозрачные точки
//   path = path.filter(p => p.alpha > 0);
  
// }

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// } 










let currentHue;
let isMouseMoving = false;
let lastX, lastY;

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('drawing-canvas');
    colorMode(HSB, 360, 100, 100);
    // background(0, 0);
    currentHue = random(360);
    stroke(currentHue, 100, 100);
    strokeWeight(6);
    strokeJoin(ROUND);
    strokeCap(ROUND);
}

function draw() {
    // Рисуем только при движении мыши
    if (isMouseMoving && !mouseIsPressed) {
        if (dist(mouseX, mouseY, lastX, lastY) > 2) {
            line(lastX, lastY, mouseX, mouseY);
            lastX = mouseX;
            lastY = mouseY;
        }
    }
}

function mouseMoved() {
    // Инициализируем позицию рисования
    if (!isMouseMoving) {
        lastX = mouseX;
        lastY = mouseY;
        isMouseMoving = true;
    }
}

function mouseClicked() {
    clear();
    // Сброс при клике
    // background(0, 0);
    currentHue = (currentHue + random(60, 300)) % 360;
    stroke(currentHue, 100, 100);
    isMouseMoving = false;
}

// function touchMoved() {
//     // Для мобильных устройств
//     mouseMoved();
//     return false;
// }

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // background(0, 0);
}