const canvas = document.getElementById('pixel-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 120; canvas.height = 150;
const S = 8;

const isDarkMode = () => document.documentElement.getAttribute('data-theme') === 'dark';

function getColors() {
  if(isDarkMode()) {
    return {
      skin:  '#D49550', skind: '#B87838',
      hair:  '#110E08', curly: '#1E1A10',
      eye:   '#1a1a2e', shirt: '#e8e8e8',
      shirt2:'#d0d0d0', pants: '#1a1a1a',
      pants2:'#111111', shoe:  '#cccccc',
      frame: '#cccccc', ear:   '#C08050',
      tattoo:'#9b8aff', watch: '#c8a040',
    };
  }
  return {
    skin:  '#D49550', skind: '#B87838',
    hair:  '#110E08', curly: '#1E1A10',
    eye:   '#1a1a2e', shirt: '#1a1a1a',
    shirt2:'#0d0d0d', pants: '#2d3a5e',
    pants2:'#1e2840', shoe:  '#1a1a1a',
    frame: '#1a1a1a', ear:   '#C08050',
    tattoo:'#5a4a8a', watch: '#c8a040',
  };
}
let C = getColors();

const themeToggleBtn = document.getElementById('theme-toggle');
if(themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    setTimeout(() => { C = getColors(); }, 50);
  });
}

function px(x, y, color) {
  if (!color) return;
  ctx.fillStyle = color;
  ctx.fillRect(x * S, y * S, S, S);
}

function drawChar(frame, offsetY) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const oy = offsetY || 0;

  for(let x=2;x<=11;x++) px(x, 0+oy, C.hair);
  for(let x=1;x<=12;x++) px(x, 1+oy, C.hair);
  for(let x=1;x<=12;x++) px(x, 2+oy, C.hair);
  for(let x=2;x<=11;x++) px(x, 3+oy, C.hair);
  const curlDots = [[2,0],[4,0],[6,0],[8,0],[10,0],[1,1],[3,1],[5,1],[7,1],[9,1],[11,1],[2,2],[4,2],[6,2],[8,2],[10,2]];
  curlDots.forEach(([x,y]) => {
    ctx.fillStyle = C.curly;
    ctx.beginPath();
    ctx.arc((x+0.5)*S, (y+oy+0.5)*S, S*0.55, 0, Math.PI*2);
    ctx.fill();
  });

  for(let x=3;x<=10;x++) px(x, 3+oy, C.skin);
  for(let x=2;x<=11;x++) px(x, 4+oy, C.skin);
  for(let x=2;x<=11;x++) px(x, 5+oy, C.skin);
  for(let x=2;x<=11;x++) px(x, 6+oy, C.skin);
  for(let x=3;x<=10;x++) px(x, 7+oy, C.skin);

  px(2, 5+oy, C.ear); px(11, 5+oy, C.ear);
  ctx.fillStyle = C.watch;
  ctx.fillRect(11*S+2, (5+oy)*S+4, 3, 3);

  px(4, 5+oy, C.eye); px(5, 5+oy, C.eye);
  px(8, 5+oy, C.eye); px(9, 5+oy, C.eye);
  ctx.strokeStyle = C.frame; ctx.lineWidth = 1;
  ctx.strokeRect(3.5*S, (4.5+oy)*S, 2.8*S, 1.8*S);
  ctx.strokeRect(7.5*S, (4.5+oy)*S, 2.8*S, 1.8*S);
  ctx.beginPath(); ctx.moveTo(6.3*S,(5.2+oy)*S); ctx.lineTo(7.5*S,(5.2+oy)*S); ctx.stroke();

  px(5, 7+oy, C.skind); px(6, 7+oy, C.skind);
  px(7, 7+oy, C.skind); px(8, 7+oy, C.skind);

  px(6, 8+oy, C.skin); px(7, 8+oy, C.skin);

  const armSwing = frame;
  for(let x=4;x<=9;x++) {
    px(x, 9+oy, C.shirt); px(x, 10+oy, C.shirt);
    px(x, 11+oy, C.shirt); px(x, 12+oy, C.shirt);
  }
  px(3, 9+oy, C.shirt); px(3, 10+oy, C.shirt);
  px(2-armSwing, 11+oy, C.shirt); px(2-armSwing, 12+oy, C.shirt);
  px(1-armSwing, 13+oy, C.skin);
  px(10, 9+oy, C.shirt); px(10, 10+oy, C.shirt);
  px(11+armSwing, 11+oy, C.shirt); px(11+armSwing, 12+oy, C.shirt);
  px(12+armSwing, 13+oy, C.skin);
  ctx.fillStyle = C.watch;
  ctx.fillRect((12+armSwing)*S, (13+oy)*S, S-1, S-1);
  ctx.fillStyle = C.tattoo;
  ctx.fillRect((1-armSwing)*S+1, (13+oy)*S+2, S-2, S-3);

  for(let x=4;x<=9;x++) px(x, 13+oy, C.pants);
  for(let x=4;x<=6;x++) { px(x,14+oy,C.pants); px(x,15+oy,C.pants); px(x,16+oy,C.pants); }
  for(let x=7;x<=9;x++) { px(x,14+oy,C.pants2); px(x,15+oy,C.pants2); px(x,16+oy,C.pants2); }

  const legOff = frame === 1 ? 1 : 0;
  px(3,17+oy,C.shoe); px(4,17+oy+legOff,C.shoe); px(5,17+oy+legOff,C.shoe);
  px(8,17+oy,C.shoe); px(9,17+oy-legOff,C.shoe); px(10,17+oy-legOff,C.shoe);

  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.beginPath();
  ctx.ellipse(canvas.width/2, canvas.height-6, 34, 7, 0, 0, Math.PI*2);
  ctx.fill();
}

