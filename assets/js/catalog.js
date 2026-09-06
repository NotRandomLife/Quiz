/* QuizMania.it — Catalog rendering for static pages
   Expects a container with [data-qm-catalog] and optional filters:
   - data-filter="scuola|adulti|fasce_eta|patenti|all"
   - data-age="3-5|6-8|9-11|12-14|15-18" etc.
*/

(function(){
  "use strict";

  function escapeHTML(s){
    return String(s)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/\"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function fmtAge(min,max){
    if(min === null || min === undefined) return "";
    if(max === null || max === undefined) return `${min}+`;
    return `${min}–${max}`;
  }

  function getStats(){
    try{
      return (window.QuizMania && window.QuizMania.getStats) ? window.QuizMania.getStats() : {};
    }catch(_){return {};}
  }

  function statForHref(stats, href){
    if(!stats || !stats.quizzes) return null;
    const p = href.replace(/\/+$/,'');
    for(const k of Object.keys(stats.quizzes)){
      if(k.includes(p)) return stats.quizzes[k];
    }
    return null;
  }

  async function loadCatalog(){
    const res = await fetch('/assets/data/quizzes.json', {cache:'no-cache'});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if(!Array.isArray(data)) throw new Error('Invalid catalog');
    return data;
  }

  function renderCard(q, stats){
    const s = statForHref(stats, q.href);
    const best = s && s.best ? `Best: ${s.best}` : "";
    const plays = s && s.plays ? `${s.plays}x` : "";
    const age = q.ageMin !== undefined ? fmtAge(q.ageMin, q.ageMax) : "";
    const chips = [];
    if(q.level) chips.push(q.level);
    if(age) chips.push(`Età ${age}`);
    if(best) chips.push(best);
    if(plays) chips.push(plays);

    const chipHTML = chips.map(c=>`<span class="qm-chip">${escapeHTML(c)}</span>`).join('');

    return `
      <a class="qm-card" href="${escapeHTML(q.href)}">
        <div class="qm-card-icon">${escapeHTML(q.emoji || '🎯')}</div>
        <div>
          <div class="qm-card-title">${escapeHTML(q.title)}</div>
          <div class="qm-card-desc">${escapeHTML(q.desc || 'Allenati con domande nuove e dinamiche.')}</div>
          <div class="qm-card-meta">${chipHTML}</div>
        </div>
      </a>
    `;
  }

  function filterItems(items, el){
    const f = (el.getAttribute('data-filter') || 'all').toLowerCase();
    const age = (el.getAttribute('data-age') || '').trim();
    let out = items.slice();
    if(f !== 'all') out = out.filter(x=>String(x.group||'').toLowerCase() === f);
    if(age){
      out = out.filter(x=>String(x.ageTag||'') === age);
    }
    return out;
  }

  function attachSearch(items, renderFn){
    const inp = document.querySelector('[data-qm-search]');
    if(!inp) return;
    inp.addEventListener('input', ()=>{
      const q = (inp.value || '').trim().toLowerCase();
      if(!q){
        renderFn(items);
        return;
      }
      const filtered = items.filter(x=>{
        const blob = `${x.title||''} ${x.desc||''} ${x.group||''} ${x.level||''}`.toLowerCase();
        return blob.includes(q);
      });
      renderFn(filtered);
    });
  }

  async function boot(){
    const containers = Array.from(document.querySelectorAll('[data-qm-catalog]'));
    if(!containers.length) return;
    let items = [];
    try{
      items = await loadCatalog();
    }catch(err){
      containers.forEach(c=>{
        c.innerHTML = `<div class="qm-card" style="grid-column: span 12;"><div class="qm-card-icon">⚠️</div><div><div class="qm-card-title">Catalogo non disponibile</div><div class="qm-card-desc">Impossibile caricare /assets/data/quizzes.json (${String(err && err.message || err)}).</div></div></div>`;
      });
      return;
    }
    const stats = getStats();

    const renderInto = (c, subset)=>{
      const filtered = filterItems(subset, c);
      c.innerHTML = filtered.map(q=>renderCard(q, stats)).join('');
    };

    containers.forEach(c=>renderInto(c, items));

    // optional search binds to the first catalog container
    attachSearch(items, (subset)=>{
      containers.forEach(c=>renderInto(c, subset));
    });
  }

  document.addEventListener('DOMContentLoaded', boot);

})();
