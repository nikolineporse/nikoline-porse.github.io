// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// "Where I've Been" — data-driven event grid + modal
// One record per event. `images` is an array so any number of photos can
// be added later without changing any markup — an empty array means "no
// photo yet," which falls back to a plain .credential card instead of a
// grid tile, matching the rest of the site's press-credential look.
const WORK_EVENTS = [
  {
    id: 'achille-salvagni-launch',
    access: 'Publication Launch',
    role: 'An Evening with Achille Salvagni',
    org: 'Assouline',
    dateDisplay: 'May 13, 2026',
    sortDate: '2026-05-13',
    description: [
      "Represented Assouline throughout an intimate cocktail reception celebrating the launch of Achille Salvagni, a new monograph dedicated to the Rome-based designer's blend of ancient craftsmanship and modern imagination",
      'Welcomed collectors, designers, gallerists, and tastemakers, shared memorable details about the publication and served as an on-site resource for guest questions',
      'Helped guests connect with the story behind the release and the cultural world surrounding Salvagni’s work'
    ],
    images: [
      { src: 'assets/work/achille-salvagni-launch-01.jpg', alt: 'Copies of the Assouline monograph Achille Salvagni displayed on a round wooden table beneath a sculptural pendant light at the launch reception' },
      { src: 'assets/work/achille-salvagni-launch-02.jpg', alt: 'Guests gathered beneath an installation of suspended Achille Salvagni books during the Assouline launch reception' },
      { src: 'assets/work/achille-salvagni-launch-03.jpg', alt: 'Achille Salvagni books displayed among furniture, lighting, and decorative objects in a warm red room at Assouline' }
    ]
  },
  {
    id: 'cosmic-desert-party-celsius',
    access: 'Event Activation',
    role: 'CELSIUS Cosmic Desert Party',
    org: 'CLD PR · Coachella 2024',
    dateDisplay: 'April 12, 2024',
    sortDate: '2024-04-12',
    description: [
      'Built targeted media lists and identified influencers whose audiences and style aligned with the launch of CELSIUS’s Space Vibe Trilogy',
      'Supported production and setup on-site, from creating decals to preparing the private buses used by performing artists',
      'Welcomed A-list guests and influencers throughout the event, helping deliver a polished experience and distributing complimentary gift bags'
    ],
    images: [
      { src: 'assets/work/cosmic-desert-party-celsius-01.jpg', alt: 'Silver, oxblood and mauve sphere sculptures reflected in a still lake at dusk, palm trees and mountains behind, at the CELSIUS Cosmic Desert Party' },
      { src: 'assets/work/celsius-cosmic-desert-party-02.jpg', alt: 'The outdoor performance stage and palm-lined event grounds during setup for the CELSIUS Cosmic Desert Party at sunset' }
    ]
  },
  {
    id: 'nyfw-gifting-suites',
    access: 'Event Activation',
    role: 'New York Fashion Week Gifting Suite',
    org: 'CLD PR',
    dateDisplay: 'September 2024',
    sortDate: '2024-09-15',
    description: [
      'Supported end-to-end production for CLD PR’s high-profile NYFW gifting suite, connecting tastemakers and VIP creators with emerging brand partners',
      'Provided hands-on executive support to Devora Viictor as the luxury handbag designer debuted her brand at the event',
      'Introduced the brand story to influencers and used real-time audience insight to strategically gift handbags to high-reach creators'
    ],
    images: [
      { src: 'assets/work/nyfw-gifting-suites-01.jpg', alt: 'Dozens of canvas CLD PR "NYFW September 2024" tote bags piled up, with cardboard signs marking VIP and press gifting sections' },
      { src: 'assets/work/nyfw-gifting-suites-02.jpg', alt: 'Influencers, creators, and brand representatives gathered at CLD PR’s rooftop gifting suite during New York Fashion Week' }
    ]
  },
  {
    id: 'roger-federer-publication',
    access: 'Publication Launch & Book Signing',
    role: 'Roger Federer Book Signing Event',
    org: 'Assouline',
    dateDisplay: 'September 4, 2024',
    sortDate: '2024-09-04',
    description: [
      'Collaborated with colleagues on the invitation list for the limited-capacity launch of Federer, with tickets selling out within hours of going live',
      'Managed guest check-in and flow as attendees arrived to meet Roger Federer and receive signed, personalized copies of the publication',
      'Supported Assouline’s events and PR teams throughout the evening, helping keep the high-energy launch polished, organized and running smoothly'
    ],
    images: [
      { src: 'assets/work/roger-federer-limited-edition-publication-01.jpg', alt: 'Roger Federer seated at a signing table, pen in hand, surrounded by stacks of his limited-edition Assouline publication displayed against a red accent wall' }
    ]
  },
  {
    id: 'carbone-book-launch',
    access: 'Publication Launch, Q&A & Book Signing',
    role: 'Carbone Book Launch',
    org: 'Assouline · ZZ’s Club',
    dateDisplay: 'December 11, 2024',
    sortDate: '2024-12-11',
    description: [
      'Provided flexible on-site support to Assouline’s events team throughout the private cocktail reception, Q&A and signing with Mario Carbone and Jeff Zalaznick',
      'Managed book checkout before the signing, guiding guests through their purchases and maintaining an organized flow into the signing line'
    ],
    images: [
      { src: 'assets/work/carbone-book-launch-02.jpg', alt: 'Guests gathered for the Carbone publication launch cocktail reception in the warmly lit lounge at ZZ’s Club' },
      { src: 'assets/work/carbone-book-launch-01.jpg', alt: 'A speaker leading the Carbone book launch Q&A beside the fireplace and sculptural chandelier at ZZ’s Club' }
    ]
  },
  {
    id: 'the-mark-book-launch',
    access: 'Cocktail Reception & Publication Launch',
    role: 'The Mark Book Launch',
    org: 'Assouline x The Mark Hotel',
    dateDisplay: 'December 11, 2025',
    sortDate: '2025-12-11',
    description: [
      'Assisted with event setup and thoughtful product placement for an intimate cocktail reception celebrating The Mark, Assouline’s limited-edition volume honoring the hotel’s legacy',
      'Socialized with guests and served as an on-site resource, sharing details about the new release and the story behind the collaboration',
      'Helped create a polished guest experience for the private gathering, with Martha Stewart among the notable attendees'
    ],
    images: [
      { src: 'assets/work/the-mark-book-launch-01.jpg', alt: 'Two white dogs wearing navy The Mark shirts reading “take me to the mark” on the hotel’s red patterned carpet during the book launch cocktail reception' }
    ]
  },
  {
    id: 'astr-danielle-alix-launch-dinner',
    access: 'Launch Dinner',
    role: 'ASTR The Label x Danielle & Alix',
    org: 'CLD PR',
    dateDisplay: 'September 2025',
    sortDate: '2025-09-01',
    description: [
      'Welcomed guests to the intimate pre-NYFW launch dinner for the Fall 2025 Style Edit at Cathédrale, managed check-in and directed attendees through the space',
      'Supported event production and setup, including branded decal placement and preparing curated gift bags for the invite-only crowd',
      'Helped create a polished arrival experience for fashion insiders celebrating Danielle O’Connell and Alix Gropper’s second collaboration with ASTR The Label'
    ],
    images: [
      { src: 'assets/work/astr-danielle-alix-launch-03.jpg', alt: 'Gold and silver Ettika jewelry arranged for gifting at the ASTR The Label x Danielle & Alix launch dinner' },
      { src: 'assets/work/astr-danielle-alix-launch-02.jpg', alt: 'The ASTR The Label Fall 2025 edit displayed beside an Ettika jewelry gifting station on Cathédrale’s plant-filled patio' },
      { src: 'assets/work/astr-danielle-alix-launch-01.jpg', alt: 'Danielle O’Connell and Alix Gropper welcoming guests beneath ASTR The Label x Danielle & Alix branding at the Cathédrale launch dinner' },
      { src: 'assets/work/astr-danielle-alix-launch-04.jpg', alt: 'A candlelit dinner table with floral arrangements and ASTR The Label menus beneath a lush plant wall at Cathédrale' }
    ]
  },
  {
    id: 'point-of-view-beauty-pop-up',
    access: 'Freelance Activation',
    role: 'Point of View Beauty Pop-Up',
    org: 'Point of View Beauty',
    dateDisplay: 'July 25–26, 2025',
    sortDate: '2025-07-25',
    description: [
      "Assisted the Point of View Beauty team with brand storytelling and on-site education for the brand's first-ever pop-up, checking out customers interested in purchasing product",
      'Supported event production — helping with setup and breakdown, and mapping the smartest flow of foot traffic through the space',
      "Helped host what also served as a meet-and-greet, as TikTok beauty influencer and Point of View founder Mikayla Nogueira was on-site to celebrate the brand's new chapter with her followers and fans"
    ],
    images: [
      { src: 'assets/work/point-of-view-beauty-pop-up-01.jpg', alt: 'Point of View Beauty skincare products — Drip It, Drench It, Whip It, Glaze It, and Amp It — displayed on a white pedestal beneath a large white floral arrangement against a blue wood-paneled wall' },
      { src: 'assets/work/point-of-view-beauty-pop-up-02.jpg', alt: 'The Point of View Beauty team gathered inside the blue pop-up space beside product displays and branded gift bags' },
      { src: 'assets/work/point-of-view-beauty-pop-up-03.jpg', alt: 'Point of View Beauty campaign posters filling the illuminated windows outside the pop-up' },
      { src: 'assets/work/point-of-view-beauty-pop-up-04.jpg', alt: 'Point of View Beauty products, informational cards, campaign posters, and gift bags arranged on a blue display shelf' },
      { src: 'assets/work/point-of-view-beauty-pop-up-05.jpg', alt: 'Two Point of View Beauty team members welcoming guests outside the pop-up' }
    ]
  },
  {
    id: 'derrick-rose-signing',
    access: 'Publication Launch & Book Signing',
    role: 'Derrick Rose: The Poohprint',
    org: 'Assouline',
    dateDisplay: 'February 14, 2026',
    sortDate: '2026-02-14',
    description: [
      'Managed event flow and on-site upkeep across the 50-person ticketed experience and public Assouline x Rose’s Flower Shop activation',
      'Served as a guest-facing resource, sharing details about Derrick Rose: The Poohprint and answering questions throughout the event',
      'Worked as Derrick Rose’s right hand throughout the event, providing hands-on support wherever it was needed'
    ],
    images: [
      { src: 'assets/work/derrick-rose-book-signing-01.jpg', alt: 'Derrick Rose signing copies of his book "The Poohprint" at Assouline, flanked by two colleagues holding bouquets of red roses, with a red accent wall and stacked book display behind' },
      { src: 'assets/work/derrick-rose-book-signing-02.jpg', alt: 'Derrick Rose greeting a guest outside the Assouline storefront during his Valentine’s Day book signing' },
      { src: 'assets/work/derrick-rose-book-signing-03.jpg', alt: 'A bouquet of red roses displayed inside Assouline for Derrick Rose’s Valentine’s Day book signing' }
    ]
  },
];

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function buildCredentialCard(event) {
  const descItems = event.description.map(d => `<li>${escapeHtml(d)}</li>`).join('');
  return `
    <div class="credential reveal">
      <p class="credential-access">${escapeHtml(event.access)}</p>
      <p class="credential-role">${escapeHtml(event.role)}</p>
      <p class="credential-org">${escapeHtml(event.org)}</p>
      <ul>${descItems}</ul>
    </div>
  `;
}