let animFrame = 0, tick = 0;
function animateChar() {
  tick++;
  if (tick % 18 === 0) animFrame = animFrame === 0 ? 1 : 0;
  const bob = animFrame === 1 ? -1 : 0;
  drawChar(animFrame, bob);
  requestAnimationFrame(animateChar);
}
animateChar();

const roles=['Hello, World! 👋','Eu sou Wesley.','Dev Frontend.','Bem-vindo ao meu portfólio!'];
let ri=0,ci=0,del=false;
const typedEl=document.getElementById('hello-text');
function typeHello(){const word=roles[ri];if(!del)ci++;else ci--;typedEl.innerHTML=word.substring(0,ci);let speed=del?55:100;if(!del&&ci===word.length){del=true;speed=2000;}else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;speed=400;}setTimeout(typeHello,speed);}
typeHello();

document.querySelectorAll('.reveal').forEach(el=>{new IntersectionObserver(entries=>{if(entries[0].isIntersecting)el.classList.add('in');},{threshold:0.1}).observe(el);});

function countUp(id,target){const el=document.getElementById(id);let c=0,s=Math.max(1,Math.ceil(target/40));const iv=setInterval(()=>{c=Math.min(c+s,target);el.textContent=c;if(c>=target)clearInterval(iv);},35);}
let counted=false;
new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!counted){counted=true;countUp('s1',4);countUp('s2',3);countUp('s3',2);countUp('s4',7);}},{threshold:0.3}).observe(document.querySelector('#about'));

new IntersectionObserver(entries=>{if(entries[0].isIntersecting)document.querySelectorAll('.skill-bar-fill[data-w]').forEach(b=>setTimeout(()=>b.style.width=b.dataset.w,200));},{threshold:0.2}).observe(document.querySelector('#skills'));

(function(){
  const items=[
    {label:'HTML'},{label:'CSS'},{label:'JavaScript'},{label:'Python'},{label:'Java'},{label:'SQL'},{label:'Git'},
    {label:'Frontend Dev',dot:true},{label:'Análise de Sistemas',dot:true},{label:'Banco de Dados',dot:true},
    {label:'Porto Digital',dot:true},{label:'UI / UX',dot:true},{label:'ADS',dot:true},{label:'Recife PE',dot:true},
  ];
  const track=document.getElementById('ticker-track');
  [...items,...items].forEach(item=>{
    const el=document.createElement('span');
    el.className='ticker-item';
    el.innerHTML=item.dot?`<span class="ticker-dot"></span>${item.label}<span class="ticker-dot"></span>`:item.label;
    track.appendChild(el);
  });
})();

