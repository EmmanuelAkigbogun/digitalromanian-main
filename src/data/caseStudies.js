import balancepawsImage from '../assets/case-studies/balancepaws.png'
import balancepawsImage1 from '../assets/case-studies/balancepaws1.png'
import balancepawsImage2 from '../assets/case-studies/balancepaws2.png'

import micinegoestiImage from '../assets/case-studies/micinegoesti.png'
import micinegoestiImage1 from '../assets/case-studies/micinegoesti1.png'
import micinegoestiImage2 from '../assets/case-studies/micinegoesti2.png'
import miciNegoestiMobileImage from '../assets/case-studies/miciNegoestiMobile.png'


import pescuiestiImage from '../assets/case-studies/pescuiesti.png'
import pescuiestiImage1 from '../assets/case-studies/pescuiesti1.png'
import pescuiestiImage2 from '../assets/case-studies/pescuiesti2.png'

import cleanconstructImage from '../assets/case-studies/cleanconstruct.png'
import cleanconstructImage1 from '../assets/case-studies/cleanconstruct1.png'
import cleanconstructImage2 from '../assets/case-studies/cleanconstruct2.png'

import virtejinstalImage from '../assets/case-studies/virtejinstal.png'
import virtejinstalImage1 from '../assets/case-studies/virtejinstal1.png'
import virtejinstalImage2 from '../assets/case-studies/virtejinstal2.png'

import kmgyImage from '../assets/case-studies/kmgy.png'
import kmgyImage1 from '../assets/case-studies/kmgy1.png'
import kmgyImage2 from '../assets/case-studies/kmgy2.png'

import autosavImage from '../assets/case-studies/autosav.png'
import autosavImage1 from '../assets/case-studies/autosav1.png'
import autosavImage2 from '../assets/case-studies/autosav2.png'

const sharedCaseStudies = [
  {
    id: 'balancepaws',
    title: 'Balance Paws',
    domain: 'balancepaws.shop',
    href: '/portofoliu/balancepaws',
    imageUrl: balancepawsImage,
    imageWidth: 1423,
    imageHeight: 732,
    imageUrl1: balancepawsImage1,
    imageUrl2: balancepawsImage2,
    showcaseSize: 'feature',
  },
  {
    id: 'micinegoesti',
    title: 'Mici de Negoiești',
    domain: 'micinegoesti.ro',
    href: '/portofoliu/micinegoesti',
    imageUrl: micinegoestiImage,
    imageWidth: 1422,
    imageHeight: 690,
    imageUrl1: micinegoestiImage1,
    imageUrl2: micinegoestiImage2,
    //imageUrl: miciNegoestiMobileImage,
    imageUrl2Mobile: true,
    showcaseImageUrl: miciNegoestiMobileImage,
    showcaseImageWidth: 286,
    showcaseImageHeight: 638,
    showcaseFit: 'contain',
    showcaseShape: 'mobile-portrait',
    showcaseImagePosition: 'center',
    showcaseSize: 'feature',
  },
  {
    id: 'pescuiesti',
    title: 'Pescuiești',
    domain: 'pescuiesti.shop',
    href: '/portofoliu/pescuiesti',
    imageUrl: pescuiestiImage,
    imageWidth: 1424,
    imageHeight: 728,
    imageUrl1: pescuiestiImage1,
    imageUrl2: pescuiestiImage2,
  },
  {
    id: 'cleanconstruct',
    title: 'Clean Construct',
    domain: 'cleanconstruct.ro',
    href: '/portofoliu/cleanconstruct',
    imageUrl: cleanconstructImage,
    imageWidth: 1434,
    imageHeight: 726,
    imageUrl1: cleanconstructImage1,
    imageUrl2: cleanconstructImage2,
    showcaseCaptionPosition: 'top',
  },
  {
    id: 'virtejinstal',
    title: 'Virtej Install',
    domain: 'virtejinstal.ro',
    href: '/portofoliu/virtejinstal',
    imageUrl: virtejinstalImage,
    imageWidth: 3002,
    imageHeight: 1712,
    imageUrl1: virtejinstalImage1,
    imageUrl2: virtejinstalImage2,
  },
  {
    id: 'kmgy',
    title: 'KMGY Kirche Krefeld',
    domain: 'kmgy.de',
    href: '/portofoliu/kmgy',
    imageUrl: kmgyImage,
    imageWidth: 3010,
    imageHeight: 1716,
    imageUrl1: kmgyImage1,
    imageUrl2: kmgyImage2,
    showcaseSize: 'feature',
  },
  {
    id: 'autosav',
    title: 'AutoSavCar',
    domain: 'autosav.ro',
    href: '/portofoliu/autosav',
    imageUrl: autosavImage,
    imageWidth: 3406,
    imageHeight: 1888,
    imageUrl1: autosavImage1,
    imageUrl2: autosavImage2,
    //imageUrl3: autosavImage3,
    showcaseCaptionPosition: 'top',
  },
]

