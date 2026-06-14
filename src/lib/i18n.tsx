import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "de";

const STORAGE_KEY = "funeral-compass:lang";

type Entry = { en: string; de: string };
type Dict = Record<string, Entry>;

const dict = {
  // Header / chrome
  brand: { en: "Compass", de: "Kompass" },
  brandLead: { en: "Funeral", de: "Bestattungs" },
  viewSummary: { en: "View summary →", de: "Zusammenfassung ansehen →" },
  footer: {
    en: "Funeral Compass · A gentle guide for difficult days.",
    de: "Bestattungskompass · Ein einfühlsamer Wegweiser.",
  },

  // Navigation
  nav_home: { en: "Home", de: "Startseite" },
  nav_contact: { en: "Contact Us", de: "Kontakt" },
  nav_about: { en: "About Us", de: "Über uns" },
  nav_impressum: { en: "Legal Notice", de: "Impressum" },

  // Contact page
  contact_title: { en: "Contact Us", de: "Kontakt" },
  contact_lead: {
    en: "We are here to help. If you have any questions or would like to speak with someone, please reach out.",
    de: "Wir sind für Sie da. Bei Fragen oder wenn Sie mit jemandem sprechen möchten, kontaktieren Sie uns gerne.",
  },
  contact_info1: {
    en: "You can reach us by email at hello@funeralcompass.example or by phone at +49 (0) 123 456789.",
    de: "Sie erreichen uns per E-Mail unter hello@funeralcompass.example oder telefonisch unter +49 (0) 123 456789.",
  },
  contact_info2: {
    en: "Our team is available Monday through Friday, 9:00 to 17:00.",
    de: "Unser Team ist montags bis freitags von 9:00 bis 17:00 Uhr erreichbar.",
  },
  contact_info3: {
    en: "For urgent matters outside of these hours, please leave a message and we will get back to you as soon as possible.",
    de: "Bei dringenden Anliegen außerhalb dieser Zeiten hinterlassen Sie uns bitte eine Nachricht — wir melden uns so schnell wie möglich bei Ihnen.",
  },
  contact_form_name: { en: "Your name", de: "Ihr Name" },
  contact_form_email: { en: "Email address", de: "E-Mail-Adresse" },
  contact_form_message: { en: "Message", de: "Nachricht" },
  contact_form_submit: { en: "Send message", de: "Nachricht senden" },
  contact_form_sending: { en: "Sending…", de: "Wird gesendet…" },
  contact_form_success: {
    en: "Your message has been sent. We will be in touch within 24 hours.",
    de: "Ihre Nachricht wurde gesendet. Wir melden uns innerhalb von 24 Stunden.",
  },
  contact_form_error: {
    en: "Something went wrong. Please try again or email us directly.",
    de: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt.",
  },

  // About page
  about_title: { en: "About Us", de: "Über uns" },
  about_lead: {
    en: "Funeral Compass was created to offer families a calm, respectful way to plan a farewell.",
    de: "Der Bestattungskompass wurde entwickelt, um Familien eine ruhige, respektvolle Möglichkeit zu bieten, einen Abschied zu planen.",
  },
  about_info1: {
    en: "We believe that every farewell deserves care and attention. Our gentle planner guides you through each step, at your own pace, with no obligations.",
    de: "Wir glauben, dass jeder Abschied Würde und Aufmerksamkeit verdient. Unser einfühlsamer Wegweiser begleitet Sie Schritt für Schritt — in Ihrem Tempo und ohne Verpflichtungen.",
  },
  about_info2: {
    en: "Whether you are facing a recent loss or preparing in advance, we are here to support you with compassion and clarity.",
    de: "Ob Sie einen aktuellen Trauerfall begleiten oder sich im Voraus informieren möchten — wir unterstützen Sie mit Empathie und Klarheit.",
  },
  about_info3: {
    en: "This tool is provided as a free resource. For personalised guidance, we recommend speaking with a local funeral director.",
    de: "Dieses Angebot ist kostenfrei. Für persönliche Beratung empfehlen wir Ihnen, sich an einen ortsansässigen Bestatter zu wenden.",
  },

  // Impressum page
  impressum_title: { en: "Legal Notice", de: "Impressum" },
  impressum_lead: {
    en: "Information required under § 5 TMG (German Telemedia Act).",
    de: "Angaben gemäß § 5 TMG.",
  },
  impressum_info1: {
    en: "Funeral Compass · Example Street 1 · 12345 Example City · Germany",
    de: "Bestattungskompass · Musterstraße 1 · 12345 Musterstadt · Deutschland",
  },
  impressum_info2: {
    en: "Represented by: Example Managing Director",
    de: "Vertreten durch: Beispiel Geschäftsführer",
  },
  impressum_info3: {
    en: "Contact: hello@funeralcompass.example · +49 (0) 123 456789",
    de: "Kontakt: hello@funeralcompass.example · +49 (0) 123 456789",
  },
  back: { en: "Back", de: "Zurück" },
  continue: { en: "Continue", de: "Weiter" },
  skip: { en: "Skip for now", de: "Vorerst überspringen" },
  change: { en: "Change", de: "Ändern" },
  yes: { en: "Yes", de: "Ja" },
  no: { en: "No", de: "Nein" },
  edit: { en: "Edit", de: "Bearbeiten" },
  cancel: { en: "Cancel", de: "Abbrechen" },
  optional: { en: "Optional", de: "Optional" },

  // Progress
  stepXofY: { en: "Step {current} of {total}", de: "Schritt {current} von {total}" },

  // Step labels
  step_intro: { en: "Getting started", de: "Einführung" },
  step_funeralType: { en: "Type of farewell", de: "Bestattungsart" },
  step_finalGoodbye: { en: "Personal farewell", de: "Letzter Abschied" },
  step_ceremonyOutline: { en: "Ceremony structure", de: "Ablauf der Feier" },
  step_mainCeremony: { en: "The ceremony", de: "Trauerfeier" },
  step_subCeremony: { en: "Graveside service", de: "Zeremonie am Grab" },
  step_coffinUrn: { en: "Coffin & Urn", de: "Sarg & Urne" },
  step_grave: { en: "Resting place", de: "Grabstätte" },
  step_obituary: { en: "Obituary", de: "Traueranzeige" },
  step_sympathy: { en: "Sympathy cards", de: "Trauerkarten" },
  step_assistance: { en: "Assistance", de: "Formalitäten" },
  step_summary: { en: "Summary", de: "Zusammenfassung" },

  // Catalogue / common
  viewCatalogue: { en: "View options", de: "Katalog ansehen" },
  catalogue: { en: "Catalogue", de: "Katalog" },
  coffinCatalogue: { en: "Coffin selection", de: "Sargkatalog" },
  urnCatalogue: { en: "Urn selection", de: "Urnenkatalog" },
  selected: { en: "Selected", de: "Ausgewählt" },

  // EntryStep
  entry_h1: { en: "We are here for you — every step of the way.", de: "Wir sind für Sie da — in dieser schwierigen Zeit." },
  entry_lead: {
    en: "Please take your time. You can skip any question or come back to change your answers later. There are no obligations — let us begin with what brings you here today.",
    de: "Gehen Sie ganz in Ihrem Tempo vor. Sie können Fragen überspringen und Ihre Auswahl jederzeit ändern. Es gibt keine Verpflichtungen — beginnen wir mit dem, was Sie heute zu uns führt.",
  },
  entry_recentLoss: { en: "A recent loss", de: "Ein aktueller Trauerfall" },
  entry_recentLossDesc: {
    en: "A loved one has passed away and you would like help planning the funeral arrangements.",
    de: "Ein geliebter Mensch ist verstorben und Sie möchten die Bestattung Schritt für Schritt planen.",
  },
  entry_preplan: { en: "Information & pre-planning", de: "Vorsorge & Information" },
  entry_preplanDesc: {
    en: "You would like to explore your options in advance — for yourself or for a family member.",
    de: "Sie möchten sich im Voraus informieren und vorsorgen — für sich selbst oder für eine nahestehende Person.",
  },
  entry_nameDeceased: { en: "Name of the deceased", de: "Name der verstorbenen Person" },
  entry_whereCurrent: { en: "Current location of the deceased", de: "Aktueller Aufenthaltsort" },
  entry_whereCurrentPh: { en: "e.g. Hospital, home, hospice…", de: "z. B. Krankenhaus, Zuhause, Hospiz…" },
  entry_whoFor: { en: "Who are you planning for?", de: "Für wen planen Sie?" },
  entry_self: { en: "Myself", de: "Für mich selbst" },
  entry_other: { en: "A loved one", de: "Für jemand anderen" },
  entry_nameOptional: { en: "Name (optional)", de: "Name (optional)" },
  entry_yourName: { en: "Your name", de: "Ihr Name" },
  entry_theirName: { en: "Their name", de: "Name der Person" },
  entry_begin: { en: "Begin planning", de: "Planung beginnen" },

  // FuneralType
  ft_title: { en: "Which type of burial do you prefer?", de: "Welche Bestattungsart wünschen Sie?" },
  ft_subtitle: {
    en: "Two decisions shape the funeral: how your loved one will be laid to rest, and where. Both choices affect what comes next in this planner.",
    de: "Zwei grundlegende Entscheidungen prägen die Bestattung: die Bestattungsform und der Ort der letzten Ruhe. Beide Entscheidungen beeinflussen den weiteren Ablauf.",
  },
  ft_careOfBody: { en: "Method of burial", de: "Bestattungsform" },
  ft_careOfBodyDesc: {
    en: "This determines how your loved one will be laid to rest. Earth burial uses a coffin; cremation uses an urn and allows more flexibility for the resting place.",
    de: "Die Bestattungsform bestimmt, wie die verstorbene Person bestattet wird. Bei der Erdbestattung erfolgt die Beisetzung im Sarg; bei der Feuerbestattung in einer Urne.",
  },
  ft_earth: { en: "Traditional burial", de: "Erdbestattung" },
  ft_earthDesc: { en: "The coffin is buried at the chosen cemetery. A timeless and dignified choice — the grave becomes a lasting place for family and friends to visit.", de: "Der Sarg wird auf dem Friedhof beigesetzt. Eine würdevolle und traditionsreiche Form — das Grab bleibt ein fester Ort der Erinnerung und des Gedenkens." },
  ft_cremation: { en: "Cremation", de: "Feuerbestattung" },
  ft_cremationDesc: { en: "The deceased is cremated and the ashes are then buried or scattered. Cremation allows greater flexibility for the choice of resting place.", de: "Die verstorbene Person wird eingeäschert; die Asche wird anschließend bestattet oder verstreut. Diese Bestattungsform bietet mehr Flexibilität bei der Wahl des Beisetzungsortes." },
  ft_place: { en: "Place of rest", de: "Ort der Beisetzung" },
  ft_placeDesc: { en: "Where would you like your loved one to rest? The options shown depend on the burial method chosen above.", de: "Wo soll die Beisetzung stattfinden? Die verfügbaren Möglichkeiten hängen von der gewählten Bestattungsform ab." },
  ft_cemetery: { en: "Cemetery", de: "Friedhof" },
  ft_cemeteryDesc: { en: "A dedicated cemetery plot, available to visit year-round. The grave can be personalised with a headstone, flowers, and planting.", de: "Ein fester Grabplatz auf dem Friedhof, der das ganze Jahr besucht werden kann. Das Grab lässt sich individuell mit Grabstein und Bepflanzung gestalten." },
  ft_friedwald: { en: "FriedWald (Forest burial)", de: "FriedWald" },
  ft_friedwaldDesc: { en: "A natural woodland burial. The ashes are placed at the roots of a chosen tree — a peaceful resting place among nature, maintained by the FriedWald organisation.", de: "Eine naturnahe Bestattung im Wald. Die Asche wird an den Wurzeln eines ausgewählten Baumes beigesetzt. Der Wald wird dauerhaft gepflegt und ist ganzjährig zugänglich." },
  ft_sea: { en: "Sea burial", de: "Seebestattung" },
  ft_seaDesc: { en: "The ashes are scattered at sea — accompanied by family or unaccompanied. There is no fixed grave; the burial coordinates are documented and shared with the family.", de: "Die Asche wird auf dem Meer verstreut — in Begleitung von Angehörigen oder still. Es gibt keine feste Grabstätte; die genauen Koordinaten werden der Familie mitgeteilt." },
  ft_whichCemetery: { en: "Which cemetery?", de: "Welcher Friedhof?" },
  ft_whichCemeteryHint: { en: "Optional — name or city.", de: "Optional — Name oder Ort." },
  ft_whichCemeteryPh: { en: "e.g. St. Mary's, Berlin", de: "z. B. St. Marien, Berlin" },
  ft_whichFriedwald: { en: "Which FriedWald?", de: "Welcher FriedWald-Standort?" },
  ft_whichFriedwaldHint: { en: "Optional — region or location.", de: "Optional — Region oder Standort." },
  ft_whichFriedwaldPh: { en: "e.g. Reinhardswald", de: "z. B. Reinhardswald" },
  ft_whichSea: { en: "Which sea?", de: "Welches Meer?" },
  ft_nordsee: { en: "North Sea", de: "Nordsee" },
  ft_ostsee: { en: "Baltic Sea", de: "Ostsee" },
  ft_international: { en: "International", de: "International" },

  // FinalGoodbye
  fg_title: { en: "A personal moment of farewell", de: "Möchten Sie sich im Vorfeld im privaten Rahmen verabschieden?" },
  fg_question: {
    en: "Would you like a private farewell before the ceremony?",
    de: "Möchten Sie sich im Vorfeld im privaten Rahmen verabschieden?",
  },
  fg_subtitle: {
    en: "A quiet, private moment to say a personal farewell before the ceremony begins.",
    de: "Hier haben Sie die Möglichkeit, sich in einer vertrauten, ruhigen Atmosphäre von der verstorbenen Person zu verabschieden.",
  },
  fg_open: { en: "Open Coffin", de: "Aufbahrung am offenen Sarg" },
  fg_openDesc: { en: "The coffin is open, allowing family and close friends to say a final, personal goodbye. Many find this an important and comforting moment.", de: "Der Sarg ist geöffnet. Familie und enge Freunde können sich persönlich und in Ruhe verabschieden. Viele Angehörige empfinden diesen Moment als tröstlich." },
  fg_closed: { en: "Closed Coffin", de: "Am geschlossenen Sarg" },
  fg_closedDesc: { en: "A quiet farewell with the coffin closed — intimate and reflective. A thoughtful choice for those who prefer a more contained goodbye.", de: "Ein stiller, intimer Abschied am geschlossenen Sarg. Oft gewählt von Familien, die einen ruhigen, beschaulichen Moment bevorzugen." },
  fg_urn: { en: "At the urn", de: "An der Urne" },
  fg_urnDesc: { en: "After cremation, a quiet and intimate gathering around the urn allows for a personal farewell before the main ceremony or burial.", de: "Nach der Einäscherung bietet die Aufbahrung der Urne Gelegenheit für einen persönlichen, stillen Abschied — vor der eigentlichen Trauerfeier oder Beisetzung." },

  // CeremonyOutline
  co_title: { en: "How should the ceremony unfold?", de: "Wie soll die Trauerfeier ablaufen?" },
  co_subtitle: { en: "This determines the shape and timing of the funeral. You can choose a combined service with burial on the same day, two separate events, or a simple farewell at the grave.", de: "Hier legen Sie fest, wie die Trauerfeier und die Beisetzung zeitlich und strukturell ablaufen sollen. Alle Optionen sind gleichwertig — wählen Sie, was Ihnen und Ihrer Familie am besten entspricht." },
  co_combined: { en: "Ceremony followed by burial", de: "Trauerfeier mit anschließender Beisetzung" },
  co_combinedDesc: { en: "The ceremony and burial take place on the same day. After the service, mourners accompany the coffin or urn to the grave together.", de: "Trauerfeier und Beisetzung finden am selben Tag statt. Im Anschluss an die Feier begleiten die Trauergäste gemeinsam den Sarg oder die Urne zur Grabstätte." },
  co_separate: { en: "Ceremony before burial (separate days)", de: "Trauerfeier getrennt von der Beisetzung" },
  co_separateDesc: { en: "A larger ceremony takes place first, allowing more people to attend. The burial then happens at a later date, often privately with close family.", de: "Die Trauerfeier findet zunächst mit einem größeren Kreis statt. Die Beisetzung erfolgt danach zu einem späteren Zeitpunkt — oft im kleinen Familienkreis." },
  co_none: { en: "No formal ceremony", de: "Keine Trauerfeier" },
  co_noneDesc: { en: "No formal ceremony is planned. The burial takes place quietly, often with a brief moment at the grave for close family.", de: "Auf eine formelle Trauerfeier wird verzichtet. Die Beisetzung erfolgt still — manchmal mit einem kurzen Moment der Stille am Grab für die engste Familie." },
  co_fwAndacht: { en: "At the FriedWald forest site", de: "Am FriedWald-Andachtsplatz" },
  co_fwAndachtDesc: { en: "A ceremony at the FriedWald's dedicated outdoor gathering space — a serene forest setting for family and friends.", de: "Eine Feier am Andachtsplatz des FriedWalds — einem ruhigen Ort im Freien, der eigens für Trauerfeiern vorgesehen ist." },
  co_fwElsewhere: { en: "At another location", de: "An einem anderen Ort" },
  co_fwElsewhereDesc: { en: "The ceremony is held at a church, chapel, or another meaningful location. The burial at the FriedWald takes place separately.", de: "Die Trauerfeier findet auf einem Friedhof, in einer Kirche oder an einem anderen Ort statt. Die Beisetzung im FriedWald erfolgt zu einem gesonderten Zeitpunkt." },
  co_fwNone: { en: "No ceremony", de: "Keine Trauerfeier" },
  co_fwNoneDesc: { en: "No larger ceremony is planned beforehand. You may still choose to attend the burial at the tree itself.", de: "Es findet keine größere Trauerfeier statt. Sie können dennoch der Beisetzung am Baum persönlich beiwohnen." },
  co_shortAtGraveQ: { en: "Would you like a brief ceremony at the graveside?", de: "Wünschen Sie eine kurze Zeremonie am Grab?" },
  co_shortAtGrave: { en: "Brief graveside ceremony", de: "Kurze Zeremonie am Grab" },
  co_noneAtAll: { en: "No ceremony at all", de: "Gar keine Zeremonie" },
  co_separateTypeQ: { en: "What kind of ceremony?", de: "Welche Art der Trauerfeier?" },
  co_separateCoffin: { en: "Ceremony at the coffin", de: "Trauerfeier am Sarg" },
  co_separateCoffinDesc: { en: "A traditional ceremony with the coffin present, before the burial takes place at a later date.", de: "Eine klassische Trauerfeier am Sarg. Die Beisetzung findet zu einem späteren Zeitpunkt statt." },
  co_separateUrn: { en: "Ceremony at the urn", de: "Trauerfeier an der Urne" },
  co_separateUrnDesc: { en: "A ceremony with the urn present, before the urn is laid to rest at a later date.", de: "Eine Trauerfeier mit der Urne. Die Beisetzung der Urne erfolgt zu einem späteren Zeitpunkt." },
  co_treeCeremonyQ: { en: "Would you like to be present at the burial at the tree?", de: "Möchten Sie der Beisetzung am Baum persönlich beiwohnen?" },
  co_seaMainQ: { en: "Would you like a land-based ceremony before the sea burial?", de: "Separate Trauerfeier vor der Seebestattung?" },
  co_seaMainDesc: { en: "A land-based service allows more guests to attend than can travel on board.", de: "Bietet die Möglichkeit, dass mehr Personen die Trauerfeier begleiten können. Findet z. B. auf dem örtlichen Friedhof statt." },
  co_seaShip: { en: "On the vessel", de: "Begleitete Seebestattung an Bord" },
  co_seaShipDesc: { en: "Family members may accompany the urn on board. Depending on the vessel, between 10 and 50 guests can attend.", de: "Wird die Urne von Angehörigen begleitet oder erfolgt die Beisetzung still? Je nach Schiff können 10–50 Personen die Bestattung begleiten." },
  co_accompanied: { en: "Accompanied", de: "Begleitet" },
  co_unaccompanied: { en: "Unaccompanied", de: "Unbegleitet" },
  co_choosePrev: { en: "Please select a place of burial in the previous step to see ceremony options.", de: "Bitte wählen Sie zuerst einen Bestattungsort, um die Optionen zu sehen." },

  // MainCeremony
  mc_title: { en: "Personalising the ceremony", de: "Gestaltung der Trauerfeier" },
  mc_subtitle: { en: "Here you can shape every aspect of the ceremony. Every choice is optional — share as much or as little as you wish, and we will guide you from there.", de: "Hier können Sie jeden Aspekt der Trauerfeier nach Ihren Wünschen gestalten. Alle Angaben sind freiwillig — teilen Sie mit, was Ihnen wichtig ist." },
  mc_place: { en: "Location of the ceremony", de: "Ort der Feier" },
  mc_placeDesc: {
    en: "Where would you like the ceremony to take place? Many families choose the cemetery chapel; others prefer a more personal or familiar venue.",
    de: "Wählen Sie, wo die Trauerfeier stattfinden soll. Viele Familien wählen die Friedhofskapelle — andere bevorzugen einen persönlicheren Ort.",
  },
  mc_atCemetery: { en: "At the cemetery", de: "Auf dem Friedhof" },
  mc_atCemeteryDesc: { en: "In the cemetery chapel or the onsite funeral hall. Most cemeteries have a dedicated space available.", de: "In der Friedhofskapelle oder der Trauerhalle auf dem Friedhof. Die meisten Friedhöfe stellen hierfür eigene Räumlichkeiten zur Verfügung." },
  mc_elsewhere: { en: "Another meaningful location", de: "An einem anderen Ort" },
  mc_elsewhereDesc: { en: "A place of your choice — a private garden, a forest, or a community hall.", de: "Die Trauerfeier kann auch außerhalb des Friedhofs stattfinden – z. B. in einem Vereinsraum, in der freien Natur oder an einem persönlich bedeutsamen Ort." },
  mc_whereExactly: { en: "Specific location", de: "Genauer Ort" },
  mc_whereExactlyPh: { en: "e.g. Village chapel, family garden", de: "z. B. Vereinsheim, Familiengarten" },
  mc_finalGoodbye: { en: "Farewell rituals during the ceremony", de: "Abschiedsrituale während der Feier" },
  mc_finalGoodbyeDesc: { en: "A shared gesture can help guests feel part of the farewell. Select one of the suggestions or describe your own.", de: "Ein gemeinsames Ritual gibt den Trauergästen die Möglichkeit, aktiv Abschied zu nehmen. Wählen Sie einen Vorschlag oder beschreiben Sie eine eigene Idee." },
  mc_fg_balloons: { en: "Releasing balloons", de: "Luftballons steigen lassen" },
  mc_fg_candle: { en: "Each guest lights a candle", de: "Jeder Gast entzündet eine Kerze" },
  mc_moreIdeas: { en: "Other ideas", de: "Weitere Ideen" },
  mc_moreIdeasDesc: { en: "Describe any other personal ideas for the ceremony.", de: "Beschreiben Sie weitere persönliche Ideen für die Feier." },
  mc_ownIdeas: { en: "Your own ideas", de: "Eigene Ideen" },
  mc_ownIdeasPh: { en: "Add any further wishes for the rituals…", de: "Weitere Wünsche zu den Ritualen…" },
  mc_orOwn: { en: "Your own ideas", de: "Eigene Ideen beschreiben" },
  mc_orOwnPh: { en: "Describe a ritual...", de: "Eigene Idee..." },
  mc_speech: { en: "Speaker", de: "Redner" },
  mc_speechDesc: {
    en: "The speaker leads and personalises the service. A funeral celebrant will meet with the family in advance to create a unique, personal tribute.",
    de: "Der Redner leitet und gestaltet die Trauerfeier. Ein freier Trauerredner trifft sich im Vorfeld mit der Familie, um eine individuelle Abschiedsrede vorzubereiten.",
  },
  mc_cleric: { en: "Clergy / Religious speaker", de: "Geistlicher / Religiöser Redner" },
  mc_freeSpeaker: { en: "Funeral celebrant", de: "Freier Redner" },
  mc_relative: { en: "Family member or friend", de: "Angehöriger oder Freund" },
  mc_music: { en: "Music", de: "Musik" },
  mc_musicDesc: {
    en: "Music can bring great comfort during a service. You may choose recorded music, organ, live performance, or no music at all.",
    de: "Musik begleitet und trägt eine Trauerfeier. Sie können Musikanlage, Orgel, Live-Musik oder keine Musik wählen.",
  },
  mc_playback: { en: "Recorded music", de: "Musikanlage" },
  mc_organ: { en: "Organ", de: "Orgel" },
  mc_live: { en: "Live musicians", de: "Live-Musik" },
  mc_noMusic: { en: "No music", de: "Keine Musik" },
  mc_songWishes: { en: "Music wishes", de: "Musikwünsche" },
  mc_songWishesHint: { en: "Optional — pieces that were meaningful to them, or that feel right for the occasion.", de: "Optional — Musikstücke, die der verstorbenen Person wichtig waren, oder die zur Trauerfeier passen." },
  mc_songWishesPh: { en: "e.g. Bach Air, or favorite songs", de: "z. B. Bach Air, Lieblingslieder" },
  mc_decoration: { en: "Floral & decor style", de: "Dekoration" },
  mc_decoNormal: { en: "Traditional", de: "Klassisch" },
  mc_decoNormalDesc: { en: "A warm, dignified atmosphere with seasonal flowers, candles, and greenery.", de: "Eine stimmungsvolle, würdevolle Gestaltung mit Blumen, Kerzen und Grünpflanzen." },
  mc_decoSimple: { en: "Minimalist", de: "Schlicht" },
  mc_decoSimpleDesc: { en: "A few quiet, considered accents — restrained and elegant.", de: "Zurückhaltend und fein — wenige, bewusst gewählte Akzente ohne Überladung." },
  mc_decoNone: { en: "None", de: "Keine" },
  mc_decoNoneDesc: { en: "No decoration — the space speaks for itself. Often chosen when the focus is entirely on the farewell.", de: "Keine Dekoration — der Raum wirkt für sich. Oft gewählt, wenn der Abschied im Mittelpunkt steht." },
  mc_decoNotes: { en: "Special requests for decoration?", de: "Besondere Wünsche zur Dekoration?" },
  mc_decoNotesHint: { en: "Optional — colors, themes, or photographs.", de: "Optional — Gestaltung, Farben, Sonstiges." },
  mc_decoNotesPh: { en: "e.g. White lilies, soft lighting", de: "z. B. dunkle Holzsäulen, weiße Tücher, herbstlich" },
  mc_flowers: { en: "Floral arrangements", de: "Blumenschmuck" },
  mc_flowersUrnDesc: { en: "Floral arrangements chosen specifically to complement an urn service.", de: "Blumengestecke, die speziell für eine Urnenfeier gestaltet werden." },
  mc_flowersCoffinDesc: { en: "Floral arrangements chosen specifically to complement a coffin service.", de: "Blumengestecke, die speziell für eine Sargfeier gestaltet werden." },
  mc_separateTip: { en: "Note: For ceremonies held separately from the burial, simpler floral arrangements are often preferred.", de: "Hinweis: Bei Trauerfeier und Beisetzung an verschiedenen Tagen wird häufig ein einfacherer Blumenschmuck gewählt." },
  mc_fl_wreath: { en: "Coffin wreath", de: "Sargkranz" },
  mc_fl_wreathDesc: { en: "A classic floral wreath for the coffin · approx. €120–€280", de: "Großer Kranz auf dem Sarg · ca. €120–€280" },
  mc_fl_bouquet: { en: "Coffin spray", de: "Sarggesteck" },
  mc_fl_bouquetDesc: { en: "A refined arrangement placed over the coffin · approx. €80–€220", de: "Elegantes Gesteck auf dem Sarg · ca. €80–€220" },
  mc_fl_single: { en: "Single flowers", de: "Einzelblumen" },
  mc_fl_singleDesc: { en: "Stems for guests to place during the service · approx. €40–€120", de: "Einzelne Stiele für die Gäste · ca. €40–€120" },
  mc_fl_none: { en: "No flowers", de: "Keine Blumen" },
  mc_fl_noneDesc: { en: "A modest farewell—perhaps with a request for charitable donations.", de: "Schlichter Abschied – oft wird stattdessen um Spenden gebeten." },
  mc_flU_wreath: { en: "Urn wreath", de: "Urnenkranz" },
  mc_flU_wreathDesc: { en: "A delicate wreath surrounding the urn · approx. €60–€140", de: "Zarter Kranz, der die Urne umschließt · ca. €60–€140" },
  mc_flU_bouquet: { en: "Urn bouquet", de: "Urnengesteck" },
  mc_flU_bouquetDesc: { en: "A small, elegant arrangement beside the urn · approx. €40–€120", de: "Kleiner Strauß neben der Urne · ca. €40–€120" },
  mc_flU_single: { en: "Individual stems", de: "Einzelne Stiele" },
  mc_flU_singleDesc: { en: "Stems for guests · approx. €30–€90", de: "Einzelne Stiele für die Gäste · ca. €30–€90" },
  mc_flU_none: { en: "No flowers", de: "Keine Blumen" },
  mc_flU_noneDesc: { en: "A simple and quiet moment.", de: "Ein schlichter, ungeschmückter Moment." },
  mc_personal: { en: "Personal touches", de: "Persönliche Details" },
  mc_personalDesc: {
    en: "Small personal details can make the ceremony feel unique. A photograph, a favourite object, or a few words from family can bring great meaning.",
    de: "Persönliche Details geben der Trauerfeier einen individuellen Charakter — ein Foto, ein vertrautes Objekt oder persönliche Worte der Angehörigen.",
  },
  mc_publicViewing: { en: "Public viewing before the ceremony?", de: "Öffentliche Aufbahrung vor der Feier?" },
  mc_publicViewingHint: { en: "Guests can visit and say a personal goodbye before the ceremony begins — usually in the chapel or funeral hall.", de: "Ermöglicht es Gästen, sich vor der Trauerfeier persönlich zu verabschieden — in der Regel in der Kapelle oder Trauerhalle." },
  mc_picture: { en: "Display a photograph?", de: "Ein Bild des Verstorbenen aufstellen?" },
  mc_personalItems: { en: "Meaningful personal items?", de: "Persönliche Gegenstände?" },
  mc_whichItems: { en: "Which items?", de: "Welche Gegenstände?" },
  mc_whichItemsPh: { en: "e.g. A favorite book, a hat, a memento...", de: "z. B. die eigenen Wanderstiefel, ein Hut, ein Andenken..." },
  mc_rituals: { en: "Personal touches & rituals", de: "Persönliche Details & Rituale" },
  mc_ritualsDesc: { en: "Small gestures that make the ceremony unique — such as lighting candles together, a shared song, or releasing balloons.", de: "Kleine Gesten, die der Feier einen persönlichen Charakter geben — z. B. gemeinsames Kerzenanzünden, ein Lieblingslied oder Ballons steigen lassen." },
  mc_memorialCards: { en: "Memorial cards for guests?", de: "Gedenkbildchen für die Gäste?" },
  mc_memorialCardsHint: { en: "Small keepsake cards with a photograph and a short verse. Guests can take one home as a lasting personal memory.", de: "Kleine Gedenkbildchen mit einem Foto und einem kurzen Text. Die Gäste nehmen diese als persönliche Erinnerung mit nach Hause." },
  mc_describeRituals: { en: "Describe any other personal ideas", de: "Weitere Ideen beschreiben" },
  mc_describeRitualsPh: { en: "Tell us about your ideas...", de: "Ihre Beschreibung..." },
  mc_decoExamples: { en: "Example arrangements (for inspiration)", de: "Beispielgestaltungen (zur Inspiration)" },
  mc_decoExamplesDesc: { en: "These examples are shown for inspiration only — describe your own wishes below.", de: "Diese Beispiele dienen nur zur Inspiration — beschreiben Sie Ihre Wünsche unten." },
  mc_flowerStyle: { en: "Style", de: "Stil" },
  mc_flowerStyleNormal: { en: "Normal", de: "Klassisch" },
  mc_flowerStyleSimple: { en: "Simple", de: "Schlicht" },
  mc_flowerTypeLabel: { en: "Type (multiple choices allowed)", de: "Art (Mehrfachauswahl möglich)" },
  mc_memorialCardsCount: { en: "How many cards do you need?", de: "Wie viele Karten werden benötigt?" },
  mc_memorialCardsCountPh: { en: "e.g. 50", de: "z. B. 50" },
  mc_speakerWishes: { en: "Specific wishes for the speaker", de: "Konkrete Wünsche an den Redner" },
  mc_speakerWishesHint: { en: "Optional — themes, anecdotes, tone, texts, or persons to acknowledge.", de: "Optional — Themen, Anekdoten, Tonalität, Texte oder Personen, die erwähnt werden sollen." },
  mc_speakerWishesPh: { en: "e.g. mention career, favorite quote, family", de: "z. B. Beruf erwähnen, Lieblingszitat, Familie" },
  mc_viewExamples: { en: "View example arrangements", de: "Beispielgestaltungen ansehen" },
  mc_decoExamplesTitle: { en: "Example decorations", de: "Beispiele für Dekoration" },
  mc_decoExamplesHint: { en: "For inspiration only — no selection needed.", de: "Nur zur Inspiration — keine Auswahl nötig." },
  mc_fl_wreathQ: { en: "Would you like a coffin wreath?", de: "Möchten Sie einen Sargkranz?" },
  mc_fl_bouquetQ: { en: "Would you like a coffin spray?", de: "Möchten Sie ein Sarggesteck?" },
  mc_fl_singleQ: { en: "Would you like single flowers for guests?", de: "Möchten Sie Einzelblumen für die Gäste?" },
  mc_floristHint: {
    en: "Usually your florist will be your competent point of contact. You may, of course, also order the flowers through us.",
    de: "In der Regel steht Ihnen der Florist als kompetenter Ansprechpartner zur Verfügung. Gerne können Sie die Blumen aber auch über uns bestellen.",
  },
  mc_fwDecoHint: {
    en: "Decoration at the FriedWald is only possible to a limited extent. We provide an urn stand, and you are welcome to additionally display a photograph of the deceased.",
    de: "Dekoration im Friedwald ist nur eingeschränkt möglich. Wir stellen einen Urnenständer und gerne kann noch ein Bild des Verstorbenen aufgestellt werden.",
  },
  mc_fwFlowerHint: {
    en: "Flowers may not be left in the FriedWald. Still, for the ceremony you may order e.g. an urn wreath, which must then be taken back out of the FriedWald afterwards.",
    de: "Im Friedwald dürfen keine Blumen abgelegt werden. Dennoch kann zur Trauerfeier z. B. ein Urnenkranz bestellt werden, welcher später aus dem Friedwald wieder mitgenommen werden muss.",
  },
  mc_urnSection: { en: "Flowers", de: "Blumen" },
  mc_urnWreathLabel: { en: "Urn flowers", de: "Urnenschmuck" },
  mc_urnArrangementLabel: { en: "General floral arrangements", de: "Genereller Blumenschmuck" },
  urnWreath_classic: { en: "Classic urn wreath", de: "Klassischer Urnenkranz" },
  urnWreath_classic_d: { en: "Round, full bloom — timeless and dignified.", de: "Runder, voller Kranz — zeitlos und würdevoll." },
  urnWreath_white: { en: "White roses urn wreath", de: "Urnenkranz aus weißen Rosen" },
  urnWreath_white_d: { en: "Soft white roses with greenery.", de: "Zarte weiße Rosen mit Grün." },
  urnWreath_seasonal: { en: "Seasonal urn wreath", de: "Saisonaler Urnenkranz" },
  urnWreath_seasonal_d: { en: "Composed from seasonal blooms.", de: "Aus saisonalen Blüten gefertigt." },
  urnWreath_smallArr: { en: "Small urn arrangement", de: "Kleines Urnengesteck" },
  urnWreath_smallArr_d: { en: "A delicate piece beside the urn.", de: "Ein zartes Gesteck neben der Urne." },
  urnWreath_classicArr: { en: "Classic urn arrangement", de: "Klassisches Urnengesteck" },
  urnWreath_classicArr_d: { en: "A traditional floral arrangement.", de: "Ein traditionelles Blumengesteck." },
  urnWreath_modernArr: { en: "Modern urn arrangement", de: "Modernes Urnengesteck" },
  urnWreath_modernArr_d: { en: "Contemporary lines and forms.", de: "Moderne Linien und Formen." },
  genFlower_heart: { en: "Heart-shaped arrangement", de: "Gesteck in Herzform" },
  genFlower_heart_d: { en: "A heart of fresh blooms.", de: "Ein Herz aus frischen Blüten." },
  genFlower_hangingWreath: { en: "Hanging wreath", de: "Kranz zum Hängen" },
  genFlower_hangingWreath_d: { en: "Wreath to hang at the ceremony.", de: "Kranz zum Aufhängen bei der Feier." },
  genFlower_planter: { en: "Planter bowl", de: "Pflanzschale" },
  genFlower_planter_d: { en: "Planted bowl with seasonal flowers.", de: "Bepflanzte Schale mit saisonalen Blumen." },
  genFlower_cross: { en: "Floral cross", de: "Blumenkreuz" },
  genFlower_cross_d: { en: "A cross composed of flowers.", de: "Ein Kreuz aus Blumen." },
  urnFlowerCatalogue: { en: "Urn flower catalogue", de: "Urnenschmuck-Katalog" },
  mc_coffinWreathLabel: { en: "Coffin flowers", de: "Sargschmuck" },
  mc_coffinBouquetLabel: { en: "Coffin bouquets", de: "Sargbuketts" },
  coffinWreath_classic: { en: "Classic coffin wreath", de: "Klassischer Sargkranz" },
  coffinWreath_classic_d: { en: "Full, round wreath — timeless and dignified.", de: "Voller, runder Kranz — zeitlos und würdevoll." },
  coffinWreath_white: { en: "White roses coffin wreath", de: "Sargkranz aus weißen Rosen" },
  coffinWreath_white_d: { en: "Soft white roses with greenery.", de: "Zarte weiße Rosen mit Grün." },
  coffinWreath_seasonal: { en: "Seasonal coffin wreath", de: "Saisonaler Sargkranz" },
  coffinWreath_seasonal_d: { en: "Composed from seasonal blooms.", de: "Aus saisonalen Blüten gefertigt." },
  coffinWreath_lush: { en: "Lush coffin cover", de: "Üppige Sargdecke" },
  coffinWreath_lush_d: { en: "Generous cover spanning the coffin lid.", de: "Großzügiger Schmuck über dem Sargdeckel." },
  coffinBouquet_classic: { en: "Classic coffin bouquet", de: "Klassisches Sargbukett" },
  coffinBouquet_classic_d: { en: "Traditional bouquet placed on the coffin.", de: "Traditionelles Bukett auf dem Sarg." },
  coffinBouquet_white: { en: "White roses bouquet", de: "Bukett aus weißen Rosen" },
  coffinBouquet_white_d: { en: "Elegant white roses with greenery.", de: "Elegante weiße Rosen mit Grün." },
  coffinBouquet_seasonal: { en: "Seasonal bouquet", de: "Saisonales Bukett" },
  coffinBouquet_seasonal_d: { en: "Bouquet of seasonal blooms.", de: "Bukett aus saisonalen Blüten." },
  coffinBouquet_modern: { en: "Modern bouquet", de: "Modernes Bukett" },
  coffinBouquet_modern_d: { en: "Contemporary lines and forms.", de: "Moderne Linien und Formen." },

  // SubCeremony
  sc_atGrave: { en: "Graveside service", de: "Zeremonie am Grab" },
  sc_atTree: { en: "Ceremony at the tree", de: "Zeremonie am Baum" },
  sc_atShip: { en: "Ceremony on board", de: "Zeremonie auf dem Schiff" },
  sc_subtitle: { en: "A quieter, more intimate gathering at the place of burial. A speaker, music, and a few personal touches can be arranged.", de: "Ein ruhiger, persönlicher Moment direkt an der Ruhestätte. Ein Redner, Musik oder ein kleines Symbol des Abschieds können den Moment gestalten." },
  sc_speaker: { en: "Speaker", de: "Redner" },
  sc_cleric: { en: "Clergy", de: "Geistlicher" },
  sc_captain: { en: "Captain", de: "Kapitän" },
  sc_noSpeaker: { en: "No speaker", de: "Kein Redner" },
  sc_picture: { en: "Portrait", de: "Bild" },
  sc_pictureQ: { en: "Display a photograph?", de: "Soll ein Bild des Verstorbenen aufgestellt werden?" },
  sc_flowersUrn: { en: "Flowers for the urn", de: "Blumen an der Urne" },
  sc_playback: { en: "Music playback", de: "Musikanlage" },
  sc_live: { en: "Live music", de: "Live-Musik" },
  sc_none: { en: "None", de: "Keine" },

  // Sub-ceremony — sea additions
  sc_seaFlowers: { en: "Flowers for the urn", de: "Blumen an der Urne" },
  sc_seaFl_wreath: { en: "Urn wreath (Urnenkranz)", de: "Urnenkranz" },
  sc_seaFl_bouquet: { en: "Urn arrangement (Urnengesteck)", de: "Urnengesteck" },
  sc_seaFl_none: { en: "None", de: "Keine" },
  sc_seaCatering: { en: "Catering on board", de: "Bewirtung an Bord" },
  sc_seaCateringQ: { en: "Would you like catering on board?", de: "Wünschen Sie eine Bewirtung an Bord?" },
  sc_seaCat_drinks: { en: "Drinks", de: "Getränke" },
  sc_seaCat_cake: { en: "Cake", de: "Kuchen" },
  sc_seaCat_savoury: { en: "Hearty food", de: "Herzhaftes Essen" },
  sc_seaRituals: { en: "Rituals", de: "Rituale" },
  sc_seaPetalsQ: { en: "Flower petals to scatter on the water?", de: "Blütenblätter zum Nachwerfen?" },
  ft_seaMovedHint: { en: "You will choose the sea region in the resting place step.", de: "Das Meeresgebiet wählen Sie im Schritt Grabstätte." },
  grave_seaWhichSea: { en: "Which sea?", de: "Welches Meer?" },
  grave_seaDeparturePort: { en: "Departure port", de: "Abfahrtshafen" },
  grave_seaDeparturePortPh: { en: "e.g. Sylt, Helgoland, Italy", de: "z. B. Sylt, Helgoland, Italien" },

  // CoffinUrnStep
  coffinUrnTitle: { en: "Coffin & Urn", de: "Sarg & Urne" },
  coffinUrnSubtitle: {
    en: "Choose with care — the coffin or urn that will accompany your loved one on their final journey.",
    de: "Nehmen Sie sich die Zeit für diese Entscheidung — für einen würdevollen letzten Weg.",
  },
  coffinSection: { en: "The Coffin", de: "Der Sarg" },
  coffinSectionDesc: {
    en: "The coffin is an important and personal choice. Our team can advise you during your consultation if you would like guidance.",
    de: "Die Wahl des Sarges ist eine persönliche Entscheidung. Unser Team berät Sie gerne ausführlich in einem persönlichen Gespräch.",
  },
  coffin_cremationStandardHint: {
    en: "Since you have not chosen a farewell at the open or closed coffin, we suggest a standard cremation coffin.",
    de: "Da Sie keinen Abschied am offenen oder geschlossenen Sarg gewählt haben, empfehlen wir einen Standard-Kremationssarg.",
  },
  urnSection: { en: "The Urn", de: "Die Urne" },
  urnSectionDescCremation: {
    en: "The urn in which the ashes will be kept with care.",
    de: "Die Urne für die letzte Ruhe und das Gedenken.",
  },
  selection: { en: "Your choice", de: "Ihre Auswahl" },
  fromCatalogue: { en: "From our collection", de: "Aus dem Katalog" },
  fromCatalogueDesc: { en: "Choose from our curated selection.", de: "Wählen Sie aus unserem sorgfältig zusammengestellten Sortiment." },
  other: { en: "Something else", de: "Individuelle Wünsche" },
  otherCoffinDesc: { en: "If you have a specific coffin in mind.", de: "Wenn Sie eine bestimmte Vorstellung haben." },
  otherUrnDesc: { en: "If you have a specific urn in mind.", de: "Wenn Sie eine bestimmte Vorstellung haben." },
  unsure: { en: "Decide later", de: "Noch unsicher" },
  unsureDesc: { en: "We will be happy to advise you on this during your personal consultation.", de: "Wir beraten Sie gerne persönlich dazu." },
  describeCoffin: { en: "Describe the coffin", de: "Sarg beschreiben" },
  describeCoffinPh: { en: "e.g. Handmade oak, specific color...", de: "z. B. Handgefertigte Eiche, bestimmte Farbe..." },
  describeUrn: { en: "Describe the urn", de: "Urne beschreiben" },
  describeUrnPh: { en: "e.g. Ceramic, custom design...", de: "z. B. Keramik, eigenes Design..." },
  clothing: { en: "Final clothing", de: "Kleidung" },
  clothing_hint: {
    en: "The clothing in which your loved one is dressed for their final journey. Personal clothing can be brought to us at any time.",
    de: "Die Kleidung, in der die verstorbene Person auf dem letzten Weg begleitet wird. Persönliche Kleidung kann jederzeit bei uns abgegeben werden.",
  },
  clothingOwn: { en: "Personal clothing", de: "Eigene Kleidung" },
  clothingOwnDesc: { en: "A favourite outfit brought from home — a meaningful and personal choice.", de: "Ein Lieblingsoutfit von zu Hause — eine vertraute und persönliche Entscheidung." },
  clothingShroud: { en: "Burial gown", de: "Sterbehemd" },
  clothingShroudDesc: { en: "A simple, dignified white burial gown — a traditional and timeless option.", de: "Ein schlichtes, würdevolles weißes Sterbehemd — eine traditionelle und zeitlose Wahl." },
  clothingCurrent: { en: "Clothing at time of passing", de: "Kleidung beibehalten" },
  clothingCurrentDesc: { en: "Your loved one remains in the clothing they were wearing when they passed.", de: "Die verstorbene Person bleibt in der Kleidung, die sie zum Zeitpunkt des Versterbens trug." },
  pillows: { en: "Pillow & blanket", de: "Kissen & Decke" },
  pillows_hint: {
    en: "The soft lining inside the coffin. Choose from our catalogue, bring something from home, or none at all.",
    de: "Die Innenausstattung des Sarges. Wählen Sie aus dem Katalog, bringen Sie etwas Eigenes mit oder verzichten Sie ganz darauf.",
  },
  pillowCatalogue: { en: "From catalogue", de: "Aus dem Katalog" },
  pillowCatalogueDesc: { en: "Choose a pillow & blanket set from our curated selection.", de: "Wählen Sie ein Kissen- und Deckenset aus unserer Auswahl." },
  pillowOwn: { en: "Personal bedding from home", de: "Eigene Kissen/Decke" },
  pillowOwnDesc: { en: "A familiar pillow or blanket that holds personal significance.", de: "Ein vertrautes Kissen oder eine Decke von zu Hause mit persönlicher Bedeutung." },
  pillowNone: { en: "None", de: "Keine" },
  pillowNoneDesc: { en: "No additional bedding — a simple and unadorned farewell.", de: "Keine zusätzliche Innenausstattung — ein schlichter, ungeschmückter Abschied." },
  pillowCatalogueTitle: { en: "Pillow & blanket selection", de: "Kissen & Decke — Auswahl" },
  pillow_satin_white: { en: "Satin — White", de: "Satin — Weiß" },
  pillow_satin_white_d: { en: "Classic white satin set with subtle sheen.", de: "Klassisches weißes Satin-Set mit dezentem Glanz." },
  pillow_linen_natural: { en: "Linen — Natural", de: "Leinen — Natur" },
  pillow_linen_natural_d: { en: "Soft natural linen in warm cream tones.", de: "Weiches Naturleinen in warmen Cremetönen." },
  pillow_silk_cream: { en: "Silk — Cream", de: "Seide — Creme" },
  pillow_silk_cream_d: { en: "Refined cream silk with a smooth finish.", de: "Edle creme­farbene Seide mit glatter Oberfläche." },
  graveGoods: { en: "Personal items to accompany them?", de: "Sargbeigaben?" },
  graveGoodsHint: { en: "Small personal items that may be placed with your loved one — a letter, a photograph, a piece of jewellery, or any meaningful memento.", de: "Kleine persönliche Gegenstände können mit der verstorbenen Person bestattet werden — ein Brief, ein Foto, ein Schmuckstück oder ein anderes bedeutungsvolles Andenken." },
  graveGoodsLabel: { en: "Which items?", de: "Welche Gegenstände sollen mitgegeben werden?" },
  graveGoodsPh: { en: "e.g. A handwritten letter, a photograph, a piece of jewellery...", de: "z. B. ein handgeschriebener Brief, ein Foto, ein Schmuckstück..." },

  // Coffin catalogue
  coffin_oak_classic: { en: "Classic Oak", de: "Eiche — Klassik" },
  coffin_oak_classic_d: { en: "Solid oak with a warm, satin finish.", de: "Massives Eichenholz mit warmem Satin-Finish." },
  coffin_pine_natural: { en: "Natural Pine", de: "Kiefer — Natur" },
  coffin_pine_natural_d: { en: "Light pine with a soft, untreated appearance.", de: "Helle Kiefer mit naturbelassener Oberfläche." },
  coffin_walnut_dark: { en: "Dark Walnut", de: "Nussbaum — Dunkel" },
  coffin_walnut_dark_d: { en: "Rich, dark walnut for a timeless, stately look.", de: "Edler, dunkler Nussbaum für ein würdevolles Erscheinungsbild." },
  coffin_willow_woven: { en: "Woven Willow", de: "Geflochtene Weide" },
  coffin_willow_woven_d: { en: "Hand-woven willow—natural and fully biodegradable.", de: "Handgeflochten – natürlich und biologisch abbaubar." },
  coffin_white_simple: { en: "Simple White", de: "Schlicht Weiß" },
  coffin_white_simple_d: { en: "A bright, modern coffin with clean, elegant lines.", de: "Ein heller Sarg mit klaren, modernen Linien." },
  coffin_cardboard_eco: { en: "Eco-Friendly Cardboard", de: "Öko-Karton" },
  coffin_cardboard_eco_d: { en: "Sustainable and fully biodegradable.", de: "Nachhaltig und vollständig biologisch abbaubar." },
  coffin_cremation_standard: { en: "Standard cremation coffin", de: "Kremationssarg — Standard" },
  coffin_cremation_standard_d: { en: "A simple, untreated wooden coffin designed for cremation.", de: "Ein schlichter, unbehandelter Holzsarg, speziell für die Kremation." },
  coffin_cremation_simple: { en: "Simple cremation coffin", de: "Kremationssarg — Schlicht" },
  coffin_cremation_simple_d: { en: "A minimalist coffin made from light, untreated wood.", de: "Ein minimalistischer Sarg aus leichtem, unbehandeltem Holz." },
  coffin_cremation_eco: { en: "Eco cremation coffin", de: "Kremationssarg — Öko" },
  coffin_cremation_eco_d: { en: "An especially sustainable coffin made from recycled material.", de: "Ein besonders nachhaltiger Sarg aus recyceltem Material." },
  coffin_cremationSectionTitle: { en: "Cremation coffins", de: "Kremationssärge" },
  coffin_cremationSectionHint: {
    en: "These coffins are designed specifically for cremation. You can also choose any other coffin from our catalogue below.",
    de: "Diese Särge sind speziell für die Feuerbestattung vorgesehen. Sie können selbstverständlich auch einen anderen Sarg aus unserem Katalog wählen.",
  },
  coffin_regularSectionTitle: { en: "All coffins", de: "Alle Särge" },

  // Urn catalogue
  urn_ceramic_white: { en: "White Ceramic", de: "Keramik — Weiß" },
  urn_ceramic_white_d: { en: "Smooth ceramic with a soft, matte glaze.", de: "Glatte Keramik mit sanfter Glasur." },
  urn_wooden_oak: { en: "Natural Oak", de: "Holz — Eiche" },
  urn_wooden_oak_d: { en: "Hand-turned oak with a natural wood finish.", de: "Handgedrechselte Eiche mit natürlicher Maserung." },
  urn_bronze_classic: { en: "Classic Bronze", de: "Bronze — Klassik" },
  urn_bronze_classic_d: { en: "Solid cast bronze with a timeless patina.", de: "Massive Bronze mit zeitloser Patina." },
  urn_bio_natural: { en: "Bio-Natural", de: "Bio-Urne" },
  urn_bio_natural_d: { en: "Plant-based vessel that returns to the earth.", de: "Pflanzenbasiert, löst sich in der Erde vollständig auf." },
  urn_stone_grey: { en: "Grey Stone", de: "Stein — Grau" },
  urn_stone_grey_d: { en: "Carved natural stone with a matte finish.", de: "Naturstein mit matt geschliffener Oberfläche." },
  urn_glass_modern: { en: "Modern Glass", de: "Glas — Modern" },
  urn_glass_modern_d: { en: "Hand-blown glass with subtle colors.", de: "Mundgeblasenes Glas mit feinen Farbnuancen." },

  // Grave step
  grave_title: { en: "The resting place", de: "Die Grabstätte" },
  grave_subtitle: { en: "We will guide you through the options for your loved one's resting place.", de: "Wir helfen Ihnen, die passende Ruhestätte zu wählen." },
  graveTypeSection: { en: "Type of grave", de: "Grabart" },
  graveTypeSectionDesc: {
    en: "Select whether an existing grave will be used, or whether a new resting place is to be arranged.",
    de: "Wählen Sie, ob ein vorhandenes Grab genutzt werden soll oder ob eine neue Grabstätte vorzubereiten ist.",
  },
  graveSingle: { en: "Single grave", de: "Einzelgrab" },
  graveSingleDesc: { en: "An individual plot for one person, with space for a personal headstone and planting.", de: "Ein Grabplatz für eine Person — individuell gestaltbar mit Grabstein und Bepflanzung." },
  graveFamily: { en: "Family grave", de: "Familiengrab" },
  graveFamilyDesc: { en: "A larger shared plot where multiple family members can be buried together over time.", de: "Ein Grabfeld für mehrere Familienmitglieder — ein gemeinsamer Ort des Gedenkens für die Familie." },
  graveTree: { en: "Tree burial", de: "Baumbestattung" },
  graveTreeDesc: { en: "The urn is placed at the roots of a tree. The tree itself serves as the memorial — no headstone required.", de: "Die Urne wird am Fuß eines Baumes beigesetzt. Der Baum selbst ist das Denkmal — kein Grabstein notwendig." },
  graveAnonymous: { en: "Anonymous burial", de: "Anonymes Grab" },
  graveAnonymousDesc: { en: "Buried without an individual marker or headstone. A quiet, private option — sometimes a personal wish of the deceased.", de: "Beisetzung ohne Namensschild oder Grabstein. Eine stille, zurückhaltende Form — häufig ein persönlicher Wunsch des Verstorbenen." },
  grave_existingQ: { en: "Is there an existing grave to use?", de: "Soll in einem bereits bestehenden Grab bestattet werden?" },
  grave_yesExisting: { en: "Yes, use an existing grave", de: "Ja, es gibt ein bestehendes Grab" },
  grave_noNew: { en: "No, a new grave is needed", de: "Nein, Beisetzung in einem neuen Grab" },
  grave_anonymous: { en: "Anonymous burial", de: "Anonymes Grab" },
  grave_number: { en: "Grave number (if known)", de: "Grabnummer (falls bekannt)" },
  grave_numberHint: { en: "Or the name of the last person buried there.", de: "Oder Name der zuletzt dort bestatteten Person." },
  grave_numberPh: { en: "e.g. Section B, Plot 142", de: "z. B. Abteilung B, Grab 142" },
  grave_futureQ: { en: "Should others be buried here in the future?", de: "Sollen künftig weitere Personen dort bestattet werden?" },
  grave_typeLabel: { en: "Grave style", de: "Grabart" },
  grave_typeDesc: {
    en: "The style of grave determines how it is maintained and how it may be personalised. Our team can advise you on local options and costs.",
    de: "Die Grabart bestimmt, wie die Grabstätte gepflegt wird und welche Gestaltungsmöglichkeiten bestehen. Wir informieren Sie gerne über die örtlichen Optionen und Kosten.",
  },
  grave_classical: { en: "Traditional plot", de: "Klassisches Grab" },
  grave_classicalDesc: { en: "A family-tended plot with a personal headstone. Can be decorated with flowers and planting throughout the year.", de: "Ein individuell gestaltbares Grab mit Grabstein, gepflegt von den Angehörigen. Ganzjährig bepflanzbar und dekorierbar." },
  grave_lawn: { en: "Lawn grave", de: "Rasengrab" },
  grave_lawnDesc: { en: "A simple plot with a small name marker in a maintained lawn area. The cemetery cares for the grass — a low-maintenance option.", de: "Ein pflegeleichtes Grab im Rasen mit kleiner Steinplatte. Der Friedhof übernimmt die Rasenpflege." },
  grave_classicalUrn: { en: "Traditional urn plot", de: "Klassisches Urnengrab" },
  grave_classicalUrnDesc: { en: "A marked urn plot with a headstone and space for individual planting and decoration.", de: "Ein Urnengrab mit Grabstein und Bepflanzungsmöglichkeit — individuell gestaltbar." },
  grave_lawnUrn: { en: "Urn lawn grave", de: "Urnen-Rasengrab" },
  grave_lawnUrnDesc: { en: "An urn plot in a maintained lawn area, marked with a name plate. Low-maintenance and dignified.", de: "Urnenplatz im Rasen mit Namensplatte. Die Rasenpflege übernimmt der Friedhof — pflegeleicht und würdevoll." },
  grave_treeCem: { en: "Cemetery tree burial", de: "Baumgrab (Friedhof)" },
  grave_treeCemDesc: { en: "The urn is placed at the roots of a tree on the cemetery grounds — a natural, peaceful alternative.", de: "Die Urne wird am Fuße eines Baumes auf dem Friedhof beigesetzt — eine naturnahe und würdevolle Alternative." },
  grave_urnWall: { en: "Urn wall (Columbarium)", de: "Urnenwand (Kolumbarium)" },
  grave_urnWallDesc: { en: "The urn is placed in a niche in a memorial wall. A sheltered, low-maintenance, and dignified option.", de: "Die Urne wird in einer Nische einer Urnenwand oder Stele beigesetzt — geschützt, wartungsarm und würdevoll." },
  grave_gardened: { en: "Managed memorial field", de: "Gärtnerbetreutes Grabfeld" },
  grave_gardenedDesc: { en: "A shared, professionally maintained memorial field — a peaceful, low-maintenance option for families.", de: "Ein gemeinschaftliches, gärtnerisch gepflegtes Grabfeld — pflegeleicht und atmosphärisch." },
  grave_crossQ: { en: "Include a grave cross?", de: "Wünschen Sie ein Grabkreuz?" },
  grave_crossUrnHint: { en: "Commonly used as a temporary marker.", de: "Oft als vorübergehende Kennzeichnung genutzt." },
  grave_fwReservedQ: { en: "Is a tree already reserved?", de: "Ist bereits ein Baum reserviert?" },
  grave_fwReservedDesc: {
    en: "If a tree has already been selected at the FriedWald, please provide the tree number so we can coordinate the burial directly.",
    de: "Falls bereits ein Baum im FriedWald ausgewählt wurde, geben Sie bitte die Baumnummer an, damit wir die Beisetzung direkt koordinieren können.",
  },
  grave_fwYes: { en: "Yes, reserved", de: "Ja, ist reserviert" },
  grave_fwNo: { en: "No, not yet", de: "Nein, noch nicht" },
  grave_fwTreeNumber: { en: "Tree number or last person buried", de: "Baumnummer oder zuletzt Bestattete*r" },
  grave_fwTreeNumberPh: { en: "e.g. Tree #B-104", de: "z. B. Baum #B-104" },
  grave_fwTypeOf: { en: "Type of placement", de: "Art des Platzes" },
  grave_fwTypeOfDesc: { en: "Choose whether the tree will be reserved exclusively for your family, shared with a partner, or shared with other families.", de: "Wählen Sie, ob der Baum exklusiv für Ihre Familie reserviert ist, mit einem Partner geteilt wird oder ein Gemeinschaftsbaum ist." },
  grave_fw_partner: { en: "Partner tree", de: "Partnerbaum" },
  grave_fw_generation: { en: "Family tree", de: "Familien-/Generationenbaum" },
  grave_fw_shared: { en: "Shared tree", de: "Platz am Gemeinschaftsbaum" },
  grave_fw_base: { en: "Basisplatz (Standard)", de: "Platz am Basisbaum" },
  grave_fwNamePlateQ: { en: "Name plate on the tree?", de: "Namensschild am Baum?" },
  grave_fwNamePlateDesc: {
    en: "A small engraved plate can be attached to the tree as a lasting memorial. FriedWald provides standardised plates; personalised options are also available.",
    de: "Eine kleine gravierte Platte am Baum dient als dauerhaftes Andenken. FriedWald bietet standardisierte Schilder an; individuelle Gestaltungen sind ebenfalls möglich.",
  },
  grave_seaNote: { en: "Sea burials have no fixed grave site. The burial coordinates are documented and provided to the family as a lasting keepsake.", de: "Bei Seebestattungen gibt es keine feste Grabstätte. Die genauen Koordinaten des Beisetzungsortes werden dokumentiert und der Familie als Erinnerung mitgeteilt." },

  // Obituary
  ob_title: { en: "Obituary", de: "Traueranzeige" },
  ob_subtitle: { en: "A formal announcement to inform family and friends and invite those who wish to pay their respects.", de: "Die Traueranzeige informiert Familie, Freunde und Bekannte und lädt sie zum Gedenken ein." },
  ob_example: { en: "A printed announcement in a regional newspaper.", de: "Beispiel: Gedruckte Anzeige in einer Regionalzeitung." },
  ob_before: { en: "Before the service", de: "Vor der Trauerfeier" },
  ob_beforeDesc: {
    en: "An obituary notice published before the ceremony informs the wider community and invites those who wish to attend or pay their respects.",
    de: "Eine Traueranzeige vor der Beisetzung informiert Freunde, Bekannte und die Gemeinschaft und lädt zum Gedenken oder zur Trauerfeier ein.",
  },
  ob_after: { en: "After the service", de: "Nach der Trauerfeier" },
  ob_afterDesc: {
    en: "A notice published after the service offers a moment of thanks and lets those who could not attend know that the ceremony has taken place.",
    de: "Eine Anzeige nach der Trauerfeier ist eine Möglichkeit, sich zu bedanken und denjenigen, die nicht dabei sein konnten, Bescheid zu geben.",
  },
  ob_publishBeforeQ: { en: "Would you like to publish an obituary notice before the ceremony?", de: "Soll eine Traueranzeige vor der Feier veröffentlicht werden?" },
  ob_publishAfterQ: { en: "Would you like to publish a thank-you notice after the service?", de: "Soll eine Danksagung nach der Trauerfeier veröffentlicht werden?" },
  ob_whereLabel: { en: "Where should it be published?", de: "Wo soll die Veröffentlichung erfolgen?" },
  ob_knowsQ: { en: "Do you already know where it should be published?", de: "Wissen Sie bereits, wo veröffentlicht werden soll?" },
  ob_known: { en: "I have a specific paper in mind", de: "Ich weiß bereits wo" },
  ob_local: { en: "Local area", de: "Ort und Umfeld" },
  ob_region: { en: "Wider region", de: "In der Region" },
  ob_papers: { en: "Newspapers", de: "Zeitungen" },
  ob_papersHint: { en: "Separate multiple names with commas.", de: "Mehrere Zeitungen mit Kommas trennen." },
  ob_papersPh: { en: "e.g. Local Times, Herald", de: "z. B. Wochenblatt \"Eppinger Stadtanzeiger\", Tageszeitung \"Heilbronner Stimme\"" },
  ob_includeDateQ: { en: "Should the date of the ceremony be included?", de: "Soll das Datum der Trauerfeier angegeben werden?" },
  sy_includeDateQ: { en: "Should the date of the ceremony be included?", de: "Soll das Datum der Trauerfeier angegeben werden?" },


  // Sympathy
  sy_title: { en: "Sympathy cards", de: "Trauerkarten" },
  sy_subtitle: { en: "A thoughtful way to inform loved ones of the loss, or to express your family's gratitude after the service.", de: "Eine persönliche Karte, um Angehörige zu benachrichtigen oder sich nach der Trauerfeier zu bedanken." },
  sy_example: { en: "A printed card sent to family and friends.", de: "Beispiel: Eine gedruckte Trauerkarte." },
  sy_before: { en: "Before the service", de: "Vor der Trauerfeier" },
  sy_beforeDesc: {
    en: "Cards sent before the ceremony let family and close friends know about the loss and invite them to the service.",
    de: "Karten vor der Trauerfeier informieren Familie und enge Freunde über den Sterbefall und laden sie zur Feier ein.",
  },
  sy_after: { en: "After the service", de: "Nach der Trauerfeier" },
  sy_afterDesc: {
    en: "Cards sent after the service are a personal way to express gratitude to all who attended, sent flowers, or offered their support.",
    de: "Karten nach der Trauerfeier sind eine persönliche Art, sich bei allen zu bedanken, die an der Feier teilgenommen, Blumen geschickt oder ihre Anteilnahme gezeigt haben.",
  },
  sy_sendBeforeQ: { en: "Send cards before the ceremony?", de: "Karten vor der Feier verschicken?" },
  sy_sendAfterQ: { en: "Send cards after the ceremony?", de: "Karten nach der Feier verschicken?" },
  sy_amount: { en: "Approximate number of cards needed", de: "Geschätzte Anzahl der Karten" },

  // Assistance
  as_title: { en: "Support with Administrative Matters", de: "Unterstützung bei behördlichen Formalitäten" },
  as_subtitle: { en: "We can help manage the many administrative tasks that follow a bereavement.", de: "Nach einem Sterbefall fallen zahlreiche Formalitäten an, die in dieser schweren Zeit eine erhebliche Belastung darstellen können." },
  as_seeSummary: { en: "View summary", de: "Zur Zusammenfassung" },
  as_intro: {
    en: "Deregistering with authorities, notifying insurance providers, cancelling contracts, and handling pension matters can feel overwhelming during a time of grief. We are here to take care of these tasks alongside you.",
    de: "Abmeldungen bei Behörden, die Benachrichtigung von Versicherungen und Rentenstellen sowie Vertragskündigungen sind in dieser Zeit besonders belastend. Wir übernehmen diese Aufgaben gerne für Sie.",
  },
  as_q: { en: "Would you like us to assist you with these matters?", de: "Möchten Sie, dass wir Sie dabei unterstützen?" },
  as_contact: { en: "We will be in touch personally to discuss how we can best help you during this time.", de: "Wir werden uns persönlich mit Ihnen in Verbindung setzen, um zu besprechen, wie wir Ihnen am besten helfen können." },

  // Summary
  su_yourPlan: { en: "Your plan", de: "Ihre Planung" },
  su_titleFor: { en: "Summary for {name}", de: "Zusammenfassung für {name}" },
  su_titleGeneric: { en: "Summary of your choices", de: "Zusammenfassung Ihrer Auswahl" },
  su_lead: { en: "Here is a review of your current selections. You can return to any step to make changes.", de: "Hier finden Sie Ihre bisherige Auswahl. Sie können jederzeit zurückkehren und Details anpassen." },
  su_empty: { en: "No choices have been made yet. Please start with the introduction.", de: "Bisher wurde keine Auswahl getroffen. Bitte beginnen Sie mit der Einführung." },
  su_breakdown: { en: "Estimated costs", de: "Kostenübersicht" },
  su_estimated: { en: "estimated", de: "geschätzt" },
  su_disclaimer: { en: "Individual requests (flowers, music, etc.) may affect final pricing.", de: "Individuelle Wünsche können zu Preisabweichungen führen." },
  su_estTotal: { en: "Estimated total", de: "Voraussichtliche Gesamtsumme" },
  su_estNote: { en: "Items not yet selected are estimated using regional averages. Final costs depend on local fees, cemetery charges, and the specific services chosen.", de: "Noch nicht getroffene Auswahlen wurden mit regionalen Durchschnittswerten berechnet. Die tatsächlichen Kosten hängen von lokalen Gebühren, Friedhofskosten und den individuell gewählten Leistungen ab." },
  su_downloadPdf: { en: "Download PDF", de: "PDF herunterladen" },
  su_planDownloaded: { en: "Download complete", de: "Plan heruntergeladen" },
  su_planDownloadedDesc: { en: "Your summary has been saved.", de: "Ihre Zusammenfassung wurde erfolgreich gespeichert." },
  su_pdfError: { en: "Download failed", de: "Fehler beim PDF-Export" },
  su_pdfErrorDesc: { en: "Please try again.", de: "Bitte versuchen Sie es erneut." },
  su_startOver: { en: "Start over", de: "Neu beginnen" },
  su_startOverQ: { en: "Reset your plan?", de: "Planung zurücksetzen?" },
  su_startOverDesc: { en: "This will clear all current selections. This cannot be undone.", de: "Alle bisherigen Eingaben werden unwiderruflich gelöscht." },
  su_yesStartOver: { en: "Yes, start over", de: "Ja, neu beginnen" },

  // Cleared toast
  cleared_title: { en: "Selections updated", de: "Auswahl aktualisiert" },
  cleared_desc: { en: "Some previous choices were reset for consistency: {preview}{more}.", de: "Einige Angaben wurden zur Wahrung der Konsistenz zurückgesetzt: {preview}{more}." },
  cleared_more: { en: " and {n} more", de: " und {n} weitere" },

  // ── Account / auth ──────────────────────────────────────────────
  nav_account: { en: "Account", de: "Konto" },
  nav_myPlans: { en: "My plans", de: "Meine Planungen" },
  acc_title: { en: "Your account", de: "Ihr Konto" },
  acc_lead: {
    en: "No passwords here. Enter your email and we send you a sign-in link — gentle and simple.",
    de: "Kein Passwort nötig. Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Anmeldelink — einfach und unkompliziert.",
  },
  acc_email: { en: "Email address", de: "E-Mail-Adresse" },
  acc_sendLink: { en: "Send sign-in link", de: "Anmeldelink senden" },
  acc_demoMode: {
    en: "Demo mode: no email is actually sent. Click below to complete sign-in directly.",
    de: "Demo-Modus: Es wird keine echte E-Mail versendet. Klicken Sie unten, um die Anmeldung direkt abzuschließen.",
  },
  acc_demoComplete: { en: "Complete demo sign-in", de: "Demo-Anmeldung abschließen" },
  acc_linkSent: { en: "Link sent", de: "Link gesendet" },
  acc_linkSentDesc: { en: "Please check your inbox to finish signing in.", de: "Bitte prüfen Sie Ihr Postfach, um die Anmeldung abzuschließen." },
  acc_signedInAs: { en: "Signed in as", de: "Angemeldet als" },
  acc_signOut: { en: "Sign out", de: "Abmelden" },
  acc_backendLocal: {
    en: "Storage: this browser only (demo). Configure Supabase to sync across devices.",
    de: "Speicherung: nur in diesem Browser (Demo). Mit Supabase-Konfiguration werden Planungen geräteübergreifend gespeichert.",
  },
  acc_backendSupabase: { en: "Storage: secure cloud database (Supabase).", de: "Speicherung: sichere Cloud-Datenbank (Supabase)." },
  acc_invalidEmail: { en: "Please enter a valid email address.", de: "Bitte geben Sie eine gültige E-Mail-Adresse ein." },

  // ── My plans ────────────────────────────────────────────────────
  mp_title: { en: "My plans", de: "Meine Planungen" },
  mp_lead: {
    en: "Your saved plans. Open one to continue where you left off, or keep several side by side.",
    de: "Ihre gespeicherten Planungen. Öffnen Sie eine, um fortzufahren — oder führen Sie mehrere parallel.",
  },
  mp_empty: { en: "No saved plans yet. You can save your current plan from the summary page.", de: "Noch keine gespeicherten Planungen. Sie können Ihre aktuelle Planung auf der Zusammenfassungsseite speichern." },
  mp_open: { en: "Open", de: "Öffnen" },
  mp_duplicate: { en: "Duplicate", de: "Duplizieren" },
  mp_delete: { en: "Delete", de: "Löschen" },
  mp_deleteQ: { en: "Delete this plan?", de: "Diese Planung löschen?" },
  mp_deleteDesc: { en: "“{name}” will be removed permanently.", de: "„{name}“ wird dauerhaft entfernt." },
  mp_updated: { en: "Updated", de: "Aktualisiert" },
  mp_status_draft: { en: "Draft", de: "Entwurf" },
  mp_status_submitted: { en: "Submitted", de: "Übermittelt" },
  mp_status_deposit_confirmed: { en: "Deposit confirmed (demo)", de: "Anzahlung bestätigt (Demo)" },
  mp_opened: { en: "Plan loaded", de: "Planung geladen" },
  mp_openedDesc: { en: "“{name}” is now your active plan.", de: "„{name}“ ist jetzt Ihre aktive Planung." },
  mp_copySuffix: { en: " (copy)", de: " (Kopie)" },
  mp_signInHint: {
    en: "Tip: sign in to keep your plans under your email address.",
    de: "Hinweis: Melden Sie sich an, um Ihre Planungen Ihrer E-Mail-Adresse zuzuordnen.",
  },

  // ── Save plan ───────────────────────────────────────────────────
  sv_save: { en: "Save plan", de: "Planung speichern" },
  sv_title: { en: "Save this plan", de: "Diese Planung speichern" },
  sv_desc: { en: "Give your plan a name so you can find it again under “My plans”.", de: "Geben Sie Ihrer Planung einen Namen, damit Sie sie unter „Meine Planungen“ wiederfinden." },
  sv_nameLabel: { en: "Plan name", de: "Name der Planung" },
  sv_namePlaceholder: { en: "e.g. Plan for my mother", de: "z. B. Planung für meine Mutter" },
  sv_confirm: { en: "Save", de: "Speichern" },
  sv_cancel: { en: "Cancel", de: "Abbrechen" },
  sv_saved: { en: "Plan saved", de: "Planung gespeichert" },
  sv_savedDesc: { en: "You can find it under “My plans”.", de: "Sie finden sie unter „Meine Planungen“." },
  sv_error: { en: "Saving failed", de: "Speichern fehlgeschlagen" },

  // ── Submission to funeral home (US 19) ──────────────────────────
  sb_submit: { en: "Send to funeral home", de: "An Bestattungshaus senden" },
  sb_title: { en: "Send your plan to the funeral home", de: "Planung an das Bestattungshaus senden" },
  sb_desc: {
    en: "We share your plan with the funeral home so they can prepare your consultation. They will contact you — there is no obligation.",
    de: "Wir übermitteln Ihre Planung an das Bestattungshaus zur Vorbereitung Ihres Beratungsgesprächs. Man wird sich bei Ihnen melden — unverbindlich.",
  },
  sb_name: { en: "Your name", de: "Ihr Name" },
  sb_email: { en: "Your email", de: "Ihre E-Mail-Adresse" },
  sb_phone: { en: "Phone (optional)", de: "Telefon (optional)" },
  sb_message: { en: "Message (optional)", de: "Nachricht (optional)" },
  sb_confirm: { en: "Send plan", de: "Planung senden" },
  sb_sent: { en: "Plan submitted", de: "Planung übermittelt" },
  sb_sentDesc: { en: "Reference {ref}. The funeral home will contact you soon.", de: "Referenz {ref}. Das Bestattungshaus wird sich in Kürze bei Ihnen melden." },
  sb_submittedBadge: { en: "Submitted — reference {ref}", de: "Übermittelt — Referenz {ref}" },
  sb_required: { en: "Please provide your name and a valid email address.", de: "Bitte geben Sie Ihren Namen und eine gültige E-Mail-Adresse an." },
  sb_error: { en: "Submission failed", de: "Übermittlung fehlgeschlagen" },

  // ── Mock payment (demo only) ────────────────────────────────────
  pay_button: { en: "Confirm deposit (demo)", de: "Anzahlung bestätigen (Demo)" },
  pay_title: { en: "Booking deposit", de: "Anzahlung zur Reservierung" },
  pay_demoBanner: { en: "DEMO — no real payment is processed", de: "DEMO — es findet keine echte Zahlung statt" },
  pay_desc: {
    en: "In the finished product, the funeral home confirms a small deposit with you personally — never a checkout under pressure. This demo simulates that confirmation.",
    de: "Im fertigen Produkt bestätigt das Bestattungshaus eine kleine Anzahlung persönlich mit Ihnen — kein Bezahlvorgang unter Druck. Diese Demo simuliert die Bestätigung.",
  },
  pay_amount: { en: "Deposit amount", de: "Anzahlungsbetrag" },
  pay_confirm: { en: "Confirm demo deposit", de: "Demo-Anzahlung bestätigen" },
  pay_done: { en: "Deposit confirmed (demo)", de: "Anzahlung bestätigt (Demo)" },
  pay_doneDesc: { en: "A demo invoice is now available.", de: "Eine Demo-Rechnung ist jetzt verfügbar." },

  // ── Invoice (demo, § 14 UStG fields) ────────────────────────────
  inv_download: { en: "Download demo invoice", de: "Demo-Rechnung herunterladen" },
  inv_demo_banner: { en: "DEMO INVOICE — not a tax document", de: "DEMO-RECHNUNG — kein steuerliches Dokument" },
  inv_title: { en: "Invoice", de: "Rechnung" },
  inv_number: { en: "Invoice no.", de: "Rechnungsnr." },
  inv_date: { en: "Invoice date", de: "Rechnungsdatum" },
  inv_customer: { en: "Billed to", de: "Rechnungsempfänger" },
  inv_customer_fallback: { en: "Customer", de: "Kundin/Kunde" },
  inv_reference: { en: "Reference", de: "Referenz" },
  inv_col_item: { en: "Service", de: "Leistung" },
  inv_col_amount: { en: "Amount (gross)", de: "Betrag (brutto)" },
  inv_net: { en: "Net amount", de: "Nettobetrag" },
  inv_vat: { en: "VAT 19%", de: "USt. 19 %" },
  inv_gross: { en: "Total (gross)", de: "Gesamtbetrag (brutto)" },
  inv_legal_note: {
    en: "Demo document for project purposes. Contains the mandatory invoice fields of § 14 (4) UStG with sample data; amounts are estimates from the planning tool.",
    de: "Demo-Dokument zu Projektzwecken. Enthält die Pflichtangaben nach § 14 Abs. 4 UStG mit Beispieldaten; Beträge sind Schätzwerte aus dem Planungstool.",
  },
  inv_einvoice_note: {
    en: "E-invoicing note: B2B invoices in Germany must follow EN 16931 (XRechnung/ZUGFeRD) — mandatory issuing from 2027/2028. Consumer (B2C) invoices like this one are not covered by the mandate.",
    de: "Hinweis E-Rechnung: B2B-Rechnungen müssen in Deutschland der EN 16931 entsprechen (XRechnung/ZUGFeRD) — Ausstellungspflicht ab 2027/2028. Verbraucherrechnungen (B2C) wie diese fallen nicht unter die Pflicht.",
  },

  // ── 24h help / trust / Sternenkinder ───────────────────────────
  eh_lead: { en: "You do not have to do this alone — we are available around the clock.", de: "Sie müssen das nicht allein durchstehen — wir sind rund um die Uhr für Sie da." },
  eh_phoneLabel: { en: "Call us:", de: "Rufen Sie uns an:" },
  trust_master: { en: "Qualified funeral professionals", de: "Qualifiziertes Bestattungsfachpersonal" },
  trust_personal: { en: "Personal consultation at 4 locations", de: "Persönliche Beratung an 4 Standorten" },
  trust_around: { en: "Available 24 hours a day", de: "24 Stunden erreichbar" },
  stars_notice: {
    en: "For stillborn children (Sternenkinder) we are personally at your side — please contact us directly rather than using this planner.",
    de: "Bei Sternenkindern sind wir persönlich an Ihrer Seite — bitte kontaktieren Sie uns direkt, anstatt diesen Planer zu verwenden.",
  },
  stars_contact: { en: "Contact us personally", de: "Persönlich Kontakt aufnehmen" },

  // ── Sympathy step: memorial jewellery ───────────────────────────
  sy_jewelry: { en: "Memorial jewellery", de: "Erinnerungsschmuck" },
  sy_jewelryDesc: {
    en: "A small keepsake — for example a pendant holding a small amount of ashes — can keep a loved one close in everyday life.",
    de: "Ein kleines Erinnerungsstück — zum Beispiel ein Anhänger mit einer kleinen Menge Asche — kann einen geliebten Menschen im Alltag nah halten.",
  },
  sy_jewelryQ: { en: "Would you like to learn about memorial jewellery?", de: "Möchten Sie Erinnerungsschmuck in Betracht ziehen?" },

  // ── Submission: office choice ───────────────────────────────────
  sb_office: { en: "Preferred location (optional)", de: "Bevorzugter Standort (optional)" },

  // ── Datenschutz ─────────────────────────────────────────────────
  nav_datenschutz: { en: "Privacy", de: "Datenschutz" },
  ds_title: { en: "Privacy Policy", de: "Datenschutzerklärung" },
  ds_lead: {
    en: "Planning a funeral is deeply personal. We treat your data accordingly: as little as possible, as protected as possible.",
    de: "Eine Bestattung zu planen ist zutiefst persönlich. Entsprechend behandeln wir Ihre Daten: so wenig wie möglich, so geschützt wie möglich.",
  },
  ds_s1_title: { en: "What we store", de: "Was wir speichern" },
  ds_s1_body: {
    en: "Your planning choices, and — only if you save or submit a plan — the name and contact details you provide. Nothing more is collected.",
    de: "Ihre Planungsauswahl sowie — nur wenn Sie eine Planung speichern oder übermitteln — die von Ihnen angegebenen Namen und Kontaktdaten. Mehr wird nicht erhoben.",
  },
  ds_s2_title: { en: "Where it is stored", de: "Wo gespeichert wird" },
  ds_s2_body: {
    en: "By default, all data stays in your own browser (local storage) and never leaves your device. If a cloud database is configured, plans are stored on EU servers, protected so that only you can access your own plans.",
    de: "Standardmäßig verbleiben alle Daten in Ihrem eigenen Browser (Local Storage) und verlassen Ihr Gerät nicht. Ist eine Cloud-Datenbank konfiguriert, werden Planungen auf EU-Servern gespeichert und so geschützt, dass nur Sie auf Ihre eigenen Planungen zugreifen können.",
  },
  ds_s3_title: { en: "No tracking", de: "Kein Tracking" },
  ds_s3_body: {
    en: "This application uses no advertising trackers, no profiling, and no third-party analytics.",
    de: "Diese Anwendung verwendet keine Werbe-Tracker, kein Profiling und keine Analyse-Dienste von Drittanbietern.",
  },
  ds_s4_title: { en: "Your rights", de: "Ihre Rechte" },
  ds_s4_body: {
    en: "You can delete saved plans at any time under “My plans”. Under the GDPR you have the right to access, rectification, and erasure of your personal data — contact us at any time. (Demo project of the University of Würzburg.)",
    de: "Gespeicherte Planungen können Sie jederzeit unter „Meine Planungen“ löschen. Nach DSGVO haben Sie das Recht auf Auskunft, Berichtigung und Löschung Ihrer personenbezogenen Daten — kontaktieren Sie uns jederzeit. (Demo-Projekt der Universität Würzburg.)",
  },
} satisfies Dict;

export type DictKey = keyof typeof dict;

const interpolate = (s: string, vars?: Record<string, string | number>) =>
  vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : s;

export const translate = (lang: Lang, key: DictKey, vars?: Record<string, string | number>) => {
  const raw = (dict as Dict)[key as string]?.[lang] ?? (dict as Dict)[key as string]?.en ?? String(key);
  return interpolate(raw, vars);
};

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (k, vars) => translate("en", k, vars),
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "en" || v === "de") setLangState(v);
    } catch {
      // ignore
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  };

  const t = (key: DictKey, vars?: Record<string, string | number>) => translate(lang, key, vars);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
};

export const useLang = () => useContext(LanguageContext);

export const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-border bg-background p-0.5 text-xs font-medium"
    >
      {(["en", "de"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={
            "rounded-full px-3 py-1 transition-smooth " +
            (lang === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground")
          }
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
