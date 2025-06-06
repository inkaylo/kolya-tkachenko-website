let path = [];
const maxLength = 30; // Максимальная длина хвоста
const fadeSpeed = 10; // Скорость исчезновения
let strokeColor;
let isMouseMoving = false;
let lastX, lastY;


function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('drawing-canvas');
  colorMode(HSB, 360, 100, 100);
  strokeColor = color(random(360), 100, 85);
  strokeWeight(8); // Толщина линии
  noFill();
  stroke(strokeColor);
  strokeJoin(ROUND);
  strokeCap(ROUND);

// Инициализация цвета
updateAccentColor();

}

function draw() {
    
    // Рисуем только при движении мыши
    if (isMouseMoving) {
        if (dist(mouseX, mouseY, lastX, lastY) > 2) {
            clear();
  
            // Добавляем текущую позицию мыши
            path.push({
                x: mouseX,
                y: mouseY,
                alpha: 255 // Начальная прозрачность
            });
            
            // // Удаляем лишние точки
            if (path.length > maxLength) {
                path.shift();
            }

            // Рисуем линию
            beginShape();
            curveVertex(path[0].x, path[0].y); // Дублируем первую точку
            path.forEach(p => curveVertex(p.x, p.y));
            curveVertex(path[path.length-1].x, path[path.length-1].y); // Дублируем последнюю
            endShape();
            
            // // Уменьшаем прозрачность всех точек
            path.forEach(p => p.alpha -= fadeSpeed);
            
            // // Удаляем полностью прозрачные точки
            path = path.filter(p => p.alpha > 0);
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

function mousePressed() {
    strokeColor = color(random(360), 100, 85);
    stroke(strokeColor);

    // Обновляем цвета на сайте
    updateAccentColor();
}

function updateAccentColor() {
    const hexColor = hsbToHex(
        hue(strokeColor), 
        saturation(strokeColor), 
        brightness(strokeColor)
    );
    
    // Обновляем CSS переменную
    document.documentElement.style.setProperty('--accent-color', hexColor);
}

function hsbToHex(h, s, b) {
    const rgb = color(h, s, b).levels;
    return `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`;
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
} 




// let currentHue;
// let isMouseMoving = false;
// let lastX, lastY;
// let strokeColor;

// function setup() {
//     const canvas = createCanvas(windowWidth, windowHeight);
//     canvas.parent('drawing-canvas');
//     colorMode(HSB, 360, 100, 100);
//     strokeColor = color(random(360), 100, 85);
//     stroke(strokeColor);
//     strokeWeight(6);
//     strokeJoin(ROUND);
//     strokeCap(ROUND);

//     updateAccentColor();
// }

// function draw() {
//     // Рисуем только при движении мыши
//     if (isMouseMoving && !mouseIsPressed) {
//         if (dist(mouseX, mouseY, lastX, lastY) > 2) {
//             line(lastX, lastY, mouseX, mouseY);
//             lastX = mouseX;
//             lastY = mouseY;
//         }
//     }
// }

// function mouseMoved() {
//     // Инициализируем позицию рисования
//     if (!isMouseMoving) {
//         lastX = mouseX;
//         lastY = mouseY;
//         isMouseMoving = true;
//     }
// }

// function mousePressed() {
//     clear();
//     strokeColor = color(random(360), 100, 85);
//     stroke(strokeColor);
//     isMouseMoving = false;
//     updateAccentColor();
// }

// function updateAccentColor() {
//     const hexColor = hsbToHex(
//         hue(strokeColor), 
//         saturation(strokeColor), 
//         brightness(strokeColor)
//     );
    
//     // Обновляем CSS переменную
//     document.documentElement.style.setProperty('--accent-color', hexColor);
// }

// function hsbToHex(h, s, b) {
//     const rgb = color(h, s, b).levels;
//     return `#${rgb[0].toString(16).padStart(2, '0')}${rgb[1].toString(16).padStart(2, '0')}${rgb[2].toString(16).padStart(2, '0')}`;
// }

// // function touchMoved() {
// //     // Для мобильных устройств
// //     mouseMoved();
// //     return false;
// // }

// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
// }