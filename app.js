const siteTitle = 'linkchain';

const links = [
  {
    slug: 'studio',
    title: 'studio',
    searchName: 'studio notes portfolio',
    url: 'https://example.com/studio',
    description: 'Current work, references, and quiet notes from the studio floor.',
    accent: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(98, 98, 98, 0.2))'
  },
  {
    slug: 'journal',
    title: 'journal',
    searchName: 'journal essays thoughts',
    url: 'https://example.com/journal',
    description: 'Fragments, essays, and thoughts released in small, deliberate bursts.',
    accent: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(50, 50, 50, 0.18))'
  },
  {
    slug: 'shop',
    title: 'shop',
    searchName: 'shop objects archive',
    url: 'https://example.com/shop',
    description: 'Objects, prints, and selected editions released for purchase.',
    accent: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(24, 24, 24, 0.22))'
  },
  {
    slug: 'contact',
    title: 'contact',
    searchName: 'contact email hello',
    url: 'https://example.com/contact',
    description: 'For commissions, collaborations, and a short note with no friction.',
    accent: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(120, 120, 120, 0.18))'
  }
];

const siteTitleEl = document.querySelector('#site-title');
const searchEl = document.querySelector('#search');
const listEl = document.querySelector('#links');
const detailEl = document.querySelector('#detail');

siteTitleEl.textContent = siteTitle;

function filterLinks(term) {
  const query = term.trim().toLowerCase();

  if (!query) {
    return links;
  }

  return links.filter((link) => {
    const haystack = `${link.title} ${link.searchName}`.toLowerCase();
    return haystack.includes(query);
  });
}

function renderLinks() {
  const filtered = filterLinks(searchEl.value);

  if (!filtered.length) {
    listEl.innerHTML = '<div class="link-card" style="min-height: 180px; display:grid; place-items:center; padding: 20px; color: rgba(255,255,255,0.7);">no matches</div>';
    return;
  }

  listEl.innerHTML = filtered
    .map(
      (link) => `
        <article class="link-card" data-slug="${link.slug}" tabindex="0" role="button" aria-label="Open ${link.title}">
          <div class="window-bar">
            <span class="window-dot"></span>
            <span class="window-dot"></span>
            <span class="window-dot"></span>
          </div>

          <div class="link-body">
            <div class="link-topbar">
              <span>open</span>
              <span class="open-mark">↗</span>
            </div>

            <div class="link-preview" style="background:${link.accent};">
              <span>${link.title}</span>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  listEl.querySelectorAll('.link-card').forEach((card) => {
    card.addEventListener('click', () => openLink(card.dataset.slug));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLink(card.dataset.slug);
      }
    });
  });
}

function renderDetail(slug) {
  const link = links.find((item) => item.slug === slug);

  if (!link) {
    detailEl.classList.remove('visible');
    detailEl.innerHTML = '';
    return;
  }

  detailEl.classList.add('visible');
  detailEl.innerHTML = `
    <h3>${link.title}</h3>
    <p>${link.description}</p>

    <div class="detail-actions">
      <a href="${link.url}" target="_blank" rel="noopener">Open link</a>
      <button type="button" data-close="true">Close</button>
    </div>
  `;

  const closeBtn = detailEl.querySelector('[data-close="true"]');
  closeBtn.addEventListener('click', () => {
    history.pushState(null, '', window.location.pathname);
    detailEl.classList.remove('visible');
    detailEl.innerHTML = '';
  });
}

function openLink(slug) {
  const selected = links.find((link) => link.slug === slug);

  if (!selected) return;

  history.pushState(null, '', `#/${selected.slug}`);
  renderDetail(selected.slug);
  window.open(selected.url, '_blank', 'noopener,noreferrer');
}

searchEl.addEventListener('input', renderLinks);

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#/', '');
  if (hash) {
    renderDetail(hash);
  } else {
    detailEl.classList.remove('visible');
    detailEl.innerHTML = '';
  }
});

renderLinks();
