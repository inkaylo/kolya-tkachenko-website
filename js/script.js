// Masonry gallery

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.masonry-grid');
    let msnry; // Экземпляр Masonry
    let resizeTimeout; // Таймер для debounce
    let observer; // Intersection Observer для анимаций

    // 1. Функция конвертации em в px
    const emToPx = (emValue = 1) => {
        const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        return emValue * fontSize;
    };

    // 2. Инициализация Intersection Observer для анимаций
    const initAnimationObserver = () => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Наблюдаем за всеми элементами
        document.querySelectorAll('.masonry-item:not(.is-visible)').forEach(item => {
            document.querySelectorAll('.masonry-item').forEach((item, index) => {
                item.style.setProperty('--index', index);
                observer.observe(item);
            });
        });
    };

    // 3. Инициализация/переинициализация Masonry
    const initMasonry = () => {
        // Удаляем старый экземпляр
        if (msnry) msnry.destroy();

        // Создаем новый экземпляр с актуальным gutter
        msnry = new Masonry(grid, {
            itemSelector: '.masonry-item',
            columnWidth: '.grid-sizer',
            percentPosition: true,
            gutter: emToPx(1), // 1em в пикселях
            horizontalOrder: true,
            transitionDuration: 0
        });
    };

    // 4. Обработчики изменений
    const initObservers = () => {
        // Ресайз с debounce
        const resizeObserver = new ResizeObserver(() => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                initMasonry();
                msnry.layout();
                initAnimationObserver();
            }, 150);
        });

        // Мутации DOM
        const mutationObserver = new MutationObserver(() => {
            msnry.layout();
            initAnimationObserver();
        });

        // Наблюдаем за изменениями
        resizeObserver.observe(grid);
        mutationObserver.observe(grid, {
            childList: true,
            subtree: true
        });

        // Очистка при покидании страницы
        window.addEventListener('beforeunload', () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            observer.disconnect();
        });
    };

    // 5. Инициализация всей системы
    imagesLoaded(grid, { background: true }, () => {
        initMasonry();
        initAnimationObserver();
        initObservers();
    });

    // 6. Дополнительные обработчики для пользовательских событий
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            initMasonry();
            msnry.layout();
        }, 500);
    });




// Модальное раскрытие элементов галереи

    let isModalOpen = false;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);

    // Обработчик клика для элементов галереи
    document.querySelectorAll('.feed-item .feed-item-image').forEach(item => {
        item.addEventListener('click', function(e) {
            // Если модалка уже открыта - игнорируем клик
            if(isModalOpen) return;

            const media = this.querySelector('img, video');
            if(!media) return;

            // 1. Блокируем всплытие события
            e.stopPropagation();
            
            // 2. Устанавливаем флаг открытия
            isModalOpen = true;

            // 3. Создаем контент модалки
            const content = document.createElement('div');
            content.className = 'modal-content';
            
            const clone = media.cloneNode(true);
            clone.style.width = '100%';
            clone.style.height = '100%';
            clone.style.objectFit = 'contain';

            content.appendChild(clone);
            overlay.appendChild(content);

            // 4. Блокируем скролл страницы
            // document.body.classList.add('modal-no-scroll');
            
            // 5. Запускаем анимацию с небольшим таймаутом
            setTimeout(() => {
                overlay.classList.add('active');
                content.classList.add('visible');
            }, 50);

            // Обработчик для видео
            if(media.tagName === 'VIDEO') {
                clone.muted = true;
                clone.loop = true;
                clone.play();
            }
        });
    });

    // Функция закрытия модалки
    function closeModal() {
        if(!isModalOpen) return;
        
        const content = overlay.querySelector('.modal-content');
        content.classList.remove('visible');
        
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.innerHTML = '';
            document.body.classList.remove('modal-no-scroll');
            isModalOpen = false;
        }, 300);
    }

    // Обработчики закрытия
    overlay.addEventListener('click', function(e) {
        // if(e.target === overlay) {
            closeModal();
        // }
    });

    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') closeModal();
    });

});

// Plyr (for audio)

document.addEventListener('DOMContentLoaded', () => {
    const player = new Plyr('#player', {
        controls: ['rewind', 'play', 'fast-forward', 'progress', 'current-time', 'mute', 'volume']
    });

    const playerContainer = document.getElementById('playerContainer');
    let currentAudioElement = null;
    let isHidden = false;

    // Инициализация начального положения
    playerContainer.style.bottom = '-100px';

    player.on('play', () => {
        if (isHidden) {
            playerContainer.style.bottom = '0';
            isHidden = false;
        }
        updateActiveState();
    });

    player.on('pause', updateActiveState);
    player.on('ended', () => closePlayer());

    document.querySelectorAll('.audio-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this === currentAudioElement) {
                player.togglePlay();
                if (!player.playing) {
                    playerContainer.style.bottom = '-100px';
                    isHidden = true;
                }
            } else {
                loadNewAudio(this);
                playerContainer.style.bottom = '0';
                isHidden = false;
            }
            updateActiveState();
        });
    });

    function loadNewAudio(element) {
        if (currentAudioElement) {
            player.stop();
        }

        player.source = {
            type: 'audio',
            sources: [{
                src: element.dataset.src,
                type: 'audio/mp3'
            }]
        };

        player.play();
        currentAudioElement = element;
    }

    function updateActiveState() {
        document.querySelectorAll('.audio-item').forEach(item => {
            item.classList.remove('active');
            if (item === currentAudioElement && player.playing) {
                item.classList.add('active');
            }
        });
    }

    window.closePlayer = () => {
        player.pause();
        playerContainer.style.bottom = '-100px';
        currentAudioElement = null;
        isHidden = true;
        updateActiveState();
    }
});

