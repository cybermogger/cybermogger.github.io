const root=document.documentElement;
let motionEnabled=true;
try{motionEnabled=localStorage.getItem('cybermogger-motion')!=='off'}catch{}
root.dataset.motion=motionEnabled?'full':'calm';
root.classList.add('js');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');if(motionEnabled)entry.target.classList.add('reveal-enter');observer.unobserve(entry.target)}}),{threshold:.01,rootMargin:'0px 0px -24px 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(el=>{el.classList.toggle('active',el===button);el.setAttribute('aria-pressed',String(el===button))});
 document.querySelectorAll('.project').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)card.classList.add('visible')});
}));
const progress=document.querySelector('.progress'),topLink=document.querySelector('.back-top');
let scrollFrame=null;
function updateScroll(){const max=root.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;topLink.classList.toggle('shown',scrollY>innerHeight)}
addEventListener('scroll',()=>{if(scrollFrame!==null)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=null;updateScroll()})},{passive:true});updateScroll();
const finePointer=matchMedia('(pointer:fine)');
document.querySelectorAll('.tilt').forEach(el=>{
 el.addEventListener('pointermove',e=>{if(!motionEnabled||!finePointer.matches)return;const r=el.getBoundingClientRect();el.style.transform=`perspective(1000px) rotateX(${-(e.clientY-r.top-r.height/2)/60}deg) rotateY(${(e.clientX-r.left-r.width/2)/70}deg)`});
 el.addEventListener('pointerleave',()=>el.style.transform='');
});
document.querySelectorAll('.project').forEach(card=>card.addEventListener('pointermove',e=>{if(!motionEnabled||!finePointer.matches)return;const r=card.getBoundingClientRect();card.style.setProperty('--spot-x',`${e.clientX-r.left}px`);card.style.setProperty('--spot-y',`${e.clientY-r.top}px`)}));
document.querySelectorAll('.magnetic').forEach(button=>{
 button.addEventListener('pointermove',e=>{if(!motionEnabled||!finePointer.matches)return;const r=button.getBoundingClientRect();button.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.13}px,${(e.clientY-r.top-r.height/2)*.18}px)`});
 button.addEventListener('pointerleave',()=>button.style.transform='');
});
const canvas=document.querySelector('#orb'),ctx=canvas.getContext('2d');
const points=Array.from({length:1300},(_,i)=>{const y=1-i/1299*2,r=Math.sqrt(1-y*y),a=i*2.399963;return [Math.cos(a)*r,y,Math.sin(a)*r]});
let w=0,h=0,frame=null,inView=true,lastTime=null,phase=0;
let glow=null;
const buckets=Array.from({length:12},()=>[]);
function paint(){
 ctx.clearRect(0,0,w,h);const radius=Math.min(w,h)*.35,t=phase,cos=Math.cos(t),sin=Math.sin(t);
 if(glow){ctx.fillStyle=glow;ctx.fillRect(0,0,w,h)}
 buckets.forEach(bucket=>bucket.length=0);
 points.forEach(([x,y,z])=>{const a=x*cos+z*sin,b=-x*sin+z*cos,warp=1+.12*Math.sin(y*6+t*7)+.06*Math.cos(a*8+t*4);buckets[Math.min(11,Math.max(0,Math.floor((b+1)*6)))].push([w/2+a*radius*warp,h/2+(y*.94+b*.28)*radius*warp,b>.2?1.35:.8])});
 buckets.forEach((bucket,i)=>{ctx.fillStyle=i>6?'rgba(138,179,69,'+(.3+((i-6)/6)*.6)+')':'rgba(140,149,132,'+(.13+i/6*.16)+')';ctx.beginPath();bucket.forEach(([x,y,r])=>{ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,Math.PI*2)});ctx.fill()});
}
function tick(now){frame=null;if(!motionEnabled||!inView||document.hidden){lastTime=null;return}if(lastTime!==null)phase+=Math.min(now-lastTime,50)*.00016;lastTime=now;paint();frame=requestAnimationFrame(tick)}
function syncAnimation(){if(frame!==null)cancelAnimationFrame(frame);frame=null;lastTime=null;paint();if(motionEnabled&&inView&&!document.hidden)frame=requestAnimationFrame(tick)}
function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),pw=Math.round(r.width*d),ph=Math.round(r.height*d);if(canvas.width===pw&&canvas.height===ph&&w===r.width&&h===r.height)return;w=r.width;h=r.height;canvas.width=pw;canvas.height=ph;ctx.setTransform(d,0,0,d,0,0);const radius=Math.min(w,h)*.35;glow=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,radius*1.6);glow.addColorStop(0,'#82a73a12');glow.addColorStop(1,'#82a73a00');paint()}
let resizeFrame=null;
resize();addEventListener('resize',()=>{if(resizeFrame!==null)return;resizeFrame=requestAnimationFrame(()=>{resizeFrame=null;resize()})});
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;syncAnimation()}).observe(canvas);
document.addEventListener('visibilitychange',syncAnimation);
const motionToggle=document.querySelector('.motion-toggle');
function updateMotionControl(){motionToggle.textContent=motionEnabled?'Анимации: вкл':'Анимации: выкл';motionToggle.setAttribute('aria-pressed',String(motionEnabled));motionToggle.setAttribute('aria-label',motionEnabled?'Отключить анимации':'Включить анимации')}
motionToggle.addEventListener('click',()=>{motionEnabled=!motionEnabled;root.dataset.motion=motionEnabled?'full':'calm';try{localStorage.setItem('cybermogger-motion',motionEnabled?'on':'off')}catch{}document.querySelectorAll('.tilt,.magnetic').forEach(el=>el.style.transform='');updateMotionControl();syncAnimation()});
updateMotionControl();syncAnimation();

const ambientObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{entry.target.style.animationPlayState=entry.isIntersecting?'running':'paused'}));document.querySelectorAll('.ticker div,.brand-rain line,.section-head h2 em').forEach(el=>ambientObserver.observe(el));
