/**
 * INDEX.JS
 * Incluye: Sistema de pestañas, menú móvil, escalado de secciones,
 * galería de imágenes y efectos de interacción
 */

// Esperar a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {

    /**
     * SISTEMA DE PESTAÑAS (SECCIÓN ABOUT)
     * Permite cambiar entre las pestañas "About" y "Features"
     * con navegación mediante botones y flechas
     */

    // Selección de elementos del DOM para el sistema de pestañas
    const tabButtons = document.querySelectorAll('.about__tabs .about__tab-button');
    const tabContents = document.querySelectorAll('.about__content .about__tab-content');
    const arrowLeft = document.querySelector('.about__arrow--left');
    const arrowRight = document.querySelector('.about__arrow--right');

    // Actualiza el estado de las flechas de navegación según la pestaña actual
    const updateArrowState = currentIndex => {
        if (!arrowLeft || !arrowRight) return;
        const noTabs = tabButtons.length <= 1;
        const isFirst = currentIndex === 0;
        const isLast = currentIndex === tabButtons.length - 1;
        // Desactiva la flecha izquierda si estamos en la primera pestaña
        arrowLeft.classList.toggle('inactive', noTabs || isFirst);
        // Desactiva la flecha derecha si estamos en la última pestaña
        arrowRight.classList.toggle('inactive', noTabs || isLast);
    }

    // Obtiene el índice de la pestaña actualmente activa
    const getCurrentTabIndex = () => Array.from(tabButtons).findIndex(btn => btn.classList.contains('about__tab-button--active'));

    // Cambia a la pestaña seleccionada y actualiza la interfaz
    const switchTab = (button, index) => {
        if (!button) return;
        const targetTab = button.getAttribute('data-tab');

        // Elimina las clases activas de todos los elementos
        tabButtons.forEach(btn => btn.classList.remove('about__tab-button--active'));
        tabContents.forEach(content => content.classList.remove('about__tab-content--active'));

        // Activa los elementos correspondientes a la pestaña seleccionada
        button.classList.add('about__tab-button--active');
        document.getElementById(`${targetTab}-content`)?.classList.add('about__tab-content--active');


        // Actualiza el estado de las flechas
        updateArrowState(index);
    }

    // Inicialización del sistema de pestañas si existen los elementos necesarios
    if (tabButtons.length > 0 && tabContents.length > 0) {
        // Establece el estado inicial de las flechas
        updateArrowState(0);

        // Añade event listeners a los botones de las pestañas
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => switchTab(button, index));
        });
    }

    // Configuración de la navegación mediante flechas
    if (arrowLeft && arrowRight && tabButtons.length > 0) {
        // Event listener para la flecha izquierda (pestaña anterior)
        arrowLeft.addEventListener('click', () => {
            // No hace nada si la flecha está inactiva
            if (arrowLeft.classList.contains('inactive')) return;

            const currentIndex = getCurrentTabIndex();
            // Cambia a la pestaña anterior si no estamos en la primera
            if (currentIndex > 0) {
                switchTab(tabButtons[currentIndex - 1], currentIndex - 1);
            }
        });

        // Event listener para la flecha derecha (pestaña siguiente)
        arrowRight.addEventListener('click', () => {
            // No hace nada si la flecha está inactiva
            if (arrowRight.classList.contains('inactive')) return;

            const currentIndex = getCurrentTabIndex();
            // Cambia a la pestaña siguiente si no estamos en la última
            if (currentIndex !== -1 && currentIndex < tabButtons.length - 1) {
                switchTab(tabButtons[currentIndex + 1], currentIndex + 1);
            }
        });
    }

    /**
     * MENÚ MÓVIL
     * Controla la apertura y cierre del menú de navegación en dispositivos móviles
     * con soporte para accesibilidad y cierre mediante Escape
     */
    const mobileMenuButton = document.querySelector('.header__menu-button');
    const mainNav = document.querySelector('.nav');

    if (mobileMenuButton && mainNav) {
        // Función para cerrar el menú móvil
        function closeMobileMenu() {
            mainNav.classList.remove('nav--active');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }

        // Abre/cierra el menú al hacer clic en el botón
        mobileMenuButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que el clic se propague al documento
            const isActive = mainNav.classList.toggle('nav--active');
            // Actualiza el atributo aria-expanded para accesibilidad
            mobileMenuButton.setAttribute('aria-expanded', isActive);
        });

        // Cierra el menú al hacer clic en cualquier enlace de navegación
        mainNav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Cierra el menú al hacer clic fuera de él
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('nav--active') &&
                !mainNav.contains(e.target) &&
                !mobileMenuButton.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Cierra el menú al presionar la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('nav--active')) {
                closeMobileMenu();
                mobileMenuButton.focus(); // Devuelve el foco al botón para mejor accesibilidad
            }
        });
    }

    /**
     * ESCALADO ADAPTATIVO DE LA SECCIÓN ATMOSPHERE
     * Ajusta el tamaño del contenido de la sección Atmosphere
     * según el ancho de la ventana para mantener proporciones adecuadas
     */
    const atmosphereSection = document.querySelector('.atmosphere');
    const atmosphereContent = document.querySelector('.atmosphere__content');
    const atmosphereBgImage = document.querySelector('.atmosphere__bg-image');

    function updateAtmosphereScale() {
        if (atmosphereSection && atmosphereContent && atmosphereBgImage) {
            let scale;
            if (window.innerWidth >= 1200) {
                scale = Math.max(1, window.innerWidth / 1800);
            } else if (window.innerWidth >= 740) {
                scale = 0.8;
            } else if (window.innerWidth >= 650) {
                scale = 0.88;
            } else if (window.innerWidth >= 580) {
                scale = 0.9;
            } else if (window.innerWidth >= 480) {
                scale = 0.85;
            } else if (window.innerWidth >= 426) {
                scale = 0.85;
            } else {
                scale = 0.8;
            }
            atmosphereContent.style.transform = `translate(-50%, -55%) scale(${scale})`;
        }
    }

    updateAtmosphereScale();

    /**
     * GALERÍA DE IMÁGENES (SECCIÓN MEDIA)
     * Permite ampliar las imágenes de la galería en un modal
     * con navegación accesible y preservación de la posición de scroll
     */

    // Elementos del DOM para la galería de imágenes
    const mediaItems = document.querySelectorAll('.media__item');
    const ventanaAmpliacion = document.getElementById('ampliacion-imagen');
    const contenedorImagen = document.getElementById('contenedor-imagen-ampliada');
    const botonCerrar = document.querySelector('.media__close-button');

    // Rutas de las imágenes que se mostrarán en la galería
    const mediaData = [
        'ui/media/fleshfest_social_final.png',
        'ui/media/jasonmurray.png',
        'ui/media/ruby_dev.png',
        'ui/media/ruby_metro.png',
        'ui/media/murray_dev.png',
        'ui/media/ruby_poses.png'
    ];

    // Añade event listeners a cada miniatura de la galería
    mediaItems.forEach((item, index) => {
        if(mediaData[index]) {
             item.addEventListener('click', () => abrirAmpliacion(index));
        } else {
            console.warn(`No media data found for media item at index ${index}`);
        }
    });

    // Event listener para cerrar la imagen ampliada con el botón de cierre
    if (botonCerrar) {
        botonCerrar.addEventListener('click', cerrarAmpliacion);
    }

    // Event listener para cerrar la imagen ampliada al hacer clic fuera de ella
    window.addEventListener('click', event => {
        if (event.target === ventanaAmpliacion) cerrarAmpliacion();
    });

    // Event listener para cerrar la imagen ampliada con la tecla Escape
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && ventanaAmpliacion && ventanaAmpliacion.style.display === 'block') {
            cerrarAmpliacion();
        }
    });

    // Variable para guardar la posición de scroll antes de abrir la imagen
    let scrollPosition = 0;

    /**
     * Abre la imagen ampliada en un modal
     * @param {number} index - Índice de la imagen en el array mediaData
     */
    function abrirAmpliacion(index) {
        if (!ventanaAmpliacion || !contenedorImagen || !mediaData[index]) return;

        // Guarda la posición actual de scroll
        scrollPosition = window.pageYOffset;

        // Crea la imagen ampliada
        contenedorImagen.innerHTML = `<img src="${mediaData[index]}" alt="Captura ampliada de Fleshfest">`;

        // Fija el body para evitar scroll mientras se muestra la imagen
        document.body.style.cssText = `
            position: fixed;
            top: -${scrollPosition}px;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        `;

        // Muestra el modal
        ventanaAmpliacion.style.display = 'block';
    }

    /**
     * Cierra la imagen ampliada y restaura el scroll
     */
    function cerrarAmpliacion() {
        if (!ventanaAmpliacion) return;

        // Oculta el modal
        ventanaAmpliacion.style.display = 'none';

        // Limpia el contenedor de la imagen
        if (contenedorImagen) contenedorImagen.innerHTML = '';

        // Restaura el estado normal del body
        document.body.style = '';

        // Restaura la posición de scroll
        window.scrollTo(0, scrollPosition);
    }

    /**
     * AJUSTE RESPONSIVE DEL BOTÓN PRESS KIT
     * Muestra u oculta las versiones desktop y móvil del botón Press Kit
     * según el ancho de la ventana
     */
    const desktopPressKit = document.querySelector('.media__press-kit--desktop');
    const mobilePressKit = document.querySelector('.media__press-kit--mobile');

    // Función para ajustar la visibilidad del botón Press Kit según el tamaño de pantalla
    function adjustPressKitVisibility() {
        const isMobile = window.innerWidth <= 576;
        if (desktopPressKit) desktopPressKit.style.display = isMobile ? 'none' : 'inline-block';
        if (mobilePressKit) mobilePressKit.style.display = isMobile ? 'block' : 'none';
    }



    // Inicialización de funciones responsive
    adjustPressKitVisibility();

    // Event listener para el evento resize de la ventana
    window.addEventListener('resize', () => {
        adjustPressKitVisibility();
        updateAtmosphereScale();
    });

});