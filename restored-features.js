const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const accents={black:'#b8ff28',blue:'#58bfff',green:'#ffd230'};
function applyTheme(theme){document.documentElement.dataset.theme='black';document.documentElement.style.setProperty('--feature-accent',accents[theme]||accents.black);localStorage.setItem('dunder-theme',theme);$$('[data-theme-label]').forEach(e=>e.textContent=theme.toUpperCase());$$('[data-theme-choice]').forEach(b=>{const on=b.dataset.themeChoice===theme;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on)})}
const saved=localStorage.getItem('dunder-theme');applyTheme(saved&&accents[saved]?saved:'black');
const themeDialog=$('.theme-dialog');$$('.theme-launcher').forEach(b=>b.onclick=()=>themeDialog?.showModal());$('.theme-dialog-close')?.addEventListener('click',()=>themeDialog.close());$$('[data-theme-choice]').forEach(b=>b.onclick=()=>{applyTheme(b.dataset.themeChoice);themeDialog.close()});
const menu=$('.mobile-menu'),toggle=$('.menu-toggle');toggle?.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});$$('.mobile-menu a').forEach(a=>a.onclick=()=>{menu.classList.remove('open');toggle?.setAttribute('aria-expanded','false')});
const search=$('.search-modal');$('.search-open')?.addEventListener('click',()=>search?.showModal());$('.search-close')?.addEventListener('click',()=>search?.close());
$$('#scene-filters button').forEach((button,index)=>button.onclick=()=>{$$('#scene-filters button').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});button.classList.add('active');button.setAttribute('aria-pressed','true');$$('.scene-category').forEach((section,i)=>section.hidden=i!==index)});
const dock=document.createElement('div');dock.className='audio-dock-original';dock.hidden=true;dock.innerHTML='<img alt=""><div><b></b><span></span><input type="range" min="0" max="100" value="0" aria-label="Progression"></div><button class="dock-toggle">Ⅱ</button><button class="dock-close" aria-label="Fermer">×</button>';document.body.append(dock);
let audio=null,current=null;function closeAudio(){audio?.pause();audio=null;current=null;dock.hidden=true}$('.dock-close',dock).onclick=closeAudio;$('.dock-toggle',dock).onclick=()=>{if(!audio)return;audio.paused?audio.play():audio.pause();$('.dock-toggle',dock).textContent=audio.paused?'▶':'Ⅱ'};$('input',dock).oninput=e=>{if(audio?.duration)audio.currentTime=audio.duration*e.target.value/100};
$$('[data-preview-url]').forEach(button=>button.onclick=()=>{const url=button.dataset.previewUrl;if(!url)return;if(current!==url){audio?.pause();audio=new Audio(url);current=url;$('b',dock).textContent=button.dataset.title||'Extrait D-UNDER';$('span',dock).textContent=button.dataset.artist||'';$('img',dock).src=button.dataset.cover||'';audio.ontimeupdate=()=>{$('input',dock).value=audio.duration?audio.currentTime/audio.duration*100:0};audio.onended=closeAudio;dock.hidden=false}audio.paused?audio.play():audio.pause()});
$('#spotify-connect')?.addEventListener('click',()=>location.href='/.netlify/functions/spotify-login');
if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{rootMargin:'80px'});$$('.reveal').forEach(e=>io.observe(e))}

/* Desktop Explore refinement */
const desktopExplore=matchMedia('(min-width:921px)');
function syncExploreLayout(){
 const buttons=$$('#scene-filters button'),sections=$$('.scene-category');
 if(desktopExplore.matches){
  let active=buttons.findIndex(b=>b.classList.contains('active'));if(active<0)active=0;
  buttons.forEach((b,i)=>{b.classList.toggle('active',i===active);b.setAttribute('aria-pressed',i===active)});
  sections.forEach((s,i)=>s.hidden=i!==active);
 }else{sections.forEach(s=>s.hidden=false)}
}
desktopExplore.addEventListener?.('change',syncExploreLayout);syncExploreLayout();
