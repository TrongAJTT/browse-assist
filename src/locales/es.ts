import type { TranslationDict } from "./en"

export const es: TranslationDict = {
  common: {
    enabled: "Activado",
    disabled: "Desactivado",
    on: "Activado",
    off: "Desactivado",
    reset: "Restablecer",
    clear: "Limpiar",
    cancel: "Cancelar",
    save: "Guardar",
    back: "Atrás",
    unassigned: "Sin asignar",
    notConfigured: "No configurado",
    configure: "Configurar",
    launch: "Lanzar",
    all: "Todo",
    none: "Ninguno",
    customizeShortcuts: "Personalizar en los atajos del navegador",
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
      navigation: "Desplaz.",
      media: "Medios",
      tools: "Herram."
    }
  },
  preferences: {
    title: "Preferencias",
    appearance: "Apariencia",
    themeMode: "Tema",
    themeModeDesc: "Claro, oscuro o según el tema del sistema.",
    viewMode: "Modo de vista",
    viewModeDesc: "Lista detallada o cuadrícula compacta.",
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
    customizeMenu: "Personalizar menú",
    customizeMenuDesc:
      "Arrastra elementos para reordenarlos o alterna su visibilidad en el popup."
  },
  about: {
    title: "Acerca de",
    projectAndLegal: "Proyecto y Legal",
    homePage: "Página de inicio",
    terms: "Términos",
    policy: "Privacidad",
    openSourceLibraries: "Bibliotecas de código abierto",
    declaredPermissions: "Permisos declarados",
    permissions: {
      storage: "Guardar localmente los ajustes y preferencias de funciones.",
      contextMenus:
        "Ofrecer acciones rápidas en el clic derecho como copiar enlaces limpios.",
      clipboardWrite:
        "Copiar códigos de color y enlaces en formato Markdown.",
      search:
        "Buscar texto seleccionado con el buscador predeterminado en Super Drag."
    }
  },
  features: {
    allowRightClick: {
      title: "Allow Right Click",
      description:
        "Restaura el menú contextual, selección y copia en sitios web restringidos.",
      popupDesc:
        "Activa el clic derecho y la copia en la pestaña actual sin afectar otras apps.",
      toastEnabled: "Clic derecho activado",
      toastDisabled: "Clic derecho desactivado",
      currentTab: "Pestaña actual"
    },
    contextMenuActions: {
      title: "Context Menu Actions",
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
            "Copia un hipervínculo en Markdown, ideal para Obsidian, Notion y GitHub.",
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
      title: "Super Drag",
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
        openLinks: "Abrir hipervínculos",
        openLinksDesc:
          "Arrastra enlaces para abrir en pestañas, ventanas o copiar URL o texto.",
        linksDisabled: "El arrastre de hipervínculos está desactivado.",
        dragImages: "Arrastrar imágenes",
        dragImagesDesc:
          "Arrastra imágenes para ver en pestañas, ventanas o copiar URL directa.",
        imagesDisabled: "El arrastre de imágenes está desactivado.",
        displayFeedback: "Pantalla y respuesta",
        dragIndicator: "Indicador visual de arrastre",
        dragIndicatorDesc:
          "Elige el estilo de respuesta visual al arrastrar elementos.",
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
      }
    },
    quickScroll: {
      title: "Quick Scroll Buttons",
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
      title: "Smooth Scrolling",
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
          "Fuerza el desplazamiento suave en todos los sitios. Desactívalo para proteger apps canvas (Figma, Maps)."
      }
    },
    mouseZoom: {
      title: "Mouse Pin-to-Zoom",
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
      }
    },
    pictureInPicture: {
      title: "Universal Picture-in-Picture",
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
      }
    },
    videoWheelControl: {
      title: "Video Wheel Control",
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
      }
    },
    colorPicker: {
      title: "Color Picker",
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
        couldNotOpen: "No se pudo abrir Color Picker",
        permissionRequired: "Se requiere interacción del usuario o permiso"
      }
    },
    elementToys: {
      title: "Element Toys",
      description:
        "Inspecciona, elimina, edita texto o mueve elementos en cualquier página web.",
      settings: {
        launchTooltip: "Lanzar Element Toys en la página",
        shortcutTitle: "Atajo de activación",
        shortcutDesc: "Abre la barra flotante de Element Toys en la página",
        inspectorBadge: "Insignia del inspector",
        showDimensions: "Mostrar dimensiones",
        showDimensionsDesc:
          "Mide y muestra ancho × alto (px) en la insignia al pasar el cursor",
        showTags: "Mostrar etiquetas y clases",
        showTagsDesc:
          "Muestra etiqueta HTML y selectores CSS (ej. div.banner#hero)",
        behaviorSection: "Comportamiento de Element Toys",
        defaultTool: "Herramienta predeterminada",
        defaultToolDesc: "Herramienta seleccionada al activar Element Toys",
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
        howToUse: "Cómo usar Element Toys",
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
      }
    },
    quickHub: {
      title: "Quick Hub",
      description:
        "Centro rápido de utilidades en pantalla con activación en esquinas.",
      settings: {
        floatingPlacement: "Ubicación del botón flotante",
        floatingPlacementDesc:
          "Arrastra o haz clic en el perímetro para anclar el botón de Quick Hub.",
        buttonShapeDesc: "Personaliza la forma del botón flotante.",
        buttonOpacityDesc: "Ajusta la transparencia del botón flotante.",
        customizeMenu: "Personalizar menú",
        customizeMenuDesc:
          "Arrastra elementos para reordenar o alterna su visibilidad en Quick Hub.",
        behaviorProximity: "Comportamiento y proximidad",
        hoverProximity: "Mostrar al acercar el cursor",
        hoverProximityDesc:
          "Muestra el botón flotante solo al acercar el cursor a la esquina. Si se desactiva, permanece al 30% de opacidad.",
        keyboardShortcut: "Atajo de teclado",
        globalHotkey: "Atajo global (Opcional)",
        globalHotkeyDesc: "Alterna el menú Quick Hub en la página activa.",
        disabledInSettings: "{{feature}} está desactivado en los ajustes",
        hiddenInMenu: "{{feature}} está oculto en el menú popup",
        quickScrollTopOnly: "Quick Scroll está configurado como 'Solo Arriba'",
        actions: {
          pipTitle: "Ver video en PiP",
          pipDesc: "Ver video en ventana flotante picture-in-picture",
          colorPickerTitle: "Capturar color de pantalla",
          colorPickerDesc: "Lupa cuentagotas y copia instantánea en hex",
          elementToysTitle: "Element Toys",
          elementToysDesc: "Inspeccionar, eliminar, editar o mover elementos",
          scrollTopTitle: "Subir al inicio",
          scrollTopDesc: "Saltar suavemente al inicio de la página",
          scrollBottomTitle: "Bajar al final",
          scrollBottomDesc: "Saltar suavemente al final de la página",
          resetZoomTitle: "Restablecer zoom",
          resetZoomDesc: "Restaurar zoom al 100%",
          cleanUrlTitle: "Copiar URL limpia",
          cleanUrlDesc: "Copiar enlace sin parámetros de rastreo (utm_*, fbclid)"
        }
      },
      logic: {
        noToolsActive:
          "Sin herramientas activas. Actívalas en el popup de Browse Assist.",
        triggerTooltip: "Quick Hub (Herramientas rápidas)",
        cleanUrlCopied: "URL limpia copiada"
      }
    },
    imageHoverPreview: {
      title: "Image Hover Preview",
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