function buildTile(event) {
  const cover = event.images[0];
  return `
    <li>
      <a href="${escapeHtml(cover.src)}" class="work-tile reveal" data-event-id="${escapeHtml(event.id)}">
        <img src="${escapeHtml(cover.src)}" alt="" loading="lazy">
        <span class="work-tile-label">${escapeHtml(event.role)}</span>
      </a>
    </li>
  `;
}

function renderWorkEvents() {
  const container = document.getElementById('workEvents');
  if (!container) return; // no-op on every page except work.html

  const newestFirst = (a, b) => b.sortDate.localeCompare(a.sortDate);
  const withPhotos = WORK_EVENTS.filter(e => e.images.length > 0).sort(newestFirst);
  const withoutPhotos = WORK_EVENTS.filter(e => e.images.length === 0).sort(newestFirst);

  let html = '';
  if (withPhotos.length) {
    html += `<ul class="work-grid">${withPhotos.map(buildTile).join('')}</ul>`;
  }
  html += withoutPhotos.map(buildCredentialCard).join('');
  container.innerHTML = html;

  container.querySelectorAll('.work-tile').forEach(tile => {
    tile.addEventListener('click', (e) => {
      e.preventDefault();
      openEventModal(tile.getAttribute('data-event-id'));
    });
  });
}

