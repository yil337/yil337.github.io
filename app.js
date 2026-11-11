(() => {
 const motion = document.querySelector('.motion-toggle');
 let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 try { paused = paused || localStorage.getItem('camp-motion') === 'paused'; } catch {}
 function setMotion(){document.body.classList.toggle('motion-off',paused);if(motion){motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'Resume animations':'Pause animations';}}
 setMotion();
 motion?.addEventListener('click',()=>{paused=!paused;setMotion();try{localStorage.setItem('camp-motion',paused?'paused':'playing');}catch{}});
 const filters=[...document.querySelectorAll('[data-filter]')];
 function applyFilter(category){
  if(!filters.some(b=>b.dataset.filter===category))category='all';
  filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===category)));
  let count=0;document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=category!=='all'&&card.dataset.category!==category;if(!card.hidden)count++;});
  const status=document.querySelector('.filter-count');if(status)status.textContent=`${count} ${count===1?'project':'projects'}`;window.dispatchEvent(new Event('portfolio-relayout'));
 }
 if(filters.length){applyFilter(new URL(location.href).searchParams.get('work')||'all');filters.forEach(button=>button.addEventListener('click',()=>{const c=button.dataset.filter;applyFilter(c);const url=new URL(location.href);if(c==='all')url.searchParams.delete('work');else url.searchParams.set('work',c);history.replaceState(null,'',url);}));window.addEventListener('popstate',()=>applyFilter(new URL(location.href).searchParams.get('work')||'all'));}
 const box=document.querySelector('.lightbox');
 document.querySelectorAll('.zoom-image').forEach(button=>button.addEventListener('click',()=>{const image=box.querySelector('img');image.src=button.dataset.src;image.alt=button.dataset.caption;box.querySelector('p').textContent=button.dataset.caption;box.showModal();}));
 box?.querySelector('.close-lightbox').addEventListener('click',()=>box.close());
 box?.addEventListener('click',event=>{if(event.target===box){const r=box.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)box.close();}});
})();
(() => {
 const toggle=document.querySelector('.menu-toggle'),links=document.querySelector('.nav-links');
 const close=()=>{links.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu +';};
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Close −':'Menu +';links.classList.toggle('is-open',open);});
 links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&links?.classList.contains('is-open')){close();toggle.focus();}});
})();
