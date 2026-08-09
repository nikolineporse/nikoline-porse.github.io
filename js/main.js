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
    id: 'cosmic-desert-party-celsius',
    access: 'Event Activation',
    role: 'Cosmic Desert Party — Celsius',
    org: 'Coachella · via CLD PR',
    dateDisplay: 'April 12, 2024',
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
    description: ['Partnered with in-house PR and events teams to plan the launch'],
    images: [
      { src: 'assets/work/roger-federer-limited-edition-publication-01.jpg', alt: 'Roger Federer seated at a signing table, pen in hand, surrounded by stacks of his limited-edition Assouline publication displayed against a red accent wall' }
    ]
  },
  {
    id: 'derrick-rose-signing',
    access: 'Author Signing',
    role: 'Derrick Rose — Book Signing',
    org: 'Assouline',
    dateDisplay: 'February 14, 2026',
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

  const withPhotos = WORK_EVENTS.filter(e => e.images.length > 0);
  const withoutPhotos = WORK_EVENTS.filter(e => e.images.length === 0);

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
