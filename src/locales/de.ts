import type { TranslationDict } from "./en"

export const de: TranslationDict = {
  common: {
    appName: "Browse Assist",
    appSlogan: "Turbo für dein Webbrowsing",
    appDescription:
      "Eine leichte, modulare Sammlung praktischer Werkzeuge für mehr Produktivität und angenehmeres Surfen.",
    enabled: "Aktiviert",
    disabled: "Deaktiviert",
    reset: "Zurücksetzen",
    clear: "Löschen",
    cancel: "Abbrechen",
    gotIt: "Verstanden",
    viewportScreen: "Anzeigebereich",
    unassigned: "Nicht zugewiesen",
    launch: "Starten",
    all: "Alle",
    none: "Keine",
    customizeShortcuts: "In den Browser-Tastenkürzeln anpassen",
    shortcutNotAssignedTip:
      "Tastenkürzel nicht zugewiesen. Klicken zum Konfigurieren",
    customizeShortcutTip: "Klicken, um das Tastenkürzel im Browser anzupassen",
    backTip: "Zurück (Rücktaste oder `)",
    toggleFeatureAria: "{{feature}} umschalten",
    resetOrder: "Reihenfolge zurücksetzen",
    show: "Einblenden",
    hide: "Ausblenden",
    center: "Mitte",
    left: "Links",
    right: "Rechts",
    top: "Oben",
    bottom: "Unten",
    unstable: "Instabil",
    screenPosition: "Bildschirmposition",
    buttonOpacity: "Schaltflächen-Deckkraft",
    buttonShape: "Schaltflächen-Form",
    shapes: {
      circle: "Kreis",
      capsule: "Kapsel",
      rounded: "Abgerundet",
      pill: "Pille"
    },
    modifiers: {
      alt: "Alt",
      shift: "Shift",
      ctrl: "Ctrl",
      altKey: "Alt-Taste",
      shiftKey: "Shift-Taste",
      rightClick: "Rechtsklick",
      leftClick: "Linksklick"
    }
  },
  popup: {
    searchPlaceholder: "Werkzeuge suchen...",
    noResults: "Keine passenden Werkzeuge gefunden.",
    resetFilters: "Filter zurücksetzen",
    switchToList: "Zur Listenansicht wechseln",
    switchToGrid: "Zum Kachelraster wechseln",
    pipBannerTitle: "Video im PiP-Modus",
    pipExit: "PiP beenden",
    supportTitle: "Projekt unterstützen",
    categories: {
      all: "Alle",
      interaction: "Maus",
      navigation: "Scrollen",
      media: "Medien",
      tools: "Werkzeuge"
    },
    tooltips: {
      preferencesAndTheme: "Einstellungen & Design",
      about: "Über Browse Assist",
      supportDonate: "Projekt unterstützen",
      jumpToVideoTab: "Klicken, um zu diesem Video-Tab zu wechseln",
      exitPipWindow: "Bild-im-Bild-Fenster schließen"
    }
  },
  preferences: {
    title: "Einstellungen",
    appearance: "Erscheinungsbild",
    themeMode: "Farbschema",
    themeModeDesc: "Hell, dunkel oder Systemdesign folgen.",
    themeDark: "Dunkel",
    themeLight: "Hell",
    themeSystem: "System",
    viewMode: "Ansichtsmodus",
    viewModeDesc: "Detaillierte Liste oder kompaktes Kachelraster.",
    viewModeList: "Liste",
    viewModeGrid: "Raster",
    language: "Sprache",
    languageDesc: "Oberflächensprache wählen oder Browser folgen.",
    languageAuto: "Auto (Browser)",
    navigation: "Navigation",
    searchAndFilter: "Suche & Kategoriefilter",
    searchAndFilterDesc:
      "Suchleiste und Kategorie-Tabs oben im Popup anzeigen.",
    rememberLastView: "Letzte Ansicht merken",
    rememberLastViewDesc:
      "Popup auf der zuletzt geöffneten Einstellungsseite wieder öffnen.",
    sessionTimeout: "Sitzungs-Timeout",
    minutesShort: "{{count}} Min.",
    tickOneMin: "1 Min.",
    tickTenMinDefault: "10 Min. (Standard)",
    tickSixtyMin: "60 Min.",
    customizeMenu: "Menü anpassen",
    customizeMenuDesc:
      "Elemente zum Sortieren ziehen oder Sichtbarkeit im Popup umschalten.",
    presets: "Vorlagen",
    presetReading: "Lesen & Navigation",
    presetReadingDesc: "Scrollen, ziehen & lesen",
    presetDesigner: "Design & Entwicklung",
    presetDesignerDesc: "Farbe, Inspektor & Tools",
    presetEssential: "Nur das Wichtigste",
    presetEssentialDesc: "Minimal & fokussiert",
    other: "Sonstiges",
    optionsPage: "Erweiterungs-Optionsseite",
    optionsPageDesc: "Vollständige Einstellungen & Tastenkürzel-Übersicht"
  },
  donate: {
    buyMeACoffeeDesc: "Projektpflege mit einem Kaffee unterstützen",
    githubSponsorsDesc: "Monatlich oder einmalig über GitHub unterstützen",
    vietqrDesc: "Sofortüberweisung über VietQR (Vietnam)",
    authorDonateLabel: "Spendenseite des Autors",
    authorDonateDesc: "Direkte Spende an den Autor"
  },
  dialogs: {
    firefoxGuide: {
      title: "Firefox-Tastenkürzel einrichten",
      intro:
        "Tastenkürzel können direkt in den Erweiterungseinstellungen Ihres Browsers angepasst werden:",
      step1Prefix: "Einen neuen Tab in Firefox öffnen und folgende Adresse aufrufen:",
      copyUrlTip: "Klicken, um URL zu kopieren",
      step2Prefix: "Klicken Sie auf das",
      step2Target: "Zahnrad-Symbol ⚙",
      step2Suffix: "oben rechts auf der Add-ons-Verwaltungsseite.",
      step3Prefix: "Wählen Sie",
      step3Target: "„Tastenkombinationen für Erweiterungen verwalten“",
      step3Suffix: "aus dem Dropdown-Menü.",
      step4Prefix: "Suchen Sie",
      step4Suffix:
        "und weisen Sie jedem Befehl Ihr gewünschtes Tastenkürzel zu."
    }
  },
  options: {
    title: "Browse Assist-Einstellungen",
    subtitle: "Konfigurieren Sie Ihre Browser-Werkzeuge und Tastenkürzel",
    openPopup: "Popup öffnen",
    openPopupTip: "Erweiterungs-Popup öffnen",
    preferences: "Einstellungen",
    preferencesTip: "Einstellungen im Popup öffnen",
    about: "Über",
    aboutTip: "Info-Ansicht im Popup öffnen",
    activeModules: "Aktive Module",
    configureInPopup: "{{feature}} im Popup konfigurieren",
    shortcutsTitle: "Tastenkürzel- & Mausgesten-Referenz",
    shortcutsSubtitle:
      "Aktuelle Browser-Hotkeys und interaktive Gestenauslöser",
    customizeShortcuts: "Tastenkürzel anpassen",
    table: {
      action: "Aktion",
      shortcut: "Kürzel / Auslöser",
      description: "Beschreibung"
    },
    triggers: {
      mouseWheel: "{{modifier}} + Mausrad",
      mouseDrag: "Maus ziehen",
      doubleClickMargin: "Doppelklick am Rand",
      rightClickLink: "Rechtsklick auf Link"
    },
    shortcuts: {
      pip: {
        name: "Bild-im-Bild (PiP)",
        desc: "Aktuelles Video in ein schwebendes PiP-Fenster auslagern"
      },
      allowRightClick: {
        name: "Rechtsklick erlauben",
        desc: "Kontextmenü und Textkopie im aktiven Tab entsperren"
      },
      elementToys: {
        name: "Element-Werkzeuge",
        desc: "Elemente per Klick entfernen, bearbeiten, ausblenden oder verschieben"
      },
      colorPicker: {
        name: "Farbpipette",
        desc: "Bildschirm-Pipette aktivieren, um Farbcodes zu prüfen und zu kopieren"
      },
      quickHub: {
        name: "Quick-Hub-Kürzel",
        desc: "Schwebendes Quick-Hub-Menü per Tastatur umschalten"
      },
      volume: {
        name: "Video-Lautstärke",
        desc: "Über Video scrollen für Lautstärke; mit Modifikator klicken zum Stummschalten"
      },
      speed: {
        name: "Video-Geschwindigkeit",
        desc: "Über Video scrollen für Tempo; klicken für Vollbild"
      },
      seek: {
        name: "Video-Spulen & Einzelbild",
        desc: "Vor-/zurückspulen; bei Pause bildweise schalten"
      },
      boost: {
        name: "Video-Boost",
        desc: "Taste X über dem Video gedrückt halten für {{speed}}x Tempo"
      },
      mouseZoom: {
        name: "Maus-Pin-Zoom",
        desc: "Seite flüssig direkt am Mauszeiger vergrößern/verkleinern"
      },
      superDrag: {
        name: "Super-Ziehen",
        desc: "Text ziehen zum Suchen; Link ziehen für Hintergrund-Tab"
      },
      quickScroll: {
        name: "Schnellscroll-Buttons",
        desc: "Seitenrand doppelklicken oder schwebende Buttons für Anfang/Ende nutzen"
      },
      smoothScroll: {
        name: "Sanftes Scrollen",
        desc: "Physikalisch interpoliertes Scrollen in allen Scroll-Bereichen"
      },
      cleanLink: {
        name: "Sauberen Link kopieren",
        desc: "Tracking-Parameter (utm_*, fbclid) entfernen und sauber oder als Markdown kopieren"
      },
      quickHubZone: {
        name: "Quick-Hub-Aktivierungszone",
        desc: "Mauszeiger an die Ecke führen, um das Schnellmenü zu öffnen"
      }
    },
    storage: {
      title: "Speicher & Daten der Erweiterung",
      desc: "Löscht dauerhaft alle gespeicherten Daten und Einstellungen von Browse Assist in Ihrem Browser, einschließlich Konfigurationen, Tastenkürzel, Quick-Hub-Reihenfolge und Farbverlauf.",
      clearAll: "Alle Daten löschen...",
      cleared:
        "Alle Erweiterungsdaten wurden gelöscht und auf Werkseinstellungen zurückgesetzt.",
      footer:
        "Browse Assist • Manifest V3 • Entwickelt mit Plasmo, React & Tailwind CSS"
    },
    modal: {
      title: "Alle Erweiterungsdaten löschen?",
      body: "Dadurch werden alle von Browse Assist gespeicherten Daten in Ihrem Browserprofil dauerhaft gelöscht.",
      listHeader: "Folgendes wird gelöscht:",
      item1: "Alle aktiven Funktionsschalter & Unterkonfigurationen",
      item2: "Quick-Hub-Reihenfolge, angeheftete Aktionen & ausgeblendete Module",
      item3: "Farbverlauf der Farbpipette",
      item4: "Design-Einstellungen und Navigationsspeicher des Popups",
      warning:
        "⚠️ Diese Aktion kann nicht rückgängig gemacht werden. Alle Einstellungen werden sofort zurückgesetzt.",
      clearing: "Daten werden gelöscht...",
      confirm: "Ja, alle Daten löschen"
    }
  },
  content: {
    copied: {
      linkText: "Linktext kopiert",
      cleanLink: "Sauberen Link kopiert",
      markdown: "Markdown kopiert",
      cleanPageUrl: "Saubere Seiten-URL kopiert",
      pageMarkdown: "Seite als Markdown kopiert",
      quote: "Zitat kopiert",
      text: "Text kopiert",
      imageLink: "Bildlink kopiert",
      linkUrl: "Link-URL kopiert"
    },
    fabMenu: {
      movePosition: "Position verschieben",
      openSettings: "Einstellungen öffnen",
      hideOnTab: "In diesem Tab ausblenden",
      disableFeature: "{{feature}} deaktivieren",
      disablePipHoverButton: "PiP-Hover-Button deaktivieren",
      dragHint: "Maus an einen Rand bewegen & klicken • Esc zum Abbrechen",
      quickDragHint: "An einen Rand ziehen & Rechtsklick loslassen • Esc zum Abbrechen",
      positionSaved: "Position gespeichert",
      hiddenOnTab: "{{feature}} in diesem Tab ausgeblendet"
    }
  },
  about: {
    title: "Über",
    projectAndLegal: "Projekt & Rechtliches",
    homePage: "Startseite",
    terms: "Nutzungsbedingungen",
    policy: "Datenschutz",
    openSourceLibraries: "Open-Source-Bibliotheken",
    declaredPermissions: "Deklarierte Berechtigungen",
    permissionNames: {
      storage: "Speicher",
      contextMenus: "Kontextmenüs",
      clipboardWrite: "Zwischenablage",
      search: "Suche"
    },
    permissions: {
      storage: "Einstellungen und Präferenzen lokal speichern.",
      contextMenus:
        "Schnellaktionen per Rechtsklick bereitstellen, z. B. saubere Links kopieren.",
      clipboardWrite:
        "Ausgewählte Farbcodes und Markdown-Links in die Zwischenablage kopieren.",
      search:
        "Markierten Text beim Super-Ziehen mit der Standardsuchmaschine suchen."
    }
  },
  siteRules: {
    title: "Website-Regeln",
    appBarTip: "Website-Regeln (Umschalt+Klick für Optionen)",
    openInOptionsTip: "Website-Regeln in den Optionen öffnen",
    openRulesTip: "Regeln für diese Website konfigurieren",
    optionsDesc:
      "Browse Assist oder einzelne Funktionen für bestimmte Domains oder Platzhalter-URLs (*) deaktivieren.",
    currentSite: "Aktuelle Website",
    pauseAllOnSite: "Alle pausieren",
    quickExcludeDesc: "Funktion anklicken, um sie auf dieser Domain zu deaktivieren:",
    pause: "Pausieren",
    resume: "Fortsetzen",
    pauseSiteTip: "Alle Funktionen auf {host} pausieren",
    resumeSiteTip: "Funktionen auf {host} fortsetzen",
    statusPaused: "Pausiert",
    statusExcludedCount: "{count} ausgenommen",
    siteOffBadge: "Auf Site aus",
    siteOffTip: "Auf {host} durch Website-Regeln deaktiviert. Klicken zum Verwalten.",
    siteOffQuickHubTip: "Auf dieser Website durch Website-Regeln deaktiviert",
    addRuleTitle: "Regel hinzufügen",
    useCurrentDomain: "{host} verwenden",
    useCurrentDomainTip: "Aktuelle Website-Domain einfügen ({host})",
    alreadyInList: "Bereits in der Liste",
    wildcardHint: "Unterstützt *-Platzhalter",
    patternPlaceholder: "figma.com, *.google.com, docs.google.com/app/*",
    scopeAll: "Alle Funktionen",
    scopeSelected: "Ausgewählt",
    addButton: "Hinzufügen",
    invalidPattern: "Gültige Domain oder URL mit Platzhalter eingeben (nicht nur *).",
    selectAtLeastOne: "Mindestens eine Funktion auswählen.",
    savedRulesTitle: "Gespeicherte Regeln",
    emptyTitle: "Noch keine Website-Regeln",
    emptyDesc:
      "Domain (figma.com) oder Platzhalter-URL (docs.google.com/spreadsheets/*) hinzufügen, um Funktionen gezielt zu deaktivieren.",
    matchesThisTab: "Dieser Tab",
    editTip: "Regel bearbeiten",
    deleteTip: "Regel löschen",
    save: "Speichern"
  },
  features: {
    allowRightClick: {
      title: "Rechtsklick erlauben",
      description:
        "Kontextmenü, Textauswahl und Kopieren auf eingeschränkten Websites wiederherstellen.",
      popupDesc:
        "Kontextmenü und Kopieren im aktuellen Tab aktivieren, ohne andere Apps zu stören.",
      toastEnabled: "Rechtsklick aktiviert",
      toastDisabled: "Rechtsklick deaktiviert",
      currentTab: "Aktueller Tab"
    },
    contextMenuActions: {
      title: "Kontextmenü-Aktionen",
      description:
        "Benutzerdefinierte Rechtsklick-Aktionen zum Kopieren sauberer, formatierter Links.",
      activeCount: "{{count}}/6 Aktiv",
      copyLinkText: "Linktext kopieren",
      cleanLinkCopy: "Sauberen Link kopieren",
      markdownLinkCopy: "Link als Markdown kopieren",
      copyCleanPageUrl: "Saubere Seiten-URL kopieren",
      copyPageMarkdown: "Seite als Markdown kopieren",
      copySelectionQuote: "Auswahl als Zitat kopieren",
      settings: {
        sectionTitle: "Kontextmenü-Einträge",
        sectionDesc:
          "Einträge zum Sortieren ziehen oder Sichtbarkeit im Rechtsklick-Menü umschalten.",
        badges: {
          textOnly: "Nur Text",
          antiTracking: "Anti-Tracking",
          markdown: "[Text](URL)",
          page: "Seite",
          selection: "Auswahl"
        },
        descriptions: {
          copyLinkText: "Extrahiert und kopiert den Linktext ohne die URL.",
          cleanLinkCopy:
            "Entfernt Tracking-Parameter (utm_*, fbclid, si) vor dem Kopieren.",
          markdownLinkCopy:
            "Kopiert einen formatierten Markdown-Link, ideal für Obsidian, Notion & GitHub.",
          copyCleanPageUrl:
            "Rechtsklick irgendwo auf der Seite, um die URL ohne Tracking-Parameter zu kopieren.",
          copyPageMarkdown:
            "Kopiert Seitentitel und saubere URL als [Titel](URL).",
          copySelectionQuote:
            "Kopiert markierten Text als Markdown-Zitat mit Quellenlink."
        }
      }
    },
    superDrag: {
      title: "Super-Ziehen",
      description:
        "Markierten Text ziehen zum Suchen oder Links ziehen zum Öffnen in neuen Tabs.",
      settings: {
        dragTargets: "Ziehziele",
        tabs: {
          text: "Text",
          link: "Links",
          image: "Bilder"
        },
        searchText: "Markierten Text suchen",
        searchTextDesc:
          "Markierten Text in 4 Richtungen ziehen zum Suchen, Öffnen oder Kopieren.",
        textDisabled: "Das Ziehen von markiertem Text ist derzeit deaktiviert.",
        openLinks: "Hyperlinks öffnen",
        openLinksDesc:
          "Links ziehen, um sie in Tabs/Fenstern zu öffnen oder URL/Text zu kopieren.",
        linksDisabled: "Das Ziehen von Hyperlinks ist derzeit deaktiviert.",
        dragImages: "Bilder ziehen",
        dragImagesDesc:
          "Bilder ziehen, um sie in Tabs/Fenstern anzuzeigen oder Bild-URLs zu kopieren.",
        imagesDisabled: "Das Ziehen von Bildern ist derzeit deaktiviert.",
        displayFeedback: "Anzeige & Feedback",
        dragIndicator: "Visueller Ziehindikator",
        dragIndicatorDesc:
          "Visuelles Feedback beim Ziehen von Elementen auswählen.",
        indicatorOpacity: "Indikator-Deckkraft",
        indicatorOpacityDesc:
          "Transparenz des Ziehindikators während des Ziehens anpassen.",
        indicatorStyles: {
          none: "Deaktiviert",
          badge: "Schwebendes Abzeichen",
          radial: "Kreissegmente"
        },
        directionalGestures: "Richtungsgesten",
        actions: {
          open_bg_tab: "Hintergrund-Tab",
          open_active_tab: "Aktiver Tab",
          open_window_active: "Neues Fenster",
          open_incognito_active: "Inkognito-Fenster",
          none: "Keine (Nichts tun)",
          copy_to_clipboard: "Kopieren",
          copy_link_text: "Linktext kopieren",
          copy_link_url: "Link-URL kopieren",
          copy_markdown: "Markdown kopieren",
          copy_image_link: "Bildlink kopieren",
          search_image: "Bild suchen"
        }
      },
      logic: {
        types: {
          search: "Suche",
          image: "Bild",
          link: "Link"
        },
        dropOpenBackground: "Ablegen: {{type}} im Hintergrund öffnen",
        shortOpenBackground: "{{type}} (Hintergrund)",
        dropOpenActive: "Ablegen: {{type}} in neuem Tab öffnen",
        shortOpenActive: "{{type}} (Neuer Tab)",
        dropOpenWindow: "Ablegen: {{type}} in neuem Fenster öffnen",
        shortOpenWindow: "{{type}} (Neues Fenster)",
        dropOpenIncognito: "Ablegen: {{type}} im Inkognito-Fenster öffnen",
        shortOpenIncognito: "{{type}} (Inkognito)",
        dropCopyLinkText: "Ablegen: Linktext kopieren",
        shortCopyLinkText: "Linktext kopieren",
        dropCopyMarkdown: "Ablegen: Markdown kopieren",
        shortCopyMarkdown: "Markdown kopieren",
        dropSearchImage: "Ablegen: Bild suchen",
        shortSearchImage: "Bild suchen",
        dropCopyText: "Ablegen: Text kopieren",
        shortCopyText: "Text kopieren",
        dropCopyImageLink: "Ablegen: Bildlink kopieren",
        shortCopyImageLink: "Bildlink kopieren",
        dropCopyLinkUrl: "Ablegen: Link-URL kopieren",
        shortCopyLinkUrl: "Link-URL kopieren",
        noAction: "Keine Aktion",
        releaseToCancel: "Loslassen zum Abbrechen",
        exceededMax: "Max. Abstand überschritten (Loslassen zum Abbrechen)"
      }
    },
    quickScroll: {
      title: "Schnellscroll-Buttons",
      description:
        "Schwebende Schaltflächen zum sanften Springen an Seitenanfang oder -ende.",
      settings: {
        buttonPlacement: "Schaltflächen-Position",
        buttonPlacementDesc:
          "Entlang des linken oder rechten Rands ziehen oder klicken, um die Scroll-Buttons zu verankern.",
        controlsStyle: "Steuerung & Stil",
        buttonSelection: "Schaltflächen-Auswahl",
        buttonSelectionDesc: "Oben- & Unten-Buttons oder nur Oben anzeigen.",
        modes: {
          both: "Oben & Unten",
          topOnly: "Nur Oben"
        },
        buttonShapeDesc: "Kreis, Kapsel oder abgerundetes Quadrat wählen.",
        buttonOpacityDesc: "Transparenz im Ruhezustand anpassen.",
        behaviorIntel: "Verhalten & Intelligenz",
        autoDim: "Bei Inaktivität abblenden",
        autoDimDesc:
          "Schaltflächen beim Anhalten des Scrollens abblenden; beim Überfahren sofort wiederherstellen.",
        scrollMemory: "Scroll-Positions-Speicher",
        scrollMemoryDesc:
          "Leseposition beim Wegspringen merken und per 1 Klick zurückkehren.",
        hideOnNative: "Bei nativem Scroll-Button ausblenden",
        hideOnNativeDesc:
          "Automatisch ausblenden, wenn die Webseite bereits einen eigenen Nach-oben-Button hat."
      },
      logic: {
        scrollToTop: "Nach oben scrollen",
        scrollToBottom: "Nach unten scrollen",
        returnToPrevious: "Zur vorherigen Position zurückkehren"
      }
    },
    smoothScroll: {
      title: "Sanftes Scrollen",
      description: "Flüssiges Scrollen mit interpolierter Physik.",
      settings: {
        profiles: "Profile",
        presetBalanced: "Ausgewogen",
        presetUltra: "Ultra",
        presetSnappy: "Direkt",
        presetCustom: "Benutzerdef.",
        fineTuning: "Feinabstimmung",
        scrollDistance: "Scroll-Distanz",
        glidingDuration: "Gleitdauer",
        ignoreTouchpad: "Touchpad ignorieren",
        ignoreTouchpadDesc:
          "Native Trackpad-Trägheit beibehalten, indem kleine Mausrad-Schritte übersprungen werden.",
        keyboardScroll: "Sanftes Tastatur-Scrollen",
        keyboardScrollDesc:
          "Scrollen mit Pfeiltasten, Bild Auf/Ab und Leertaste sanft interpolieren.",
        aggressiveMode: "Aggressives Abfangen",
        aggressiveModeDesc:
          "Sanftes Scrollen auf allen Websites erzwingen. Deaktiviert lassen, um Canvas- & Web-Apps (z. B. Konva, Figma, Maps) zu schützen."
      }
    },
    mouseZoom: {
      title: "Maus-Pin-Zoom",
      description:
        "Modifikatortaste halten und Mausrad drehen, um zur Cursor-Position zu zoomen.",
      settings: {
        resetZoomTooltip: "Zoom im aktuellen Tab auf 100% zurücksetzen",
        triggerModifier: "Auslöse-Modifikatortaste",
        zoomSensitivity: "Zoom-Empfindlichkeit",
        stepIncrement: "Schrittweite",
        tickFine: "4% (Fein)",
        tickDefault: "10% (Standard)",
        tickFast: "25% (Schnell)",
        behaviorDisplay: "Verhalten & Anzeige",
        smoothAnimation: "Sanfte Animation",
        smoothAnimationDesc:
          "Zoom-Übergänge sanft interpolieren für ein flüssiges Gefühl.",
        invertDirection: "Richtung umkehren",
        invertDirectionDesc:
          "Nach unten scrollen zum Hineinzoomen, nach oben zum Herauszoomen.",
        showZoomToast: "Zoom-Hinweis anzeigen",
        showZoomToastDesc:
          "Schwebendes Prozent-Badge oben rechts auf der Seite anzeigen."
      },
      logic: {
        pageZoom: "Seitenzoom"
      }
    },
    pictureInPicture: {
      title: "Bild-im-Bild (PiP)",
      description:
        "Schwebendes Videofenster per anpassbarem Tastenkürzel umschalten.",
      settings: {
        shortTitle: "Picture-in-Picture",
        globalShortcut: "Globales Tastenkürzel",
        globalShortcutDesc: "Schwebendes Videofenster umschalten",
        displayFeedback: "Anzeige & Feedback",
        extensionBadge: "Erweiterungs-Badge-Anzeige",
        extensionBadgeDesc:
          "„PiP“-Abzeichen auf dem Erweiterungssymbol anzeigen, wenn ein Video im PiP läuft.",
        actionToast: "Aktions-Benachrichtigung",
        actionToastDesc:
          "Kurze Bestätigung beim Starten oder Beenden von PiP anzeigen.",
        autoPauseOnExit: "Beim PiP-Beenden pausieren",
        autoPauseOnExitDesc:
          "Video automatisch pausieren, wenn das Picture-in-Picture-Fenster geschlossen wird.",
        hoverButton: "Hover-PiP-Button im Video",
        hoverButtonDesc:
          "Schwebenden PiP-Auslöser in laufenden Videos anzeigen. Kann auf manchen Playern instabil sein.",
        buttonPosition: "Schaltflächen-Position",
        edgeAlignment: "Rand & Ausrichtung",
        edgeAlignmentDesc:
          "Entlang der Ränder ziehen oder klicken, um den PiP-Button im Videorahmen zu verankern.",
        buttonOpacityDesc: "Transparenz des Hover-Buttons im Ruhezustand anpassen."
      },
      logic: {
        watchInPip: "Im Bild-im-Bild-Modus ansehen",
        exitedPip: "Bild-im-Bild beendet",
        enteredPip: "Bild-im-Bild gestartet",
        notSupported: "PiP wird in diesem Browser nicht unterstützt",
        cannotEnter: "Bild-im-Bild konnte nicht gestartet werden",
        noVideoFound: "Kein Video auf der Seite gefunden"
      },
      background: {
        playing: "Wiedergabe in PiP: {{title}}",
        untitledVideo: "Video"
      }
    },
    videoWheelControl: {
      title: "Video-Mausrad-Steuerung",
      description:
        "Videolautstärke und Wiedergabegeschwindigkeit stufenlos per Mausrad regeln.",
      settings: {
        tabs: {
          volume: "Lautstärke",
          speed: "Tempo",
          seek: "Spulen",
          extra: "Extra"
        },
        conflictTitle: "Modifikatortasten-Konflikt erkannt",
        conflictDesc:
          "Zwei oder mehr aktive Steuerungen nutzen dieselbe Modifikatortaste (Priorität: Spulen > Tempo > Lautstärke). Bitte eindeutige Tasten zuweisen.",
        modifierKey: "Modifikatortaste",
        modifierKeyDesc: "Taste halten + über Video scrollen",
        volumeControl: "Lautstärkeregelung",
        volumeStep: "Lautstärkeschritt",
        clickToMute: "Klick zum Stummschalten",
        clickToMuteDesc:
          "Video bei gedrückter {{key}}-Taste anklicken, um stummzuschalten.",
        invertVolume: "Lautstärke-Scroll umkehren",
        invertVolumeDesc:
          "Scrollrichtung beim Anpassen der Lautstärke umkehren.",
        speedControl: "Geschwindigkeitsregelung",
        speedStep: "Temposchritt",
        holdXBoost: "'X' halten für Boost (2.0x)",
        holdXBoostDesc:
          "Taste 'X' beim Ansehen gedrückt halten für vorübergehend 2.0x Geschwindigkeit.",
        clickToFullscreen: "Klick für Vollbild",
        clickToFullscreenDesc:
          "Video bei gedrückter {{key}}-Taste anklicken für Vollbild.",
        invertSpeed: "Tempo-Scroll umkehren",
        invertSpeedDesc:
          "Scrollrichtung beim Anpassen der Wiedergabegeschwindigkeit umkehren.",
        seekControl: "Spulsteuerung",
        seekStep: "Spulschritt (Sekunden)",
        frameStepper: "Einzelbild-Schaltung",
        frameStepperDesc:
          "Bei pausiertem Video bewegt das Mausrad bildweise (~1/30s).",
        invertSeek: "Spul-Scroll umkehren",
        invertSeekDesc: "Scrollrichtung beim Spulen des Videos umkehren.",
        screenshot: "Video-Screenshot (Shift+Alt+Klick)",
        screenshotDesc:
          "Aktuelles Videobild direkt als PNG in die Zwischenablage kopieren.",
        osd: "On-Screen-Display (OSD)",
        osdDesc:
          "Schwebende HUD-Hinweise für Lautstärke, Tempo, Spulen und Boost anzeigen.",
        osdOpacity: "OSD-Deckkraft",
        osdOpacityDesc: "Transparenz des schwebenden OSD-Hinweises anpassen.",
        noticeTitle: "Kompatibilitäts- & Statushinweis",
        noticeBody1:
          "Diese Funktion interagiert direkt mit dem zugrunde liegenden HTML5-Media-Element (<video>).",
        noticeBody2:
          "Auf großen Plattformen können eigene State-Manager gelegentlich Wiedergabetempo oder Stummschaltung beim Loopen, Auflösungswechsel oder Autoplay zurücksetzen."
      },
      logic: {
        muted: "Stumm",
        fullscreen: "Vollbild",
        exitFullscreen: "Vollbild beenden",
        frameCopied: "Bild kopiert!",
        captureFailed: "Aufnahme fehlgeschlagen",
        clipboardDenied: "Zwischenablage verweigert",
        corsProtected: "CORS-geschützt",
        frameStep: "Bild {{sign}} ({{time}})",
        boost: "⚡ {{rate}}x Boost"
      }
    },
    colorPicker: {
      title: "Farbpipette",
      description:
        "Jede Pixelfarbe vom Bildschirm aufnehmen und sofort in mehreren Formaten kopieren.",
      settings: {
        shortcutTitle: "Pipetten-Tastenkürzel",
        shortcutDesc: "Bildschirm-Farbpipette schnell aktivieren",
        recentColors: "Zuletzt verwendete Farben",
        clearHistoryTooltip: "Gesamten Farbverlauf löschen",
        clickToCopy: "Klicken zum Kopieren: {{value}}",
        noRecentColors:
          "Noch keine Farben aufgenommen. Tastenkürzel oder Button oben nutzen.",
        defaultFormat: "Standard-Kopierformat",
        clipboardFormat: "Zwischenablage-Farbformat",
        clipboardFormatDesc:
          "Farbstandard, der beim Aufnehmen automatisch kopiert wird.",
        behaviorFeedback: "Verhalten & Feedback",
        autoCopy: "Automatisch in Zwischenablage kopieren",
        autoCopyDesc:
          "Ausgewählten Farbwert sofort beim Aufnehmen kopieren",
        showPalette: "Schwebende Palette anzeigen",
        showPaletteDesc:
          "Interaktives HEX / RGB / HSL-Palettenfenster nach dem Aufnehmen anzeigen",
        feedbackNotification: "Feedback-Benachrichtigung",
        feedbackDisabledDesc: "Deaktiviert, solange schwebende Palette aktiv ist",
        feedbackEnabledDesc: "Bestätigung beim Aufnehmen einer Farbe anzeigen"
      },
      logic: {
        copiedColor: "Farbe kopiert",
        notSupported: "EyeDropper wird auf dieser Seite/diesem Browser nicht unterstützt",
        pickedAndCopied: "Farbe aufgenommen & kopiert",
        picked: "Farbe aufgenommen",
        couldNotOpen: "Farbpipette konnte nicht geöffnet werden",
        permissionRequired: "Benutzerinteraktion erforderlich oder nicht erlaubt",
        palette: {
          pickedColor: "Aufgenommene Farbe",
          close: "Schließen",
          copyHex: "HEX kopieren",
          copyRgb: "RGB kopieren",
          copyHsl: "HSL kopieren"
        }
      }
    },
    elementToys: {
      title: "Element-Werkzeuge",
      description:
        "Elemente auf jeder Webseite inspizieren, entfernen, bearbeiten oder verschieben.",
      settings: {
        launchTooltip: "Element-Werkzeuge auf der Seite starten",
        shortcutTitle: "Aktivierungs-Tastenkürzel",
        shortcutDesc: "Schwebende Element-Toys-Leiste auf aktiver Seite öffnen",
        inspectorBadge: "Element-Inspektor-Abzeichen",
        showDimensions: "Element-Abmessungen anzeigen",
        showDimensionsDesc:
          "Breite × Höhe (px) messen und im Hover-Abzeichen anzeigen",
        showTags: "Tag- & Klassennamen anzeigen",
        showTagsDesc:
          "HTML-Tagnamen und CSS-Klassenselektoren anzeigen (z. B. div.banner#hero)",
        behaviorSection: "Element-Toys-Verhalten",
        defaultTool: "Standard-Werkzeug beim Start",
        defaultToolDesc: "Ausgewähltes Werkzeug beim Aktivieren von Element-Werkzeuge",
        modes: {
          zap: "Entfernen (Zap)",
          edit: "Bearbeiten",
          move: "Bewegen",
          hide: "Ausblenden"
        },
        continuousSession: "Fortlaufende Sitzung",
        continuousSessionDesc:
          "Werkzeuge nach jeder Aktion aktiv halten, bis Esc oder Beenden gedrückt wird",
        autoUnfreeze: "Seitenscroll automatisch entsperren",
        autoUnfreezeDesc:
          "Scrollbarkeit (overflow: auto) wiederherstellen, falls ein blockierendes Overlay entfernt wurde",
        showToast: "Schwebenden Hinweis anzeigen",
        showToastDesc:
          "Bestätigungsbanner auf der Seite anzeigen, wenn Aktionen ausgeführt werden",
        howToUse: "Verwendung von Element-Werkzeuge",
        tipShortcutPrefix: "Drücke",
        tipShortcutSuffix: "um die schwebende HUD-Leiste auf der Seite zu öffnen.",
        tipNoShortcutPrefix: "Lege oben ein Tastenkürzel fest oder klicke",
        tipNoShortcutSuffix: "um die schwebende HUD-Leiste auf der Seite zu öffnen.",
        tipZapDesc:
          "Klicke auf beliebige Banner, Overlays oder Widgets, um sie aus dem DOM zu entfernen.",
        tipEditDesc:
          "Klicke auf beliebigen Text, um ihn direkt inline zu bearbeiten (Tastatureingaben sind von der Seite isoliert).",
        tipMoveDesc:
          "Ziehe Elemente, um sie neu zu positionieren. Wechsle direkt zwischen Flow & Free und nutze + / - für den Auswahlbereich.",
        tipHideDesc:
          "Klicken, um Elemente unsichtbar zu machen, ohne das Seitenlayout zu zerstören.",
        tipUndoPrefix: "Drücke",
        tipUndoMiddle: "um Aktionen rückgängig zu machen, oder klicke",
        tipUndoSettings: "Einstellungen",
        tipUndoSuffix: "in der Leiste für weitere Optionen."
      },
      toolbar: {
        title: "Element-Werkzeuge",
        zap: "Entfernen",
        zapTip: "Entfernen: Klicken, um Element aus dem DOM zu löschen",
        edit: "Bearbeiten",
        editTip: "Text bearbeiten: Klicken, um Text inline zu bearbeiten",
        move: "Bewegen",
        moveActiveTip: "Bewegen aktiv (+/- für übergeordneten Bereich)",
        moveTip: "Bewegen: Klicken für Bewegen-Modus (Flow / Free)",
        moveLabel: "Bewegen ({{mode}})",
        flow: "Flow",
        flowTip:
          "Flow-Modus: Ordnet im DOM-Layout neu an & verschiebt andere Elemente",
        free: "Free",
        freeTip: "Free-Modus: Freies Verschieben ohne Layout-Änderung",
        hide: "Ausblenden",
        hideTip: "Ausblenden: Klicken zum Verbergen ohne Layout-Verschiebung",
        undo: "Rückgängig",
        undoTip: "Letzte Aktion rückgängig (Strg+Z)",
        settings: "Einstellungen",
        settingsTip: "Element-Werkzeuge-Einstellungen öffnen",
        exit: "Beenden",
        exitTip: "Element-Werkzeuge beenden (Esc)"
      },
      overlay: {
        clickToZap: "Klicken zum Entfernen",
        clickToEdit: "Klicken zum Bearbeiten",
        dragBody: "Körper für {{type}} ziehen • Ecken zum Skalieren ziehen",
        clickToHide: "Klicken zum Ausblenden"
      },
      logic: {
        zapped: "Element entfernt!",
        hidden: "Element ausgeblendet",
        resized: "Größe geändert",
        textUpdated: "Text aktualisiert",
        undone: "Aktion rückgängig",
        undoneDetail: "{{action}} rückgängig gemacht",
        closed: "Element-Werkzeuge geschlossen",
        active: "Element-Werkzeuge aktiv",
        activeDetail: "Werkzeuge oben wählen • Esc zum Beenden",
        scope: "Bereich: <{{tag}}>",
        scopeDetail: "Ebene +{{depth}} (- zum Verkleinern)",
        scrollUnfrozen: "Seitenscroll entsperrt",
        scrollUnfrozenDetail: "overflow: auto wiederhergestellt"
      }
    },
    quickHub: {
      title: "Schnellmenü",
      description:
        "Schnellzugriffs-Menü auf dem Bildschirm mit Aktivierung an den Ecken.",
      settings: {
        floatingPlacement: "Position des schwebenden Buttons",
        floatingPlacementDesc:
          "Entlang des Rands ziehen oder klicken, um den Quick-Hub-Auslöser beliebig zu verankern.",
        buttonShapeDesc: "Form des schwebenden Auslöse-Buttons anpassen.",
        buttonOpacityDesc: "Transparenz des schwebenden Auslöse-Buttons anpassen.",
        customizeMenu: "Menü anpassen",
        customizeMenuDesc:
          "Einträge zum Sortieren ziehen oder Sichtbarkeit umschalten.",
        behaviorProximity: "Verhalten & Annäherung",
        hoverProximity: "Bei Mausannäherung einblenden",
        hoverProximityDesc:
          "Schwebenden Button nur anzeigen, wenn sich der Cursor der Ecke nähert. Sonst mit 30% Deckkraft sichtbar.",
        keyboardShortcut: "Tastenkürzel",
        globalHotkey: "Globales Tastenkürzel (Optional)",
        globalHotkeyDesc: "Quick-Hub-Menü auf der aktiven Webseite umschalten.",
        disabledInSettings: "{{feature}} ist in den Einstellungen deaktiviert",
        hiddenInMenu: "{{feature}} ist im Popup-Menü ausgeblendet",
        quickScrollTopOnly: "Quick Scroll ist auf 'Nur Oben' eingestellt",
        actions: {
          pipTitle: "Video im PiP ansehen",
          pipDesc: "Video im schwebenden Bild-im-Bild-Fenster ansehen",
          colorPickerTitle: "Farbe vom Bildschirm aufnehmen",
          colorPickerDesc: "Pixellupe und sofortiges Hex-Kopieren",
          elementToysTitle: "Element-Werkzeuge",
          elementToysDesc: "Elemente inspizieren, entfernen, bearbeiten oder verschieben",
          scrollTopTitle: "Nach oben scrollen",
          scrollTopDesc: "Sanft zum Seitenanfang springen",
          scrollBottomTitle: "Nach unten scrollen",
          scrollBottomDesc: "Sanft zum Seitenende springen",
          resetZoomTitle: "Seitenzoom zurücksetzen",
          resetZoomDesc: "100% Ansichtszoom wiederherstellen",
          cleanUrlTitle: "Saubere URL kopieren",
          cleanUrlDesc: "Link ohne Tracking-Parameter (utm_*, fbclid) kopieren",
          allowRightClickTitle: "Rechtsklick erlauben",
          allowRightClickDesc: "Rechtsklick- & Kopier-Sperre in diesem Tab umschalten",
          copyMarkdownTitle: "Seite als Markdown kopieren",
          copyMarkdownDesc: "Sauberen Seitenlink im Format [Titel](URL) kopieren",
          videoScreenshotTitle: "Videobild aufnehmen",
          videoScreenshotDesc: "PNG-Screenshot des aktiven Videos in die Zwischenablage kopieren"
        }
      },
      logic: {
        noToolsActive:
          "Keine Werkzeuge aktiv. Funktionen im Browse-Assist-Popup aktivieren.",
        triggerTooltip: "Schnellmenü (Schnellwerkzeuge)",
        triggerAria: "Schnellmenü",
        cleanUrlCopied: "Saubere URL kopiert",
        markdownCopied: "Seiten-Markdown kopiert",
        noVideoFound: "Kein aktives Video auf dieser Seite gefunden"
      }
    },
    imageHoverPreview: {
      title: "Bild-Hover-Vorschau",
      description:
        "Über Bilder oder Bildlinks fahren, um eine Vollbild-Vorschau anzuzeigen.",
      settings: {
        activation: "Aktivierung",
        triggerModifier: "Auslöse-Modifikator",
        triggerModifierDesc:
          "Diese Taste halten, während der Mauszeiger über einem Bild schwebt.",
        hoverDelay: "Hover-Verzögerung",
        hoverDelayDesc: "Wartezeit vor dem Öffnen der Vorschaukarte.",
        instant: "Sofort",
        displaySize: "Anzeigegröße",
        maxViewportSize: "Maximale Viewport-Größe",
        animation: "Einblend-Animation",
        animationDesc: "Bewegungseffekt beim Einblenden der Vorschaukarte.",
        animZoom: "Zoom",
        animMorph: "Morph",
        animFade: "Einblenden",
        animSlide: "Gleiten",
        animNone: "Keine",
        behavior: "Verhalten",
        previewImageLinks: "Bildlinks in Vorschau anzeigen",
        previewImageLinksDesc:
          "Bildvorschau auch beim Überfahren von Hyperlinks zu Bilddateien anzeigen.",
        showDimensions: "Abmessungs-Badge anzeigen",
        showDimensionsDesc:
          "Natürliche Breite × Höhe (px) in der Ecke der Vorschau anzeigen."
      }
    }
  }
}
