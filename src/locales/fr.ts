import type { TranslationDict } from "./en"

export const fr: TranslationDict = {
  common: {
    enabled: "Activé",
    disabled: "Désactivé",
    on: "Activé",
    off: "Désactivé",
    reset: "Réinitialiser",
    clear: "Effacer",
    cancel: "Annuler",
    save: "Enregistrer",
    back: "Retour",
    unassigned: "Non assigné",
    notConfigured: "Non configuré",
    configure: "Configurer",
    launch: "Lancer",
    all: "Tout",
    none: "Aucun",
    customizeShortcuts: "Personnaliser dans les raccourcis du navigateur",
    resetOrder: "Réinitialiser l'ordre",
    show: "Afficher",
    hide: "Masquer",
    center: "Centre",
    left: "Gauche",
    right: "Droite",
    top: "Haut",
    bottom: "Bas",
    unstable: "Instable",
    screenPosition: "Position à l'écran",
    buttonOpacity: "Opacité du bouton",
    buttonShape: "Forme du bouton",
    shapes: {
      circle: "Cercle",
      capsule: "Capsule",
      rounded: "Arrondi",
      pill: "Pilule"
    },
    modifiers: {
      alt: "Alt",
      shift: "Shift",
      ctrl: "Ctrl",
      altKey: "Touche Alt",
      shiftKey: "Touche Shift",
      rightClick: "Clic droit",
      leftClick: "Clic gauche"
    }
  },
  popup: {
    searchPlaceholder: "Rechercher des outils...",
    noResults: "Aucun outil ne correspond à votre filtre.",
    resetFilters: "Réinitialiser les filtres",
    switchToList: "Passer en vue liste",
    switchToGrid: "Passer en grille compacte",
    pipBannerTitle: "Vidéo en mode PiP",
    pipExit: "Quitter PiP",
    supportTitle: "Soutenir le projet",
    categories: {
      all: "Tout",
      interaction: "Souris",
      navigation: "Défilem.",
      media: "Médias",
      tools: "Outils"
    }
  },
  preferences: {
    title: "Préférences",
    appearance: "Apparence",
    themeMode: "Thème",
    themeModeDesc: "Clair, sombre ou selon votre système.",
    viewMode: "Mode d'affichage",
    viewModeDesc: "Liste détaillée ou grille compacte.",
    language: "Langue",
    languageDesc: "Choisir la langue de l'interface ou suivre le navigateur.",
    languageAuto: "Auto (Navigateur)",
    navigation: "Navigation",
    searchAndFilter: "Recherche et filtres de catégorie",
    searchAndFilterDesc:
      "Afficher la barre de recherche et les catégories en haut du popup.",
    rememberLastView: "Mémoriser la dernière vue",
    rememberLastViewDesc:
      "Rouvrir le popup sur la dernière page de paramètres consultée.",
    sessionTimeout: "Expiration de session",
    customizeMenu: "Personnaliser le menu",
    customizeMenuDesc:
      "Faites glisser pour réorganiser ou masquez des fonctionnalités dans le popup."
  },
  about: {
    title: "À propos",
    projectAndLegal: "Projet & Mentions légales",
    homePage: "Page d'accueil",
    terms: "Conditions",
    policy: "Confidentialité",
    openSourceLibraries: "Bibliothèques Open Source",
    declaredPermissions: "Permissions déclarées",
    permissions: {
      storage: "Sauvegarder localement vos réglages et préférences.",
      contextMenus:
        "Fournir des actions rapides au clic droit comme la copie de liens propres.",
      clipboardWrite:
        "Copier les codes couleur et liens Markdown dans le presse-papiers.",
      search:
        "Rechercher le texte sélectionné avec le moteur par défaut via Super Drag."
    }
  },
  features: {
    allowRightClick: {
      title: "Allow Right Click",
      description:
        "Réactive le menu contextuel, la sélection et la copie sur les sites restreints.",
      popupDesc:
        "Active le menu contextuel et la copie sur l'onglet actif sans gêner les autres apps.",
      toastEnabled: "Clic droit activé",
      toastDisabled: "Clic droit désactivé",
      currentTab: "Onglet actuel"
    },
    contextMenuActions: {
      title: "Context Menu Actions",
      description:
        "Actions personnalisées au clic droit pour copier des liens propres et formatés.",
      activeCount: "{{count}}/6 Actives",
      copyLinkText: "Copier le texte du lien",
      cleanLinkCopy: "Copier le lien propre",
      markdownLinkCopy: "Copier le lien en Markdown",
      copyCleanPageUrl: "Copier l'URL propre de la page",
      copyPageMarkdown: "Copier la page en Markdown",
      copySelectionQuote: "Copier la sélection en citation",
      settings: {
        sectionTitle: "Éléments du menu clic droit",
        sectionDesc:
          "Glissez pour réorganiser ou basculez la visibilité dans votre menu contextuel.",
        badges: {
          textOnly: "Texte seul",
          antiTracking: "Anti-pistage",
          markdown: "[Texte](URL)",
          page: "Page",
          selection: "Sélection"
        },
        descriptions: {
          copyLinkText: "Extrait et copie le texte du lien sans copier l'URL.",
          cleanLinkCopy:
            "Supprime les paramètres de suivi (utm_*, fbclid, si) avant de copier.",
          markdownLinkCopy:
            "Copie un hyperlien Markdown, idéal pour Obsidian, Notion et GitHub.",
          copyCleanPageUrl:
            "Clic droit n'importe où sur une page pour copier son URL sans traceurs.",
          copyPageMarkdown:
            "Copie le titre et l'URL propre de la page sous forme [Titre](URL).",
          copySelectionQuote:
            "Copie le texte surligné en citation Markdown avec lien source."
        }
      }
    },
    superDrag: {
      title: "Super Drag",
      description:
        "Glissez du texte pour rechercher ou des liens pour les ouvrir dans de nouveaux onglets.",
      settings: {
        dragTargets: "Cibles de glissement",
        tabs: {
          text: "Texte",
          link: "Liens",
          image: "Images"
        },
        searchText: "Rechercher le texte surligné",
        searchTextDesc:
          "Glissez le texte dans 4 directions pour rechercher, ouvrir ou copier.",
        textDisabled: "Le glissement de texte surligné est désactivé.",
        openLinks: "Ouvrir les hyperliens",
        openLinksDesc:
          "Glissez les liens pour ouvrir dans des onglets/fenêtres ou copier l'URL/texte.",
        linksDisabled: "Le glissement d'hyperliens est désactivé.",
        dragImages: "Glisser des images",
        dragImagesDesc:
          "Glissez les images pour les voir dans des onglets/fenêtres ou copier l'URL.",
        imagesDisabled: "Le glissement d'images est désactivé.",
        displayFeedback: "Affichage & Retour",
        dragIndicator: "Indicateur visuel de glissement",
        dragIndicatorDesc:
          "Choisissez le style de retour visuel affiché pendant le glissement.",
        indicatorStyles: {
          none: "Désactivé",
          badge: "Badge flottant",
          radial: "Segments circulaires"
        },
        directionalGestures: "Gestes directionnels",
        actions: {
          open_bg_tab: "Onglet en arrière-plan",
          open_active_tab: "Onglet actif",
          open_window_active: "Nouvelle fenêtre",
          open_incognito_active: "Fenêtre privée",
          none: "Aucune (Ne rien faire)",
          copy_to_clipboard: "Copier",
          copy_link_text: "Copier le texte du lien",
          copy_link_url: "Copier l'URL du lien",
          copy_markdown: "Copier en Markdown",
          copy_image_link: "Copier le lien de l'image",
          search_image: "Rechercher l'image"
        }
      }
    },
    quickScroll: {
      title: "Quick Scroll Buttons",
      description:
        "Boutons flottants intelligents pour remonter ou descendre en douceur.",
      settings: {
        buttonPlacement: "Position des boutons",
        buttonPlacementDesc:
          "Glissez ou cliquez le long du bord gauche ou droit pour ancrer les boutons.",
        controlsStyle: "Contrôles & Style",
        buttonSelection: "Sélection des boutons",
        buttonSelectionDesc: "Afficher haut & bas ou uniquement haut.",
        modes: {
          both: "Haut & Bas",
          topOnly: "Haut uniquement"
        },
        buttonShapeDesc: "Choisissez cercle, capsule unifiée ou carré arrondi.",
        buttonOpacityDesc: "Ajustez la transparence au repos.",
        behaviorIntel: "Comportement & Intelligence",
        autoDim: "Atténuer à l'inactivité",
        autoDimDesc:
          "Atténue les boutons à l'arrêt ; rétablit instantanément au survol.",
        scrollMemory: "Mémoire de position",
        scrollMemoryDesc:
          "Enregistre votre position de lecture pour y revenir en 1 clic.",
        hideOnNative: "Masquer si bouton natif présent",
        hideOnNativeDesc:
          "Masque automatiquement si le site possède déjà un bouton haut de page."
      },
      logic: {
        scrollToTop: "Haut de page",
        scrollToBottom: "Bas de page",
        returnToPrevious: "Revenir à la position précédente"
      }
    },
    smoothScroll: {
      title: "Smooth Scrolling",
      description: "Défilement fluide avec physique interpolée.",
      settings: {
        profiles: "Profils",
        presetBalanced: "Équilibré",
        presetUltra: "Ultra",
        presetSnappy: "Réactif",
        presetCustom: "Personnalisé",
        fineTuning: "Réglage fin",
        scrollDistance: "Distance de défilement",
        glidingDuration: "Durée de glisse",
        ignoreTouchpad: "Ignorer le pavé tactile",
        ignoreTouchpadDesc:
          "Préserve l'inertie native du trackpad en ignorant les petits incréments.",
        keyboardScroll: "Défilement fluide au clavier",
        keyboardScrollDesc:
          "Interpole en douceur les touches Flèches, PageHaut/Bas et Espace.",
        aggressiveMode: "Interception agressive",
        aggressiveModeDesc:
          "Force le défilement fluide partout. Laissez désactivé pour protéger les apps canvas (Figma, Maps)."
      }
    },
    mouseZoom: {
      title: "Mouse Pin-to-Zoom",
      description:
        "Maintenez une touche et faites défiler pour zoomer sur le curseur.",
      settings: {
        resetZoomTooltip: "Réinitialiser le zoom à 100% sur l'onglet actif",
        triggerModifier: "Touche de déclenchement",
        zoomSensitivity: "Sensibilité du zoom",
        stepIncrement: "Incrément par cran",
        tickFine: "4% (Fin)",
        tickDefault: "10% (Défaut)",
        tickFast: "25% (Rapide)",
        behaviorDisplay: "Comportement & Affichage",
        smoothAnimation: "Animation fluide",
        smoothAnimationDesc:
          "Interpole les transitions de zoom pour un rendu fluide.",
        invertDirection: "Inverser la direction",
        invertDirectionDesc:
          "Molette vers le bas pour zoomer, vers le haut pour dézoomer.",
        showZoomToast: "Afficher l'indicateur de zoom",
        showZoomToastDesc:
          "Affiche un badge flottant avec le pourcentage en haut à droite."
      }
    },
    pictureInPicture: {
      title: "Universal Picture-in-Picture",
      description:
        "Basculer la fenêtre vidéo flottante via un raccourci personnalisable.",
      settings: {
        shortTitle: "Picture-in-Picture",
        globalShortcut: "Raccourci global",
        globalShortcutDesc: "Basculer la fenêtre vidéo flottante",
        displayFeedback: "Affichage & Retour",
        extensionBadge: "Badge sur l'icône",
        extensionBadgeDesc:
          "Affiche « PiP » sur l'icône de l'extension lorsqu'une vidéo est en PiP.",
        actionToast: "Notification d'action",
        actionToastDesc:
          "Affiche une brève confirmation à l'entrée ou la sortie du mode PiP.",
        autoPauseOnExit: "Pause auto à la fermeture",
        autoPauseOnExitDesc:
          "Met automatiquement la vidéo en pause lors de la fermeture de la fenêtre PiP.",
        hoverButton: "Bouton PiP au survol",
        hoverButtonDesc:
          "Affiche un déclencheur PiP dans les vidéos en lecture. Peut être instable sur certains lecteurs.",
        buttonPosition: "Position du bouton",
        edgeAlignment: "Bord & Alignement",
        edgeAlignmentDesc:
          "Glissez ou cliquez sur les bords pour ancrer le bouton PiP dans la vidéo.",
        buttonOpacityDesc: "Ajuste la transparence du bouton au repos."
      },
      logic: {
        watchInPip: "Regarder en Picture-in-Picture",
        exitedPip: "Mode Picture-in-Picture quitté",
        enteredPip: "Mode Picture-in-Picture activé",
        notSupported: "PiP non pris en charge par ce navigateur",
        cannotEnter: "Impossible de lancer Picture-in-Picture",
        noVideoFound: "Aucune vidéo trouvée sur la page"
      }
    },
    videoWheelControl: {
      title: "Video Wheel Control",
      description:
        "Ajustez le volume et la vitesse de lecture en douceur avec la molette.",
      settings: {
        tabs: {
          volume: "Volume",
          speed: "Vitesse",
          seek: "Avance",
          extra: "Extra"
        },
        conflictTitle: "Conflit de touche détecté",
        conflictDesc:
          "Au moins deux contrôles actifs partagent la même touche (priorité : Avance > Vitesse > Volume). Assignez des touches uniques.",
        modifierKey: "Touche modificatrice",
        modifierKeyDesc: "Maintenez la touche + molette sur la vidéo",
        volumeControl: "Contrôle du volume",
        volumeStep: "Palier de volume",
        clickToMute: "Clic pour couper le son",
        clickToMuteDesc:
          "Cliquez sur la vidéo en maintenant {{key}} pour couper/rétablir le son.",
        invertVolume: "Inverser la molette volume",
        invertVolumeDesc: "Inverse le sens de la molette pour le volume.",
        speedControl: "Contrôle de vitesse",
        speedStep: "Palier de vitesse",
        holdXBoost: "Maintenir 'X' pour booster (2.0x)",
        holdXBoostDesc:
          "Maintenez la touche 'X' pour passer temporairement la vidéo à 2.0x.",
        clickToFullscreen: "Clic pour plein écran",
        clickToFullscreenDesc:
          "Cliquez sur la vidéo en maintenant {{key}} pour le plein écran.",
        invertSpeed: "Inverser la molette vitesse",
        invertSpeedDesc: "Inverse le sens de la molette pour la vitesse.",
        seekControl: "Contrôle d'avance",
        seekStep: "Palier d'avance (Secondes)",
        frameStepper: "Image par image",
        frameStepperDesc:
          "Vidéo en pause, la molette avance image par image (~1/30s).",
        invertSeek: "Inverser la molette d'avance",
        invertSeekDesc: "Inverse le sens de la molette pour l'avance.",
        screenshot: "Capture vidéo (Shift+Alt+Clic)",
        screenshotDesc:
          "Copie l'image vidéo actuelle en PNG dans le presse-papiers.",
        osd: "Affichage à l'écran (OSD)",
        osdDesc:
          "Affiche des badges HUD flottants pour volume, vitesse, avance et boost.",
        osdOpacity: "Opacité OSD",
        osdOpacityDesc: "Ajuste la transparence du badge OSD flottant.",
        noticeTitle: "Avis de compatibilité et d'état",
        noticeBody1:
          "Cette fonction interagit directement avec l'élément média HTML5 (<video>).",
        noticeBody2:
          "Sur certaines plateformes, les lecteurs peuvent réinitialiser la vitesse ou le son lors d'une boucle ou d'un changement de qualité."
      }
    },
    colorPicker: {
      title: "Color Picker",
      description:
        "Pipette à l'écran avec copie instantanée en plusieurs formats.",
      settings: {
        shortcutTitle: "Raccourci pipette",
        shortcutDesc: "Activer rapidement la pipette de couleur",
        recentColors: "Couleurs récentes",
        clearHistoryTooltip: "Effacer tout l'historique des couleurs",
        clickToCopy: "Cliquer pour copier {{value}}",
        noRecentColors:
          "Aucune couleur capturée. Utilisez le raccourci ou le bouton ci-dessus.",
        defaultFormat: "Format de copie par défaut",
        clipboardFormat: "Format du presse-papiers",
        clipboardFormatDesc:
          "Format de couleur copié automatiquement lors de la capture.",
        behaviorFeedback: "Comportement & Retour",
        autoCopy: "Copie automatique",
        autoCopyDesc:
          "Copie automatiquement la couleur sélectionnée dès la capture",
        showPalette: "Afficher la palette flottante",
        showPaletteDesc:
          "Affiche une fenêtre interactive HEX / RGB / HSL après la capture",
        feedbackNotification: "Notification de retour",
        feedbackDisabledDesc: "Désactivé lorsque la palette flottante est active",
        feedbackEnabledDesc: "Affiche une confirmation lors de la capture"
      },
      logic: {
        copiedColor: "Couleur copiée",
        notSupported: "EyeDropper non pris en charge sur cette page/navigateur",
        pickedAndCopied: "Couleur capturée & copiée",
        picked: "Couleur capturée",
        couldNotOpen: "Impossible d'ouvrir Color Picker",
        permissionRequired: "Interaction utilisateur requise ou non autorisée"
      }
    },
    elementToys: {
      title: "Element Toys",
      description:
        "Inspectez, supprimez, modifiez ou déplacez des éléments sur toute page web.",
      settings: {
        launchTooltip: "Lancer Element Toys sur la page",
        shortcutTitle: "Raccourci d'activation",
        shortcutDesc: "Ouvre la barre flottante Element Toys sur la page active",
        inspectorBadge: "Badge d'inspecteur",
        showDimensions: "Afficher les dimensions",
        showDimensionsDesc:
          "Mesure et affiche largeur × hauteur (px) sur le badge au survol",
        showTags: "Afficher balises et classes",
        showTagsDesc:
          "Affiche le nom de balise HTML et les classes CSS (ex. div.banner#hero)",
        behaviorSection: "Comportement Element Toys",
        defaultTool: "Outil par défaut",
        defaultToolDesc: "Outil sélectionné au lancement d'Element Toys",
        modes: {
          zap: "Supprimer",
          edit: "Éditer",
          move: "Déplacer",
          hide: "Masquer"
        },
        continuousSession: "Session continue",
        continuousSessionDesc:
          "Garde les outils actifs après chaque action jusqu'à Échap ou Quitter",
        autoUnfreeze: "Débloquer le défilement",
        autoUnfreezeDesc:
          "Restaure le défilement (overflow: auto) si un overlay le bloquait",
        showToast: "Afficher notification flottante",
        showToastDesc:
          "Affiche une bannière de confirmation lors de l'exécution d'actions",
        howToUse: "Comment utiliser Element Toys",
        tipShortcutPrefix: "Appuyez sur",
        tipShortcutSuffix: "pour ouvrir la barre HUD flottante sur la page.",
        tipNoShortcutPrefix: "Assignez un raccourci ci-dessus ou cliquez sur",
        tipNoShortcutSuffix: "pour ouvrir la barre HUD flottante sur la page.",
        tipZapDesc:
          "Cliquez sur n'importe quelle bannière ou fenêtre pour la supprimer du DOM.",
        tipEditDesc:
          "Cliquez sur un texte pour l'éditer en direct (saisie isolée de la page).",
        tipMoveDesc:
          "Glissez pour repositionner les éléments. Basculez Flow/Free sur la barre et appuyez sur + / - pour ajuster la portée.",
        tipHideDesc:
          "Cliquez pour masquer des éléments sans casser la mise en page.",
        tipUndoPrefix: "Appuyez sur",
        tipUndoMiddle: "pour annuler, ou cliquez sur",
        tipUndoSettings: "Paramètres",
        tipUndoSuffix: "sur la barre pour configurer les options."
      }
    },
    quickHub: {
      title: "Quick Hub",
      description:
        "Menu d'accès rapide à l'écran avec activation au survol des coins.",
      settings: {
        floatingPlacement: "Position du bouton flottant",
        floatingPlacementDesc:
          "Glissez ou cliquez sur le contour pour ancrer le déclencheur Quick Hub.",
        buttonShapeDesc: "Personnalisez la forme du bouton flottant.",
        buttonOpacityDesc: "Ajustez la transparence du bouton flottant.",
        customizeMenu: "Personnaliser le menu",
        customizeMenuDesc:
          "Glissez pour réorganiser ou masquez les outils inutilisés dans Quick Hub.",
        behaviorProximity: "Comportement & Proximité",
        hoverProximity: "Révéler à l'approche du curseur",
        hoverProximityDesc:
          "Affiche le bouton uniquement près du coin. Sinon, reste visible à 30% d'opacité.",
        keyboardShortcut: "Raccourci clavier",
        globalHotkey: "Raccourci global (Optionnel)",
        globalHotkeyDesc: "Affiche/masque le menu Quick Hub sur la page active.",
        disabledInSettings: "{{feature}} est désactivé dans les paramètres",
        hiddenInMenu: "{{feature}} est masqué dans le menu popup",
        quickScrollTopOnly: "Quick Scroll est réglé sur 'Haut uniquement'",
        actions: {
          pipTitle: "Voir la vidéo en PiP",
          pipDesc: "Ouvrir la vidéo dans une fenêtre flottante PiP",
          colorPickerTitle: "Capturer une couleur",
          colorPickerDesc: "Loupe pipette et copie hexadécimale instantanée",
          elementToysTitle: "Element Toys",
          elementToysDesc: "Inspecter, supprimer, éditer ou déplacer des éléments",
          scrollTopTitle: "Haut de page",
          scrollTopDesc: "Remonter en douceur en haut de la page",
          scrollBottomTitle: "Bas de page",
          scrollBottomDesc: "Descendre en douceur en bas de la page",
          resetZoomTitle: "Réinitialiser le zoom",
          resetZoomDesc: "Rétablir le zoom de la page à 100%",
          cleanUrlTitle: "Copier l'URL propre",
          cleanUrlDesc: "Copier le lien sans traceurs (utm_*, fbclid)"
        }
      },
      logic: {
        noToolsActive:
          "Aucun outil actif. Activez des fonctions dans le popup Browse Assist.",
        triggerTooltip: "Quick Hub (Outils rapides)",
        cleanUrlCopied: "URL propre copiée"
      }
    },
    imageHoverPreview: {
      title: "Image Hover Preview",
      description:
        "Survolez des images ou liens d'images pour les prévisualiser en grand format.",
      settings: {
        activation: "Activation",
        triggerModifier: "Modificateur de déclenchement",
        triggerModifierDesc:
          "Maintenez cette touche en survolant une image pour la prévisualiser.",
        hoverDelay: "Délai de survol",
        hoverDelayDesc: "Temps d'attente avant d'ouvrir l'aperçu.",
        instant: "Instantané",
        displaySize: "Taille d'affichage",
        maxViewportSize: "Taille maximale à l'écran",
        behavior: "Comportement",
        previewImageLinks: "Prévisualiser les liens d'images",
        previewImageLinksDesc:
          "Affiche l'aperçu au survol des liens pointant vers des fichiers image.",
        showDimensions: "Afficher les dimensions",
        showDimensionsDesc:
          "Affiche largeur × hauteur d'origine (px) dans un coin de l'aperçu."
      }
    }
  }
}
