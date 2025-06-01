// Простой курсор

// function setup() {
//   var myCanvas = createCanvas(windowWidth, windowHeight);
//   myCanvas.parent("canvas-overlay");
// }

// function draw() {
  
//   frameRate(120);
//   clear();
//   fill('rgba(0, 255, 0, 0.25)');

//  //white circles drawn at mouse position
//   circle(mouseX, mouseY, 100);

// }

//when mouse button is pressed, circles turn black
// if (mouseIsPressed === true) {
//   fill(0);
// } else {
//   fill('rgba(0, 255, 0, 0.25)');
// }




// Курсор-маска с затемнением

  // function setup() {
  //   const canvas = createCanvas(windowWidth, windowHeight);
  //   canvas.parent('canvas-overlay');
  //   noStroke();
  // }
  
  // function draw() {
  //   clear();
    
  //   // 1. Заливаем весь canvas чёрным с небольшой прозрачностью
  //   fill(0, 0, 0, 200); // Можно регулировать прозрачность (10-50)
  //   rect(0, 0, width, height);
    
  //   // 2. Меняем режим композитинга — вырезаем дырку
  //   drawingContext.globalCompositeOperation = 'destination-out';
    
  //   // 3. Рисуем круг в позиции курсора (это будет "линза")
  //   circle(mouseX, mouseY, 400); // Размер круга
    
  //   // 4. Возвращаем стандартный режим (на будущее)
  //   drawingContext.globalCompositeOperation = 'source-over';
  // }
  
  // function windowResized() {
  //   resizeCanvas(windowWidth, windowHeight);
  // }

 





// Рабочий курсор из частиц

  // let particles = [];
  // const fadeSpeed = 2;
  // const particleSize = 30;
  
  // function setup() {
  //   const canvas = createCanvas(windowWidth, windowHeight);
  //   canvas.parent('drawing-canvas');
  //   noStroke();
  //   fill(255, 0, 0, 50); // Полупрозрачный красный цвет
  // }
  
  // function draw() {
  //   // Прозрачный фон для эффекта исчезновения (не перекрывает контент)
  //   clear();
  //   background(0, 0, 0, 0);
    
  //   // Добавляем новую частицу
  //   particles.push({
  //     x: mouseX,
  //     y: mouseY,
  //     size: particleSize,
  //     life: 100
  //   });
  
  //   // Рисуем все частицы
  //   for (let i = particles.length - 1; i >= 0; i--) {
  //     const p = particles[i];
      
  //     // Цвет меняется от красного к жёлтому при исчезновении
  //     fill(255 * (p.life/100), 100, 0, p.life);
  //     circle(p.x, p.y, p.size);
      
  //     p.life -= fadeSpeed;
  //     p.size *= 0.96;
      
  //     if (p.life <= 0) {
  //       particles.splice(i, 1);
  //     }
  //   }
    
  //   // Рисуем курсор
  //   fill(0, 150);
  //   circle(mouseX, mouseY, 12);
  // }
  
  // function windowResized() {
  //   resizeCanvas(windowWidth, windowHeight);
  // }





// Рабочий курсор - линия

  let path = [];
const maxLength = 30; // Максимальная длина хвоста
const fadeSpeed = 10  ; // Скорость исчезновения

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('drawing-canvas');
  strokeWeight(8); // Толщина линии
  noFill();
  stroke(255, 100, 0, 100)
}

function draw() {
  clear();
  background(0, 0, 0, 0); // Полная прозрачность
  
  
  // Добавляем текущую позицию мыши
  path.push({
    x: mouseX,
    y: mouseY,
    alpha: 255 // Начальная прозрачность
  });
  
  // Удаляем лишние точки
  if (path.length > maxLength) {
    path.shift();
  }
  
  // Рисуем линию
  beginShape();
  curveVertex(path[0].x, path[0].y); // Дублируем первую точку
  path.forEach(p => curveVertex(p.x, p.y));
  curveVertex(path[path.length-1].x, path[path.length-1].y); // Дублируем последнюю
  endShape();
  
  // Уменьшаем прозрачность всех точек
  path.forEach(p => p.alpha -= fadeSpeed);
  
  // Удаляем полностью прозрачные точки
  path = path.filter(p => p.alpha > 0);


  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}