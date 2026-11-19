import type { TranslationDict } from "./en"

export const es: TranslationDict = {
  common: {
    appName: "Browse Assist",
    appSlogan: "Potencia tu navegación web",
    appDescription:
      "Una colección ligera y modular de herramientas prácticas para mejorar tu productividad y fluidez al navegar.",
    enabled: "Activado",
    disabled: "Desactivado",
    reset: "Restablecer",
    clear: "Limpiar",
    cancel: "Cancelar",
    gotIt: "Entendido",
    viewportScreen: "Área visible",
    unassigned: "Sin asignar",
    launch: "Lanzar",
    all: "Todo",
    none: "Ninguno",
    customizeShortcuts: "Personalizar en los atajos del navegador",
    shortcutNotAssignedTip:
      "Atajo sin asignar. Haz clic para configurar en el navegador",
    customizeShortcutTip: "Haz clic para personalizar el atajo en el navegador",
    backTip: "Atrás (Retroceso o `)",
    toggleFeatureAria: "Alternar {{feature}}",
    resetOrder: "Restablecer orden",
    show: "Mostrar",
    hide: "Ocultar",
    center: "Centro",
    left: "Izquierda",
    right: "Derecha",
    top: "Arriba",
    bottom: "Abajo",
    unstable: "Inestable",
    screenPosition: "Posición en pantalla",
    buttonOpacity: "Opacidad del botón",
    buttonShape: "Forma del botón",
    shapes: {
      circle: "Círculo",
      capsule: "Cápsula",
      rounded: "Redondeado",
      pill: "Píldora"
    },
    modifiers: {
      alt: "Alt",
      shift: "Shift",
      ctrl: "Ctrl",
      altKey: "Tecla Alt",
      shiftKey: "Tecla Shift",
      rightClick: "Clic derecho",
      leftClick: "Clic izquierdo"
    }
  },
  popup: {
    searchPlaceholder: "Buscar utilidades...",
    noResults: "No hay utilidades que coincidan.",
    resetFilters: "Restablecer filtros",
    switchToList: "Cambiar a vista de lista",
    switchToGrid: "Cambiar a cuadrícula compacta",
    pipBannerTitle: "Video en modo PiP",
    pipExit: "Salir de PiP",
    supportTitle: "Apoyar el proyecto",
    categories: {
      all: "Todo",
      interaction: "Ratón",
      navigation: "Desplazamiento",
      media: "Medios",
      tools: "Herramientas"
    },
    tooltips: {
      preferencesAndTheme: "Preferencias y Tema",
      about: "Acerca de Browse Assist",
      supportDonate: "Apoyar y Donar",
      jumpToVideoTab: "Haz clic para ir a esta pestaña de video",
      exitPipWindow: "Salir de la ventana Picture-in-Picture"
    }
  },
  preferences: {
    title: "Preferencias",
    appearance: "Apariencia",
    themeMode: "Tema",
    themeModeDesc: "Claro, oscuro o según el tema del sistema.",
    themeDark: "Oscuro",
    themeLight: "Claro",
    themeSystem: "Sistema",
    viewMode: "Modo de vista",
    viewModeDesc: "Lista detallada o cuadrícula compacta.",
    viewModeList: "Lista",
    viewModeGrid: "Cuadrícula",
    language: "Idioma",
    languageDesc: "Elige el idioma de la interfaz o sigue al navegador.",
    languageAuto: "Auto (Navegador)",
    navigation: "Navegación",
    searchAndFilter: "Búsqueda y filtro de categorías",
    searchAndFilterDesc:
      "Mostrar la barra de búsqueda y categorías arriba en el popup.",
    rememberLastView: "Recordar última vista",
    rememberLastViewDesc:
      "Reabrir el popup en la última página de ajustes visitada.",
    sessionTimeout: "Tiempo de sesión",
    minutesShort: "{{count}} min",
    tickOneMin: "1 min",
    tickTenMinDefault: "10 min (Predeterminado)",
    tickSixtyMin: "60 min",
    customizeMenu: "Personalizar menú",
    customizeMenuDesc:
      "Arrastra elementos para reordenarlos o alterna su visibilidad en el popup.",
    presets: "Preajustes",
    presetReading: "Lectura y Navegación",
    presetReadingDesc: "Desplazar, arrastrar y leer",
    presetDesigner: "Diseño y Desarrollo",
    presetDesignerDesc: "Color, inspeccionar y edición",
    presetEssential: "Solo lo esencial",
    presetEssentialDesc: "Mínimo y enfocado",
    other: "Otros",
    optionsPage: "Página de Opciones",
    optionsPageDesc: "Panel completo de ajustes y guía de atajos"
  },
  donate: {
    buyMeACoffeeDesc: "Apoya el mantenimiento del proyecto con un café",
    githubSponsorsDesc: "Patrocina en GitHub de forma mensual o puntual",
    vietqrDesc: "Transferencia bancaria instantánea vía VietQR (Vietnam)",
    authorDonateLabel: "Página de donación del autor",
    authorDonateDesc: "Donación directa al autor"
  },
  dialogs: {
    firefoxGuide: {
      title: "Guía de atajos en Firefox",
      intro:
        "Los atajos de teclado se pueden personalizar directamente en la configuración de complementos de tu navegador:",
      step1Prefix: "Abre una nueva pestaña en Firefox y ve a",
      copyUrlTip: "Haz clic para copiar la URL",
      step2Prefix: "Haz clic en el",
      step2Target: "Icono de engranaje ⚙",
      step2Suffix: "en la esquina superior derecha del Administrador de complementos.",
      step3Prefix: "Selecciona",
      step3Target: "«Administrar atajos de complementos»",
      step3Suffix: "en el menú desplegable.",
      step4Prefix: "Busca",
      step4Suffix: "y asigna los atajos que prefieras para cada comando."
    }
  },
  options: {
    title: "Configuración de Browse Assist",
    subtitle: "Configura tus herramientas de navegación y atajos",
    openPopup: "Abrir Popup",
    openPopupTip: "Abrir ventana emergente de la extensión",
    preferences: "Preferencias",
    preferencesTip: "Abrir preferencias en el popup",
    about: "Acerca de",
    aboutTip: "Abrir información de la extensión en el popup",
    activeModules: "Módulos activos",
    configureInPopup: "Configurar {{feature}} en el popup",
    shortcutsTitle: "Referencia de atajos de teclado y ratón",
    shortcutsSubtitle:
      "Atajos en tiempo real y gestos interactivos",
    customizeShortcuts: "Personalizar atajos",
    table: {
      action: "Acción",
      shortcut: "Atajo / Disparador",
      description: "Descripción"
    },
    triggers: {
      mouseWheel: "{{modifier}} + Rueda del ratón",
      mouseDrag: "Arrastrar con ratón",
      doubleClickMargin: "Doble clic en el margen",
      rightClickLink: "Clic derecho en enlace"
    },
    shortcuts: {
      pip: {
        name: "Imagen en Imagen (PiP)",
        desc: "Separar el video actual en una ventana flotante PiP"
      },
      allowRightClick: {
        name: "Permitir clic derecho",
        desc: "Desbloquear el menú contextual y copia en la pestaña actual"
      },
      elementToys: {
        name: "Herramientas de elementos",
        desc: "Activar selección para eliminar, editar, ocultar o mover elementos"
      },
      colorPicker: {
        name: "Selector de color",
        desc: "Activar lupa cuentagotas para inspeccionar y copiar colores"
      },
      quickHub: {
        name: "Atajo de Centro rápido",
        desc: "Alternar el menú flotante Centro rápido mediante teclado"
      },
      volume: {
        name: "Control de volumen de video",
        desc: "Desplaza sobre el video para ajustar volumen; clic con modificador para silenciar"
      },
      speed: {
        name: "Control de velocidad de video",
        desc: "Desplaza sobre el video para ajustar velocidad; clic para pantalla completa"
      },
      seek: {
        name: "Avance y fotograma a fotograma",
        desc: "Avanzar o retroceder; paso fotograma a fotograma en pausa"
      },
      boost: {
        name: "Aceleración de video",
        desc: "Mantén la tecla X sobre el video para acelerar a {{speed}}x"
      },
      mouseZoom: {
        name: "Zoom en el cursor",
        desc: "Hacer zoom fluido centrado directamente en el cursor"
      },
      superDrag: {
        name: "Súper Arrastre",
        desc: "Arrastra texto para buscar; arrastra enlaces para abrir en segundo plano"
      },
      quickScroll: {
        name: "Botones de desplazamiento rápido",
        desc: "Doble clic en márgenes o botones flotantes para ir arriba/abajo"
      },
      smoothScroll: {
        name: "Desplazamiento suave",
        desc: "Interpolación física con inercia en contenedores desplazables"
      },
      cleanLink: {
        name: "Copiar enlace limpio",
        desc: "Eliminar parámetros de rastreo (utm_*, fbclid) y copiar limpio o Markdown"
      },
      quickHubZone: {
        name: "Zona de activación Centro rápido",
        desc: "Pasa el cursor por la esquina para abrir las herramientas rápidas"
      }
    },
    storage: {
      title: "Almacenamiento y Datos",
      desc: "Borra permanentemente todos los datos y ajustes guardados por Browse Assist en tu navegador, incluyendo configuraciones, atajos, orden de Centro rápido e historial de colores.",
      clearAll: "Borrar todos los datos...",
      cleared:
        "Todos los datos de la extensión se han borrado y restablecido.",
      footer:
        "Browse Assist • Manifest V3 • Creado con Plasmo, React y Tailwind CSS"
    },
    modal: {
      title: "¿Borrar todos los datos de la extensión?",
      body: "Esto eliminará permanentemente todos los datos almacenados por Browse Assist en tu perfil.",
      listHeader: "Se eliminará lo siguiente:",
      item1: "Estados y subconfiguraciones de todas las funciones",
      item2: "Orden de Centro rápido, acciones fijadas y módulos ocultos",
      item3: "Historial de colores en Selector de color",
      item4: "Preferencias de tema y memoria de navegación",
      warning:
        "⚠️ Esta acción no se puede deshacer. Todos los ajustes volverán a sus valores predeterminados.",
      clearing: "Borrando datos...",
      confirm: "Sí, eliminar todo"
    }
  },
  content: {
    copied: {
      linkText: "Texto del enlace copiado",
      cleanLink: "Enlace limpio copiado",
      markdown: "Markdown copiado",
      cleanPageUrl: "URL limpia copiada",
      pageMarkdown: "Página Markdown copiada",
      quote: "Cita copiada",
      text: "Texto copiado",
      imageLink: "Enlace de imagen copiado",
      linkUrl: "URL del enlace copiada"
    },
    fabMenu: {
      movePosition: "Mover posición",
      openSettings: "Abrir ajustes",
      hideOnTab: "Ocultar en esta pestaña",
      disableFeature: "Desactivar {{feature}}",
      disablePipHoverButton: "Desactivar botón flotante de PiP",
      dragHint: "Mueve el cursor a un borde y haz clic • Esc para cancelar",
      quickDragHint: "Arrastra a un borde y suelta el clic derecho • Esc para cancelar",
      positionSaved: "Posición guardada",
      hiddenOnTab: "{{feature}} oculto en esta pestaña"
    }
  },
  about: {
    title: "Acerca de",
    projectAndLegal: "Proyecto y Legal",
    homePage: "Página de inicio",
    terms: "Términos",
    policy: "Privacidad",
    openSourceLibraries: "Bibliotecas de código abierto",
    declaredPermissions: "Permisos declarados",
    permissionNames: {
      storage: "Almacenamiento",
      contextMenus: "Menús contextuales",
      clipboardWrite: "Portapapeles",
      search: "Búsqueda"
    },
    permissions: {
      storage: "Guardar localmente los ajustes y preferencias de funciones.",
      contextMenus:
        "Ofrecer acciones rápidas en el clic derecho como copiar enlaces limpios.",
      clipboardWrite:
        "Copiar códigos de color y enlaces en formato Markdown.",
      search:
        "Buscar texto seleccionado con el buscador predeterminado en Súper Arrastre."
    }
  },
  features: {
    allowRightClick: {
      title: "Permitir clic derecho",
      description:
        "Restaura el menú contextual, selección y copia en sitios web restringidos.",
      popupDesc:
        "Activa el clic derecho y la copia en la pestaña actual sin afectar otras apps.",
      toastEnabled: "Clic derecho activado",
      toastDisabled: "Clic derecho desactivado",
      currentTab: "Pestaña actual"
    },
    contextMenuActions: {
      title: "Acciones del menú contextual",
      description:
        "Acciones personalizadas de clic derecho para copiar enlaces limpios y formateados.",
      activeCount: "{{count}}/6 Activas",
      copyLinkText: "Copiar texto del enlace",
      cleanLinkCopy: "Copiar enlace limpio",
      markdownLinkCopy: "Copiar enlace como Markdown",
      copyCleanPageUrl: "Copiar URL limpia de la página",
      copyPageMarkdown: "Copiar página como Markdown",
      copySelectionQuote: "Copiar selección como cita",
      settings: {
        sectionTitle: "Elementos del menú contextual",
        sectionDesc:
          "Arrastra para reordenar o alterna su visibilidad en tu menú de clic derecho.",
        badges: {
          textOnly: "Solo texto",
          antiTracking: "Anti-rastreo",
          markdown: "[Texto](URL)",
          page: "Página",
          selection: "Selección"
        },
        descriptions: {
          copyLinkText: "Extrae y copia el texto del enlace sin copiar la URL.",
          cleanLinkCopy:
            "Elimina parámetros de rastreo (utm_*, fbclid, si) antes de copiar.",
          markdownLinkCopy:
            "Copia un enlace en Markdown, ideal para Obsidian, Notion y GitHub.",
          copyCleanPageUrl:
            "Clic derecho en cualquier parte de la página para copiar su URL sin rastreadores.",
          copyPageMarkdown:
            "Copia el título y URL limpia de la página como [Título](URL).",
          copySelectionQuote:
            "Copia el texto resaltado como cita Markdown con enlace a la fuente."
        }
      }
    },
    superDrag: {
      title: "Súper Arrastre",
      description:
        "Arrastra texto seleccionado para buscar o enlaces para abrirlos en nuevas pestañas.",
      settings: {
        dragTargets: "Objetivos de arrastre",
        tabs: {
          text: "Texto",
          link: "Enlaces",
          image: "Imágenes"
        },
        searchText: "Buscar texto resaltado",
        searchTextDesc:
          "Arrastra texto seleccionado en 4 direcciones para buscar, abrir ventanas o copiar.",
        textDisabled: "El arrastre de texto resaltado está desactivado.",
        openLinks: "Abrir enlaces",
        openLinksDesc:
          "Arrastra enlaces para abrir en pestañas, ventanas o copiar URL o texto.",
        linksDisabled: "El arrastre de enlaces está desactivado.",
        dragImages: "Arrastrar imágenes",
        dragImagesDesc:
          "Arrastra imágenes para ver en pestañas, ventanas o copiar URL directa.",
        imagesDisabled: "El arrastre de imágenes está desactivado.",
        displayFeedback: "Pantalla y respuesta",
        dragIndicator: "Indicador visual de arrastre",
        dragIndicatorDesc:
          "Elige el estilo de respuesta visual al arrastrar elementos.",
        indicatorOpacity: "Opacidad del indicador",
        indicatorOpacityDesc:
          "Ajusta la transparencia del indicador de arrastre al arrastrar.",
        indicatorStyles: {
          none: "Desactivado",
          badge: "Insignia flotante",
          radial: "Segmentos circulares"
        },
        directionalGestures: "Gestos direccionales",
        actions: {
          open_bg_tab: "Pestaña en 2.º plano",
          open_active_tab: "Pestaña activa",
          open_window_active: "Nueva ventana",
          open_incognito_active: "Ventana de incógnito",
          none: "Ninguna (No hacer nada)",
          copy_to_clipboard: "Copiar",
          copy_link_text: "Copiar texto del enlace",
          copy_link_url: "Copiar URL del enlace",
          copy_markdown: "Copiar Markdown",
          copy_image_link: "Copiar enlace de imagen",
          search_image: "Buscar imagen"
        }
      },
      logic: {
        types: {
          search: "Búsqueda",
          image: "Imagen",
          link: "Enlace"
        },
        dropOpenBackground: "Soltar: Abrir {{type}} (2.º plano)",
        shortOpenBackground: "{{type}} (2.º plano)",
        dropOpenActive: "Soltar: Abrir {{type}} (Nueva pestaña)",
        shortOpenActive: "{{type}} (Nueva pestaña)",
        dropOpenWindow: "Soltar: Abrir {{type}} (Nueva ventana)",
        shortOpenWindow: "{{type}} (Nueva ventana)",
        dropOpenIncognito: "Soltar: Abrir {{type}} (Incógnito)",
        shortOpenIncognito: "{{type}} (Incógnito)",
        dropCopyLinkText: "Soltar: Copiar texto del enlace",
        shortCopyLinkText: "Copiar texto",
        dropCopyMarkdown: "Soltar: Copiar Markdown",
        shortCopyMarkdown: "Copiar Markdown",
        dropSearchImage: "Soltar: Buscar imagen",
        shortSearchImage: "Buscar imagen",
        dropCopyText: "Soltar: Copiar texto",
        shortCopyText: "Copiar texto",
        dropCopyImageLink: "Soltar: Copiar enlace de imagen",
        shortCopyImageLink: "Copiar enlace de imagen",
        dropCopyLinkUrl: "Soltar: Copiar URL del enlace",
        shortCopyLinkUrl: "Copiar URL",
        noAction: "Sin acción",
        releaseToCancel: "Suelta para cancelar",
        exceededMax: "Distancia máxima superada (Suelta para cancelar)"
      }
    },
    quickScroll: {
      title: "Botones de desplazamiento rápido",
      description:
        "Botones flotantes inteligentes para ir suavemente arriba o abajo.",
      settings: {
        buttonPlacement: "Ubicación de botones",
        buttonPlacementDesc:
          "Arrastra o haz clic en el borde izquierdo o derecho para fijar los botones.",
        controlsStyle: "Controles y estilo",
        buttonSelection: "Selección de botones",
        buttonSelectionDesc: "Mostrar botones arriba y abajo o solo arriba.",
        modes: {
          both: "Arriba y Abajo",
          topOnly: "Solo Arriba"
        },
        buttonShapeDesc: "Elige círculo, cápsula unificada o cuadrado redondeado.",
        buttonOpacityDesc: "Ajusta la transparencia cuando no pasa el cursor.",
        behaviorIntel: "Comportamiento e inteligencia",
        autoDim: "Atenuar al estar inactivo",
        autoDimDesc:
          "Atenúa los botones al pausar el desplazamiento; restaura al pasar el cursor.",
        scrollMemory: "Memoria de posición",
        scrollMemoryDesc:
          "Guarda tu punto de lectura al saltar, permitiendo volver con 1 clic.",
        hideOnNative: "Ocultar si hay botón nativo",
        hideOnNativeDesc:
          "Oculta automáticamente si la web ya incluye un botón fijo para subir."
      },
      logic: {
        scrollToTop: "Ir arriba",
        scrollToBottom: "Ir abajo",
        returnToPrevious: "Volver a la posición anterior"
      }
    },
    smoothScroll: {
      title: "Desplazamiento suave",
      description: "Desplazamiento fluido con física interpolada.",
      settings: {
        profiles: "Perfiles",
        presetBalanced: "Equilibrado",
        presetUltra: "Ultra",
        presetSnappy: "Rápido",
        presetCustom: "Personaliz.",
        fineTuning: "Ajuste fino",
        scrollDistance: "Distancia de desplazamiento",
        glidingDuration: "Duración de deslizamiento",
        ignoreTouchpad: "Ignorar Touchpad",
        ignoreTouchpadDesc:
          "Mantiene la inercia nativa del trackpad omitiendo eventos pequeños.",
        keyboardScroll: "Desplazamiento suave con teclado",
        keyboardScrollDesc:
          "Interpola suavemente con Flechas, RePág/AvPág y Espacio.",
        aggressiveMode: "Intercepción agresiva",
        aggressiveModeDesc:
          "Fuerza el desplazamiento suave en todos los sitios. Desactívalo para proteger apps canvas (Konva, Figma, Maps)."
      }
    },
    mouseZoom: {
      title: "Zoom en el cursor",
      description:
        "Mantén una tecla modificadora y gira la rueda para hacer zoom en el cursor.",
      settings: {
        resetZoomTooltip: "Restablecer zoom al 100% en la pestaña actual",
        triggerModifier: "Tecla modificadora",
        zoomSensitivity: "Sensibilidad del zoom",
        stepIncrement: "Incremento por paso",
        tickFine: "4% (Fino)",
        tickDefault: "10% (Defecto)",
        tickFast: "25% (Rápido)",
        behaviorDisplay: "Comportamiento y pantalla",
        smoothAnimation: "Animación suave",
        smoothAnimationDesc:
          "Interpola las transiciones de zoom para una sensación fluida.",
        invertDirection: "Invertir dirección",
        invertDirectionDesc:
          "Desplazar abajo para acercar, arriba para alejar.",
        showZoomToast: "Mostrar aviso de zoom",
        showZoomToastDesc:
          "Muestra una insignia flotante con el porcentaje arriba a la derecha."
      },
      logic: {
        pageZoom: "Zoom de página"
      }
    },
    pictureInPicture: {
      title: "Imagen en Imagen (PiP)",
      description:
        "Alterna ventana de video flotante mediante atajo personalizable.",
      settings: {
        shortTitle: "Picture-in-Picture",
        globalShortcut: "Atajo global",
        globalShortcutDesc: "Alternar ventana de video flotante",
        displayFeedback: "Pantalla y respuesta",
        extensionBadge: "Insignia en el icono",
        extensionBadgeDesc:
          "Muestra “PiP” en el icono de la extensión cuando hay un video en PiP.",
        actionToast: "Notificación de acción",
        actionToastDesc:
          "Muestra una breve confirmación al entrar o salir de PiP.",
        autoPauseOnExit: "Pausar al salir de PiP",
        autoPauseOnExitDesc:
          "Pausa automáticamente el video al cerrar la ventana PiP.",
        hoverButton: "Botón PiP al pasar el cursor",
        hoverButtonDesc:
          "Muestra un botón PiP flotante dentro de videos en reproducción. Puede ser inestable en algunos reproductores.",
        buttonPosition: "Posición del botón",
        edgeAlignment: "Borde y alineación",
        edgeAlignmentDesc:
          "Arrastra o haz clic en los bordes para fijar el botón PiP en el video.",
        buttonOpacityDesc: "Ajusta la transparencia del botón cuando no tiene foco."
      },
      logic: {
        watchInPip: "Ver en Picture-in-Picture",
        exitedPip: "Saliste de Picture-in-Picture",
        enteredPip: "Entraste en Picture-in-Picture",
        notSupported: "PiP no es compatible en este navegador",
        cannotEnter: "No se pudo iniciar Picture-in-Picture",
        noVideoFound: "No se encontró ningún video en la página"
      },
      background: {
        playing: "Reproduciendo en PiP: {{title}}",
        untitledVideo: "Video"
      }
    },
    videoWheelControl: {
      title: "Control de video con rueda",
      description:
        "Ajusta volumen, velocidad y avance del video suavemente con la rueda del ratón.",
      settings: {
        tabs: {
          volume: "Volumen",
          speed: "Velocidad",
          seek: "Avance",
          extra: "Extra"
        },
        conflictTitle: "Conflicto de tecla modificadora detectado",
        conflictDesc:
          "Dos o más controles activos comparten la misma tecla (prioridad: Avance > Velocidad > Volumen). Asigna teclas únicas.",
        modifierKey: "Tecla modificadora",
        modifierKeyDesc: "Mantén la tecla + gira la rueda sobre el video",
        volumeControl: "Control de volumen",
        volumeStep: "Paso de volumen",
        clickToMute: "Clic para silenciar",
        clickToMuteDesc:
          "Haz clic en el video manteniendo {{key}} para silenciar.",
        invertVolume: "Invertir rueda de volumen",
        invertVolumeDesc: "Invierte la dirección de la rueda al ajustar el volumen.",
        speedControl: "Control de velocidad",
        speedStep: "Paso de velocidad",
        holdXBoost: "Mantener 'X' para acelerar (2.0x)",
        holdXBoostDesc:
          "Mantén la tecla 'X' viendo un video para acelerarlo temporalmente a 2.0x.",
        clickToFullscreen: "Clic para pantalla completa",
        clickToFullscreenDesc:
          "Haz clic en el video manteniendo {{key}} para pantalla completa.",
        invertSpeed: "Invertir rueda de velocidad",
        invertSpeedDesc:
          "Invierte la dirección de la rueda al ajustar la velocidad.",
        seekControl: "Control de avance",
        seekStep: "Paso de avance (Segundos)",
        frameStepper: "Avance fotograma a fotograma",
        frameStepperDesc:
          "Con el video pausado, la rueda avanza fotograma a fotograma (~1/30s).",
        invertSeek: "Invertir rueda de avance",
        invertSeekDesc: "Invierte la dirección de la rueda al avanzar.",
        screenshot: "Captura de video (Shift+Alt+Clic)",
        screenshotDesc:
          "Captura el fotograma actual directamente al portapapeles como PNG.",
        osd: "Visualización en pantalla (OSD)",
        osdDesc:
          "Muestra insignias HUD flotantes para volumen, velocidad, avance y boost.",
        osdOpacity: "Opacidad del OSD",
        osdOpacityDesc: "Ajusta la transparencia de la insignia OSD flotante.",
        noticeTitle: "Aviso de compatibilidad y estado",
        noticeBody1:
          "Esta función interactúa directamente con el elemento HTML5 (<video>).",
        noticeBody2:
          "En plataformas avanzadas, los gestores propios pueden restablecer la velocidad o el silencio al repetir o cambiar resolución."
      },
      logic: {
        muted: "Silenciado",
        fullscreen: "Pantalla completa",
        exitFullscreen: "Salir de pantalla completa",
        frameCopied: "¡Fotograma copiado!",
        captureFailed: "Error al capturar",
        clipboardDenied: "Portapapeles denegado",
        corsProtected: "Protegido por CORS",
        frameStep: "Fotograma {{sign}} ({{time}})",
        boost: "⚡ Aceleración {{rate}}x"
      }
    },
    colorPicker: {
      title: "Selector de color",
      description:
        "Captura cualquier color de la pantalla con copia instantánea en varios formatos.",
      settings: {
        shortcutTitle: "Atajo del cuentagotas",
        shortcutDesc: "Activa rápidamente el selector de color en pantalla",
        recentColors: "Colores recientes",
        clearHistoryTooltip: "Borrar todo el historial de colores",
        clickToCopy: "Clic para copiar {{value}}",
        noRecentColors:
          "Aún no hay colores recientes. Usa el atajo o el botón superior.",
        defaultFormat: "Formato de copia predeterminado",
        clipboardFormat: "Formato en portapapeles",
        clipboardFormatDesc:
          "Estándar de color copiado automáticamente al capturar.",
        behaviorFeedback: "Comportamiento y respuesta",
        autoCopy: "Copiar automáticamente",
        autoCopyDesc:
          "Copia automáticamente el valor del color seleccionado al capturar",
        showPalette: "Mostrar paleta flotante",
        showPaletteDesc:
          "Muestra un modal interactivo HEX / RGB / HSL tras capturar",
        feedbackNotification: "Notificación de confirmación",
        feedbackDisabledDesc: "Desactivado mientras la paleta flotante esté activa",
        feedbackEnabledDesc: "Muestra un aviso al capturar un color"
      },
      logic: {
        copiedColor: "Color copiado",
        notSupported: "EyeDropper no es compatible en esta página o navegador",
        pickedAndCopied: "Color capturado y copiado",
        picked: "Color capturado",
        couldNotOpen: "No se pudo abrir el Selector de color",
        permissionRequired: "Se requiere interacción del usuario o permiso",
        palette: {
          pickedColor: "Color capturado",
          close: "Cerrar",
          copyHex: "Copiar HEX",
          copyRgb: "Copiar RGB",
          copyHsl: "Copiar HSL"
        }
      }
    },
    elementToys: {
      title: "Herramientas de elementos",
      description:
        "Inspecciona, elimina, edita texto o mueve elementos en cualquier página web.",
      settings: {
        launchTooltip: "Lanzar Herramientas de elementos en la página",
        shortcutTitle: "Atajo de activación",
        shortcutDesc: "Abre la barra flotante de Herramientas de elementos en la página",
        inspectorBadge: "Insignia del inspector",
        showDimensions: "Mostrar dimensiones",
        showDimensionsDesc:
          "Mide y muestra ancho × alto (px) en la insignia al pasar el cursor",
        showTags: "Mostrar etiquetas y clases",
        showTagsDesc:
          "Muestra etiqueta HTML y selectores CSS (ej. div.banner#hero)",
        behaviorSection: "Comportamiento de Herramientas de elementos",
        defaultTool: "Herramienta predeterminada",
        defaultToolDesc: "Herramienta seleccionada al activar Herramientas de elementos",
        modes: {
          zap: "Eliminar",
          edit: "Editar",
          move: "Mover",
          hide: "Ocultar"
        },
        continuousSession: "Sesión continua",
        continuousSessionDesc:
          "Mantiene las herramientas activas tras cada acción hasta pulsar Esc o Salir",
        autoUnfreeze: "Desbloquear scroll automático",
        autoUnfreezeDesc:
          "Restaura el desplazamiento (overflow: auto) si el elemento bloqueaba el scroll",
        showToast: "Mostrar aviso flotante",
        showToastDesc:
          "Muestra un banner de confirmación en la página al ejecutar acciones",
        howToUse: "Cómo usar Herramientas de elementos",
        tipShortcutPrefix: "Pulsa",
        tipShortcutSuffix: "para abrir la barra HUD flotante en la página.",
        tipNoShortcutPrefix: "Asigna un atajo arriba o haz clic en",
        tipNoShortcutSuffix: "para abrir la barra HUD flotante en la página.",
        tipZapDesc:
          "Haz clic en cualquier banner, overlay o widget para eliminarlo del DOM.",
        tipEditDesc:
          "Haz clic en cualquier texto para editarlo en tiempo real (teclas aisladas de la página).",
        tipMoveDesc:
          "Arrastra para reposicionar elementos. Cambia entre Flow y Free en la barra y pulsa + / - para ajustar el alcance.",
        tipHideDesc:
          "Haz clic para ocultar elementos sin romper el flujo de la página.",
        tipUndoPrefix: "Pulsa",
        tipUndoMiddle: "para deshacer cualquier acción, o haz clic en",
        tipUndoSettings: "Ajustes",
        tipUndoSuffix: "en la barra para configurar opciones."
      },
      toolbar: {
        title: "Herramientas de elementos",
        zap: "Eliminar",
        zapTip: "Eliminar: Haz clic para borrar el elemento del DOM",
        edit: "Editar",
        editTip: "Editar texto: Haz clic en cualquier texto para editarlo",
        move: "Mover",
        moveActiveTip: "Modo Mover activo (+/- para ajustar el alcance)",
        moveTip: "Mover: Haz clic para activar el modo Mover (Flow / Free)",
        moveLabel: "Mover ({{mode}})",
        flow: "Flow",
        flowTip: "Modo Flow: Reordena en el DOM y desplaza otros elementos",
        free: "Free",
        freeTip: "Modo Free: Transformación libre sin alterar el diseño",
        hide: "Ocultar",
        hideTip: "Ocultar: Haz clic para ocultar sin mover el diseño",
        undo: "Deshacer",
        undoTip: "Deshacer última acción (Ctrl+Z)",
        settings: "Ajustes",
        settingsTip: "Abrir ajustes de Herramientas de elementos",
        exit: "Salir",
        exitTip: "Salir de Herramientas de elementos (Esc)"
      },
      overlay: {
        clickToZap: "Clic para eliminar",
        clickToEdit: "Clic para editar texto",
        dragBody: "Arrastra para {{type}} • Arrastra esquinas para redimensionar",
        clickToHide: "Clic para ocultar"
      },
      logic: {
        zapped: "¡Elemento eliminado!",
        hidden: "Elemento oculto",
        resized: "Elemento redimensionado",
        textUpdated: "Texto actualizado",
        undone: "Acción deshecha",
        undoneDetail: "Revertido: {{action}}",
        closed: "Herramientas de elementos cerrado",
        active: "Herramientas de elementos activo",
        activeDetail: "Elige herramientas arriba • Esc para salir",
        scope: "Alcance: <{{tag}}>",
        scopeDetail: "Nivel +{{depth}} (Pulsa - para reducir)",
        scrollUnfrozen: "Scroll desbloqueado",
        scrollUnfrozenDetail: "overflow: auto restaurado"
      }
    },
    quickHub: {
      title: "Centro rápido",
      description:
        "Centro rápido de utilidades en pantalla con activación en esquinas.",
      settings: {
        floatingPlacement: "Ubicación del botón flotante",
        floatingPlacementDesc:
          "Arrastra o haz clic en el perímetro para anclar el botón de Centro rápido.",
        buttonShapeDesc: "Personaliza la forma del botón flotante.",
        buttonOpacityDesc: "Ajusta la transparencia del botón flotante.",
        customizeMenu: "Personalizar menú",
        customizeMenuDesc:
          "Arrastra elementos para reordenar o alterna su visibilidad en Centro rápido.",
        behaviorProximity: "Comportamiento y proximidad",
        hoverProximity: "Mostrar al acercar el cursor",
        hoverProximityDesc:
          "Muestra el botón flotante solo al acercar el cursor a la esquina. Si se desactiva, permanece al 30% de opacidad.",
        keyboardShortcut: "Atajo de teclado",
        globalHotkey: "Atajo global (Opcional)",
        globalHotkeyDesc: "Alterna el menú Centro rápido en la página activa.",
        disabledInSettings: "{{feature}} está desactivado en los ajustes",
        hiddenInMenu: "{{feature}} está oculto en el menú popup",
        quickScrollTopOnly: "Quick Scroll está configurado como 'Solo Arriba'",
        actions: {
          pipTitle: "Ver video en PiP",
          pipDesc: "Ver video en ventana flotante picture-in-picture",
          colorPickerTitle: "Capturar color de pantalla",
          colorPickerDesc: "Lupa cuentagotas y copia instantánea en hex",
          elementToysTitle: "Herramientas de elementos",
          elementToysDesc: "Inspeccionar, eliminar, editar o mover elementos",
          scrollTopTitle: "Subir al inicio",
          scrollTopDesc: "Saltar suavemente al inicio de la página",
          scrollBottomTitle: "Bajar al final",
          scrollBottomDesc: "Saltar suavemente al final de la página",
          resetZoomTitle: "Restablecer zoom",
          resetZoomDesc: "Restaurar zoom al 100%",
          cleanUrlTitle: "Copiar URL limpia",
          cleanUrlDesc: "Copiar enlace sin parámetros de rastreo (utm_*, fbclid)",
          allowRightClickTitle: "Permitir clic derecho",
          allowRightClickDesc: "Desbloquear clic derecho y copiado en esta pestaña",
          copyMarkdownTitle: "Copiar página en Markdown",
          copyMarkdownDesc: "Copiar enlace limpio en formato [Título](URL)",
          videoScreenshotTitle: "Capturar fotograma de video",
          videoScreenshotDesc: "Copiar captura PNG del video activo al portapapeles"
        }
      },
      logic: {
        noToolsActive:
          "Sin herramientas activas. Actívalas en el popup de Browse Assist.",
        triggerTooltip: "Centro rápido (Herramientas rápidas)",
        triggerAria: "Centro rápido",
        cleanUrlCopied: "URL limpia copiada",
        markdownCopied: "Markdown de la página copiado",
        noVideoFound: "No se encontró ningún video activo en esta página"
      }
    },
    imageHoverPreview: {
      title: "Vista previa de imagen al pasar",
      description:
        "Pasa el cursor sobre imágenes o enlaces de imagen para previsualizarlas en tamaño completo.",
      settings: {
        activation: "Activación",
        triggerModifier: "Modificador de activación",
        triggerModifierDesc:
          "Mantén esta tecla mientras pasas el cursor por una imagen.",
        hoverDelay: "Retardo al pasar el cursor",
        hoverDelayDesc: "Tiempo de espera antes de abrir la vista previa.",
        instant: "Instantáneo",
        displaySize: "Tamaño de visualización",
        maxViewportSize: "Tamaño máximo en pantalla",
        behavior: "Comportamiento",
        previewImageLinks: "Previsualizar enlaces de imagen",
        previewImageLinksDesc:
          "Muestra vista previa al pasar el cursor sobre enlaces a archivos de imagen.",
        showDimensions: "Mostrar dimensiones",
        showDimensionsDesc:
          "Muestra el ancho × alto natural (px) en la esquina de la vista previa."
      }
    }
  }
}
