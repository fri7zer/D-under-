(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const normalize = value => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  // Complete, centralized search index. Add future artists and projects here.
  const searchIndex = [];
  const seen = new Set();
  $$('.artist-card[data-artist]').forEach(card => {
    const id = card.dataset.artist;
    if (seen.has(`artist:${id}`)) return;
    seen.add(`artist:${id}`);
    searchIndex.push({ type: 'Artiste', id, label: $('h3', card)?.textContent || id, detail: $('.artist-description', card)?.textContent || 'Profil D-UNDER' });
  });
  $$('.release-card [data-listen], .track-list [data-listen], .music-action-card[data-listen]').forEach(node => {
    const key = node.dataset.listen;
    if (!key || seen.has(`track:${key}`)) return;
    seen.add(`track:${key}`);
    const [artist, title] = key.split('|');
    searchIndex.push({ type: 'Morceau', id: key, label: title, detail: artist, listen: true });
  });
  searchIndex.push(
    { type: 'Projet', id: 'alien-xp', label: 'ALIEN XP', detail: 'Kemi2Vinci', anchor: '#largage' },
    { type: 'Projet', id: 'kribi', label: 'KRIBI', detail: 'Erton', anchor: '#largage' },
    { type: 'Rubrique', id: 'lexique', label: 'Lexique Mboko', detail: 'Bientôt disponible', anchor: '#lexique' }
  );

  const searchInput = $('#global-search');
  const results = $('#search-results');
  function renderSearch(query) {
    const q = normalize(query);
    if (!q) { results.innerHTML = '<p>Commence à saisir pour explorer la culture.</p>'; return; }
    const matches = searchIndex.filter(item => normalize(`${item.label} ${item.detail} ${item.type}`).includes(q)).slice(0, 12);
    results.innerHTML = matches.length ? matches.map((item, index) => `<button class="search-result" type="button" data-result="${index}"><span><strong>${item.label}</strong><br><small>${item.detail}</small></span><small>${item.type} →</small></button>`).join('') : '<p>Aucun résultat dans la base D-UNDER.</p>';
    $$('.search-result', results).forEach((button, index) => button.addEventListener('click', () => openResult(matches[index])));
  }
  function openResult(item) {
    $('.search-modal')?.close();
    if (item.type === 'Artiste') {
      const card = $(`.artist-card[data-artist="${CSS.escape(item.id)}"]`);
      card?.click();
    } else if (item.listen) {
      const trigger = $(`[data-listen="${CSS.escape(item.id)}"]`);
      trigger?.click();
    } else if (item.anchor) {
      location.hash = item.anchor;
      $(item.anchor)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }
  searchInput?.addEventListener('input', event => renderSearch(event.target.value));
  $('.search-open')?.addEventListener('click', () => setTimeout(() => searchInput?.focus(), 30));

  // Dynamic Focus: samples the full artist base, not only initially visible cards.
  const focusCatalog = $('#artist-catalog');
  const artistSources = [...new Map($$('.artist-card[data-artist]').map(card => [card.dataset.artist, card.cloneNode(true)])).values()];
  let focusOffset = 0;
  function renderFocus() {
    if (!focusCatalog || !artistSources.length) return;
    focusOffset = (focusOffset + 4) % artistSources.length;
    const selection = Array.from({ length: Math.min(4, artistSources.length) }, (_, i) => artistSources[(focusOffset + i) % artistSources.length].cloneNode(true));
    focusCatalog.replaceChildren(...selection);
  }
  $('#focus .shuffle-button')?.addEventListener('click', renderFocus);

  // Music tabs expose honest filtered states; no fake external metrics.
  const musicArticles = $$('#music-catalog > article');
  $$('.music-tabs button').forEach((button, index) => {
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    button.addEventListener('click', () => {
      $$('.music-tabs button').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      button.classList.add('active'); button.setAttribute('aria-selected', 'true');
      musicArticles.forEach(article => { article.hidden = index === 2 ? !article.classList.contains('editorial-focus') : false; });
      if (index === 1 || index === 3) $('#music-catalog').dataset.notice = 'Données externes en attente de connexion officielle';
      else delete $('#music-catalog').dataset.notice;
    });
  });
  $('#musique .shuffle-button')?.addEventListener('click', () => {
    const list = $('#music-catalog');
    [...musicArticles].sort(() => Math.random() - .5).forEach(article => list.append(article));
  });

  const chartCopy = {
    artists: ['Top artistes bientôt disponible.', "D-UNDER publiera ce classement dès qu’un jeu de données officiel, comparable et daté sera disponible."],
    tracks: ['Top morceaux bientôt disponible.', "Les liens d’écoute restent accessibles dans Musique. Aucun nombre de streams n’est inventé ici."]
  };
  $$('.chart-tabs button').forEach(button => button.addEventListener('click', () => {
    $$('.chart-tabs button').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    button.classList.add('active'); button.setAttribute('aria-selected', 'true');
    const [title, copy] = chartCopy[button.dataset.chartTab];
    $('#chart-panel h3').textContent = title; $('#chart-panel p').textContent = copy;
  }));

  const tracklists = {
    'alien-xp': { title: 'ALIEN XP — KEMI2VINCI', html: '<p class="tracklist-unavailable">La liste officielle des titres est disponible sur la page du projet. D-UNDER ne recopie aucun titre non vérifié.</p><a href="https://untitled.stream/library/project/NI1fi1fhKgLM7UMsKGUa2" target="_blank" rel="noopener">Ouvrir la tracklist officielle ↗</a>' },
    kribi: { title: 'KRIBI — ERTON', html: '<p class="tracklist-unavailable">Tracklist officielle en attente de validation. Elle apparaîtra ici sans donnée fictive dès sa publication.</p>' }
  };
  const tracklistDialog = $('.tracklist-dialog');
  $$('.tracklist-open').forEach(button => button.addEventListener('click', () => {
    const project = tracklists[button.dataset.project];
    $('#tracklist-title').textContent = project.title; $('#tracklist-content').innerHTML = project.html; tracklistDialog?.showModal();
  }));
  $('.tracklist-close')?.addEventListener('click', () => tracklistDialog?.close());
  const lexiqueDialog = $('.lexique-dialog');
  $('.lexique-status')?.addEventListener('click', () => lexiqueDialog?.showModal());
  $('.lexique-close')?.addEventListener('click', () => lexiqueDialog?.close());

  // Language preference placeholder and backward-compatible preference migration.
  try {
    const legacy = localStorage.getItem('dunder-mboa-language');
    if (legacy && !localStorage.getItem('dunder-mboko-language')) localStorage.setItem('dunder-mboko-language', legacy);
    localStorage.removeItem('dunder-mboa-language');
  } catch (_) {}
  $$('[data-mboko-lang]').forEach(button => button.addEventListener('click', () => {
    const lang = button.dataset.mbokoLang;
    $$('[data-mboko-lang]').forEach(b => { const active = b.dataset.mbokoLang === lang; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    document.documentElement.dataset.mbokoLanguage = lang;
    try { localStorage.setItem('dunder-mboko-language', lang); } catch (_) {}
    const notice = $('.mboa-language-notice'); if (notice) { notice.classList.add('visible'); setTimeout(() => notice.classList.remove('visible'), 2600); }
  }));

  // Every placeholder editorial link has an explicit, honest state.
  $$('.editorial a[href="#"]').forEach(link => { link.removeAttribute('href'); link.setAttribute('aria-disabled', 'true'); link.textContent = 'Histoires — bientôt disponibles'; });
})();
