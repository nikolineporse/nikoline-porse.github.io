// Mobile nav toggle
const PALETTE_STORAGE_KEY = 'nikoline-color-experiment';
const PALETTE_DEFAULTS = {
  paper: '#FFFFFF',
  ink: '#000000',
  'content-frame': '#752329',
  'pattern-stripe-a': '#752329',
  'pattern-stripe-b': '#2E62A3'
};

function normalizeHex(value) {
  const match = String(value).trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  const hex = match[1].length === 3
    ? match[1].split('').map(character => character + character).join('')
    : match[1];
  return `#${hex.toUpperCase()}`;
}

function applyPalette(palette) {
  const root = document.documentElement;
  Object.entries(palette).forEach(([token, color]) => {
    root.style.setProperty(`--${token}`, color);
  });

  // The current design aliases these semantic accents to the text color.
  ['oxblood', 'oxblood-deep', 'brass', 'slate'].forEach(token => {
    root.style.setProperty(`--${token}`, palette.ink);
  });
}

function storedPalette() {
  try {
    const saved = JSON.parse(localStorage.getItem(PALETTE_STORAGE_KEY));
    if (!saved) return null;
    const palette = { ...PALETTE_DEFAULTS, ...saved };
    return Object.values(palette).every(normalizeHex) ? palette : null;
  } catch {
    return null;
  }
}

const initialPalette = storedPalette();
if (initialPalette) applyPalette(initialPalette);

function initPaletteLab() {
  const lab = document.querySelector('.palette-lab');
  if (!lab) return;

  const inputs = [...lab.querySelectorAll('[data-palette-token]')];
  const pickers = [...lab.querySelectorAll('[data-palette-picker]')];
  const status = lab.querySelector('[data-palette-status]');
  let palette = initialPalette || { ...PALETTE_DEFAULTS };

  function showStatus(message) {
    status.textContent = message;
  }

  function syncInputs() {
    inputs.forEach(input => {
      const color = palette[input.dataset.paletteToken];
      input.value = color;
      input.removeAttribute('aria-invalid');
    });
    pickers.forEach(picker => {
      picker.value = palette[picker.dataset.palettePicker];
    });
  }

  function saveAndApply() {
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, JSON.stringify(palette));
    } catch {
      // Preview still works when storage is unavailable (for example, file://).
    }
    applyPalette(palette);
    syncInputs();
  }

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const color = normalizeHex(input.value);
      input.toggleAttribute('aria-invalid', !color);
      if (!color) return;
      palette[input.dataset.paletteToken] = color;
      saveAndApply();
      showStatus('Preview saved locally.');
    });

    input.addEventListener('paste', event => {
      const pasted = event.clipboardData?.getData('text') || '';
      const colors = pasted.match(/#?[0-9a-f]{6}\b|#?[0-9a-f]{3}\b/gi)?.map(normalizeHex);
      if (!colors || colors.length < inputs.length) return;
      event.preventDefault();
      inputs.forEach((field, index) => {
        palette[field.dataset.paletteToken] = colors[index];
      });
      saveAndApply();
      showStatus('Five-color palette applied.');
    });
  });

  pickers.forEach(picker => {
    picker.addEventListener('input', () => {
      palette[picker.dataset.palettePicker] = normalizeHex(picker.value);
      saveAndApply();
      showStatus('Preview saved locally.');
    });
  });

  lab.querySelector('[data-palette-reset]').addEventListener('click', () => {
    palette = { ...PALETTE_DEFAULTS };
    localStorage.removeItem(PALETTE_STORAGE_KEY);
    applyPalette(palette);
    syncInputs();
    showStatus('Original branch colors restored.');
  });

  lab.querySelector('[data-palette-copy]').addEventListener('click', async () => {
    const reproduciblePalette = {
      paper: palette.paper,
      ink: palette.ink,
      oxblood: palette.ink,
      'oxblood-deep': palette.ink,
      brass: palette.ink,
      slate: palette.ink,
      'content-frame': palette['content-frame'],
      'pattern-stripe-a': palette['pattern-stripe-a'],
      'pattern-stripe-b': palette['pattern-stripe-b']
    };
    const css = `:root {\n${Object.entries(reproduciblePalette)
      .map(([token, color]) => `  --${token}: ${color};`)
      .join('\n')}\n}`;
    try {
      await navigator.clipboard.writeText(css);
      showStatus('CSS copied.');
    } catch {
      showStatus('Clipboard unavailable; use the fields above.');
    }
  });

  syncInputs();
  applyPalette(palette);
}

