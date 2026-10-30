(()=>{
 'use strict';
 const t=s=>window.BatumiI18n?.t(s)||s;
 const status=document.getElementById('uiStatus');let statusTimer;
 function announce(message){if(!status)return;status.textContent=t(message);status.hidden=false;clearTimeout(statusTimer);statusTimer=setTimeout(()=>status.hidden=true,5000);}
 const menu=document.getElementById('mobileMenu'),menuButton=document.querySelector('.menu-toggle');
 function setMenu(open){if(!menu)return;menu.hidden=!open;menuButton?.setAttribute('aria-expanded',String(open));menuButton?.setAttribute('aria-label',t(open?'Закрыть меню':'Открыть меню'));}
 function closeMenu(){setMenu(false);}
 menuButton?.addEventListener('click',()=>setMenu(menu.hidden));
 document.addEventListener('click',e=>{if(e.target.closest('a[href^="#"],a[href^="/#"]')||!e.target.closest('.site-header'))closeMenu();});
 window.addEventListener('hashchange',closeMenu);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu&&!menu.hidden){closeMenu();menuButton.focus();}});
 let favorites=new Set();try{const saved=JSON.parse(localStorage.getItem('bh3-favorites')||'[]');if(Array.isArray(saved))favorites=new Set(saved.filter(x=>typeof x==='string'));}catch{}
 function drawFavorites(){document.querySelectorAll('[data-favorite]').forEach(button=>{const on=favorites.has(button.dataset.favorite);button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-label',t(on?'Убрать из избранного':'Добавить в избранное'));});}
 document.addEventListener('click',e=>{const b=e.target.closest('[data-favorite]');if(!b)return;const id=b.dataset.favorite;if(favorites.has(id))favorites.delete(id);else favorites.add(id);try{localStorage.setItem('bh3-favorites',JSON.stringify([...favorites]));}catch{announce('Избранное доступно до закрытия страницы.');}drawFavorites();if(favoritesOnly){renderFavorites();const next=document.querySelector('#favoritesGrid [data-favorite]')||document.getElementById('favoritesTitle');next?.focus({preventScroll:true});}});
 const cards=[...document.querySelectorAll('.property-card')],results=document.getElementById('searchResults'),rooms=document.getElementById('filterRooms'),kind=document.getElementById('filterKind');let favoritesOnly=location.hash==='#favorites';
 const favoritesSection=document.getElementById('favorites'),favoritesGrid=document.getElementById('favoritesGrid');
 function renderFavorites(){if(!favoritesGrid)return;const selected=cards.filter(card=>favorites.has(card.dataset.propertyId));favoritesGrid.replaceChildren(...selected.map(card=>{const copy=card.cloneNode(true);copy.removeAttribute('id');copy.hidden=false;return copy;}));document.getElementById('favoritesEmpty').hidden=selected.length>0;document.getElementById('favoritesCount').textContent=selected.length?t('Сохранено квартир')+': '+selected.length:'';}
 function filter(){let count=0;for(const card of cards){const d=card.dataset;const okay=(d.type!=='long'||(!rooms?.value||d.rooms===rooms.value)&&(!kind?.value||d.kind===kind.value));card.hidden=!okay;if(okay)count++;}
 for(const section of document.querySelectorAll('.catalog-section')){const visible=[...section.querySelectorAll('.property-card')].some(c=>!c.hidden);section.querySelector('.empty-state').hidden=visible;section.hidden=favoritesOnly;}
 if(favoritesSection){favoritesSection.hidden=!favoritesOnly;if(favoritesOnly)renderFavorites();}
 document.querySelectorAll('.bottom-nav a').forEach(a=>{const active=(a.hash||'#top')===(location.hash||'#top');a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
 document.querySelectorAll('#search [data-rental]').forEach(a=>{const active=a.hash===(location.hash||'#daily');a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
 if(results){results.hidden=favoritesOnly||!rooms?.value&&!kind?.value;results.textContent=t('Найдено')+': '+count;}

 }
 rooms?.addEventListener('change',filter);kind?.addEventListener('change',filter);
 document.getElementById('resetSearch')?.addEventListener('click',()=>{favoritesOnly=false;if(rooms)rooms.value='';if(kind)kind.value='';if(location.hash==='#favorites')history.replaceState(null,'','#apartments');filter();});
 window.addEventListener('hashchange',()=>{favoritesOnly=location.hash==='#favorites';if(favoritesOnly){filter();favoritesSection?.scrollIntoView({block:'start'});}else if(cards.length)filter();});
 document.querySelectorAll('a[href="#daily"],a[href="/#daily"],a[href="#apartments"],a[href="/#apartments"]').forEach(a=>a.addEventListener('click',e=>{if(!cards.length)return;e.preventDefault();favoritesOnly=false;const hash=a.hash;history.pushState(null,'',hash);filter();document.querySelector(hash)?.scrollIntoView({block:'start'});}));
 document.querySelectorAll('a[href="/#favorites"]').forEach(a=>a.addEventListener('click',e=>{if(!cards.length)return;e.preventDefault();if(location.hash==='#favorites'){favoritesOnly=true;filter();favoritesSection?.scrollIntoView({block:'start'});}else location.hash='favorites';}));
 document.querySelectorAll('[data-apartment]').forEach(a=>{const href=a.getAttribute('href');if(!href?.startsWith('https://t.me/'))return;const url=new URL(href);url.searchParams.set('text','Здравствуйте! Интересует квартира: '+a.dataset.apartment);a.href=url.href;});
 const gallery=document.getElementById('propertyGallery'),galleryImage=gallery?.querySelector('.gallery-image'),photoButtons=[...document.querySelectorAll('.gallery-thumb')];let photoIndex=0,zoom=1,swipe=0;
 function showPhoto(i){photoIndex=(i+photoButtons.length)%photoButtons.length;const source=photoButtons[photoIndex].querySelector('img');galleryImage.src=source.src;galleryImage.alt=source.alt;zoom=1;galleryImage.style.transform='';document.getElementById('galleryCounter').textContent=(photoIndex+1)+' / '+photoButtons.length;}
 document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{if(!gallery)return;showPhoto(Number(b.dataset.photo));gallery.showModal();}));
 gallery?.querySelector('.gallery-close').addEventListener('click',()=>gallery.close());gallery?.querySelector('.gallery-prev').addEventListener('click',()=>showPhoto(photoIndex-1));gallery?.querySelector('.gallery-next').addEventListener('click',()=>showPhoto(photoIndex+1));gallery?.querySelector('.gallery-zoom').addEventListener('click',()=>{zoom=zoom===1?2:1;galleryImage.style.transform='scale('+zoom+')';});
 gallery?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}});
 galleryImage?.addEventListener('pointerdown',e=>{swipe=e.clientX;});galleryImage?.addEventListener('pointerup',e=>{const delta=e.clientX-swipe;if(zoom===1&&Math.abs(delta)>60)showPhoto(photoIndex+(delta<0?1:-1));});
 document.getElementById('shareProperty')?.addEventListener('click',async()=>{const url=location.href;if(navigator.share){try{await navigator.share({title:document.title,url});return;}catch(e){if(e.name==='AbortError')return;}}try{await navigator.clipboard.writeText(url);announce('Ссылка скопирована');}catch{announce('Скопируйте ссылку из адресной строки браузера.');}});
 function restoreSearch(){let saved;try{saved=JSON.parse(sessionStorage.getItem('bh3-search')||'null');}catch{}if(!saved)return;const date=document.getElementById('checkin')||document.getElementById('moveDate'),guest=document.getElementById('guests')||document.getElementById('leadGuests');if(date&&!date.value&&/^\d{4}-\d{2}-\d{2}$/.test(saved.date)&&(!date.min||saved.date>=date.min)){date.value=saved.date;date.dispatchEvent(new Event('change',{bubbles:true}));}if(guest&&!guest.value&&/^[1-5]$/.test(saved.guests)){guest.value=saved.guests;guest.dispatchEvent(new Event('input',{bubbles:true}));}}
 document.addEventListener('batumi:language',()=>{setMenu(menu&&!menu.hidden);drawFavorites();if(cards.length)filter();});
 drawFavorites();if(cards.length)filter();if(favoritesOnly)favoritesSection?.scrollIntoView({block:'start'});restoreSearch();
})();
