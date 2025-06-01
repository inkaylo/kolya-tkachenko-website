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



document.addEventListener('DOMContentLoaded', () => {
  if(typeof p5 === 'function') {
      new p5(function(p) {
          let path = [];
          let hue = 0; // Тон (0-360)
          const saturation = 100; // Фиксированная насыщенность (%)
          const brightness = 100; // Фиксированная яркость (%)
          const alpha = 100; // Фиксированная прозрачность (0-255)
          let lastMouseX = 0;
          let lastMouseY = 0;
          
          p.setup = function() {
              // Создаем canvas поверх всего контента
              const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
              canvas.parent('drawing-canvas');
              
              // Настройки стилей canvas
              canvas.style('position', 'fixed');
              canvas.style('top', '0');
              canvas.style('left', '0');
              canvas.style('z-index', '9999');
              canvas.style('pointer-events', 'none');
              
              // Переключаем в режим HSB
              p.colorMode(p.HSB, 360, 100, 100, 255);
              
              // Прозрачный фон
              p.background(0, 0);
              p.noFill();
              
              // Генерируем начальный цвет
              generateNewColor();
          };
          
          function generateNewColor() {
              // Случайный тон (0-360)
              hue = p.random(360);
          }
          
          p.draw = function() {
              // Добавляем новые точки только при движении мыши
              if (p.mouseX !== lastMouseX || p.mouseY !== lastMouseY) {
                  // Рассчитываем расстояние от последней точки
                  const distance = p.dist(lastMouseX, lastMouseY, p.mouseX, p.mouseY);
                  
                  // Интерполяция для плавности
                  const steps = Math.max(1, Math.min(5, Math.floor(distance / 2)));
                  for (let i = 0; i <= steps; i++) {
                      const t = i / steps;
                      const x = p.lerp(lastMouseX, p.mouseX, t);
                      const y = p.lerp(lastMouseY, p.mouseY, t);
                      path.push({x, y});
                  }
                  
                  lastMouseX = p.mouseX;
                  lastMouseY = p.mouseY;
              }
              
              // Рисуем всю линию заново
              p.clear();
              if (path.length > 1) {
                  p.beginShape();
                  p.stroke(hue, saturation, brightness, alpha);
                  p.strokeWeight(8);
                  
                  // Используем curveVertex для гладких кривых
                  for (let i = 0; i < path.length; i++) {
                      p.curveVertex(path[i].x, path[i].y);
                  }
                  p.endShape();
              }
          };
          
          p.mousePressed = function() {
              // Очищаем canvas при клике и генерируем новый цвет
              path = [];
              generateNewColor();
              p.clear();
          };
          
          p.windowResized = function() {
              p.resizeCanvas(p.windowWidth, p.windowHeight);
          };
      });
  }
});