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
    org: 'Assouline · 817 Madison Avenue',
    dateDisplay: 'May 13, 2026',
    sortDate: '2026-05-13',
    description: [
      "Represented Assouline throughout an intimate cocktail reception celebrating the launch of Achille Salvagni, a new monograph dedicated to the Rome-based designer's blend of ancient craftsmanship and modern imagination",
      'Welcomed collectors, designers, gallerists, and tastemakers, shared memorable details about the publication and served as an on-site resource for guest questions',
      'Helped guests connect with the story behind the release and the cultural world surrounding Salvagni’s work'
    ],
    images: [
      { src: 'assets/work/achille-salvagni-launch-01.jpg', alt: 'Copies of the Assouline monograph Achille Salvagni displayed on a round wooden table beneath a sculptural pendant light at the 817 Madison Avenue launch reception' }
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

function renderModalContent(event) {
  const gallery = event.images.map(img =>
    `<img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}">`
  ).join('');
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
    <div class="event-modal-gallery">${gallery}</div>
  `;
}

function openEventModal(id) {
  const event = WORK_EVENTS.find(e => e.id === id);
  if (!event) return;
  lastFocusedEl = document.activeElement;
  const body = document.getElementById('eventModalBody');
  const dialog = document.getElementById('eventModal');
  if (!body || !dialog) return;
  body.innerHTML = renderModalContent(event);
  dialog.showModal();
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
    lastFocusedEl?.focus();
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
