document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.getElementById('custom-cursor');
  const interactiveZones = document.querySelectorAll('[data-cursor-img]');
  
  // Движение курсора
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX - cursor.offsetWidth/2}px`;
    cursor.style.top = `${e.clientY - cursor.offsetHeight/2}px`;
  });
  
  // Вход в зону
  interactiveZones.forEach(zone => {
    zone.addEventListener('mouseenter', () => {
      const imgUrl = zone.getAttribute('data-cursor-img');
      cursor.style.backgroundImage = `url(${imgUrl})`;
      cursor.style.display = 'block';
    });
    
    zone.addEventListener('mouseleave', () => {
      cursor.style.display = 'none';
    });
  });
  
  // Скрываем курсор при выходе за пределы окна
  document.addEventListener('mouseout', () => {
    cursor.style.display = 'none';
  });
});



// // Вторая версия с обработкой мобилы

// document.addEventListener('DOMContentLoaded', () => {
//     const cursor = document.getElementById('custom-cursor');
//     const zones = document.querySelectorAll('[data-cursor-img]');
//     let isTouchDevice = false;

//     // Определяем тип устройства
//     const checkTouchDevice = () => {
//       try {
//         document.createEvent('TouchEvent');
//         isTouchDevice = true;
//       } catch (e) {
//         isTouchDevice = ('ontouchstart' in window) || 
//                        (navigator.maxTouchPoints > 0) || 
//                        (navigator.msMaxTouchPoints > 0);
//       }
//     };
//     checkTouchDevice();

//     // Общие функции
//     const showCursor = (x, y, img) => {
//       cursor.style.backgroundImage = `url(${img})`;
//       cursor.style.display = 'block';
//       updatePosition(x, y);
//     };

//     const updatePosition = (x, y) => {
//       cursor.style.left = `${x}px`;
//       cursor.style.top = `${y}px`;
//     };

//     const hideCursor = () => {
//       cursor.style.display = 'none';
//     };

//     // Обработчики для десктопа
//     if (!isTouchDevice) {
//       document.addEventListener('mousemove', (e) => {
//         updatePosition(e.clientX, e.clientY);
//       });

//       zones.forEach(zone => {
//         zone.addEventListener('mouseenter', () => {
//           showCursor(
//             zone.getBoundingClientRect().left + zone.offsetWidth/2,
//             zone.getBoundingClientRect().top + zone.offsetHeight/2,
//             zone.getAttribute('data-cursor-img')
//           );
//         });

//         zone.addEventListener('mouseleave', hideCursor);
//       });
//     }
//     // Обработчики для мобильных
//     else {
//       let activeTouch = null;

//       document.addEventListener('touchstart', (e) => {
//         if (activeTouch) return;
        
//         const touch = e.touches[0];
//         const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
//         if (element && element.hasAttribute('data-cursor-img')) {
//           activeTouch = touch.identifier;
//           showCursor(touch.clientX, touch.clientY, element.getAttribute('data-cursor-img'));
//           e.preventDefault();
//         }
//       }, { passive: false });

//       document.addEventListener('touchmove', (e) => {
//         if (!activeTouch) return;
        
//         for (let i = 0; i < e.changedTouches.length; i++) {
//           if (e.changedTouches[i].identifier === activeTouch) {
//             updatePosition(
//               e.changedTouches[i].clientX,
//               e.changedTouches[i].clientY
//             );
//             e.preventDefault();
//             break;
//           }
//         }
//       }, { passive: false });

//       document.addEventListener('touchend', (e) => {
//         if (!activeTouch) return;
        
//         for (let i = 0; i < e.changedTouches.length; i++) {
//           if (e.changedTouches[i].identifier === activeTouch) {
//             hideCursor();
//             activeTouch = null;
//             break;
//           }
//         }
//       });
//     }

//     // Скрываем курсор при выходе за пределы
//     document.addEventListener('mouseout', hideCursor);
    
//     // Предзагрузка изображений
//     function preloadImages() {
//       zones.forEach(zone => {
//         const img = new Image();
//         img.src = zone.getAttribute('data-cursor-img');
//       });
//     }
//     window.onload = preloadImages;
//   });