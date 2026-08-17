const siteTitle = 'linkchain';

const normalizeUrl = (value) => {
  const normalized = String(value || '').trim();

  if (!normalized) {
    return '';
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return `https://${normalized}`;
};

const makePreview = (label, dark, light) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 180">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${light}" />
          <stop offset="100%" stop-color="${dark}" />
        </linearGradient>
      </defs>
      <rect width="300" height="180" fill="#111111"/>
      <rect x="18" y="18" width="264" height="144" rx="0" fill="url(#g)"/>
      <rect x="30" y="30" width="240" height="120" fill="none" stroke="rgba(255,255,255,0.28)"/>
      <text x="150" y="98" fill="#f3efe9" font-size="42" text-anchor="middle" font-family="Georgia, serif" letter-spacing="2">${label}</text>
      <text x="150" y="126" fill="rgba(243,239,233,0.7)" font-size="12" text-anchor="middle" font-family="Segoe UI, sans-serif" letter-spacing="5">LINKCHAIN</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const faviconUrl = (siteUrl) => {
  try {
    const hostname = new URL(siteUrl).hostname.replace(/^www\./, '');
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`;
  } catch (error) {
    return '';
  }
};

const links = [
  {
    slug: 'Lovable',
    title: 'Lovable',
    searchName: 'lovable website loveable',
    url: normalizeUrl('https://lovable.dev/dashboard?utm_device=c&utm_source=google&utm_medium=paid_search_branded&utm_campaign=google-us-b2c-prospecting-evergreen-subscription-US+-+Search+-+Lovable+-+CORE&campaignid=23072209374&gad_source=1&gad_campaignid=23072209374&gbraid=0AAAAA-iIxGfktdU3ccJsTcdcJeTQyNvoV&gclid=Cj0KCQjw4orUBhCjARIsAIbF3qx1_ZG21--yKQ3jAzowvRURCV0T8ioq_8G9-CVKmb6dL3yOJ5Xlwe0aAmE3EALw_wcB'),
    description: 'Create anything',
    previewImage: faviconUrl('https://lovable.dev/dashboard?utm_device=c&utm_source=google&utm_medium=paid_search_branded&utm_campaign=google-us-b2c-prospecting-evergreen-subscription-US+-+Search+-+Lovable+-+CORE&campaignid=23072209374&gad_source=1&gad_campaignid=23072209374&gbraid=0AAAAA-iIxGfktdU3ccJsTcdcJeTQyNvoV&gclid=Cj0KCQjw4orUBhCjARIsAIbF3qx1_ZG21--yKQ3jAzowvRURCV0T8ioq_8G9-CVKmb6dL3yOJ5Xlwe0aAmE3EALw_wcB'),
    previewFallback: makePreview('ST', '#1a1a1a', '#4b4b4b')
  },
  {
    slug: 'Shopify',
    title: 'Shopify',
    searchName: 'shopify shops shopity',
    url: normalizeUrl('https://www.shopify.com/'),
    description: 'Create your marketplace',
    previewImage: faviconUrl('https://www.shopify.com/'),
    previewFallback: makePreview('JR', '#111111', '#5a5a5a')
  },
  {
    slug: 'Star Wars',
    title: 'Star Wars',
    searchName: 'test poopy caca star wars',
    url: normalizeUrl('starwars.com'),
    description: 'Yeah',
    previewImage: faviconUrl('https://starwars.com/'),
    previewFallback: makePreview('CT', '#111111', '#676767')
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
              <span>↗</span>
            </div>

            <div class="link-title-row">
              <h2>${link.title}</h2>

              <img
                class="link-favicon"
                src="${link.previewImage || link.previewFallback}"
                alt="${link.title} preview"
                onerror="this.onerror=null;this.src='${link.previewFallback}';"
              />
            </div>

            <div class="link-url-shell" data-url="${link.url}">
              <div class="link-url-track">
                <span>${link.url}</span>
                <span>${link.url}</span>
                <span>${link.url}</span>
              </div>
              <span class="copy-status">url copied</span>
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

  listEl.querySelectorAll('.link-url-track').forEach((track) => {
    const width = track.scrollWidth / 2;
    const duration = Math.max(8, width / 90);
    track.style.animationDuration = `${duration}s`;
  });

  listEl.querySelectorAll('.link-url-shell').forEach((shell) => {
    shell.addEventListener('click', async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const url = shell.dataset.url;
      const copyText = async () => {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
          return;
        }

        const helper = document.createElement('textarea');
        helper.value = url;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.left = '-9999px';
        document.body.appendChild(helper);
        helper.select();
        document.execCommand('copy');
        document.body.removeChild(helper);
      };

      try {
        await copyText();
        shell.classList.add('copied');
        setTimeout(() => shell.classList.remove('copied'), 1200);
      } catch (error) {
        shell.classList.add('copied');
        setTimeout(() => shell.classList.remove('copied'), 1200);
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
    <div class="detail-header">
      <h3>${link.title}</h3>
      <button type="button" class="detail-close" data-close="true">close</button>
    </div>
    <p>${link.description}</p>

    <div class="detail-actions">
      <a href="${link.url}" target="_blank" rel="noopener">Open link</a>
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

if (window.location.hash) {
  const hash = window.location.hash.replace('#/', '');
  if (hash) {
    renderDetail(hash);
  }
}

renderLinks();
