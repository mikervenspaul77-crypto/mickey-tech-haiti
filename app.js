/* MICKEY TECH — amélioration fonctionnelle sans changer la structure d'origine.
   Visuels: photos de véritables modèles sur Wikimedia Commons; crédits: CREDITS_IMAGES.md.
   Prix, stock et paiements: non confirmés, ne pas inventer. */
(() => {
 'use strict';
 const $=(s,root=document)=>root.querySelector(s);
 const $$=(s,root=document)=>[...root.querySelectorAll(s)];
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const KEY='mickey-original-cart-v2',WISH='mickey-original-wish-v2',ACCOUNT='mickey-account-profile-v1',PHOTO_CACHE='mickey-commons-photo-cache-v2';
 const read=(key,fallback)=>{try {const v=JSON.parse(localStorage.getItem(key));return v??fallback;}catch{return fallback;}};
 const save=(key,v)=>{try{localStorage.setItem(key,JSON.stringify(v));}catch{showToast('Stockage local indisponible','error');}};
 const saveCart=()=>save(KEY,cart);
 const money=x=>Number(x).toLocaleString('fr-FR')+' HTG';
 const priced=p=>typeof p.price==='number'&&Number.isFinite(p.price)&&p.price>=0;
 const products=Array.isArray(window.MICKEY_CATALOG)?window.MICKEY_CATALOG:[];
 const brands=Array.isArray(window.MICKEY_BRANDS)?window.MICKEY_BRANDS:[...new Set(products.map(p=>p.brand))];
 const categories=Array.isArray(window.MICKEY_CATEGORIES)?window.MICKEY_CATEGORIES:[];
 const SOCIAL=window.MICKEY_SOCIAL||{whatsapp:'https://wa.me/50939068588'};
 let cart=read(KEY,[]); if(!Array.isArray(cart))cart=[];
 cart=cart.filter(i=>products.some(p=>p.id===i.id)&&Number.isInteger(i.qty)&&i.qty>0);
 let wishlist=read(WISH,[]);if(!Array.isArray(wishlist))wishlist=[];
 let profile=read(ACCOUNT,{});if(!profile||typeof profile!=='object'||Array.isArray(profile))profile={};
 let photoCache=read(PHOTO_CACHE,{});if(!photoCache||typeof photoCache!=='object'||Array.isArray(photoCache))photoCache={};
 const photoRequests=new Set();let photoQueue=[],photoRequestsActive=0;
 let currentFilter='all',currentCategory='all',currentSort='newest',search='',onlyFavs=false,detailProduct=null,photoIndex=0;
 function photoUrl(path){
   if(typeof path!=='string'||!path.trim())return '';
   if(/^https:\/\/[^<>"']+$/i.test(path))return path;
   if(/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(path))return path;
   if(/^images\/[A-Za-z0-9._-]+\.(png|jpe?g|webp)$/i.test(path))return path;
   if(/^[^/?#<>]+\.(png|jpg|jpeg|webp)$/i.test(path))return 'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(path)+'?width=900';
   return '';
 }
 function commonsSource(p){const metadata=p.photoMetadata?.[photoIndex];if(metadata?.sourceUrl)return metadata.sourceUrl;const name=p.images?.[photoIndex];return name&&!name.startsWith('http')&&!name.startsWith('images/')&&!name.startsWith('data:')?'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(name.replaceAll(' ','_')):'';}
 function ph(p,i=0){const url=photoUrl(p.images?.[i]);return url?`<img src="${esc(url)}" alt="Photo réelle du modèle ${esc(p.name)}" loading="lazy" draggable="false" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="photo-fallback" style="display:none">Photo indisponible</span>`:'<span class="photo-fallback">Photo à ajouter</span>';}
 function normalizeWords(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(/\s+/).filter(Boolean);}
 function expectedPhotoMatch(product,title){
   const words=normalizeWords(title),compact=words.join('');
   const aliases={Samsung:['samsung','galaxy'],Motorola:['motorola','moto'],Apple:['apple','iphone'],'Xiaomi / Redmi':['xiaomi','redmi'],TECNO:['tecno'],itel:['itel'],'M-Horse':['mhorse','horse'],Revel:['revel'],TCL:['tcl'],LG:['lg','stylo'],Oukitel:['oukitel'],BLU:['blu'],MyoTab:['myotab'],Rover:['rover'],Whoop:['whoop'],Bold:['bold'],Celero:['celero']};
   const brandWords=aliases[product.brand]||normalizeWords(product.brand);
   const brandMatches=brandWords.some(word=>words.includes(word)||compact.includes(word));
   if(!brandMatches)return false;
   const nameWords=normalizeWords(product.name.replace(/\b\d+\s*(?:gb|go|ram|pouces)\b/gi,''));
   const markers=nameWords.filter(word=>/\d/.test(word));
   if(markers.length&&!markers.every(marker=>words.includes(marker)||compact.includes(marker)))return false;
  const ignored=new Set([...normalizeWords(product.brand),'samsung','galaxy','motorola','moto','apple','iphone','xiaomi','redmi','tecno','itel','horse','revel','tcl','lg','oukitel','blu','myotab','rover','whoop','bold','celero','go','gb','ram','pouces','vietnam','with','sans','avec','body','court','long','petit','grand','original','oled','incell','screen','display','ecran','écran','4g','5g','pro','max','plus','ultra','fe','note','power','play','stylus','edge','pure','fast','star','prime','core','se','s','x','one','ace','uw','djn','two','flex','2020','2021','2022','2023','2024','2025']);
  const family=nameWords.filter(word=>word.length>2&&!ignored.has(word)&&!/\d/.test(word));
  if(!['screens','charging-flex'].includes(product.category)&&family.length&&!family.some(word=>words.includes(word)))return false;
   if(product.category==='screens'&&!words.some(word=>['screen','display','lcd','oled','amoled','incell','digitizer','touch'].includes(word)))return false;
   if(product.category==='charging-flex'&&!words.some(word=>['flex','charging','charge','connector','port','ribbon'].includes(word)))return false;
   return markers.length>0||family.length>0;
 }
 function searchPhotoUrl(product){return 'https://commons.wikimedia.org/w/index.php?search='+encodeURIComponent(product.brand+' '+product.name)+'&title=Special:MediaSearch&type=image';}
 function photoNote(product){
   const photo=product.photoMetadata?.[0];
   if(photo)return `Photo : <a class="photo-source-link" href="${esc(photo.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(photo.artist||photo.title)} · ${esc(photo.license||'Licence à vérifier')}</a>`;
   if(product.photoSearchDone)return `Photo non trouvée · <a class="photo-source-link" href="${esc(searchPhotoUrl(product))}" target="_blank" rel="noopener noreferrer">Rechercher une image</a>`;
   return product.images?.length?'Photo du modèle · Disponibilité à confirmer':'Recherche d’une photo libre…';
 }
 function applyPhoto(product,photo){product.images=[photo.thumbUrl];product.photoMetadata=[photo];product.photoSearchDone=true;}
 function cachedPhoto(product){
   if(product.images?.length)return;
   const entry=photoCache[product.id];if(!entry)return;
   if(Date.now()-entry.savedAt>30*24*60*60*1000){delete photoCache[product.id];save(PHOTO_CACHE,photoCache);return;}
   product.photoSearchDone=true;if(entry.photo)applyPhoto(product,entry.photo);
 }
 async function findCommonsPhoto(product){
   const modelTerms=normalizeWords(product.name).filter(word=>!/^\d+$/.test(word)&&!['gb','go','ram','vietnam','pouces'].includes(word));
   const brandTerms=normalizeWords(product.brand).filter(word=>!modelTerms.includes(word));
   const params=new URLSearchParams({action:'query',generator:'search',gsrsearch:`${[...brandTerms,...modelTerms].join(' ')} filetype:bitmap`,gsrnamespace:'6',gsrlimit:'8',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'800',format:'json',origin:'*'});
   const response=await fetch('https://commons.wikimedia.org/w/api.php?'+params);
   if(!response.ok)throw new Error('Wikimedia search failed');
   const data=await response.json(),pages=Object.values(data.query?.pages||{}).sort((a,b)=>(a.index||0)-(b.index||0));
   const page=pages.find(candidate=>expectedPhotoMatch(product,candidate.title));if(!page)return null;
   const info=page.imageinfo?.[0];if(!info?.thumburl||!info.descriptionurl)return null;
   const metadata=info.extmetadata||{},artistHtml=metadata.Artist?.value||'';
   const artist=new DOMParser().parseFromString(artistHtml,'text/html').body.textContent.trim();
   return {thumbUrl:info.thumburl,title:page.title.replace(/^File:/,''),sourceUrl:info.descriptionurl,artist,license:metadata.LicenseShortName?.value||'',licenseUrl:metadata.LicenseUrl?.value||''};
 }
 function refreshProductPhoto(product){
   const card=$$('#productsGrid .product-card').find(item=>item.dataset.id===product.id);if(!card)return;
   const image=card.querySelector('.product-image');image.querySelector('.photo-fallback')?.remove();
   if(product.images?.length)image.insertAdjacentHTML('afterbegin',ph(product));
   card.querySelector('.product-note').innerHTML=photoNote(product);
 }
 function queuePhotoSearch(product){
   if(product.images?.length||product.photoSearchDone||photoRequests.has(product.id))return;
   cachedPhoto(product);if(product.photoSearchDone){refreshProductPhoto(product);return;}
   photoRequests.add(product.id);photoQueue.push(product);
   runPhotoQueue();
 }
 function runPhotoQueue(){
   while(photoRequestsActive<3&&photoQueue.length){
     const next=photoQueue.shift();photoRequestsActive++;
     findCommonsPhoto(next).then(photo=>{
       photoCache[next.id]={savedAt:Date.now(),photo};save(PHOTO_CACHE,photoCache);
       next.photoSearchDone=true;if(photo)applyPhoto(next,photo);
       refreshProductPhoto(next);
       if(detailProduct?.id===next.id&&$('#productDialog').open)renderDetailPhoto();
     }).catch(()=>{next.photoSearchDone=true;refreshProductPhoto(next);}).finally(()=>{photoRequests.delete(next.id);photoRequestsActive--;runPhotoQueue();});
   }
 }
 function observeProductPhotos(grid){
   if(!('IntersectionObserver'in window))return;
   const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
     if(!entry.isIntersecting)return;
     observer.unobserve(entry.target);const product=products.find(item=>item.id===entry.target.dataset.photoProduct);
     if(product)queuePhotoSearch(product);
   }),{rootMargin:'300px'});
   grid.querySelectorAll('[data-photo-product]').forEach(card=>observer.observe(card));
 }
 const get=id=>products.find(p=>p.id===id);
 window.showToast=(message,type='success')=>{
   const wrap=$('#toastContainer');if(!wrap)return;
   const toast=document.createElement('div');toast.className='toast '+type;
   const icon=document.createElement('i');icon.className='fas '+(type==='error'?'fa-exclamation-circle':'fa-check-circle');
   const label=document.createElement('span');label.textContent=message;
   toast.append(icon,label);wrap.append(toast);setTimeout(()=>toast.remove(),3800);
 };
 function loadBrandButtons(){
   const available=brands.filter(brand=>currentCategory==='all'||products.some(product=>product.brand===brand&&product.category===currentCategory));
   if(currentFilter!=='all'&&!available.includes(currentFilter))currentFilter='all';
   $('#brandFilters').innerHTML=['all',...available].map(b=>`<button type="button" class="filter-btn${b===currentFilter?' active':''}" data-brand="${esc(b)}">${b==='all'?'Toutes':esc(b)}</button>`).join('');
   $$('#brandFilters button').forEach(btn=>btn.addEventListener('click',()=>{
     currentFilter=btn.dataset.brand;onlyFavs=false;
     $$('#brandFilters button').forEach(b=>b.classList.toggle('active',b===btn));
     renderProducts();
   }));
 }
 function loadCategoryButtons(){
   const total=products.length;
   $('#categoryFilters').innerHTML=[{id:'all',label:'Tout',count:total},...categories.map(category=>({id:category.id,label:category.label,count:products.filter(product=>product.category===category.id).length}))].map(category=>`<button type="button" class="filter-btn${category.id===currentCategory?' active':''}" data-category="${esc(category.id)}">${esc(category.label)} <span class="filter-count">${category.count}</span></button>`).join('');
   $$('#categoryFilters button').forEach(btn=>btn.addEventListener('click',()=>{
     currentCategory=btn.dataset.category;onlyFavs=false;loadCategoryButtons();loadBrandButtons();renderProducts();
   }));
 }
 function filtered(){
   const term=search.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
   let arr=products.filter(p=>(currentCategory==='all'||p.category===currentCategory)&&(currentFilter==='all'||p.brand===currentFilter)&&(!onlyFavs||wishlist.includes(p.id))&&(!term||[p.name,p.brand,p.category,p.series,p.description].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(term)));
   if(currentSort==='name')arr.sort((a,b)=>a.name.localeCompare(b.name,'fr'));
   if(currentSort==='brand')arr.sort((a,b)=>a.brand.localeCompare(b.brand,'fr'));
   return arr;
 }
 function renderProducts(){
   const grid=$('#productsGrid'),items=filtered();
   if(!items.length){grid.innerHTML=`<div class="empty-catalog"><h3>Aucun produit affiché</h3><p>${currentFilter!=='all'?'La collection '+esc(currentFilter)+' sera complétée avec les références exactes et leurs photos.':'Essayez une autre recherche.'}</p><a href="${esc(SOCIAL.whatsapp)}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer" style="margin-top:1rem">Demander sur WhatsApp</a></div>`;return;}
   grid.innerHTML=items.map(p=>{
     cachedPhoto(p);
     const favorite=wishlist.includes(p.id),price=priced(p)?money(p.price):'Prix à confirmer';
    return `<article class="product-card" data-id="${esc(p.id)}" data-photo-product="${esc(p.id)}">
     <button type="button" class="product-wishlist" data-wish="${esc(p.id)}" aria-label="${favorite?'Retirer des':'Ajouter aux'} favoris" title="Favoris"><i class="${favorite?'fas':'far'} fa-heart"></i></button>
     <div class="product-image quick-open" data-open="${esc(p.id)}" role="button" tabindex="0" aria-label="Voir ${esc(p.name)}">${ph(p)}
     <button type="button" class="product-quick-view" data-open="${esc(p.id)}"><i class="fas fa-eye"></i> Voir le produit</button></div>
     <div class="product-info"><div class="product-brand">${esc(p.brand)}</div>
     <h3 class="product-name"><button class="product-name-btn" data-open="${esc(p.id)}">${esc(p.name)}</button></h3>
    <p class="product-note">${photoNote(p)}</p>
     <div class="product-specs">${p.series?`<span class="spec-tag">${esc(p.series)}</span>`:''}<span class="spec-tag">${esc(p.label||'Technologie')}</span></div>
     <div class="product-footer"><div class="product-price price-unknown">${esc(price)}</div>
     <button type="button" class="add-to-cart" data-add="${esc(p.id)}" title="Ajouter à ma sélection" aria-label="Ajouter ${esc(p.name)}"><i class="fas fa-plus"></i></button></div></div></article>`;
   }).join('');
   $$('[data-wish]',grid).forEach(b=>b.addEventListener('click',()=>toggleWishlistItem(b.dataset.wish)));
   $$('[data-open]',grid).forEach(b=>b.addEventListener('click',()=>openProduct(b.dataset.open)));
   $$('.product-image.quick-open',grid).forEach(b=>b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProduct(b.dataset.open);}}));
   $$('[data-add]',grid).forEach(b=>b.addEventListener('click',()=>addToCart(b.dataset.add)));
   observeProductPhotos(grid);
 }
 function addToCart(id){const p=get(id);if(!p)return;const found=cart.find(x=>x.id===id);if(found)found.qty=Math.min(99,found.qty+1);else cart.push({id,qty:1});saveCart();showToast(p.name+' ajouté à votre sélection');updateCartUI();}
 function updateQty(id,delta){const line=cart.find(x=>x.id===id);if(!line)return;line.qty+=delta;if(line.qty<=0)cart=cart.filter(x=>x.id!==id);else line.qty=Math.min(line.qty,99);saveCart();updateCartUI();}
 function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();updateCartUI();}
 function updateCartUI(){
   $('#cartCount').textContent=cart.reduce((sum,x)=>sum+x.qty,0);
   $('#cartItems').innerHTML=cart.length?cart.map(item=>{const p=get(item.id);if(!p)return '';
     return `<div class="cart-item" style="position:relative"><div class="cart-item-image">${ph(p)}</div><div class="cart-item-details"><div class="cart-item-name">${esc(p.name)}</div><div class="cart-item-price">${priced(p)?money(p.price):'Prix à confirmer'}</div><div class="cart-item-actions"><div class="qty-control"><button type="button" class="qty-btn" data-qty="-1" data-id="${esc(p.id)}">−</button><span>${item.qty}</span><button type="button" class="qty-btn" data-qty="1" data-id="${esc(p.id)}">+</button></div></div></div><button type="button" class="remove-item" data-remove="${esc(p.id)}" aria-label="Retirer ${esc(p.name)}"><i class="fas fa-trash"></i></button></div>`;
   }).join(''):'<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Votre sélection est vide</p></div>';
   $$('#cartItems [data-qty]').forEach(b=>b.addEventListener('click',()=>updateQty(b.dataset.id,Number(b.dataset.qty))));
   $$('#cartItems [data-remove]').forEach(b=>b.addEventListener('click',()=>removeFromCart(b.dataset.remove)));
   const allPriced=cart.length&&cart.every(i=>priced(get(i.id)));
   const sum=cart.reduce((s,i)=>s+(priced(get(i.id))?get(i.id).price*i.qty:0),0);
   $('#subtotal').textContent=allPriced?money(sum):'Sur demande';
   $('#cartTotal').textContent=allPriced?money(sum):'À confirmer';
  updateAccountSummary();
 }
 window.toggleCart=()=>document.body.classList.toggle('cart-active');
 window.openCheckout=()=>{
   if(!cart.length)return showToast('Ajoutez un produit à votre sélection','error');
   const lines=['Bonjour MICKEY TECH, je souhaite connaître les prix et disponibilités :',''];
   cart.forEach((line,i)=>{const p=get(line.id);if(p)lines.push(`${i+1}. ${p.brand} ${p.name} × ${line.qty}${priced(p)?' — '+money(p.price):''}`);});
   lines.push('','Pouvez-vous confirmer les modalités de paiement (MonCash, NatCash ou autres) et de livraison ?');
   window.open((SOCIAL.whatsapp||'https://wa.me/50939068588')+'?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener,noreferrer');
 };
 function toggleWishlistItem(id){if(wishlist.includes(id))wishlist=wishlist.filter(x=>x!==id);else wishlist.push(id);save(WISH,wishlist);renderProducts();updateAccountSummary();}
 window.toggleWishlist=()=>{onlyFavs=!onlyFavs;currentFilter='all';currentCategory='all';loadCategoryButtons();loadBrandButtons();renderProducts();$('#products').scrollIntoView({behavior:'smooth'});showToast(onlyFavs?'Vos produits favoris':'Tous les produits');};
 function openProduct(id){const p=get(id);if(!p)return;cachedPhoto(p);detailProduct=p;photoIndex=0;queuePhotoSearch(p);
  $('#productDetail').innerHTML=`<div class="detail-layout"><div><div class="detail-view" id="detailView" tabindex="0" role="button" aria-label="Glisser pour incliner la photo, cliquer pour zoomer"><div id="detailFrame" style="width:100%;display:flex;justify-content:center;align-items:center"></div></div><div class="detail-gallery"><button class="detail-nav" id="detailPrev" title="Photo précédente" type="button">‹</button><div id="detailThumbs" class="detail-gallery"></div><button class="detail-nav" id="detailNext" title="Photo suivante" type="button">›</button></div><div class="photo-caption">Les photos illustrent le modèle et ne confirment pas le stock réel de la boutique.</div></div><div><div class="detail-brand">${esc(p.brand)} · ${esc(p.category)}</div><h2 id="detailTitle" class="detail-name">${esc(p.name)}</h2><p class="detail-desc">${esc(p.description||'Renseignements disponibles sur demande.')}</p><div class="detail-price">${priced(p)?money(p.price):'Prix à confirmer'}</div><p class="detail-desc">Stock, couleur, capacité et modalités de paiement à vérifier auprès de MICKEY TECH.</p><div class="detail-actions"><button class="btn btn-primary" type="button" id="detailAdd"><i class="fas fa-plus"></i> Ajouter au panier</button><button class="btn btn-secondary" type="button" id="detailAsk"><i class="fab fa-whatsapp"></i> WhatsApp</button></div><p class="detail-meta">Faites glisser pour incliner la vue, cliquez pour zoomer et utilisez les flèches pour parcourir les photos disponibles.</p><p class="detail-meta"><a id="detailSource" target="_blank" rel="noopener noreferrer">Source de la photographie ↗</a></p><p class="detail-meta"><a id="detailLicense" target="_blank" rel="noopener noreferrer">Licence de la photographie ↗</a></p></div></div>`;
   $('#detailAdd').onclick=()=>addToCart(p.id);
   $('#detailAsk').onclick=()=>window.open((SOCIAL.whatsapp||'https://wa.me/50939068588')+'?text='+encodeURIComponent('Bonjour MICKEY TECH, je souhaite des renseignements sur '+p.name+' ('+p.brand+').'),'_blank','noopener,noreferrer');
   $('#detailPrev').onclick=()=>changePhoto(-1);$('#detailNext').onclick=()=>changePhoto(1);
  const stage=$('#detailView');let dragStart=null,lastPointer=null,dragged=false,rotationX=0,rotationY=0;
  stage.onpointerdown=e=>{if(stage.classList.contains('zoomed'))return;dragStart={x:e.clientX,y:e.clientY};lastPointer={x:e.clientX,y:e.clientY};dragged=false;stage.setPointerCapture(e.pointerId);};
  stage.onpointerup=e=>{if(!dragStart)return;const distanceX=e.clientX-dragStart.x;if(dragged&&Math.abs(distanceX)>55&&(detailProduct.images||[]).length>1){rotationX=0;rotationY=0;changePhoto(distanceX<0?1:-1);}else if(!dragged)stage.classList.toggle('zoomed');dragStart=null;lastPointer=null;};
  stage.onpointercancel=()=>{dragStart=null;lastPointer=null;};
  stage.onpointermove=e=>{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!stage.classList.contains('zoomed')){const img=$('#detailFrame img');if(!img)return;if(dragStart&&lastPointer){const deltaX=e.clientX-lastPointer.x,deltaY=e.clientY-lastPointer.y;rotationY=Math.max(-45,Math.min(45,rotationY+deltaX*.6));rotationX=Math.max(-30,Math.min(30,rotationX-deltaY*.6));dragged=dragged||Math.abs(e.clientX-dragStart.x)+Math.abs(e.clientY-dragStart.y)>8;lastPointer={x:e.clientX,y:e.clientY};img.style.transform=`rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;}else{const r=stage.getBoundingClientRect(),x=((e.clientX-r.left)/r.width-.5)*12,y=((e.clientY-r.top)/r.height-.5)*-12;img.style.transform=`rotateY(${x}deg) rotateX(${y}deg)`;}}};
  stage.onpointerleave=()=>{if(dragStart)return;rotationX=0;rotationY=0;const img=$('#detailFrame img');if(img)img.style.transform='';};
   stage.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();stage.classList.toggle('zoomed');}if(e.key==='ArrowRight')changePhoto(1);if(e.key==='ArrowLeft')changePhoto(-1);};
   renderDetailPhoto();$('#productDialog').showModal();
 }
 function changePhoto(delta){const photos=detailProduct.images||[];if(photos.length<2)return;photoIndex=(photoIndex+delta+photos.length)%photos.length;renderDetailPhoto();}
 function renderDetailPhoto(){const p=detailProduct;if(!p)return;
   $('#detailFrame').innerHTML=ph(p,photoIndex);
   $('#detailThumbs').innerHTML=(p.images||[]).map((img,i)=>`<button type="button" data-pic="${i}" class="detail-thumb${i===photoIndex?' active':''}" aria-label="Vue ${i+1}"><img loading="lazy" src="${esc(photoUrl(img))}" alt=""></button>`).join('');
   $$('#detailThumbs button').forEach(b=>b.addEventListener('click',()=>{photoIndex=+b.dataset.pic;renderDetailPhoto();}));
   $('#detailPrev').disabled=(p.images||[]).length<2;$('#detailNext').disabled=(p.images||[]).length<2;
  const metadata=p.photoMetadata?.[photoIndex],source=commonsSource(p);$('#detailSource').href=source||'#';$('#detailSource').hidden=!source;
  $('#detailSource').textContent=metadata?`Source : ${metadata.title} · ${metadata.artist||'auteur indiqué sur Commons'}`:'Source de la photographie ↗';
  $('#detailLicense').href=metadata?.licenseUrl||'#';$('#detailLicense').hidden=!metadata?.licenseUrl;
  if(metadata)$('#detailLicense').textContent=`Licence : ${metadata.license||'consulter la page source'}`;
   $('#detailView').classList.remove('zoomed');
 }
 window.toggleMenu=()=>{
   const nav=$('.nav-center');const open=nav.dataset.open!=='true';nav.dataset.open=open?'true':'false';
   nav.style.cssText=open?'display:flex;position:absolute;top:100%;left:0;right:0;z-index:1200;background:#131313;flex-direction:column;align-items:stretch;padding:1.2rem 2rem;gap:1.25rem;border-bottom:1px solid #d4af37':' '; 
 };
 window.showOwnerInfo=()=>showToast('Bienvenue chez MICKEY TECH');
 window.scrollToProducts=()=>$('#products').scrollIntoView({behavior:'smooth'});
 function updateAccountSummary(){
   const favoriteCount=$('#accountFavoriteCount');if(!favoriteCount)return;
   favoriteCount.textContent=wishlist.length;
   $('#accountCartCount').textContent=cart.reduce((sum,item)=>sum+item.qty,0);
   const fullyPriced=cart.length&&cart.every(item=>priced(get(item.id)));
   const total=cart.reduce((sum,item)=>sum+(priced(get(item.id))?get(item.id).price*item.qty:0),0);
   $('#accountCartTotal').textContent=fullyPriced?money(total):'À confirmer';
 }
 function openAccount(){
   const form=$('#accountForm');
   for(const field of form.elements){if(field.name)field.value=profile[field.name]||'';}
   $('#accountGreeting').textContent=profile.name?'Bonjour '+profile.name+', retrouvez vos informations et votre sélection.':'Retrouvez vos informations et votre sélection.';
   updateAccountSummary();$('#accountDialog').showModal();
 }
 function setup(){
   document.addEventListener('click',e=>{
     const action=e.target.closest('[data-action]');if(!action)return;
     switch(action.dataset.action){
       case 'owner-info':showOwnerInfo();break;
       case 'wishlist':toggleWishlist();break;
       case 'cart':toggleCart();break;
       case 'menu':toggleMenu();break;
       case 'scroll-products':scrollToProducts();break;
       case 'checkout':openCheckout();break;
      case 'account':openAccount();break;
      case 'account-favorites':$('#accountDialog').close();if(!onlyFavs)toggleWishlist();else $('#products').scrollIntoView({behavior:'smooth'});break;
      case 'account-cart':$('#accountDialog').close();toggleCart();break;
       case 'facebook':e.preventDefault();showToast('Lien Facebook à ajouter','error');break;
     }
   });
  loadCategoryButtons();loadBrandButtons();renderProducts();updateCartUI();
   $('#sortSelect').addEventListener('change',e=>{currentSort=e.target.value;renderProducts();});
   [$('#productSearch'),$('#searchInput')].forEach(input=>input.addEventListener('input',e=>{search=e.target.value;const other=input.id==='searchInput'?$('#productSearch'):$('#searchInput');other.value=search;renderProducts();}));
   $('#detailClose').addEventListener('click',()=>$('#productDialog').close());
   $('#accountClose').addEventListener('click',()=>$('#accountDialog').close());
   $('#accountForm').addEventListener('submit',e=>{
     e.preventDefault();profile=Object.fromEntries(new FormData(e.currentTarget).entries());
     for(const key of Object.keys(profile))profile[key]=String(profile[key]).trim();
     save(ACCOUNT,profile);
     $('#accountGreeting').textContent=profile.name?'Bonjour '+profile.name+', retrouvez vos informations et votre sélection.':'Vos coordonnées sont enregistrées.';
     showToast('Vos coordonnées sont enregistrées sur cet appareil.');
   });
   $('#accountClear').addEventListener('click',()=>{
     profile={};save(ACCOUNT,profile);$('#accountForm').reset();
     $('#accountGreeting').textContent='Vos coordonnées enregistrées ont été effacées.';
     showToast('Coordonnées effacées de ce navigateur.');
   });
   $('#accountDialog').addEventListener('click',e=>{if(e.target===$('#accountDialog'))$('#accountDialog').close();});
   $('#productDialog').addEventListener('click',e=>{if(e.target===$('#productDialog'))$('#productDialog').close();});
   window.addEventListener('scroll',()=>$('#header').classList.toggle('scrolled',window.scrollY>100));
   // Convert footer brand names into functional filters, no broken placeholder links.
   $$('.footer-column ul a').forEach(a=>{
      if(a.getAttribute('href')!=='#')return;
      const text=a.textContent.trim();const guessed=/(iphone|apple)/i.test(text)?'Apple':/Samsung/i.test(text)?'Samsung':/Xiaomi/i.test(text)?'Xiaomi / Redmi':/OnePlus/i.test(text)?'OnePlus':/Google/i.test(text)?'Google':null;
      if(guessed){a.href='#products';a.addEventListener('click',()=>{currentFilter=guessed;loadBrandButtons();renderProducts();});}
      else{a.href='#contact';}
   });
 }
 document.addEventListener('DOMContentLoaded',setup);
})();