let lastFocusedEl = null;
let activeGalleryEvent = null;
let activeGalleryIndex = 0;
let galleryTouchStartX = null;

function galleryMarkup(event) {
  const image = event.images[activeGalleryIndex];
  const controls = event.images.length > 1 ? `
    <button type="button" class="event-gallery-arrow event-gallery-prev" aria-label="Previous photo">←</button>
    <button type="button" class="event-gallery-arrow event-gallery-next" aria-label="Next photo">→</button>
    <p class="event-gallery-count" aria-live="polite">${activeGalleryIndex + 1} / ${event.images.length}</p>
  ` : '';
  return `
    <div class="event-modal-gallery${event.images.length > 1 ? ' is-carousel' : ''}">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}">
      ${controls}
    </div>
  `;
}

function showGalleryImage(index) {
  if (!activeGalleryEvent) return;
  const total = activeGalleryEvent.images.length;
  activeGalleryIndex = (index + total) % total;
  const gallery = document.querySelector('.event-modal-gallery');
  if (!gallery) return;
  gallery.outerHTML = galleryMarkup(activeGalleryEvent);
  bindGalleryControls();
}

function bindGalleryControls() {
  const gallery = document.querySelector('.event-modal-gallery');
  if (!gallery || !activeGalleryEvent || activeGalleryEvent.images.length < 2) return;
  gallery.querySelector('.event-gallery-prev')?.addEventListener('click', () => showGalleryImage(activeGalleryIndex - 1));
  gallery.querySelector('.event-gallery-next')?.addEventListener('click', () => showGalleryImage(activeGalleryIndex + 1));
  gallery.addEventListener('touchstart', (event) => {
    galleryTouchStartX = event.touches[0]?.clientX ?? null;
  }, { passive: true });
  gallery.addEventListener('touchend', (event) => {
    if (galleryTouchStartX === null) return;
    const endX = event.changedTouches[0]?.clientX ?? galleryTouchStartX;
    const distance = endX - galleryTouchStartX;
    galleryTouchStartX = null;
    if (Math.abs(distance) < 40) return;
    showGalleryImage(activeGalleryIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });
}

function renderModalContent(event) {
  const descItems = event.description.map(d => `<li>${escapeHtml(d)}</li>`).join('');
  const dateMarkup = event.dateDisplay
    ? `<p class="credential-meta"><span>${escapeHtml(event.dateDisplay)}</span></p>`
    : '';
  return `
    <p class="credential-access">${escapeHtml(event.access)}</p>
    <h3 id="eventModalTitle" class="credential-role">${escapeHtml(event.role)}</h3>
    <p class="credential-org">${escapeHtml(event.org)}</p>
    ${dateMarkup}
    <ul>${descItems}</ul>
    ${galleryMarkup(event)}
  `;
}

function openEventModal(id) {
  const event = WORK_EVENTS.find(e => e.id === id);
  if (!event) return;
  lastFocusedEl = document.activeElement;
  const body = document.getElementById('eventModalBody');
  const dialog = document.getElementById('eventModal');
  if (!body || !dialog) return;
  activeGalleryEvent = event;
  activeGalleryIndex = 0;
  body.innerHTML = renderModalContent(event);
  dialog.showModal();
  bindGalleryControls();
  document.getElementById('eventModalClose')?.focus();
}

function closeEventModal() {
  document.getElementById('eventModal')?.close();
}

(function initEventModal() {
  const dialog = document.getElementById('eventModal');
  if (!dialog) return;
  document.getElementById('eventModalClose')?.addEventListener('click', closeEventModal);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeEventModal();
  });
  dialog.addEventListener('close', () => {
    activeGalleryEvent = null;
    activeGalleryIndex = 0;
    lastFocusedEl?.focus();
  });
  dialog.addEventListener('keydown', (event) => {
    if (!activeGalleryEvent || activeGalleryEvent.images.length < 2) return;
    if (event.key === 'ArrowLeft') showGalleryImage(activeGalleryIndex - 1);
    if (event.key === 'ArrowRight') showGalleryImage(activeGalleryIndex + 1);
  });
})();

renderWorkEvents();

// Scroll reveal — respects prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');

if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}