const projects=[
  {icon:'🌱',th:'pt-1',cat:'Web · Agro Tech',title:'SeedTech',direct:true,img:'assets/images/seedtech.jpg',desc:'App para facilitar a vida do agricultor familiar com pedido de sementes integrado ao IPA e comunidade para troca de informações entre agricultores.',tags:['HTML','CSS','JavaScript','IPA'],github:'https:
  {icon:'⚡',th:'pt-2',cat:'React Native · Porto Digital',title:'AX Charge',imgContain:true,img:'assets/images/axcharge.jpg',desc:'App mobile de rotas para carros elétricos com mapa de postos de recarga, cálculo de autonomia e favoritos. Desenvolvido para o desafio do Porto Digital e Banco do Brasil.',tags:['React Native','Expo','TypeScript','Google Maps'],github:'https:
  {icon:'🎨',th:'pt-3',cat:'UI Design · Figma',title:'Portfólio Pixel Art',direct:true,img:'assets/images/pixelart.png',desc:'Portfólio pessoal criado no Figma com estética pixel art e fotos autorais tiradas em uma viagem a Salvador.',tags:['Figma','UI Design','Pixel Art','Design'],github:null,live:'https:
];

const arrowSvg = `<svg xmlns="http:
const grid=document.getElementById('proj-grid');

projects.forEach((p,i)=>{
  const tags=p.tags.map(t=>`<span class="ptag">${t}</span>`).join('');
  const projLink = p.live || p.github;
  const projBtn = projLink ? `<a href="${projLink}" target="_blank" rel="noopener noreferrer" class="proj-btn">Ver projeto ${arrowSvg}</a>` : '';
  const thumb = p.img ? `<img class="proj-thumb-img${p.imgContain?' contain':''}" src="${p.img}" alt="${p.title}"/>` : `<span class="thumb-icon">${p.icon}</span>`;

  const card = document.createElement('div');
  card.className = 'proj-card reveal';
  card.innerHTML = `
    <div class="proj-thumb ${p.th}">${thumb}</div>
    <div class="proj-body">
      <div class="proj-cat">${p.cat}</div>
      <div class="proj-title">${p.title}</div>
      <p class="proj-desc">${p.desc}</p>
      <div class="proj-footer">
        <div class="proj-tags">${tags}</div>
        ${projBtn}
      </div>
    </div>`;

  if(!p.direct){
    card.addEventListener('click', (e)=>{ if(!e.target.closest('.proj-btn')) openModal(p); });
  }
  grid.appendChild(card);
  new IntersectionObserver(entries=>{if(entries[0].isIntersecting)card.classList.add('in');},{threshold:0.1}).observe(card);
});

function openModal(p){
  document.getElementById('m-icon').textContent=p.icon;
  document.getElementById('m-thumb').className=`modal-thumb ${p.th}`;
  document.getElementById('m-cat').textContent=p.cat;
  document.getElementById('m-title').textContent=p.title;
  document.getElementById('m-desc').textContent=p.desc;
  document.getElementById('m-tags').innerHTML=p.tags.map(t=>`<span class="ptag">${t}</span>`).join('');
  let a='';
  if(p.github&&p.github!=='#')a+=`<a href="${p.github}" target="_blank" class="modal-btn solid">🐙 GitHub</a>`;
  if(p.live&&p.live!=='#')a+=`<a href="${p.live}" target="_blank" class="modal-btn ${a?'outline':'solid'}">🌐 Ver ao vivo</a>`;
  document.getElementById('m-actions').innerHTML=a;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){document.getElementById('modal-overlay').classList.remove('open');document.body.style.overflow='';}
document.getElementById('m-close').addEventListener('click',closeModal);
document.getElementById('modal-overlay').addEventListener('click',e=>{if(e.target.id==='modal-overlay')closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

const toggle = document.getElementById('theme-toggle');
const icon   = document.getElementById('theme-icon');
const sun  = `<svg xmlns="http:
const moon = `<svg xmlns="http:
const saved = localStorage.getItem('theme');
if(saved === 'dark') { document.documentElement.setAttribute('data-theme','dark'); icon.innerHTML = sun; }
toggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if(isDark) {
    document.documentElement.removeAttribute('data-theme');
    icon.innerHTML = moon;
    localStorage.setItem('theme','light');
  } else {
    document.documentElement.setAttribute('data-theme','dark');
    icon.innerHTML = sun;
    localStorage.setItem('theme','dark');
  }
});

function addGlow(cardEl) {
  
  const wrap = document.createElement('div');
  wrap.className = 'proj-card-wrap';
  cardEl.parentNode.insertBefore(wrap, cardEl);
  wrap.appendChild(cardEl);

  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    wrap.style.setProperty('--mx', x + '%');
    wrap.style.setProperty('--my', y + '%');
  });
}

function addTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -12;
      const rotY = ((x - cx) / cx) * 12;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
      card.style.boxShadow = `${-rotY*1.5}px ${rotX*1.5}px 30px rgba(61,82,213,0.18)`;
      card.style.transition = 'box-shadow 0.1s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.boxShadow = '';
      card.style.transition = 'all 0.5s cubic-bezier(0.4,0,0.2,1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.1s';
    });
  });
}

setTimeout(() => {
  addTilt('.formation-card');
  addTilt('.skill-pill');
  document.querySelectorAll('.proj-card').forEach(addGlow);
}, 500);

(function(){
  const linesEl = document.getElementById('ed-lines');
  const codeEl  = document.getElementById('ed-code');
  const posEl   = document.getElementById('ed-cursor-pos');
  if(!linesEl || !codeEl) return;

  const lines = [
    {html:'<span class="sy-kw">const</span> <span class="sy-fn">developer</span> <span class="sy-px">=</span> <span class="sy-px">{</span>'},
    {html:'  <span class="sy-prop">name</span><span class="sy-px">:</span> <span class="sy-str">"Wesley Telles"</span><span class="sy-px">,</span>'},
    {html:'  <span class="sy-prop">location</span><span class="sy-px">:</span> <span class="sy-str">"Recife, PE 🌴"</span><span class="sy-px">,</span>'},
    {html:'  <span class="sy-prop">role</span><span class="sy-px">:</span> <span class="sy-str">"Frontend Dev"</span><span class="sy-px">,</span>'},
    {html:'  <span class="sy-prop">course</span><span class="sy-px">:</span> <span class="sy-str">"ADS @ SENAC"</span><span class="sy-px">,</span>'},
    {html:'  <span class="sy-prop">skills</span><span class="sy-px">: [</span>'},
    {html:'    <span class="sy-str">"HTML"</span><span class="sy-px">,</span> <span class="sy-str">"CSS"</span><span class="sy-px">,</span> <span class="sy-str">"JS"</span><span class="sy-px">,</span>'},
    {html:'    <span class="sy-str">"Python"</span><span class="sy-px">,</span> <span class="sy-str">"Java"</span>'},
    {html:'  <span class="sy-px">],</span>'},
    {html:'  <span class="sy-prop">status</span><span class="sy-px">:</span> <span class="sy-str">"Buscando estágio 🎯"</span>'},
    {html:'<span class="sy-px">};</span>'},
    {html:''},
    {html:'<span class="sy-cmt">
    {html:'<span class="sy-fn">developer</span><span class="sy-px">.</span><span class="sy-fn">projects</span><span class="sy-px">.</span><span class="sy-fn">forEach</span><span class="sy-px">(</span><span class="sy-fn">build</span><span class="sy-px">);</span>'},
  ];

  let currentLine = 0;
  let currentChar = 0;
  let rendered = [];

  function getPlainText(htmlStr) {
    const d = document.createElement('div');
    d.innerHTML = htmlStr;
    return d.textContent;
  }

  function renderLines() {
    linesEl.innerHTML = '';
    codeEl.innerHTML  = '';
    rendered.forEach((line, i) => {
      
      const ln = document.createElement('div');
      ln.className = 'ed-ln' + (i === rendered.length-1 ? ' active' : '');
      ln.textContent = i + 1;
      linesEl.appendChild(ln);
      
      const cl = document.createElement('div');
      cl.className = 'ed-line' + (i === rendered.length-1 ? ' current' : '');
      cl.innerHTML = line.html + (i === rendered.length-1 ? '<span class="ed-cursor"></span>' : '');
      codeEl.appendChild(cl);
    });
    if(posEl) posEl.textContent = 'Ln ' + rendered.length + ', Col ' + (getPlainText(rendered[rendered.length-1]?.html||'').length+1);
  }

  function typeNextLine() {
    if(currentLine >= lines.length) {
      
      setTimeout(() => {
        rendered = [];
        currentLine = 0;
        renderLines();
        setTimeout(typeNextLine, 400);
      }, 3500);
      return;
    }
    const line = lines[currentLine];
    rendered.push({html: line.html});
    currentLine++;
    renderLines();
    const delay = line.html === '' ? 120 : 160 + Math.random() * 120;
    setTimeout(typeNextLine, delay);
  }

  setTimeout(typeNextLine, 1000);
})();
