// Обычная сетка
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.feed');
    let resizeTimeout;
    
    imagesLoaded(grid, { background: true }, () => {
        const msnry = new Masonry(grid, {
            itemSelector: '.masonry-item',
            columnWidth: '.grid-sizer',
            percentPosition: true,
            gutter: 20,
            horizontalOrder: true,
            resize: false // Отключаем встроенный ресайз
        });

        // Оптимизированный обработчик ресайза
        const resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                msnry.layout();
            }, 100); // Дебаунс 100 мс
        });

        resizeObserver.observe(grid);
        
        // Обработчик для ручного вызова при изменении контента
        const mutationObserver = new MutationObserver(() => {
            msnry.layout();
        });

        mutationObserver.observe(grid, {
            childList: true,
            subtree: true
        });

        // Уничтожаем наблюдатели при размонтировании
        window.addEventListener('beforeunload', () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        });
    });
});




// С анимацией появления

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.feed');
    let resizeTimeout;
    let observer;

    // Функция для анимации элементов
    const animateItems = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Прекращаем наблюдение после появления
            }
        });
    };

    // Настройки Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Инициализация наблюдателя
    const initObserver = () => {
        observer = new IntersectionObserver(animateItems, observerOptions);
        document.querySelectorAll('.masonry-item:not(.is-visible)').forEach(item => {
            // В цикле наблюдения элементов
            document.querySelectorAll('.masonry-item').forEach((item, index) => {
                item.style.setProperty('--index', index);
                observer.observe(item);
            });
        });
    };

    imagesLoaded(grid, { background: true }, () => {
        const msnry = new Masonry(grid, {
            itemSelector: '.masonry-item',
            columnWidth: '.grid-sizer',
            percentPosition: true,
            gutter: 20,
            horizontalOrder: true,
            resize: false
        });

        // Инициализация анимаций после полной загрузки
        initObserver();

        // Обновляем анимации при изменении сетки
        const mutationObserver = new MutationObserver(() => {
            initObserver();
            msnry.layout();
        });

        mutationObserver.observe(grid, {
            childList: true,
            subtree: true
        });

        // Ресайз-обсервер
        const resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                msnry.layout();
                initObserver(); // Переинициализация при ресайзе
            }, 100);
        });

        resizeObserver.observe(grid);

        window.addEventListener('beforeunload', () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            observer.disconnect();
        });
    });
});





// Вариант с кнопкой "Показать ещё"
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.feed');
    const loadMoreButton = document.createElement('button'); // Создаем кнопку динамически
    let msnry; // Экземпляр Masonry
    let visibleItemsCount = 0; // Текущее количество видимых элементов

    // Конфигурация
    const config = {
        initialItems: 8, // Элементов при загрузке
        itemsPerLoad: 4, // Элементов за 1 подгрузку
        totalItems: document.querySelectorAll('.masonry-item').length // Всего элементов
    };

    // Инициализация Masonry (основная логика без изменений)
    function initMasonry() {
        imagesLoaded(grid, { background: true }, () => {
            msnry = new Masonry(grid, {
                itemSelector: '.masonry-item:not(.hidden)',
                columnWidth: '.grid-sizer',
                percentPosition: true,
                gutter: 20,
                horizontalOrder: true,
                resize: false
            });

            initObservers();
            initLoadMoreButton();
            updateVisibility(config.initialItems);
        });
    }

    // Инициализация наблюдателей (прежняя логика)
    function initObservers() {
        let resizeTimeout;
        const resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => msnry.layout(), 100);
        });

        const mutationObserver = new MutationObserver(() => msnry.layout());

        resizeObserver.observe(grid);
        mutationObserver.observe(grid, { childList: true, subtree: true });

        window.addEventListener('beforeunload', () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        });
    }

    // НОВАЯ ФУНКЦИОНАЛЬНОСТЬ: Управление видимостью элементов
    function updateVisibility(showCount) {
        const allItems = Array.from(grid.querySelectorAll('.masonry-item'));
        
        allItems.forEach((item, index) => {
            item.classList.toggle('hidden', index >= showCount);
        });

        visibleItemsCount = Math.min(showCount, config.totalItems);
        msnry.layout(); // Обязательное обновление Masonry
        
        // Обновляем состояние кнопки
        loadMoreButton.classList.toggle('hidden', visibleItemsCount >= config.totalItems);
    }

    // НОВАЯ ФУНКЦИОНАЛЬНОСТЬ: Инициализация кнопки
    function initLoadMoreButton() {
        loadMoreButton.className = 'load-more';
        loadMoreButton.textContent = 'Показать ещё';
        loadMoreButton.hidden = true;
        
        loadMoreButton.addEventListener('click', () => {
            updateVisibility(visibleItemsCount + config.itemsPerLoad);
        });

        grid.after(loadMoreButton); // Добавляем кнопку после галереи
    }

    // Первичная инициализация
    initMasonry();
});