initPaletteLab();

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
    org: 'Assouline · 817 Madison Avenue',
    dateDisplay: 'May 13, 2026',
    sortDate: '2026-05-13',
    description: [
      "Represented Assouline throughout an intimate cocktail reception celebrating the launch of Achille Salvagni, a new monograph dedicated to the Rome-based designer's blend of ancient craftsmanship and modern imagination",
      'Welcomed collectors, designers, gallerists, and tastemakers, shared memorable details about the publication and served as an on-site resource for guest questions',
      'Helped guests connect with the story behind the release and the cultural world surrounding Salvagni’s work'
    ],
    images: [
      { src: 'assets/work/achille-salvagni-launch-01.jpg', alt: 'Copies of the Assouline monograph Achille Salvagni displayed on a round wooden table beneath a sculptural pendant light at the 817 Madison Avenue launch reception' },
      { src: 'assets/work/achille-salvagni-launch-02.jpg', alt: 'Guests gathered beneath an installation of suspended Achille Salvagni books during the Assouline launch reception at 817 Madison Avenue' },
      { src: 'assets/work/achille-salvagni-launch-03.jpg', alt: 'Achille Salvagni books displayed among furniture, lighting, and decorative objects in a warm red room at Assouline 817 Madison Avenue' }
    ]
  },
  {
    id: 'cosmic-desert-party-celsius',
    access: 'Event Activation',
    role: 'Cosmic Desert Party — Celsius',
    org: 'Coachella · via CLD PR',
    dateDisplay: 'April 12, 2024',
    sortDate: '2024-04-12',
    description: ['Managed press logistics and tastemaker outreach for the activation'],
    images: [
      { src: 'assets/work/cosmic-desert-party-celsius-01.jpg', alt: 'Silver, oxblood and mauve sphere sculptures reflected in a still lake at dusk, palm trees and mountains behind, at the Cosmic Desert Party — Celsius activation' }
    ]
  },
  {
    id: 'nyfw-gifting-suites',
    access: 'Event Activation',
    role: 'NYFW Gifting Suites',
    org: 'via CLD PR',
    dateDisplay: 'September 2024',
    sortDate: '2024-09-15',
    description: ['Coordinated celebrity seeding and press logistics across several gifting suites during New York Fashion Week'],
    images: [
      { src: 'assets/work/nyfw-gifting-suites-01.jpg', alt: 'Dozens of canvas CLD PR "NYFW September 2024" tote bags piled up, with cardboard signs marking VIP and press gifting sections' }
    ]
  },
  {
    id: 'roger-federer-publication',
    access: 'Product Launch',
    role: 'Roger Federer — Limited-Edition Publication',
    org: 'Assouline',
    dateDisplay: 'September 4, 2024',
    sortDate: '2024-09-04',
    description: ['Partnered with in-house PR and events teams to plan the launch'],
    images: [
      { src: 'assets/work/roger-federer-limited-edition-publication-01.jpg', alt: 'Roger Federer seated at a signing table, pen in hand, surrounded by stacks of his limited-edition Assouline publication displayed against a red accent wall' }
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
      { src: 'assets/work/point-of-view-beauty-pop-up-01.jpg', alt: 'Point of View Beauty skincare products — Drip It, Drench It, Whip It, Glaze It, and Amp It — displayed on a white pedestal beneath a large white floral arrangement against a blue wood-paneled wall' }
    ]
  },
  {
    id: 'derrick-rose-signing',
    access: 'Author Signing',
    role: 'Derrick Rose — Book Signing',
    org: 'Assouline',
    dateDisplay: 'February 14, 2026',
    sortDate: '2026-02-14',
    description: ['Partnered with in-house PR and events teams to plan the signing'],
    images: [
      { src: 'assets/work/derrick-rose-book-signing-01.jpg', alt: 'Derrick Rose signing copies of his book "The Poohprint" at Assouline, flanked by two colleagues holding bouquets of red roses, with a red accent wall and stacked book display behind' }
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