const caseStudyContent = {
  ro: {
    balancepaws: {
      type: 'Website & eCommerce',
      status: 'Live',
      imageAlt: 'Magazin online Balance Paws pentru produse pet care',
      excerpt: 'Un magazin online pentru un brand pet care construit în jurul încrederii, al călduri vizuale și al unei experiențe clare care transformă vizitatorul în client.',
      paragraphs: [
        'Balance Paws nu trebuia să fie doar un shop funcțional. Trebuia să fie un spațiu digital în care oamenii să se simtă bine când cumpără pentru animalele lor. Am pornit de la zero: logo, paletă de culori, direcție vizuală, structura magazinului, texte și imagini — totul gândit împreună, nu asamblat separat.',
        'Publicul pet care este atent și selectiv. Alege branduri care par să înțeleagă ce înseamnă să iubești un animal. Tocmai de aceea am pus accent pe căldură, pe claritate și pe o ierarhie vizuală care ghidează natural spre decizia de cumpărare — fără presiune, fără zgomot.',
        'Rezultatul este un eCommerce cu identitate coerentă, administrare simplă și o experiență orientată spre decizie. Un shop care arată că știe cui vorbește.',
      ],
      services: ['Logo', 'Culori', 'Conținut', 'Website', 'eCommerce', 'Direcție vizuală'],
    },
    micinegoesti: {
      type: 'Restaurant & comenzi online',
      status: 'Live',
      imageAlt: 'Website restaurant Mici de Negoiești cu meniu și comenzi online',
      excerpt: 'Website de restaurant construit pentru decizii rapide — meniu clar, comandă directă și o experiență mobile-first care respectă timpul clientului.',
      paragraphs: [
        'Când un client intră pe website-ul unui restaurant, are deja foame. Nu are chef să caute, să dea scroll sau să ghicească unde e meniul. Totul trebuia să fie la vedere: ce se mănâncă, cât costă, cum se comandă.',
        'Am construit experiența de la mobil în sus. Structura meniului, butoanele de comandă, informațiile de contact — fiecare element a fost gândit pentru ecrane mici și degete nerăbdătoare. Vizualul urmează aceeași logică: cald, apetisant, direct.',
        'Rezultatul este o platformă care lucrează pentru restaurant zi și noapte: prezintă meniul, primește comenzi și comunică cu clientul fără frecare și fără frustrare.',
      ],
      services: ['Website', 'Meniu online', 'UX mobil', 'Conținut', 'Branding', 'Comenzi'],
    },
    pescuiesti: {
      type: 'Website & eCommerce',
      status: 'Live',
      imageAlt: 'Magazin online Pescuiești pentru produse de pescuit',
      excerpt: 'Magazin online de nișă pentru pescuit — identitate distinctă, categorii clare și o structură care ajută vizitatorul să găsească rapid ce caută.',
      paragraphs: [
        'Pescuitul are limbajul lui. Cel care intră pe un site de profil știe exact ce vrea: un anumit tip de nadiță, o lanseta cu o anumită caracteristică, un accesoriu pe care l-a văzut într-un video. Magazinul trebuia să vorbească pe limba lui, nu să pară un eCommerce generic cu un header de pești.',
        'Am creat identitatea vizuală de la zero — logo, culori, structura categoriilor, textele și imaginile — cu un singur obiectiv: să facem magazinul ușor de recunoscut și ușor de navigat pentru cine știe ce caută.',
        'Rezultatul este un shop cu caracter propriu, pregătit să crească prin conținut, SEO de nișă și campanii social media targetate exact pe comunitatea de pescari.',
      ],
      services: ['Logo', 'Culori', 'eCommerce', 'Categorii produse', 'Conținut', 'Imagine brand'],
    },
    cleanconstruct: {
      type: 'Website de prezentare',
      status: 'Live',
      imageAlt: 'Website de prezentare Clean Construct pentru servicii de construcții',
      excerpt: 'Website de prezentare pentru servicii de construcții — imagine curată, structură clară și o primă impresie care câștigă încrederea înainte de primul telefon.',
      paragraphs: [
        'În construcții, credibilitatea se vede înainte să se audă. Un potențial client care ajunge pe site-ul tău ia o decizie vizuală în primele câteva secunde: par seriosi? Merită să iau legătura? Website-ul Clean Construct trebuia să răspundă da înainte ca vizitatorul să citească un singur cuvânt.',
        'Am construit o prezență curată, fără aglomerație vizuală — logo, culori, structura paginilor, texte și imagini aliniate într-un limbaj consistent care transmite competență și stabilitate. Fiecare secțiune are un singur scop: să ducă vizitatorul mai aproape de contactare.',
        'Rezultatul este un website care face exact ce trebuie să facă un website de servicii: prezintă clar, câștigă încredere rapid și facilitează pasul următor.',
      ],
      services: ['Logo', 'Website', 'Culori', 'Conținut', 'Structură servicii', 'Imagine profesională'],
    },
    virtejinstal: {
      type: 'Google Ads & strategie de conținut SEO',
      status: 'În mentenanță',
      imageAlt: 'Proiect Virtej Install cu optimizare Google Ads și plan de articole SEO',
      excerpt: 'Optimizare Google Ads și strategie de conținut SEO pentru servicii de instalații — mai puțin buget irosit, lead-uri mai relevante și vizibilitate care crește organic.',
      paragraphs: [
        'Virtej Install rula deja campanii Google Ads, dar banii plecau fără rezultate clare. Cuvintele cheie nu erau aliniate cu intenția comercială, grupele de anunțuri erau dezorganizate și nu exista nicio structură pentru a urmări ce funcționează. Primul pas a fost un audit complet și repararea a ceea ce era stricat.',
        'După stabilizarea campaniilor plătite, am construit un plan editorial SEO bazat pe întrebări reale, servicii specifice și căutări locale. Ideea era simplă: reclama aduce trafic azi, conținutul construiește autoritate pe termen lung. Cele două lucrează împreună, nu separat.',
        'Astăzi, Virtej Install are o structură de promovare mai coerentă, costuri per lead mai eficiente și un fundament de conținut care crește vizibilitatea organică lună de lună.',
      ],
      services: ['Audit & fix campanii', 'Google Ads management', 'Optimizare conversii', 'Strategie cuvinte-cheie', 'Plan editorial blog', 'SEO local'],
    },
    kmgy: {
      type: 'Website de prezentare multilingv',
      status: 'Live',
      imageAlt: 'Website KMGY pentru biserica din Krefeld, realizat pro bono',
      excerpt: 'Website pro bono pentru comunitatea KMGY din Krefeld — mesaj clar, structură modernă și acces ușor la informații în mai multe limbi.',
      paragraphs: [
        'O comunitate are nevoie să fie găsită, înțeleasă și simțită ca un loc deschis. KMGY Kirche Krefeld aduna oameni din mai multe culturi și limbi, dar prezența lor online nu reflecta nici pe departe energia și deschiderea comunității reale. Am ales să facem asta pro bono pentru că proiectul merita să existe bine făcut.',
        'Am construit structura multilingvă, copywriting-ul, direcția de design și funcționalitățile cheie cu un singur fir conducător: oricine ajunge pe site, indiferent de limbă sau background, trebuie să înțeleagă imediat unde a ajuns, ce se întâmplă și cum poate participa.',
        'Rezultatul este o prezență digitală modernă și primitoare — un website care funcționează ca o ușă deschisă, nu ca o broșură.',
      ],
      services: ['Pro bono website', 'Copywriting', 'Design UI', 'Funcționalitate multilingvă', 'Structură conținut', 'UX pentru comunitate'],
    },
    autosav: {
      type: 'Website de prezentare & cereri de ofertă',
      status: 'Live',
      imageAlt: 'Website AutoSavCar pentru piese auto, consumabile și accesorii',
      excerpt: 'Website pentru un magazin local de piese auto — mesaj clar, vizual memorabil și un drum direct spre cererea de ofertă.',
      paragraphs: [
        'AutoSavCar vinde piese auto, consumabile, anvelope și accesorii pentru șoferi, service-uri și firme locale. Publicul lor știe ce vrea, nu are răbdare și judecă repede dacă merită să sune sau să treacă mai departe. Website-ul trebuia să fie rapid, clar și de încredere — exact ca un magazin fizic bine organizat.',
        'Am construit o direcție vizuală aerisită cu un hero puternic, accente 3D și un mesaj simplu de reținut. Structura pune pe primul loc orientarea rapidă: ce vindem, cum comanzi, unde ești. Cererea de ofertă este vizibilă și accesibilă din orice punct al paginii.',
        'Rezultatul este un website curat, modern și local relevant — un punct digital de încredere care transformă un vizitator grăbit într-un client care sună.',
      ],
      services: ['Website', 'UI design', 'Copywriting', 'Structură produse', 'Cerere ofertă', 'Imagine locală'],
    },
  },
  en: {
    balancepaws: {
      type: 'Website & eCommerce',
      status: 'Live',
      imageAlt: 'Balance Paws online store for pet care products',
      excerpt: 'An online store for a pet care brand built around trust, visual warmth, and a clear experience that turns visitors into confident buyers.',
      paragraphs: [
        'Balance Paws was never meant to be just another functional shop. It needed to feel like a space where people enjoy buying for their pets — warm, clear, and reassuring. We started from scratch: logo, color palette, visual direction, store structure, copy, and imagery — every piece designed together, not assembled separately.',
        'Pet care audiences are attentive and selective. They choose brands that seem to genuinely understand what it means to love an animal. That is why we focused on warmth, clarity, and a visual hierarchy that guides naturally toward a purchase decision — without pressure, without noise.',
        'The result is an eCommerce presence with a coherent identity, simple administration, and an experience built around decision-making. A store that looks like it knows exactly who it is talking to.',
      ],
      services: ['Logo', 'Colors', 'Content', 'Website', 'eCommerce', 'Visual direction'],
    },
    micinegoesti: {
      type: 'Restaurant & online orders',
      status: 'Live',
      imageAlt: 'Mici de Negoiești restaurant website with menu and online orders',
      excerpt: 'A restaurant website built for fast decisions — clear menu, direct ordering, and a mobile-first experience that respects the customer"s time.',
      paragraphs: [
        'When someone visits a restaurant website, they are already hungry. They have no patience to search, to scroll through ambiguity, or to guess where the menu is. Everything had to be immediately visible: what is served, how much it costs, how to order.',
        'We built the experience from mobile up. Menu structure, order buttons, contact details — every element was designed for small screens and impatient fingers. The visual language follows the same logic: warm, appetizing, direct.',
        'The result is a platform that works for the restaurant around the clock — presenting the menu, receiving orders, and communicating with customers without friction or frustration.',
      ],
      services: ['Website', 'Online menu', 'Mobile UX', 'Content', 'Branding', 'Orders'],
    },
    pescuiesti: {
      type: 'Website & eCommerce',
      status: 'Live',
      imageAlt: 'Pescuiești online store for fishing products',
      excerpt: 'A niche online store for fishing — distinct identity, clear categories, and a structure that helps visitors find exactly what they came for.',
      paragraphs: [
        'Fishing has its own language. Someone who visits a fishing store already knows what they want — a specific bait type, a rod with particular specs, an accessory they spotted in a video. The store had to speak their language, not look like a generic eCommerce site with a fish in the header.',
        'We built the visual identity from scratch — logo, colors, category structure, copy, and imagery — with a single goal: make the store easy to recognize and easy to navigate for someone who knows what they are looking for.',
        'The result is a shop with its own character, ready to grow through niche content, targeted SEO, and social media campaigns aimed precisely at the fishing community.',
      ],
      services: ['Logo', 'Colors', 'eCommerce', 'Product categories', 'Content', 'Brand image'],
    },
    cleanconstruct: {
      type: 'Presentation website',
      status: 'Live',
      imageAlt: 'Clean Construct presentation website for construction services',
      excerpt: 'A presentation website for construction services — clean image, clear structure, and a first impression that earns trust before the first phone call.',
      paragraphs: [
        'In construction, credibility is visual before it is verbal. A potential client landing on your website makes a judgment in the first few seconds: do they look serious? Is it worth reaching out? The Clean Construct website had to answer yes before the visitor read a single word.',
        'We built a clean, uncluttered presence — logo, colors, page structure, copy, and images aligned in a consistent visual language that communicates competence and stability. Every section has one purpose: move the visitor one step closer to making contact.',
        'The result is a website that does exactly what a service business website should do: present clearly, earn trust quickly, and make the next step easy.',
      ],
      services: ['Logo', 'Website', 'Colors', 'Content', 'Service structure', 'Professional image'],
    },
    virtejinstal: {
      type: 'Google Ads & SEO content strategy',
      status: 'Ongoing',
      imageAlt: 'Virtej Install project with Google Ads optimization and SEO blog planning',
      excerpt: 'Google Ads optimization and SEO content strategy for installation services — less wasted budget, more relevant leads, and organic visibility that compounds over time.',
      paragraphs: [
        'Virtej Install was already running Google Ads campaigns, but money was leaving without clear results. Keywords were not aligned with commercial intent, ad groups were disorganized, and there was no structure to track what actually worked. The first step was a full audit and fixing everything that was broken.',
        'Once the paid campaigns were stabilized, we built an SEO editorial plan based on real questions, specific services, and local searches. The logic was straightforward: ads bring traffic today, content builds authority over time. The two work together, not in parallel isolation.',
        'Today, Virtej Install has a more coherent promotion structure, more efficient cost per lead, and a content foundation that grows organic visibility month by month.',
      ],
      services: ['Campaign audit & fixes', 'Google Ads management', 'Conversion optimization', 'Keyword strategy', 'Blog editorial plan', 'Local SEO'],
    },
    kmgy: {
      type: 'Multilingual presentation website',
      status: 'Live',
      imageAlt: 'KMGY website for the church in Krefeld, built pro bono',
      excerpt: 'A pro bono website for the KMGY community in Krefeld — clear messaging, modern structure, and easy access to information in multiple languages.',
      paragraphs: [
        'A community needs to be found, understood, and felt as an open place. KMGY Kirche Krefeld brought together people from multiple cultures and languages, but their online presence did not reflect the energy and openness of the real community. We chose to do this pro bono because the project deserved to be done well.',
        'We built the multilingual structure, the copywriting, the design direction, and the key functionalities around a single guiding principle: anyone who arrives on the site, regardless of language or background, should immediately understand where they are, what is happening, and how they can get involved.',
        'The result is a modern and welcoming digital presence — a website that works like an open door, not a brochure.',
      ],
      services: ['Pro bono website', 'Copywriting', 'UI design', 'Multilingual functionality', 'Content structure', 'Community-focused UX'],
    },
    autosav: {
      type: 'Presentation website & quote requests',
      status: 'Live',
      imageAlt: 'AutoSavCar website for auto parts, consumables, and accessories',
      excerpt: 'A website for a local auto parts shop — clear message, memorable visuals, and a direct path to the quote request.',
      paragraphs: [
        'AutoSavCar sells auto parts, consumables, tires, and accessories to drivers, service shops, and local businesses. Their audience knows what it wants, has little patience, and quickly decides whether to call or move on. The website had to be fast, clear, and trustworthy — exactly like a well-organized physical store.',
        'We built an airy visual direction with a strong hero section, 3D product accents, and a simple, memorable message. The structure puts quick orientation first: what we sell, how to order, where to find us. The quote request is visible and accessible from anywhere on the page.',
        'The result is a clean, modern, locally relevant website — a trusted digital touchpoint that turns a hurried visitor into a customer who picks up the phone.',
      ],
      services: ['Website', 'UI design', 'Copywriting', 'Product structure', 'Quote request', 'Local positioning'],
    },
  },
  de: {
    balancepaws: {
      type: 'Website & eCommerce',
      status: 'Live',
      imageAlt: 'Balance Paws Online-Shop für Pet-Care-Produkte',
      excerpt: 'Ein Online-Shop für eine Pet-Care-Marke, aufgebaut rund um Vertrauen, visuelle Wärme und eine klare Erfahrung, die Besucher in überzeugte Käufer verwandelt.',
      paragraphs: [
        'Balance Paws sollte nie nur ein weiterer funktionierender Shop sein. Er musste sich wie ein Ort anfühlen, an dem Menschen gerne für ihre Tiere einkaufen — warm, klar und vertrauenswürdig. Wir haben von Null angefangen: Logo, Farbpalette, visuelle Richtung, Shop-Struktur, Texte und Bilder — alles zusammen gedacht, nicht separat zusammengesetzt.',
        'Pet-Care-Zielgruppen sind aufmerksam und wählerisch. Sie entscheiden sich für Marken, die zu verstehen scheinen, was es bedeutet, ein Tier zu lieben. Deshalb haben wir uns auf Wärme, Klarheit und eine visuelle Hierarchie konzentriert, die natürlich zur Kaufentscheidung führt — ohne Druck, ohne Lärm.',
        'Das Ergebnis ist eine eCommerce-Präsenz mit kohärenter Identität, einfacher Verwaltung und einer auf Entscheidungsfindung ausgerichteten Erfahrung. Ein Shop, der aussieht, als wüsste er genau, mit wem er spricht.',
      ],
      services: ['Logo', 'Farben', 'Content', 'Website', 'eCommerce', 'Visuelle Richtung'],
    },
    micinegoesti: {
      type: 'Restaurant & Online-Bestellungen',
      status: 'Live',
      imageAlt: 'Restaurant-Website Mici de Negoiești mit Menü und Online-Bestellungen',
      excerpt: 'Eine Restaurant-Website für schnelle Entscheidungen — klares Menü, direkte Bestellung und eine Mobile-first-Erfahrung, die die Zeit des Kunden respektiert.',
      paragraphs: [
        'Wenn jemand eine Restaurant-Website besucht, hat er bereits Hunger. Er hat keine Geduld zu suchen, durch Unklarheiten zu scrollen oder zu raten, wo das Menü ist. Alles musste sofort sichtbar sein: was serviert wird, wie viel es kostet, wie man bestellt.',
        'Wir haben die Erfahrung von Mobil aufwärts gebaut. Menüstruktur, Bestellbuttons, Kontaktdaten — jedes Element wurde für kleine Bildschirme und ungeduldige Finger gestaltet. Die visuelle Sprache folgt der gleichen Logik: warm, appetitlich, direkt.',
        'Das Ergebnis ist eine Plattform, die rund um die Uhr für das Restaurant arbeitet — Menü präsentieren, Bestellungen entgegennehmen und mit Kunden ohne Reibung und Frustration kommunizieren.',
      ],
      services: ['Website', 'Online-Menü', 'Mobile UX', 'Content', 'Branding', 'Bestellungen'],
    },
    pescuiesti: {
      type: 'Website & eCommerce',
      status: 'Live',
      imageAlt: 'Pescuiești Online-Shop für Angelprodukte',
      excerpt: 'Ein Nischen-Shop für Angeln — klare Identität, einfache Kategorien und eine Struktur, die Besucher schnell zum richtigen Produkt führt.',
      paragraphs: [
        'Angeln hat seine eigene Sprache. Wer einen Angelshop besucht, weiß bereits, was er will — einen bestimmten Ködertyp, eine Rute mit bestimmten Spezifikationen, ein Zubehörteil aus einem Video. Der Shop musste seine Sprache sprechen, nicht wie ein generischer eCommerce-Auftritt mit einem Fisch im Header wirken.',
        'Wir haben die visuelle Identität von Grund auf aufgebaut — Logo, Farben, Kategoriestruktur, Texte und Bilder — mit einem einzigen Ziel: den Shop leicht erkennbar und leicht navigierbar für jemanden zu machen, der weiß, was er sucht.',
        'Das Ergebnis ist ein Shop mit eigenem Charakter, bereit zu wachsen durch Nischen-Content, gezieltes SEO und Social-Media-Kampagnen, die genau auf die Angelgemeinschaft ausgerichtet sind.',
      ],
      services: ['Logo', 'Farben', 'eCommerce', 'Produktkategorien', 'Content', 'Markenbild'],
    },
    cleanconstruct: {
      type: 'Präsentationswebsite',
      status: 'Live',
      imageAlt: 'Clean Construct Präsentationswebsite für Bauleistungen',
      excerpt: 'Eine Präsentationswebsite für Bauleistungen — sauberes Bild, klare Struktur und ein erster Eindruck, der Vertrauen gewinnt, bevor der erste Anruf kommt.',
      paragraphs: [
        'Im Bauwesen ist Glaubwürdigkeit visuell, bevor sie verbal ist. Ein potenzieller Kunde, der auf Ihrer Website landet, trifft in den ersten Sekunden ein Urteil: Wirken die seriös? Lohnt es sich, Kontakt aufzunehmen? Die Clean Construct Website musste Ja antworten, bevor der Besucher ein einziges Wort gelesen hat.',
        'Wir haben eine saubere, unübersichtliche Präsenz aufgebaut — Logo, Farben, Seitenstruktur, Texte und Bilder in einer konsistenten visuellen Sprache, die Kompetenz und Stabilität vermittelt. Jeder Abschnitt hat einen Zweck: den Besucher einen Schritt näher zur Kontaktaufnahme zu bringen.',
        'Das Ergebnis ist eine Website, die genau das tut, was eine Dienstleistungswebsite tun sollte: klar präsentieren, schnell Vertrauen gewinnen und den nächsten Schritt einfach machen.',
      ],
      services: ['Logo', 'Website', 'Farben', 'Content', 'Service-Struktur', 'Professionelles Bild'],
    },
    virtejinstal: {
      type: 'Google Ads & SEO-Content-Strategie',
      status: 'Laufende Betreuung',
      imageAlt: 'Virtej Install Projekt mit Google Ads Optimierung und SEO-Blogplanung',
      excerpt: 'Google-Ads-Optimierung und SEO-Content-Strategie für Installationsservices — weniger verschwendetes Budget, relevantere Leads und organische Sichtbarkeit, die wächst.',
      paragraphs: [
        'Virtej Install betrieb bereits Google-Ads-Kampagnen, aber Geld floss ohne klare Ergebnisse ab. Keywords waren nicht auf kommerzielle Suchintention ausgerichtet, Anzeigengruppen waren unorganisiert, und es gab keine Struktur, um zu verfolgen, was tatsächlich funktionierte. Der erste Schritt war ein vollständiges Audit und die Behebung von allem, was nicht stimmte.',
        'Sobald die bezahlten Kampagnen stabilisiert waren, haben wir einen SEO-Redaktionsplan auf Basis echter Fragen, spezifischer Leistungen und lokaler Suchanfragen aufgebaut. Die Logik war einfach: Anzeigen bringen heute Traffic, Content baut langfristig Autorität auf. Beide arbeiten zusammen, nicht isoliert.',
        'Heute hat Virtej Install eine kohärentere Werbestruktur, effizienteren Cost per Lead und ein Content-Fundament, das die organische Sichtbarkeit Monat für Monat steigert.',
      ],
      services: ['Kampagnen-Audit & Fixes', 'Google Ads Betreuung', 'Conversion-Optimierung', 'Keyword-Strategie', 'Blog-Redaktionsplan', 'Lokales SEO'],
    },
    kmgy: {
      type: 'Mehrsprachige Präsentationswebsite',
      status: 'Live',
      imageAlt: 'KMGY Website für die Kirche in Krefeld, pro bono umgesetzt',
      excerpt: 'Eine Pro-bono-Website für die KMGY-Gemeinde in Krefeld — klare Botschaft, moderne Struktur und einfacher Zugang zu Informationen in mehreren Sprachen.',
      paragraphs: [
        'Eine Gemeinschaft muss gefunden, verstanden und als offener Ort wahrgenommen werden. KMGY Kirche Krefeld brachte Menschen aus verschiedenen Kulturen und Sprachen zusammen, aber ihre Online-Präsenz spiegelte weder die Energie noch die Offenheit der echten Gemeinschaft wider. Wir haben uns entschieden, dies pro bono zu tun, weil das Projekt es verdiente, gut gemacht zu werden.',
        'Wir haben die mehrsprachige Struktur, das Copywriting, die Designrichtung und die wichtigsten Funktionalitäten um einen einzigen Leitgedanken aufgebaut: Jeder, der auf die Website kommt, soll unabhängig von Sprache oder Hintergrund sofort verstehen, wo er ist, was passiert und wie er mitmachen kann.',
        'Das Ergebnis ist eine moderne und einladende digitale Präsenz — eine Website, die wie eine offene Tür funktioniert, nicht wie eine Broschüre.',
      ],
      services: ['Pro-bono-Website', 'Copywriting', 'UI-Design', 'Mehrsprachige Funktionalität', 'Content-Struktur', 'Community-orientierte UX'],
    },
    autosav: {
      type: 'Präsentationswebsite & Angebotsanfragen',
      status: 'Live',
      imageAlt: 'AutoSavCar Website für Autoteile, Verbrauchsmaterialien und Zubehör',
      excerpt: 'Eine Website für einen lokalen Autoteile-Shop — klare Botschaft, einprägsame Visuals und ein direkter Weg zur Angebotsanfrage.',
      paragraphs: [
        'AutoSavCar verkauft Autoteile, Verbrauchsmaterialien, Reifen und Zubehör an Fahrer, Werkstätten und lokale Unternehmen. Ihre Zielgruppe weiß, was sie will, hat wenig Geduld und entscheidet schnell, ob es sich lohnt anzurufen oder weiterzugehen. Die Website musste schnell, klar und vertrauenswürdig sein — genau wie ein gut organisierter Laden.',
        'Wir haben eine luftige visuelle Richtung mit einem starken Hero-Bereich, 3D-Produktakzenten und einer einfachen, einprägsamen Botschaft aufgebaut. Die Struktur stellt schnelle Orientierung an erste Stelle: Was wir verkaufen, wie man bestellt, wo man uns findet. Die Angebotsanfrage ist von überall auf der Seite sichtbar und zugänglich.',
        'Das Ergebnis ist eine saubere, moderne und lokal relevante Website — ein vertrauenswürdiger digitaler Kontaktpunkt, der einen eiligen Besucher in einen Kunden verwandelt, der zum Telefon greift.',
      ],
      services: ['Website', 'UI-Design', 'Copywriting', 'Produktstruktur', 'Angebotsanfrage', 'Lokale Positionierung'],
    },
  },
}

export function getCaseStudies(lang = 'ro') {
  const content = caseStudyContent[lang] || caseStudyContent.ro

  return sharedCaseStudies.map((caseStudy) => ({
    ...caseStudy,
    ...content[caseStudy.id],
  }))
}

export const caseStudies = getCaseStudies('ro')