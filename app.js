/* English Train. Everything stays on this device. No analytics or remote services. */
'use strict';
(() => {
  const C = globalThis.TRAIN_CONTENT;
  const KEY = 'english-train-v1';
  const DAY = 86400000;
  const INTERVALS = [0, 0, 1, 3, 7, 16];
  const LEVELS = [[0,'Passenger','🎟️'],[100,'Rider','🚆'],[300,'Commuter','🌆'],[700,'Conductor','🎩'],[1500,'Driver','🚂'],[3000,'Station Master','🏫'],[6000,'City Guide','🗺️']];
  const stampList = [['Doctor','🩺'],['Market','🛒'],['Phone','☎️'],['Map','🧭'],['Yesterday','🌅'],['Work','🤝'],['Bus','🚍'],['BU','🧹'],['Calendar','🗓️'],['Help','🛟'],['Sound','🎧'],['Bank','🏦'],['Boston','🏙️'],['Tea','☕'],['Home','🏡'],['Garden','🌿']];
  const TYPES = ['listen','read','match','build','mc','type','say','twins'];
  // Pets she hatches and collects. [id, English, Amharic, rarity]. Art: pets/<id>.webp
  const PETS=[['puppy','Puppy','ቡችላ','common'],['kitten','Kitten','ድመት','common'],['bunny','Bunny','ጥንቸል','common'],['duckling','Duckling','ዳክዬ','common'],['hamster','Hamster','ሃምስተር','common'],['chick','Chick','ጫጩት','common'],['piglet','Piglet','አሳማ','common'],['lamb','Lamb','ጠቦት','common'],['calf','Calf','ጥጃ','common'],['goldfish','Goldfish','ዓሣ','common'],['turtle','Turtle','ኤሊ','common'],['hedgehog','Hedgehog','ጃርት','common'],['frog','Frog','እንቁራሪት','common'],['squirrel','Squirrel','ሽኮኮ','common'],['mouse','Mouse','አይጥ','common'],['pony','Pony','ትንሽ ፈረስ','common'],
    ['fox','Fox','ቀበሮ','rare'],['panda','Panda','ፓንዳ','rare'],['koala','Koala','ኮዋላ','rare'],['penguin','Penguin','ፔንግዊን','rare'],['owl','Owl','ጉጉት','rare'],['otter','Otter','ኦተር','rare'],['redpanda','Red panda','ቀይ ፓንዳ','rare'],['fawn','Fawn','አጋዘን','rare'],['raccoon','Raccoon','ራኩን','rare'],['sloth','Sloth','ስሎዝ','rare'],
    ['gelada','Gelada monkey','ጭላዳ ዝንጀሮ','epic'],['walia','Walia ibex','ዋልያ','epic'],['ewolf','Ethiopian wolf','ቀይ ቀበሮ','epic'],['hyena','Hyena','ጅብ','epic'],
    ['lion','Lion of Judah','የይሁዳ አንበሳ','legendary'],['unicorn','Unicorn','ባለ አንድ ቀንድ ፈረስ','legendary']];
  const petById=Object.fromEntries(PETS.map(p=>[p[0],p]));
  const PET_STAGES=[[0,'Baby'],[150,'Young'],[600,'Grown up'],[1500,'Best friend']];
  const numberIds=new Set(C.guides.numbers.map(c=>c.id));
  const calendarIds=new Set([...C.guides.days,...C.guides.months].map(c=>c.id));
  const distractorCache=new Map();
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
  const stopList = C.lines.flatMap(l=>l.stops);
  const stopById = Object.fromEntries(stopList.map(s=>[s.id,s]));
  const num = (n, max=1e9) => typeof n==='number' && Number.isFinite(n) ? Math.max(0,Math.min(max,n)) : 0;
  const dateKey = (d=new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const ordinal = key => /^\d{4}-\d{2}-\d{2}$/.test(key || '') ? Date.parse(key+'T12:00:00Z') / DAY : NaN;
  const shiftDate = (key, amount) => new Date(Date.parse(key+'T12:00:00Z')+amount*DAY).toISOString().slice(0,10);
  const normalize = value => String(value || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,'').replace(/\s+/g,' ').trim();
  function distance(a,b) {
    let row=Array.from({length:b.length+1},(_,i)=>i);
    for(let i=1;i<=a.length;i++) {
      const next=[i];
      for(let j=1;j<=b.length;j++) next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]===b[j-1]?0:1));
      row=next;
    }
    return row[b.length];
  }
  function spelling(value, answer) {
    const a=normalize(value),b=normalize(answer);
    return a===b ? 'exact' : b.length>=6 && distance(a,b)===1 ? 'almost' : 'wrong';
  }
  function defaults() {
    return {version:1,xp:0,settings:{goal:1,am:true,sound:true},onboarded:false,cards:{},stops:{},seenStops:[],days:{},rides:0,seconds:0,streak:0,bestStreak:0,shields:2,lastRide:null,shieldThrough:null,streakMilestone:0,stamps:[],speedBest:0,commute:{quiet:false,silent:false,until:0},active:null,result:null,speed:null,levelSeen:0,notice:null,puzzles:0,answers:{right:0,wrong:0},log:[],pets:{owned:{},egg:60,buddy:null,names:{},growth:{},hatch:null}};
  }
  function validDate(key) {return typeof key==='string' && /^\d{4}-\d{2}-\d{2}$/.test(key) && Number.isFinite(ordinal(key)) && shiftDate(key,0)===key;}
  function validQuestion(q) {
    if(!q || !TYPES.includes(q.t)) return false;
    if(q.cardIds && (!Array.isArray(q.cardIds)||q.cardIds.some(id=>!C.cards[id]))) return false;
    if(['listen','read','mc','twins'].includes(q.t) && (!Array.isArray(q.opts)||q.opts.length<2||q.opts.length>6||!q.opts.every(o=>typeof o==='string')||!Number.isInteger(q.a)||!q.opts[q.a])) return false;
    if(['build','type'].includes(q.t) && typeof q.answer!=='string') return false;
    if(q.t==='say' && typeof q.en!=='string') return false;
    if(q.t==='match' && (!Array.isArray(q.pairs)||!q.pairs.length||q.pairs.length>8||!q.pairs.every(p=>Array.isArray(p)&&p.length===2&&p.every(x=>typeof x==='string')))) return false;
    return true;
  }
  function cleanQuestion(raw) {
    const q={t:raw.t};
    for(const key of ['q','qAm','audio','en','am','amHint','answer','why','whyAm','tip']) if(typeof raw[key]==='string')q[key]=raw[key].slice(0,5000);
    if(raw.opts){q.opts=raw.opts.map(o=>o.slice(0,5000));q.a=raw.a;}
    q.cardIds=Array.isArray(raw.cardIds)?raw.cardIds.filter(id=>C.cards[id]):[];
    for(const key of ['reading','meaning'])q[key]=raw[key]===true;
    if(q.t==='build') {
      const words=q.answer.split(/\s+/),bank=raw.bank;
      q.bank=Array.isArray(bank)&&bank.length===words.length&&bank.every(w=>typeof w==='string')&&[...bank].sort().join(' ')===words.sort().join(' ')?bank:q.answer.split(/\s+/);
    }
    if(q.t==='match'){
      q.pairs=raw.pairs.map(p=>p.map(s=>s.slice(0,5000)));
      q.order=Array.isArray(raw.order)&&raw.order.length===q.pairs.length&&new Set(raw.order).size===q.pairs.length&&raw.order.every(i=>Number.isInteger(i)&&i>=0&&i<q.pairs.length)?raw.order:q.pairs.map((_,i)=>i);
    }
    return q;
  }
  function validate(raw) {
    if(!raw || typeof raw!=='object' || Array.isArray(raw) || raw.version!==1) throw new Error('This is not an English Train progress code.');
    const s=defaults();
    for(const k of ['xp','rides','seconds','streak','bestStreak','streakMilestone','speedBest','levelSeen']) s[k]=num(raw[k]);
    s.shields=raw.shields===undefined?2:Math.floor(num(raw.shields,3));
    s.settings={goal:[1,2,3].includes(raw.settings?.goal)?raw.settings.goal:1,am:raw.settings?.am!==false,sound:raw.settings?.sound!==false};
    s.onboarded=raw.onboarded===true;
    for(const [id,c] of Object.entries(raw.cards || {})) if(C.cards[id] && c && typeof c==='object') {
      s.cards[id]={box:Math.max(1,Math.floor(num(c.box,5))),due:num(c.due,9e12),known:c.known===true||num(c.box)>=2};
      if(c.miss)s.cards[id].miss=Math.floor(num(c.miss,1e6));
    }
    const rp=raw.pets&&typeof raw.pets==='object'?raw.pets:null;
    if(rp){
      for(const [id,n] of Object.entries(rp.owned||{}))if(petById[id]&&num(n))s.pets.owned[id]=Math.floor(num(n,999));
      s.pets.egg=Math.floor(num(rp.egg===undefined?60:rp.egg,99));
      s.pets.buddy=s.pets.owned[rp.buddy]?rp.buddy:null;
      for(const [id,v] of Object.entries(rp.names||{}))if(s.pets.owned[id]&&typeof v==='string')s.pets.names[id]=v.slice(0,24);
      for(const [id,v] of Object.entries(rp.growth||{}))if(s.pets.owned[id])s.pets.growth[id]=num(v);
      s.pets.hatch=s.pets.owned[rp.hatch]?rp.hatch:null;
    }
    s.puzzles=Math.floor(num(raw.puzzles));
    s.answers={right:Math.floor(num(raw.answers?.right)),wrong:Math.floor(num(raw.answers?.wrong))};
    s.log=Array.isArray(raw.log)?raw.log.filter(e=>e&&validDate(e.d)&&['ride','free','review','guide','puzzle'].includes(e.type)).slice(-500).map(e=>({d:e.d,type:e.type,topic:typeof e.topic==='string'?e.topic.slice(0,40):'',seconds:num(e.seconds,86400),right:num(e.right,1e4),wrong:num(e.wrong,1e4)})):[];
    for(const [id,stars] of Object.entries(raw.stops || {})) if(stopById[id]) s.stops[id]=Math.max(1,Math.floor(num(stars,3)));
    s.seenStops=Array.isArray(raw.seenStops)?raw.seenStops.filter(id=>stopById[id]):[];
    for(const [d,v] of Object.entries(raw.days || {})) if(validDate(d)&&v&&typeof v==='object') s.days[d]={xp:num(v.xp),rides:num(v.rides),seconds:num(v.seconds)};
    for(const k of ['lastRide','shieldThrough']) s[k]=validDate(raw[k])?raw[k]:null;
    s.stamps=Array.isArray(raw.stamps)?[...new Set(raw.stamps.filter(n=>stampList.some(([id])=>id===n)))]:[];
    s.commute={quiet:raw.commute?.quiet===true,silent:raw.commute?.silent===true,until:num(raw.commute?.until,9e12)};
    if(raw.active && (stopById[raw.active.stopId]||['review','guide','free'].includes(raw.active.stopId)) && Array.isArray(raw.active.queue) && raw.active.queue.length>0 && raw.active.queue.length<=2000 && raw.active.queue.every(validQuestion)) {
      const r=raw.active;
      s.active={stopId:r.stopId,name:typeof r.name==='string'?r.name.slice(0,500):'Your ride',queue:r.queue.map(cleanQuestion),double:r.double===true,index:Math.floor(num(r.index,r.queue.length)),xp:num(r.xp),mistakes:num(r.mistakes),correct:num(r.correct),combo:num(r.combo),seconds:num(r.seconds),baseCount:num(r.baseCount,100)||8,knownBefore:num(r.knownBefore),phase:r.phase==='intro'?'intro':'questions',feedback:r.feedback&&typeof r.feedback==='object'?{ok:r.feedback.ok===true,message:String(r.feedback.message||'').slice(0,5000),am:String(r.feedback.am||'').slice(0,5000)}:null};
      s.active.cardIds=Array.isArray(r.cardIds)?r.cardIds.filter(id=>C.cards[id]):[];
      s.active.quiet=r.quiet===true;s.active.silent=r.silent===true;
      if(r.free&&C.lines.some(l=>l.id===r.free.lineId))s.active.free={lineId:r.free.lineId,limit:[0,300,600].includes(r.free.limit)?r.free.limit:0};
      const d=r.draft&&typeof r.draft==='object'?r.draft:{},q=s.active.queue[s.active.index];
      s.active.draft={typed:typeof d.typed==='string'?d.typed.slice(0,5000):'',selected:Number.isInteger(d.selected)?d.selected:null,fallback:d.fallback===true,hadWrong:d.hadWrong===true,matchStarted:num(d.matchStarted),pairMessage:typeof d.pairMessage==='string'?d.pairMessage.slice(0,5000):''};
      if(q?.t==='build')s.active.draft.chosen=Array.isArray(d.chosen)?[...new Set(d.chosen.filter(i=>Number.isInteger(i)&&i>=0&&i<q.bank.length))]:[];
      if(q?.t==='match'){
        s.active.draft.matched=Array.isArray(d.matched)?[...new Set(d.matched.filter(i=>Number.isInteger(i)&&i>=0&&i<q.pairs.length))]:[];
        if(d.pair&&Number.isInteger(d.pair.index)&&d.pair.index>=0&&d.pair.index<q.pairs.length&&[0,1].includes(d.pair.side))s.active.draft.pair=d.pair;
      }
    }
    if(raw.result && typeof raw.result==='object' && typeof raw.result.name==='string') {
      const r=raw.result, reward=r.reward;
      if(reward && ['xp','shield','stamp'].includes(reward.type)) s.result={free:r.free===true,name:r.name.slice(0,500),xp:num(r.xp),stars:Math.max(1,num(r.stars,3)),words:num(r.words),seconds:num(r.seconds),correct:num(r.correct),previousDay:num(r.previousDay),open:r.open===true,speedAvailable:r.speedAvailable===true,reward:{type:reward.type,amount:Math.max(10,num(reward.amount,30)),stamp:stampList.some(([id])=>id===reward.stamp)?reward.stamp:'Boston'}};
    }
    if(raw.speed && typeof raw.speed==='object' && validQuestion(raw.speed.question)) s.speed={endAt:num(raw.speed.endAt,9e12),score:num(raw.speed.score),answered:num(raw.speed.answered),previousBest:num(raw.speed.previousBest),question:cleanQuestion(raw.speed.question),finished:raw.speed.finished===true};
    return s;
  }
  function advanceCard(s,id,correct,now=Date.now()) {
    if(!C.cards[id]) return;
    const c=s.cards[id] || {box:1,due:now,known:false};
    c.box=correct?Math.min(5,c.box+1):1;
    if(!correct)c.miss=(c.miss||0)+1;
    c.known=c.known||c.box>=2;
    c.due=now+INTERVALS[c.box]*DAY;
    s.cards[id]=c;
  }
  function dueCards(s,now=Date.now()) {return Object.keys(s.cards).filter(id=>C.cards[id]&&s.cards[id].due<=now).sort((a,b)=>s.cards[a].due-s.cards[b].due);}
  function wordCount(s) {
    // Count unique English vocabulary, even when it appears on several lines.
    return new Set(Object.keys(s.cards).filter(id=>s.cards[id].known && C.cards[id]?.kind==='word').map(id=>normalize(C.cards[id].en))).size;
  }
  function reconcileStreak(s,today=dateKey()) {
    if(!s.lastRide || !s.streak || ordinal(today)<=ordinal(s.lastRide)) return null;
    const through=s.shieldThrough && ordinal(s.shieldThrough)>ordinal(s.lastRide)?s.shieldThrough:s.lastRide;
    const missing=Math.max(0,Math.round(ordinal(today)-ordinal(through))-1);
    if(!missing) return null;
    s.shieldThrough=shiftDate(today,-1);
    if(missing<=s.shields) {
      s.shields-=missing;s.streak+=missing;s.bestStreak=Math.max(s.bestStreak,s.streak);
      return 'shield';
    }
    s.shields=0;s.streak=0;s.streakMilestone=0;
    return 'welcome';
  }
  function completeDay(s,today=dateKey()) {
    const notice=reconcileStreak(s,today);
    if(s.lastRide!==today) {
      s.streak+=1;s.lastRide=today;s.shieldThrough=today;
      s.bestStreak=Math.max(s.bestStreak,s.streak);
      const milestone=Math.floor(s.streak/7);
      if(milestone>s.streakMilestone) {s.shields=Math.min(3,s.shields+milestone-s.streakMilestone);s.streakMilestone=milestone;}
    }
    return notice;
  }
  const levelFor=xp=>LEVELS.reduce((n,l,i)=>xp>=l[0]?i:n,0);
  const L={KEY,DAY,INTERVALS,LEVELS,defaults,validate,dateKey,shiftDate,ordinal,normalize,spelling,advanceCard,dueCards,wordCount,reconcileStreak,completeDay,levelFor,validQuestion,cardKind,distractors,cardQuestion,buildRide};
  globalThis.TRAIN_LOGIC=L;
  if(typeof document==='undefined') return;

  const root=document.getElementById('app');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const am=s=>s?`<span lang="am" class="am am-help">${esc(s)}</span>`:'';
  const bilingual=(en,translation)=>`${esc(en)}${am(translation)}`;
  const btn=(label,action,classes='',extra='')=>`<button class="${classes}" data-action="${action}" ${extra}>${label}</button>`;
  const primary=(label,action,extra='')=>btn(label,action,'button primary',extra);
  let S, storageFailed=false, currentTab='home', screen='main', selectedStop=null, onboardingStep=0, freeTopic=null, freeLimit=0, puzzle=null;
  let timer=null,lastTick=Date.now(),voice=null,audioContext=null,recorder=null,micStream=null,recordingURL=null,recordingAudio=null,recordingChunks=[],micTimer=null,recordingBusy=false,micGeneration=0;
  let toastTimer=null, levelReturn=null;
  try {const stored=localStorage.getItem(KEY);S=stored?validate(JSON.parse(stored)):defaults();}
  catch (_) {S=defaults();storageFailed=true;}
  const streakNotice=reconcileStreak(S);
  if(streakNotice) S.notice=streakNotice;
  function save() {
    try {localStorage.setItem(KEY,JSON.stringify(S));storageFailed=false;}
    catch (_) {storageFailed=true;}
  }
  save();
  const clock=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  // Pets: lessons fill the egg, a full egg hatches a random animal, her buddy grows with the XP she earns.
  const petStage=id=>PET_STAGES.reduce((n,s,i)=>(S.pets.growth[id]||0)>=s[0]?i:n,0);
  const petName=id=>S.pets.names[id]||petById[id][1];
  const petImg=(id,cls='')=>`<img src="pets/${id}.webp" alt="${esc(petById[id][1])}" class="pet-img ${cls}" width="256" height="256" draggable="false">`;
  let petView=null, hatchReturn=null;
  function rollPet(){
    const roll=Math.random(),tier=roll<.03?'legendary':roll<.12?'epic':roll<.4?'rare':'common';
    const pool=PETS.filter(p=>p[3]===tier),fresh=pool.filter(p=>!S.pets.owned[p[0]]),pick=fresh.length?fresh:pool;
    return pick[Math.floor(Math.random()*pick.length)][0];
  }
  function feedEgg(points){
    const p=S.pets;if(p.hatch){p.egg=Math.min(99,p.egg+points);return;}
    p.egg+=points;if(p.egg<100)return;
    p.egg=0;const id=rollPet();p.owned[id]=(p.owned[id]||0)+1;p.hatch=id;if(!p.buddy)p.buddy=id;
  }
  function logSession(type,topic,seconds,right,wrong){S.log.push({d:dateKey(),type,topic,seconds:Math.round(seconds),right,wrong});if(S.log.length>500)S.log.splice(0,S.log.length-500);}
  // Her voice recordings stay on this phone (IndexedDB), labeled with the sentence and date.
  function voiceTx(mode,fn){return new Promise((ok,no)=>{const q=indexedDB.open('english-train-voice',1);q.onupgradeneeded=()=>q.result.createObjectStore('clips',{keyPath:'id',autoIncrement:true});q.onerror=()=>no(q.error);q.onsuccess=()=>{const db=q.result,t=db.transaction('clips',mode),req=fn(t.objectStore('clips'));t.oncomplete=()=>{db.close();ok(req.result);};t.onerror=()=>{db.close();no(t.error);};};});}
  function keepRecording(blob,q,stopId){if(globalThis.indexedDB)voiceTx('readwrite',s=>s.add({at:new Date().toISOString(),stopId,text:q?.en||'',blob})).catch(()=>{});}
  function showVoiceCount(){const e=document.getElementById('voice-count');if(!e||!globalThis.indexedDB)return;voiceTx('readonly',s=>s.count()).then(n=>{e.textContent=`${n} voice recording${n===1?'':'s'} saved on this phone.`;}).catch(()=>{e.textContent='Voice recordings could not be read on this phone.';});}
  function toast(text) {
    const e=document.getElementById('toast');e.textContent=text;e.hidden=false;
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.hidden=true,4200);
  }
  function announce(text) {document.getElementById('announcer').textContent=text;}
  function applyPreferences(){document.body.classList.toggle('hide-am',!S.settings.am);}
  function pickVoice() {
    if(!('speechSynthesis' in globalThis)) return;
    const vs=speechSynthesis.getVoices().filter(v=>/^en(-|_|$)/i.test(v.lang));
    voice=vs.find(v=>/Samantha/i.test(v.name)&&/^en[-_]US/i.test(v.lang))||vs.find(v=>/^en[-_]US/i.test(v.lang))||vs[0]||null;
  }
  pickVoice();
  if('speechSynthesis' in globalThis) speechSynthesis.addEventListener('voiceschanged',pickVoice);
  function speak(text,slow=false,button=null) {
    if(!('speechSynthesis' in globalThis)) {toast('Voice is unavailable. You can keep learning by reading.');return;}
    try {
      speechSynthesis.cancel();pickVoice();
      const u=new SpeechSynthesisUtterance(text);u.lang='en-US';if(voice)u.voice=voice;u.rate=slow?0.6:0.9;
      u.onerror=e=>{if(!["interrupted","canceled"].includes(e?.error))toast('Voice unavailable offline? Choose “Can’t listen now” to use reading.');};
      if(button){button.classList.add('speaking');u.onend=()=>button.classList.remove('speaking');}
      speechSynthesis.speak(u);
    } catch (_) {toast('Try the reading option for this ride.');}
  }
  function initAudio() {
    try {
      if(!audioContext){const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(Audio)audioContext=new Audio();}
      if(audioContext?.state==='suspended') audioContext.resume().catch(()=>{});
    } catch (_) { /* Silent play is always allowed. */ }
  }
  function tone(type) {
    if(!S.settings.sound||!audioContext) return;
    try {
      const notes={correct:[659,880],wrong:[196],combo:[523,659,784,1047],fanfare:[523,659,784,1047,1319]}[type]||[659];
      notes.forEach((f,i)=>{
        const o=audioContext.createOscillator(),g=audioContext.createGain(),start=audioContext.currentTime+i*.105;
        o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(type==='wrong'?.035:.07,start+.015);g.gain.exponentialRampToValueAtTime(.001,start+.22);o.connect(g);g.connect(audioContext.destination);o.start(start);o.stop(start+.24);
      });
    } catch (_) {}
  }
  function stopMedia() {
    micGeneration++;clearTimeout(micTimer);
    if(recorder && recorder.state!=='inactive') {recorder.onstop=null;try{recorder.stop();}catch(_){}}
    micStream?.getTracks().forEach(t=>t.stop());micStream=null;recorder=null;recordingBusy=false;
    recordingAudio?.pause();recordingAudio=null;
    if(recordingURL) URL.revokeObjectURL(recordingURL);recordingURL=null;
    if('speechSynthesis' in globalThis) speechSynthesis.cancel();
  }
  function top(title,back=null) {
    return `<header class="app-header"><div class="header-inner">${back?btn('←',back,'icon-button','aria-label="Back"'):'<div class="brand-mark" aria-hidden="true">🚆</div>'}<div class="brand"><strong>${esc(title)}</strong><span>${back?'ONE SMALL STEP, EVERY RIDE':'ENGLISH, ONE STOP AT A TIME'}</span></div><div class="xp-pill">✦ ${Math.floor(S.xp+(S.active?.xp||0))}<small> XP</small></div></div></header>`;
  }
  function tabs(){return `<nav class="tab-bar" aria-label="Main navigation">${[['home','🏠','Home'],['map','🚆','Train'],['words','📖','Words'],['passport','🛂','Passport'],['me','👤','Me']].map(([id,icon,label])=>btn(`<span aria-hidden="true">${icon}</span><span>${label}</span>`,'tab','tab'+(currentTab===id?' selected':''),`data-tab="${id}" ${currentTab===id?'aria-current="page"':''}`)).join('')}</nav>`;}
  let dockObserver=null;
  function layout(content,title='English Train',back=null,{footer='',nav=true,mode=''}={}) {
    dockObserver?.disconnect();
    root.className=mode?`viewport-screen ${mode}-view${mode==='speed'?' ride-view':''}`:'';
    const header=mode==='ride'?lessonHeader(S.active):mode==='speed'?`<header class="ride-bar">${btn('✕','speed-leave','icon-button','aria-label="Finish speed round"')}<strong id="speed-seconds">${Math.max(0,Math.ceil((S.speed.endAt-Date.now())/1000))}s</strong><div class="band grow"><i id="speed-fill" style="width:${Math.max(0,(S.speed.endAt-Date.now())/45000*100)}%"></i></div><strong>⚡ ${S.speed.score}</strong></header>`:top(title,back);
    applyPreferences();root.innerHTML=header+`<main id="main" tabindex="-1" class="${nav?'has-tabs':'has-dock'}">${content}</main>`+(footer?`<div class="action-dock"><div>${footer}</div></div>`:'')+(nav?tabs():'');
    const dock=root.querySelector('.action-dock');
    if(dock&&globalThis.ResizeObserver){dockObserver=new ResizeObserver(entries=>document.documentElement.style.setProperty('--dock-height',entries[0].target.getBoundingClientRect().height+'px'));dockObserver.observe(dock);}
  }
  function goTop(){globalThis.scrollTo?.({top:0,behavior:'instant'});document.getElementById('main')?.focus({preventScroll:true});}
  const daily=()=>S.days[dateKey()]||{rides:0,xp:0,seconds:0};
  const currentStop=()=>stopList.find(s=>!S.stops[s.id])||stopList[stopList.length-1];
  function unlocked(id){const i=stopList.findIndex(s=>s.id===id);return i===0||!!S.stops[stopList[i-1]?.id]||!!S.stops[id];}
  function noticeHtml(){
    const n=S.notice==='shield'?bilingual('Your shield saved your streak! 🛡️','የቀን ተከታታይነትሽ ተጠብቋል።'):S.notice==='welcome'?bilingual("Welcome back! Let’s start a new streak.",'እንኳን ደህና መጣሽ! እንደገና እንጀምር።'):'';
    let html=n?`<div class="notice">${n}</div>`:'';
    if(storageFailed)html+=`<div class="notice">Progress can’t be saved on this device. ${btn('Save a progress code →','settings','text-button')}</div>`;
    if(S.result)html+=primary('🎁 Your reward is waiting →','result');
    if(S.speed && !S.speed.finished)html+=primary('⚡ Resume your speed round →','resume-speed');
    return html;
  }
  function dailyCard(){const d=daily();return `<div class="daily-card"><div class="goal-ring" style="--progress:${Math.min(1,d.rides/S.settings.goal)*360}deg"><div>${Math.min(d.rides,S.settings.goal)}<small>/ ${S.settings.goal}</small></div></div><div class="grow"><strong>${d.rides>=S.settings.goal?'Today? You did it.':'Your daily goal'}</strong><span>${d.rides>=S.settings.goal?'You can keep going.':`${S.settings.goal} ${S.settings.goal===1?'lesson':'lessons'} · about ${S.settings.goal*3} minutes`}</span></div><div class="streak-pill">🔥 ${S.streak}<small>day${S.streak===1?'':'s'}</small></div></div>`;}
  function homeCard(icon,title,sub,amText,action,extra=''){return btn(`<span class="home-icon" aria-hidden="true">${icon}</span><strong>${esc(title)}</strong><small>${esc(sub)}</small>${am(amText)}`,action,'home-card',extra);}
  function renderHome(){
    screen='main';currentTab='home';const next=currentStop(),hour=new Date().getHours(),due=dueCards(S);
    let html=`<section class="welcome"><div class="eyebrow">ENGLISH FOR YOUR DAY</div><h1>${hour<12?'Good morning.':hour<18?'Good afternoon.':'Good evening.'}</h1><p class="subtitle">${am('እንኳን ደህና መጣሽ።')}</p></section>`+petStrip()+dailyCard()+noticeHtml();
    if(S.active)html+=`<div class="resume-card"><div><span class="eyebrow">SAVED FOR YOU</span><h3>${esc(S.active.name)}</h3><p>${S.active.index} answers practiced. Pick up here.</p>${am('ከቆምሽበት ቀጥዪ።')}</div>${primary('▶ Continue','resume')}</div>`;
    html+=`<div class="home-grid">${homeCard('🚆','Train ride',`Next stop: ${next.name}`,'የባቡር ጉዞ','tab','data-tab="map"')}${homeCard('🌿','Free practice','Any topic, your pace','ነፃ ልምምድ','free')}${homeCard('🔎','Word search','Find your words','ቃል ፍለጋ','puzzle')}${homeCard('📈','My progress',`${wordCount(S)} words so far`,'እድገትሽ','progress')}</div>`;
    if(due.length>=5)html+=btn(`<span class="express-icon">↗</span><span><strong>Review Express</strong><small>${due.length} cards ready · double XP${am('ቃላቱን ደግሚ።')}</small></span><span class="xp-tag">2×</span>`,'review','express-card');
    layout(html);
  }
  function renderMap() {
    screen='main';currentTab='map';const d=daily(),next=currentStop(),line=C.lines.find(l=>l.id===next.lineId),due=dueCards(S),allDone=stopList.every(s=>S.stops[s.id]);
    const notices=S.notice==='shield'?bilingual('Your shield saved your streak! 🛡️','የቀን ተከታታይነትሽ ተጠብቋል።'):S.notice==='welcome'?bilingual("Welcome back! Let’s start a new streak.",'እንኳን ደህና መጣሽ! እንደገና እንጀምር።'):'';
    let html=`<section class="welcome"><div class="eyebrow">ENGLISH FOR YOUR DAY</div><h1>Every ride counts.</h1><p class="subtitle">${am('ደረጃ በደረጃ እንግሊዝኛ')}</p></section>`;
    html+=`<div class="daily-card"><div class="goal-ring" style="--progress:${Math.min(1,d.rides/S.settings.goal)*360}deg"><div>${Math.min(d.rides,S.settings.goal)}<small>/ ${S.settings.goal}</small></div></div><div class="grow"><strong>${d.rides>=S.settings.goal?'Today? You did it.':'Your daily goal'}</strong><span>${d.rides>=S.settings.goal?'You can keep going.':`${S.settings.goal} ${S.settings.goal===1?'ride':'rides'} · about ${S.settings.goal*3} minutes`}</span></div><div class="streak-pill">🔥 ${S.streak}<small>day${S.streak===1?'':'s'}</small></div></div>`;
    if(S.active)html+=`<div class="resume-card"><div><span class="eyebrow">SAVED FOR YOU</span><h3>${esc(S.active.name)}</h3><p>${S.active.index} answers practiced. Pick up here.</p>${am('ከቆምሽበት ቀጥዪ።')}</div>${primary('▶ Resume ride','resume')}</div>`;
    else html+=`<section class="next-ride" style="--route:${line.color}"><div class="next-label"><span class="ticket-label">${allDone?'KEEP YOUR ENGLISH GROWING':'NEXT DEPARTURE'}</span><span>2–3 MIN</span></div><div class="next-heading"><span class="train-hero" aria-hidden="true">🚆</span><div><h2>${esc(next.name)}</h2><p>${esc(line.title)} · Stop ${next.index+1}</p></div></div>${primary(`${allDone?'↻ Ride again':'▶ Ride'} <span>Let’s go</span>`,'intro',`data-stop="${next.id}"`)}</section>`;
    if(notices)html+=`<div class="notice">${notices}</div>`;
    if(storageFailed)html+=`<div class="notice">Progress can’t be saved on this device. ${btn('Save a progress code →','settings','text-button')}</div>`;
    if(S.result)html+=primary('🎁 Your ride reward is waiting →','result');
    if(S.speed && !S.speed.finished)html+=primary('⚡ Resume your speed round →','resume-speed');
    if(due.length>=5)html+=btn(`<span class="express-icon">↗</span><span><strong>Review Express</strong><small>${due.length} cards ready · double XP${am('ቃላቱን ደግሚ።')}</small></span><span class="xp-tag">2×</span>`,'review','express-card');
    html+=`<div class="section-heading"><div><span class="eyebrow">YOUR ENGLISH JOURNEY</span><h2>One stop at a time</h2></div><span class="muted">${Object.keys(S.stops).length}/${stopList.length}</span></div><div class="map-legend"><span>● Visited</span><span>◉ Up next</span><span>○ Still to come</span></div><div class="journey-map">`;
    C.lines.forEach((l,li)=>{
      const completed=l.stops.filter(s=>S.stops[s.id]).length;
      html+=`<section class="line-section" style="--route:${l.color}"><div class="line-title"><div class="line-number">${String(li+1).padStart(2,'0')}</div><div class="grow"><h3>${esc(l.title)}</h3>${am(l.am)}</div><span class="line-count">${completed} / ${l.stops.length}<small>stops</small></span></div><ol class="station-list">`;
      l.stops.forEach(s=>{
        const done=S.stops[s.id],active=!allDone&&next.id===s.id,locked=!unlocked(s.id);
        html+=`<li class="station ${done?'visited':''} ${active?'current':''} ${locked?'locked':''}" ${active?'id="current-station"':''}><div class="station-dot" aria-hidden="true">${active?'<span class="map-train">🚆</span>':done?'✓':''}</div>${btn(`<span class="grow"><strong>${esc(s.name)}</strong><small>${done?`<span class="stars" aria-label="${done} stars">${'★'.repeat(done)}${'☆'.repeat(3-done)}</span>`:active?'Next stop':locked?'Coming up':'Ready when you are'}</small></span><span aria-hidden="true">${locked?'🔒':done?'↻':'▶'}</span>`,'intro','station-button',`data-stop="${s.id}" ${locked?'disabled':''}`)}</li>`;
      });html+='</ol></section>';
    });
    html+=`</div><div class="journey-note">Made for your journey. Made for you.<br>${am('እንግሊዝኛሽ እየተሻሻለ ነው።')}<small>${esc(offlineText())} · 🛡️ ${S.shields} streak shields</small></div>`;
    layout(html);
  }
  let offlineReady=false;
  function offlineText(){return location.protocol==='file:'?'Local file · offline installation needs HTTPS':offlineReady?'Ready for the subway · offline saved':'Your progress stays on this device';}
  function renderWords(){
    screen='main';currentTab='words';const known=wordCount(S),count=Object.keys(S.cards).length;
    let html=`<section class="page-intro"><span class="eyebrow">YOUR GROWING COLLECTION</span><h1>You know <em>${known}</em><br>English words.</h1><p>${am('እንግሊዝኛሽ እየተሻሻለ ነው።')}<span class="muted">${count} words & phrases practiced. Tap to listen.</span></p></section><div class="notice">Each bar is a step toward remembering. New → Familiar → Growing → Strong → Mastered.</div>`;
    if(dueCards(S).length)html+=primary(`↗ Review ${Math.min(8,dueCards(S).length)} cards`,'review');
    if(!count)html+=`<div class="empty-state"><span>🌱</span><h2>Your word collection.</h2><p>Finish your first ride to plant something here.</p>${am('ትምህርቱን ጀምሪ።')}${primary('▶ Take your first ride','home')}</div>`;
    C.lines.forEach(l=>{
      const ids=Object.keys(S.cards).filter(id=>C.cards[id]?.lineId===l.id);
      if(ids.length)html+=`<section class="word-group"><h2><span>${l.icon}</span> ${esc(l.title)}</h2>${ids.map(id=>wordRow(id)).join('')}</section>`;
    });
    html+=btn('<span>🗓️</span><span><strong>Numbers, days & months</strong><small>Your pocket guide · 1–100 + dates</small></span><span>→</span>','guide','express-card');
    layout(html,'My Words');
  }
  function wordRow(id,guide=false,label='') {
    const w=C.cards[id],c=S.cards[id],box=c?.box||0;
    return `<div class="word-row">${btn('🔊','speak','icon-button',`data-text="${esc(w.en)}" aria-label="Listen: ${esc(w.en)}"`)}<div class="grow">${label?`<span class="word-label">${esc(label)}</span>`:''}<strong>${esc(w.en)}</strong>${w.say?`<small class="pronunciation">${esc(w.say)}</small>`:''}${am(w.am)}${guide?'':`<div class="mastery" role="img" aria-label="Mastery ${box} of 5">${Array.from({length:5},(_,i)=>`<i class="${i<box?'filled':''}"></i>`).join('')}</div>`}</div>${guide?btn('Practice','guide-ride','small-button',`data-card="${esc(id)}" aria-label="Practice ${esc(w.en)}"`):btn('🐢','slow','icon-button',`data-text="${esc(w.en)}" aria-label="Listen slowly: ${esc(w.en)}"`)}</div>`;
  }
  function renderGuide(){
    screen='guide';let html=`<section class="page-intro"><span class="eyebrow">YOUR POCKET GUIDE</span><h1>A number.<br><em>A day. A date.</em></h1><p>Listen to any word. Tap Practice for a short ride.</p>${am('ለመስማት ቃሉን ንኪ።')}</section><div class="notice"><strong>Boston clock & calendar</strong><p>Times here use the US clock and Gregorian calendar. 7:30 AM means half past seven in the morning.</p>${am('እዚህ ያሉት ሰዓቶች የአሜሪካ አቆጣጠር ናቸው።')}</div>`;
    for(const [key,label] of [['days','Days of the week'],['months','Months'],['numbers','Numbers 1–100']])html+=`<details class="guide-section" ${key==='days'?'open':''}><summary>${label}</summary>${C.guides[key].map(x=>wordRow(x.id,true,key==='numbers'?x.label:'')).join('')}</details>`;
    layout(html,'Pocket Guide','words');
  }
  function renderPassport(){
    screen='main';currentTab='passport';layout(`<section class="page-intro"><span class="eyebrow">LOOK HOW FAR YOU’VE COME</span><h1>Your English<br><em>passport.</em></h1><p>Every line is a new place you can go.<br>${am('በጣም ጎበዝ።')}<span class="muted">${S.stamps.length} / ${stampList.length} stamps collected</span></p></section><div class="passport-book"><div class="passport-heading"><span>ENGLISH TRAIN</span><span>🛂</span><span>BOSTON, MA</span></div><div class="stamp-grid">${stampList.map(([id,icon],i)=>`<div class="passport-stamp ${S.stamps.includes(id)?'earned':'unearned'}" style="--tilt:${i%2?4:-4}deg"><span>${S.stamps.includes(id)?icon:'◌'}</span><strong>${esc(id)}</strong><small>${S.stamps.includes(id)?'COLLECTED':C.lines.some(l=>l.stamp===id)?'FINISH THE LINE':'CHEST SURPRISE'}</small></div>`).join('')}</div><p class="passport-foot">A little progress, every ride.</p></div>`,'Passport');
  }
  function xpSum(start,end){return Object.entries(S.days).filter(([d])=>d>=start&&d<=end).reduce((n,[,d])=>n+d.xp,0);}
  function renderMe(){
    screen='main';currentTab='me';const level=levelFor(S.xp),nextLevel=LEVELS[level+1],today=dateKey();
    const weekday=(new Date().getDay()+6)%7,weekStart=shiftDate(today,-weekday),lastStart=shiftDate(weekStart,-7),thisWeek=xpSum(weekStart,today),lastWeek=xpSum(lastStart,shiftDate(weekStart,-1)),maxWeek=Math.max(thisWeek,lastWeek,1);
    const days=Array.from({length:7},(_,i)=>shiftDate(today,i-6)),maxXP=Math.max(1,...days.map(d=>S.days[d]?.xp||0));
    layout(`<section class="page-intro me-intro"><div><span class="eyebrow">LOOK HOW FAR YOU’VE COME</span><h1>This is<br><em>your journey.</em></h1></div>${btn('⚙️','settings','icon-button','aria-label="Settings"')}</section><section class="level-card"><div class="level-icon">${LEVELS[level][2]}</div><div class="grow"><span class="eyebrow">LEVEL ${level+1}</span><h2>${LEVELS[level][1]}</h2><p>${Math.floor(S.xp)} XP ${nextLevel?`· ${nextLevel[0]-S.xp} to ${nextLevel[1]}`:'· You’re a City Guide!'}</p><div class="band"><i style="width:${nextLevel?(S.xp-LEVELS[level][0])/(nextLevel[0]-LEVELS[level][0])*100:100}%"></i></div></div></section><div class="stats-grid">${[[wordCount(S),'words you know','🌱'],[S.rides,'rides completed','🚆'],[Math.floor(S.seconds/60),'minutes learned','⏱'],[S.bestStreak,'best streak','🔥']].map(([n,l,i])=>`<div class="stat"><span>${i}</span><strong>${n}</strong><small>${l}</small></div>`).join('')}</div><section class="panel"><h2>Your last 7 days</h2><p class="muted">Every bar is time you gave yourself.</p><div class="xp-chart" role="img" aria-label="Daily XP: ${days.map(d=>`${d}: ${S.days[d]?.xp||0}`).join(', ')}">${days.map(d=>`<div class="chart-day"><small>${S.days[d]?.xp||0}</small><div class="chart-track"><i style="height:${Math.max(2,(S.days[d]?.xp||0)/maxXP*100)}%"></i></div><span>${new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'narrow'})}</span></div>`).join('')}</div></section><section class="panel"><span class="eyebrow">YOUR PERSONAL LEAGUE</span><h2>You vs. you.</h2><div class="league-row"><span>This week</span><strong>${thisWeek} XP</strong></div><div class="league-track"><i style="width:${thisWeek/maxWeek*100}%"></i></div><div class="league-row"><span>Last week</span><strong>${lastWeek} XP</strong></div><div class="league-track previous"><i style="width:${lastWeek/maxWeek*100}%"></i></div><p>${thisWeek>lastWeek?'You’re ahead of last week. Look at you go!':'Practice today is a win.'}</p>${am('እንግሊዝኛሽ እየተሻሻለ ነው።')}</section><div class="panel shield-panel"><span>🛡️</span><div><strong>${S.shields} / 3 streak shields</strong><p>For the days life gets busy. Your first ride each day keeps your streak going.</p></div></div><div class="panel"><strong>⚡ Speed round best: ${S.speedBest}</strong><p class="muted">A 45-second bonus every third ride.</p></div>${btn('📈 My full progress','progress','button secondary')}${btn('⚙️ Settings & save my progress','settings','button secondary')}`,'Me');
  }
  function renderFreeSetup(){
    screen='free-setup';
    const topics=C.lines.map(l=>btn(`<span aria-hidden="true">${l.icon}</span><span class="grow"><strong>${esc(l.title)}</strong>${am(l.am)}</span>`,'free-topic','free-topic'+(freeTopic===l.id?' chosen':''),`data-line="${l.id}" aria-pressed="${freeTopic===l.id}"`)).join('');
    const times=[[0,'No timer'],[300,'5 min'],[600,'10 min']].map(([n,label])=>btn(`<strong>${label}</strong>`,'free-time',freeLimit===n?'chosen':'',`data-limit="${n}" aria-pressed="${freeLimit===n}"`)).join('');
    layout(`<section class="page-intro"><span class="eyebrow">FREE PRACTICE</span><h1>Practice<br><em>your way.</em></h1><p>Pick a topic. Practice as long as you like.</p>${am('ርዕስ ምረጪ።')}</section><section class="panel"><h2>Timer</h2><div class="goal-picker free-times">${times}</div></section><section class="panel"><h2>Topic</h2><div class="free-topics">${topics}</div></section>`,'Free practice','home',{nav:false,footer:primary('▶ Start practice','free-start',freeTopic?'':'disabled')});
  }
  function freeBatch(lineId){const l=C.lines.find(x=>x.id===lineId);return l?buildRide(l.stops[Math.floor(Math.random()*l.stops.length)],S):[];}
  function startFree(){
    if(S.active){toast('Your current lesson is saved. Finish it first.');return resumeRide();}
    if(S.result){toast('Your last lesson has a reward waiting.');return renderResult();}
    const l=C.lines.find(x=>x.id===freeTopic),queue=l?freeBatch(l.id):[];if(!queue.length)return;
    S.active={stopId:'free',name:'Free practice: '+l.title,phase:'questions',queue,index:0,baseCount:100,xp:0,mistakes:0,correct:0,combo:0,seconds:0,knownBefore:wordCount(S),quiet:false,silent:false,feedback:null,draft:{},cardIds:[...new Set(queue.flatMap(q=>q.cardIds||[]))],double:false,free:{lineId:l.id,limit:freeLimit}};
    save();lastTick=Date.now();renderRide();goTop();
  }
  function finishFree(){
    const r=S.active;if(!r?.free)return;
    if(!r.correct&&!r.mistakes){stopMedia();S.active=null;save();renderHome();return goTop();}
    completeRide();
  }
  function puzzleWords(){
    const seen=new Map();
    for(const id of Object.keys(S.cards)){const w=C.cards[id];if(w?.kind!=='word')continue;const word=normalize(w.en).toUpperCase();if(/^[A-Z]{3,8}$/.test(word)&&!seen.has(word))seen.set(word,id);}
    return shuffle([...seen.entries()]).sort((a,b)=>(S.cards[b[1]].known?1:0)-(S.cards[a[1]].known?1:0)).slice(0,7);
  }
  function makePuzzle(){
    const size=9,grid=Array(size*size).fill(''),words=[],dirs=[[0,1],[1,0],[1,1]];
    for(const [w,id] of puzzleWords()){
      for(let tries=0;tries<150;tries++){
        const [dr,dc]=dirs[Math.floor(Math.random()*dirs.length)],r0=Math.floor(Math.random()*(size-dr*(w.length-1))),c0=Math.floor(Math.random()*(size-dc*(w.length-1)));
        const cells=[...w].map((_,i)=>(r0+dr*i)*size+c0+dc*i);
        if(cells.every((c,i)=>!grid[c]||grid[c]===w[i])){cells.forEach((c,i)=>grid[c]=w[i]);words.push({w,id,cells,found:false});break;}
      }
    }
    for(let i=0;i<grid.length;i++)if(!grid[i])grid[i]='ABCDEFGHIJKLMNOPRSTUW'[Math.floor(Math.random()*21)];
    puzzle={size,grid,words,first:null,start:Date.now(),done:false};
  }
  function renderPuzzle(){
    screen='puzzle';
    if(!puzzle||puzzle.words.length<3){layout(`<div class="empty-state"><span>🔎</span><h2>Learn a few more words first.</h2><p>Word search uses the words you have learned. Take a lesson, then come back.</p>${am('መጀመሪያ ጥቂት ቃላት ተማሪ።')}${btn('🚆 Take a train ride','tab','button primary','data-tab="map"')}</div>`,'Word search','home',{nav:false});return;}
    const p=puzzle,foundCells=new Set(p.words.filter(w=>w.found).flatMap(w=>w.cells));
    const cells=p.grid.map((ch,i)=>btn(ch,'cell',`ws-cell${foundCells.has(i)?' found':''}${p.first===i?' first':''}`,`data-index="${i}" ${p.done?'disabled':''}`)).join('');
    const list=p.words.map(w=>`<div class="ws-word${w.found?' found':''}"><strong>${w.found?esc(w.w):'?'.repeat(w.w.length)}</strong>${am(C.cards[w.id]?.am)}</div>`).join('');
    const found=p.words.filter(w=>w.found).length;
    layout(`<section class="page-intro"><span class="eyebrow">WORD SEARCH · ${found} / ${p.words.length}</span><h1>${p.done?'You found<br><em>them all!</em>':'Find your<br><em>words.</em>'}</h1><p>Tap the first letter, then the last letter. Use the Amharic hints.</p>${am('የመጀመሪያውን ፊደል ንኪ፣ ከዚያ የመጨረሻውን ፊደል ንኪ።')}</section><div class="ws-grid" style="--size:${p.size}">${cells}</div><div class="ws-words">${list}</div>`,'Word search','home',{nav:false,footer:p.done?(S.pets.hatch?primary('🥚 Your egg is hatching!','hatch'):'')+primary('🔎 New puzzle','puzzle')+btn('Back home','home','button secondary'):'<p class="dock-note">Words go across, down, or diagonally.</p>'});
  }
  function tapCell(i){
    const p=puzzle;if(!p||p.done||!p.grid[i])return;
    if(p.first===null){p.first=i;return renderPuzzle();}
    const a=p.first;p.first=null;
    const hit=p.words.find(w=>!w.found&&((w.cells[0]===a&&w.cells.at(-1)===i)||(w.cells[0]===i&&w.cells.at(-1)===a)));
    if(hit){hit.found=true;tone('correct');addXP(5);advanceCard(S,hit.id,true);speak(C.cards[hit.id].en);
      if(p.words.every(w=>w.found)){p.done=true;const secs=Math.min(3600,(Date.now()-p.start)/1000),d=dateKey();addXP(10);S.puzzles++;S.seconds+=secs;S.days[d].seconds+=secs;logSession('puzzle','',secs,p.words.length,0);feedEgg(30);tone('fanfare');confetti();}
      save();
    } else if(a!==i)tone('wrong');
    renderPuzzle();
  }
  function renderProgress(){
    screen='progress';const today=dateKey(),days=Object.entries(S.days).filter(([,d])=>d.rides||d.seconds),totalAnswers=S.answers.right+S.answers.wrong;
    const month=Array.from({length:28},(_,i)=>shiftDate(today,i-27)),maxSec=Math.max(60,...month.map(d=>S.days[d]?.seconds||0));
    const boxes=[0,0,0,0,0];Object.values(S.cards).forEach(c=>boxes[Math.min(5,c.box)-1]++);const totalCards=Math.max(1,boxes.reduce((a,b)=>a+b,0));
    const hard=Object.entries(S.cards).filter(([id,c])=>c.miss&&c.box<=2&&C.cards[id]).sort((a,b)=>b[1].miss-a[1].miss).slice(0,6);
    const topics=C.lines.map(l=>{const ids=l.cardIds.filter(id=>C.cards[id].kind==='word'),known=ids.filter(id=>S.cards[id]?.known).length;return [l,known,ids.length];}).filter(([,k])=>k);
    const names={ride:'Train ride',free:'Free practice',review:'Review',guide:'Pocket guide',puzzle:'Word search'};
    const recent=S.log.slice(-10).reverse();
    layout(`<section class="page-intro"><span class="eyebrow">MY PROGRESS</span><h1>Look how far<br><em>you’ve come.</em></h1>${am('እንግሊዝኛሽ እየተሻሻለ ነው።')}</section>
<div class="stats-grid">${[[days.length,'days practiced','📅'],[Math.floor(S.seconds/60),'minutes learned','⏱'],[wordCount(S),'words you know','🌱'],[totalAnswers?Math.round(S.answers.right/totalAnswers*100)+'%':'–','answers right','🎯'],[S.rides,'lessons finished','🚆'],[S.puzzles,'word searches','🔎']].map(([n,l,i])=>`<div class="stat"><span>${i}</span><strong>${n}</strong><small>${l}</small></div>`).join('')}</div>
<section class="panel"><h2>Last 4 weeks</h2><p class="muted">Greener days mean more minutes practiced.</p><div class="heatmap">${month.map(d=>{const s=S.days[d]?.seconds||0;return `<i title="${d}: ${Math.round(s/60)} min" style="--level:${s?Math.max(.2,s/maxSec):0}" class="${d===today?'today':''}"></i>`;}).join('')}</div></section>
<section class="panel"><h2>How well you know your words</h2>${['New','Familiar','Growing','Strong','Mastered'].map((label,i)=>`<div class="league-row"><span>${label}</span><strong>${boxes[i]}</strong></div><div class="league-track"><i style="width:${boxes[i]/totalCards*100}%"></i></div>`).join('')}</section>
${topics.length?`<section class="panel"><h2>Words by topic</h2>${topics.map(([l,k,n])=>`<div class="league-row"><span>${l.icon} ${esc(l.title)}</span><strong>${k} / ${n}</strong></div><div class="league-track"><i style="width:${k/n*100}%"></i></div>`).join('')}</section>`:''}
${hard.length?`<section class="panel"><h2>Words to practice</h2><p class="muted">These were tricky. They will come back in your lessons.</p>${hard.map(([id])=>wordRow(id)).join('')}</section>`:''}
<section class="panel"><h2>Recent practice</h2>${recent.length?recent.map(e=>`<div class="league-row"><span>${esc(e.d.slice(5))} · ${names[e.type]||e.type}</span><strong>${Math.max(1,Math.round(e.seconds/60))} min · ${e.right}✓ ${e.wrong}✗</strong></div>`).join(''):'<p class="muted">Your lessons will show up here.</p>'}<p class="muted" id="voice-count"></p></section>`,'My progress','home');
    showVoiceCount();
  }
  function encodeState(s){const bytes=new TextEncoder().encode(JSON.stringify(s));let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return btoa(binary);}
  function decodeState(code){
    if(code.length>3e6)throw new Error('This progress code is too long.');
    const binary=atob(code.replace(/\s+/g,'')),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
    return validate(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes)));
  }
  function renderSettings(){
    screen='settings';const code=encodeState(S);
    layout(`<section class="page-intro"><span class="eyebrow">MAKE YOURSELF AT HOME</span><h1>Your<br><em>preferences.</em></h1></section><section class="panel"><h2>Daily goal</h2><p>Even one ride is enough.</p><div class="goal-picker">${[1,2,3].map(n=>btn(`<strong>${n}</strong><span>${n===1?'ride':'rides'}</span>`,'goal',S.settings.goal===n?'chosen':'',`data-goal="${n}" aria-pressed="${S.settings.goal===n}"`)).join('')}</div></section><section class="panel settings-list">${settingToggle('am','አማርኛ እርዳታ','Amharic helper text',S.settings.am)}${settingToggle('sound','Pleasant sounds','Chimes and celebrations',S.settings.sound)}</section><section class="panel"><h2>Save my progress</h2><p>Copy this code to Notes. It brings your progress back if your phone clears its storage.</p>${am('እድገትሽን ለማስቀመጥ ይህን ኮድ ቅጂ።')}<label for="backup">Your progress code</label><textarea id="backup" rows="3" readonly spellcheck="false">${code}</textarea>${primary('Copy progress code','copy')}<hr><label for="restore">Restore a saved progress code</label><textarea id="restore" rows="3" placeholder="Paste your saved code here…" spellcheck="false" autocapitalize="off"></textarea><p class="muted">Restore replaces this device’s current progress. Copy the code above first if you want to keep it.</p>${btn('Check progress code','restore-check','button secondary')}<div id="restore-preview" role="status"></div></section><section class="panel"><h2>Take it with you</h2><p>In Safari, tap Share <span aria-label="Share">⬆</span>, then <strong>Add to Home Screen</strong>. Open it once while online to save it for your next subway ride.</p>${am('በSafari ውስጥ Share ንኪ፣ ከዚያ Add to Home Screen ምረጪ።')}<p class="muted">${esc(offlineText())}</p></section><section class="panel"><h2>My voice recordings</h2><p>When you record your voice, it is saved on this phone so you can hear how much you improve.</p>${am('የምትቀጂው ድምፅሽ በዚህ ስልክ ላይ ይቀመጣል።')}<p class="muted" id="voice-count"></p></section>`,'Settings','me');
    showVoiceCount();
  }
  function settingToggle(key,title,sub,on){return `<div class="setting-row"><div><strong ${key==='am'?'lang="am" class="am"':''}>${esc(title)}</strong><small>${esc(sub)}</small></div>${btn(`<span></span>`, 'setting','switch',`role="switch" aria-checked="${on}" aria-label="${esc(title)}" data-setting="${key}"`)}</div>`;}
  function renderOnboarding(){
    screen='onboarding';const standalone=navigator.standalone||globalThis.matchMedia?.('(display-mode: standalone)').matches;
    if(standalone&&onboardingStep===2)return finishOnboarding();
    const pages=[
      `<div class="onboarding-art"><span>☀️</span><div class="onboard-train">🚆</div><div class="onboard-track"></div></div><span class="eyebrow">WELCOME ABOARD</span><h1>Your English.<br><em>A world of possibility.</em></h1><p>For the bus stop. For your next shift.<br>For all the things you want to say.</p>${am('እንኳን ደህና መጣሽ። ደረጃ በደረጃ እንግሊዝኛ እንማር።')}`,
      `<div class="onboarding-symbol">🌱</div><span class="eyebrow">SMALL IS A LOVELY START</span><h1>Your<br><em>daily goal.</em></h1><p>How many short rides feel right for you?</p>${am('በቀን ስንት አጫጭር ትምህርቶች ትፈልጊያለሽ?')}<div class="goal-picker">${[1,2,3].map(n=>btn(`<strong>${n}</strong><span>${n===1?'ride':'rides'}</span><small>${n*3} min</small>`,'onboard-goal',S.settings.goal===n?'chosen':'',`data-goal="${n}" aria-pressed="${S.settings.goal===n}"`)).join('')}</div>`,
      `<div class="onboarding-symbol">📲</div><span class="eyebrow">READY FOR THE SUBWAY</span><h1>Ready to go<br><em>on your phone.</em></h1><p>Add English Train to your Home Screen. Then it’s ready for a ride, even underground.</p>${am('በስልክሽ መነሻ ገጽ ላይ አስቀምጪው።')}<ol class="install-steps"><li><span>1</span>Open this page in Safari.</li><li><span>2</span>Tap Share ⬆.</li><li><span>3</span>Tap “Add to Home Screen”.</li></ol>`
    ];
    layout(`<section class="onboarding"><div class="onboarding-top"><span>ENGLISH TRAIN</span>${btn('Skip','onboard-skip','text-button')}</div>${pages[onboardingStep]}<div class="page-dots" aria-label="Step ${onboardingStep+1} of 3">${[0,1,2].map(i=>`<i class="${i===onboardingStep?'active':''}"></i>`).join('')}</div></section>`,'English Train',null,{nav:false,footer:primary(onboardingStep===2?'Let’s take a ride →':'Continue →','onboard-next')});
  }
  function finishOnboarding(){S.onboarded=true;save();renderHome();goTop();}

  function cardKind(w) {
    if(calendarIds.has(w.id))return 'calendar';
    if(numberIds.has(w.id)||/\d|\bdollars?\b|\bo.clock\b|\bhalf past\b/i.test(w.en))return w.kind==='sentence'?'number-sentence':'number';
    return w.kind;
  }
  function distractors(id,stop=null,english=false) {
    const cacheKey=id+'|'+(stop?.id||'')+'|'+english;
    if(distractorCache.has(cacheKey))return distractorCache.get(cacheKey);
    const w=C.cards[id],local=new Set(stop?.cardIds||[]),seen=new Set([english?w.en:w.am]);
    const rank=c=>local.has(c.id)?0:c.lineId===w.lineId?1:2;
    const result=shuffle(Object.values(C.cards)).filter(c=>c.id!==id&&cardKind(c)===cardKind(w)&&(english||c.am))
      .sort((a,b)=>rank(a)-rank(b)||Math.abs(a.en.length-w.en.length)-Math.abs(b.en.length-w.en.length))
      .filter(c=>{const value=english?c.en:c.am;if(seen.has(value))return false;seen.add(value);return true;});
    distractorCache.set(cacheKey,result);return result;
  }
  function cardQuestion(id,mode='read',stop=null) {
    const w=C.cards[id],others=distractors(id,stop);
    if(mode==='sentence') {
      const opts=shuffle([w.en,...distractors(id,stop,true).slice(0,2).map(c=>c.en)]);
      return {t:'listen',audio:w.en,opts,a:opts.indexOf(w.en),cardIds:[id]};
    }
    if(!w.am) {
      const words=w.en.split(/\s+/),last=words.pop(),alternatives=shuffle(['today.','please.','tomorrow.','here.','now.','yesterday.'].filter(v=>normalize(v)!==normalize(last))).slice(0,2),opts=shuffle([last,...alternatives]);
      return {t:mode==='listen'?'listen':'read',q:'Complete the sentence.',qAm:'ዓረፍተ ነገሩን ጨርሺ።',audio:w.en,en:words.join(' ')+' ___',opts,a:opts.indexOf(last),cardIds:[id]};
    }
    const useMeaning=!!w.am;
    const correct=useMeaning?w.am:w.en;
    const opts=shuffle([correct,...others.slice(0,2).map(c=>useMeaning?c.am:c.en)]);
    return {t:mode==='listen'?'listen':'read',q:mode==='listen'?'Listen. What does it mean?':'What does this mean?',qAm:'ትርጉሙ ምንድን ነው?',audio:w.en,en:w.en,opts,a:opts.indexOf(correct),cardIds:[id],meaning:true};
  }
  function prepareExercise(raw,quiet,silent) {
    let q=JSON.parse(JSON.stringify(raw));
    if(q.t==='match'&&q.pairs.length>5){q.pairs=q.pairs.slice(0,5);q.cardIds=(q.cardIds||[]).slice(0,5);}
    if(q.t==='say'&&silent) {q={t:'build',answer:q.en,audio:q.en,am:q.am,cardIds:q.cardIds};}
    if(q.t==='twins') {
      const choice=Math.random()<.5?0:1;
      if(quiet) {return {t:'read',q:'Read the word. Choose its meaning.',qAm:C.ui.read[1],en:choice?q.b:q.a,opts:[q.amA,q.amB],a:choice,cardIds:[q.cardIds[choice]],tip:q.tip};}
      q={...q,opts:[q.a,q.b],a:choice,audio:choice?q.b:q.a,cardIds:[q.cardIds[choice]]};
    }
    if(q.t==='listen'&&quiet) {
      if(q.meaning) q.t='read';
      else {q={t:'build',answer:q.audio,audio:q.audio,cardIds:q.cardIds,reading:true};}
    }
    if(q.t==='type'&&quiet)q.reading=true;
    if(['listen','read','mc','twins'].includes(q.t)){
      const correct=q.opts[q.a];q.opts=shuffle(q.opts);q.a=q.opts.indexOf(correct);
    }
    if(q.t==='build')q.bank=shuffle(q.answer.split(/\s+/));
    if(q.t==='match')q.order=shuffle(q.pairs.map((_,i)=>i));
    return q;
  }
  function buildRide(stop,state,quiet=false,silent=false) {
    const line=C.lines.find(l=>l.id===stop.lineId),local=new Set(stop.cardIds);
    const ids=[...shuffle(stop.cardIds),...shuffle(line.cardIds.filter(id=>!local.has(id)))];
    const sentences=ids.filter(id=>C.cards[id].kind==='sentence'),words=ids.filter(id=>C.cards[id].kind==='word');
    const candidates=[];
    const add=q=>{const ready=prepareExercise(q,quiet,silent);if(validQuestion(ready))candidates.push(ready);};
    shuffle(stop.exercises).forEach(add);
    for(const id of sentences){const w=C.cards[id];
      if(!silent)add({t:'say',en:w.en,am:w.am,cardIds:[id]});
      add({t:'build',answer:w.en,audio:w.en,am:w.am,cardIds:[id]});
      if(!quiet)add(cardQuestion(id,'sentence',stop));
      add(cardQuestion(id,'read',stop));
      if(w.am){const q=cardQuestion(id,'sentence',stop);add({...q,t:'mc',q:'How do you say this?',qAm:w.am});}
    }
    for(const id of words){const w=C.cards[id];
      add({t:'type',answer:w.en,audio:w.en,amHint:w.am,cardIds:[id]});
      add(cardQuestion(id,quiet?'read':'listen',stop));add(cardQuestion(id,'read',stop));
      if(w.am){const q=cardQuestion(id,'sentence',stop);add({...q,t:'mc',q:'Choose the English word.',qAm:w.am});}
      if(!sentences.length){
        add({t:'build',answer:w.en,audio:w.en,am:w.am,cardIds:[id]});
      }
      if(!sentences.length&&!silent)add({t:'say',en:w.en,am:w.am,cardIds:[id]});
    }
    shuffle(C.pairs).forEach(p=>add({t:'twins',...p}));
    const chosen=[],used=new Set(),counts={};
    const keys=q=>(q.cardIds||[]).map(id=>normalize(C.cards[id].en));
    const take=q=>{if(!q||counts[q.t]>=2||(q.t==='match'&&counts.match)||keys(q).some(k=>used.has(k)))return false;
      chosen.push(q);counts[q.t]=(counts[q.t]||0)+1;keys(q).forEach(k=>used.add(k));return true;};
    // Reserve earlier due targets first; they still count toward the variety limits.
    const earlier=dueCards(state).filter(id=>!local.has(id));
    for(const id of earlier){if(chosen.length>=2)break;take(prepareExercise(cardQuestion(id,'read',stop),quiet,silent));}
    const pick=t=>candidates.find(q=>q.t===t&&!keys(q).some(k=>used.has(k)));
    if(!silent)take(pick('say'));
    take(pick('build')||pick('type'));
    // Rotate optional types so adjacent stops do not serve the same template.
    const order=['mc','match','twins','type','listen','read'];
    const offset=(stop.index+C.lines.indexOf(line))%order.length;
    for(const t of [...order.slice(offset),...order.slice(0,offset)]) {
      if(chosen.length>=8)break;
      if(t==='match'){
        const pool=words.filter(id=>C.cards[id].am&&!used.has(normalize(C.cards[id].en))).slice(0,5);
        if(pool.length>=2)take(prepareExercise({t:'match',pairs:pool.map(id=>[C.cards[id].en,C.cards[id].am]),cardIds:pool},quiet,silent));
      } else take(pick(t));
    }
    for(const q of candidates){if(chosen.length>=8)break;take(q);}
    // Backtracking avoids leaving two identical types at the end of the ride.
    function arrange(left,result=[]) {
      if(!left.length)return result;
      for(const q of shuffle(left)){if(q.t===result.at(-1)?.t)continue;
        const found=arrange(left.filter(x=>x!==q),[...result,q]);if(found)return found;}
      return null;
    }
    return arrange(chosen)||chosen;
  }
  function rideQuestions(stop,quiet,silent,review=false,guideId=null) {
    const due=dueCards(S);
    let base=[];
    if(review) base=(guideId?[guideId,...shuffle(due.filter(id=>id!==guideId)).slice(0,5)]:due.slice(0,8)).map((id,i)=>cardQuestion(id,quiet||i%2?'read':'listen'));
    else return buildRide(stop,S,quiet,silent);
    if(guideId)while(base.length<7)base.push(cardQuestion(guideId,quiet||base.length%2?'read':'listen'));
    return base.map(q=>prepareExercise(q,quiet,silent));
  }
  function showIntro(id='review',guideId=null){
    if(S.active){toast('Your current ride is saved. Finish it before starting another.');return resumeRide();}
    if(S.result){toast('Your last ride has a reward waiting.');return renderResult();}
    if(id!=='review'&&id!=='guide'&&!unlocked(id))return;
    if(id==='review'&&!dueCards(S).length){toast('Your words are resting. Take a new ride while they settle in.');return;}
    selectedStop={id,guideId};screen='intro';
    const stop=stopById[id],line=C.lines.find(l=>l.id===stop?.lineId),valid=S.commute.until>Date.now(),quiet=valid&&S.commute.quiet,silent=valid&&S.commute.silent;
    const name=stop?.name || (guideId?'Practice: '+C.cards[guideId].en:'Review Express');
    layout(`<section class="ride-intro"><span class="ticket-label">${stop?'YOUR NEXT RIDE':'TIME TO REVIEW'}</span><div class="intro-symbol">${line?.icon||'🚆'}</div><h1>${esc(name)}</h1>${am(line?.am||'ቃላቱን ደግሚ።')}<p>${stop?'A short story. A few new words.<br>More confidence.':'A few familiar words, ready to stick.'}</p><div class="ticket-details"><span>⏱ 2–3 minutes</span><span>✦ ${id==='review'?'Double':'Every answer earns'} XP</span></div></section><section class="panel commute-panel"><h2>How’s your ride today?</h2>${am('ዛሬ እንዴት መማር ትፈልጊያለሽ?')}<label class="commute-option"><span>🎧</span><div><strong>Can’t listen now</strong><small>Use reading questions</small></div><input id="quiet" type="checkbox" ${quiet?'checked':''}></label><label class="commute-option"><span>🤫</span><div><strong>Can’t speak now</strong><small>Use word tiles instead</small></div><input id="silent" type="checkbox" ${silent?'checked':''}></label><p class="muted">Remembered for 30 minutes.</p></section>`,'All aboard','home',{nav:false,mode:'intro',footer:primary('▶ Start my ride','start')});goTop();
  }
  function startRide(){
    if(!selectedStop||S.active)return;
    const {id,guideId}=selectedStop,quiet=!!document.getElementById('quiet')?.checked,silent=!!document.getElementById('silent')?.checked,stop=stopById[id],queue=rideQuestions(stop,quiet,silent,id==='review'||id==='guide',guideId);
    if(!queue.length)return;
    S.commute={quiet,silent,until:Date.now()+30*60000};
    S.active={stopId:id,name:stop?.name || (guideId?'Practice: '+C.cards[guideId].en:'Review Express'),phase:stop&&!S.seenStops.includes(id)?'intro':'questions',queue,index:0,baseCount:queue.length,xp:0,mistakes:0,correct:0,combo:0,seconds:0,knownBefore:wordCount(S),quiet,silent,feedback:null,draft:{},cardIds:[...new Set(queue.flatMap(q=>q.cardIds||[]))],double:id==='review'};
    save();lastTick=Date.now();renderRide();goTop();
  }
  function resumeRide(){
    if(!S.active)return renderHome();lastTick=Date.now();
    if(S.active.index>=S.active.queue.length)return completeRide();
    renderRide();goTop();
  }
  function freeClock(r){return '⏱ '+(r.free.limit?clock(Math.max(0,r.free.limit-r.seconds))+' left':clock(r.seconds));}
  function lessonHeader(r){if(r.free)return `<header class="ride-bar">${btn('✕','pause','icon-button','aria-label="Pause practice"')}<strong id="free-clock" class="grow">${freeClock(r)}</strong><span class="combo ${r.combo>=3?'hot':''}">${r.combo>=3?'🔥 '+r.combo+' · ':''}✦ ${r.xp} XP</span>${btn('Finish','free-finish','small-button')}</header>`;const pct=Math.min(100,r.index/r.queue.length*100);return `<header class="ride-bar">${btn('✕','pause','icon-button','aria-label="Pause ride"')}<div class="ride-track" role="progressbar" aria-label="Ride progress" aria-valuetext="${r.index} of ${r.queue.length} practiced" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i><span style="left:${Math.max(4,Math.min(94,pct))}%" aria-hidden="true">🚆</span></div><span class="combo ${r.combo>=3?'hot':''}">${r.combo>=3?'🔥 '+r.combo+' · ':''}✦ ${r.xp} XP</span></header>`;}
  function audioButtons(text,quiet=false){return quiet?'':`<div class="audio-controls">${btn('<span>🔊</span><strong>Listen</strong>','speak','listen-button',`data-text="${esc(text)}"`)}${btn('🐢 Slow','slow','slow-button',`data-text="${esc(text)}"`)}</div>`;}
  function renderStory(){
    const r=S.active,stop=stopById[r.stopId];if(!stop){r.phase='questions';return renderRide();}
    let html=lessonHeader(r)+`<section class="story-intro"><span class="eyebrow">REAL LIFE ENGLISH</span><h1>${stop.grammar?'Yesterday & today':'Your story starts here.'}</h1><p>${r.quiet?'Read the short conversation.':'Listen to the conversation. Tap ▶ on each line.'}</p>${am('ንግግሩን አዳምጪ። በእያንዳንዱ መስመር ላይ ▶ ንኪ።')}</section>`;
    if(stop.grammar){const g=stop.grammar;html+=`<div class="panel"><h2>${esc(g.title)}</h2><p>${g.body.replace(/<(?!\/?b\b)[^>]*>/g,'')}</p><p class="am am-help" lang="am">${g.bodyAm}</p>${g.rows.map(([en,translation])=>`<div class="grammar-row"><strong>${esc(en)}</strong>${am(translation)}</div>`).join('')}</div>`;}
    if(stop.dialog.length)html+=`<div class="dialog">${stop.dialog.map(d=>`<div class="dialog-bubble ${d.b?'you':''}"><span class="eyebrow">${esc(d.who)}</span><p>${esc(d.en)}</p>${am(d.am)}${r.quiet?'':btn('▶','speak','icon-button',`data-text="${esc(d.en)}" aria-label="Play ${esc(d.who)}’s line"`)}</div>`).join('')}</div>`;
    if(['u1','u3','u6'].includes(stop.lineId))html+=`<div class="notice">The original Amharic story uses Ethiopian clock time. Listen to the English time for Boston appointments.${am('የእንግሊዝኛውን ሰዓት አዳምጪ።')}</div>`;
    if(['numbers'].includes(stop.lineId))html+=`<div class="notice">Times here use the US clock: 7:30 AM is half past seven in the morning.${am('እዚህ ያሉት ሰዓቶች የአሜሪካ አቆጣጠር ናቸው።')}</div>`;
    html+=`<div class="section-heading"><h2>Your words for this ride</h2></div><p class="muted">${r.quiet?'Read each word and its meaning.':'Tap a word. Try saying it once.'}</p>${am('ለመስማት ቃሉን ንኪ።')}<div class="story-words">${stop.cardIds.map(id=>{const w=C.cards[id];return `<div class="word-row">${r.quiet?'<span class="word-sprout">🌱</span>':btn('🔊','speak','icon-button',`data-text="${esc(w.en)}" aria-label="Listen: ${esc(w.en)}"`)}<div class="grow"><strong>${esc(w.en)}</strong><small class="pronunciation">${esc(w.say)}</small>${am(w.am)}</div></div>`;}).join('')}</div>`;
    layout(html,'Your story','pause',{nav:false,footer:primary('I’m ready. Let’s practice →','story-done')});
  }
  function renderRide(){
    const r=S.active;if(!r)return renderHome();screen='ride';
    if(r.phase==='intro')return renderStory();
    const q=r.queue[r.index];if(!q)return completeRide();
    const fb=r.feedback,disabled=fb?'disabled':'';
    const instruction=(q.t==='read'?q.en:q.q) || C.ui[q.t]?.[0] || 'What do you say?';
    const translation=q.qAm || C.ui[q.t]?.[1] || 'ምን ትያለሽ?';
    let html=`<section class="question question-${q.t} slide-in" aria-labelledby="question-title"><div class="exercise-label">${{listen:'LISTEN & PICK',read:'WORD CHECK',match:'MATCH THE PAIRS',build:'BUILD THE SENTENCE',mc:'WHAT DO YOU SAY?',type:'TYPE IT',say:'YOUR VOICE',twins:'SOUND TWINS'}[q.t]}${r.index>=r.baseCount&&!r.free?' · ONE MORE TRY':''}</div><h1 id="question-title">${esc(q.t==='say'&&r.quiet?'Read. Then say it yourself.':instruction)}</h1>${am(translation)}`;
    if(q.t==='listen'||q.t==='twins')html+=audioButtons(q.audio,r.quiet);
    if(q.t==='read')html+=audioButtons(q.audio||q.en,r.quiet);
    if(['listen','read','mc','twins'].includes(q.t))html+=`<div class="options">${q.opts.map((o,i)=>btn(`<span class="option-letter">${String.fromCharCode(65+i)}</span><span ${/[\u1200-\u137F]/.test(o)?'lang="am" class="am"':''}>${esc(o)}</span>${fb&&i===q.a?'<span class="answer-check">✓</span>':''}`,'answer',`option ${fb&&i===q.a?'correct':''} ${fb&&!fb.ok&&r.draft.selected===i?'incorrect':''}`,`data-index="${i}" ${disabled}`)).join('')}</div>`;
    if(q.t==='build') {
      if(r.quiet||q.reading)html+=`<div class="notice">${q.am?am(q.am):'Read it once: '+esc(q.answer)}</div>`;
      else html+=audioButtons(q.audio||q.answer);
      const bank=q.bank||q.answer.split(' '),chosen=Array.isArray(r.draft.chosen)?r.draft.chosen:[];
      html+=`<p class="muted">Tap words in order. Tap again to undo.</p><div class="sentence-slot ${fb?.ok?'correct':''}" aria-label="Your sentence">${chosen.map((index,pos)=>btn(esc(bank[index]),'unbuild','word-tile in-slot',`data-index="${pos}" ${disabled}`)).join('')||'<span>Your sentence goes here…</span>'}</div><div class="word-bank">${bank.map((w,i)=>btn(esc(w),'build','word-tile '+(chosen.includes(i)?'used':''),`data-index="${i}" ${chosen.includes(i)?'disabled':disabled}`)).join('')}</div>`;
    }
    if(q.t==='type')html+=audioButtons(q.audio,r.quiet)+`<div class="type-hint">${am(q.amHint||C.cards[q.cardIds?.[0]]?.am||'')}${r.quiet||q.reading?`<p>Read, then type: <strong>${esc(q.answer)}</strong></p>`:''}</div><label for="typed-answer">Your English word</label><input id="typed-answer" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type here…" value="${esc(r.draft.typed||'')}" ${disabled}>`;
    if(q.t==='match') {
      const matched=Array.isArray(r.draft.matched)?r.draft.matched:[],sel=r.draft.pair;
      const tile=(i,side)=>btn(esc(q.pairs[i][side]),'pair',`pair-tile ${side===1?'am':''} ${matched.includes(i)?'matched':''} ${sel?.index===i&&sel.side===side?'selected':''}`,`data-index="${i}" data-side="${side}" ${side===1?'lang="am"':''} ${matched.includes(i)||fb?'disabled':''}`);
      html+=`<div class="match-timer">✦ Match in 25 seconds for bonus XP. Take your time.</div><div class="pairs-grid"><div>${q.pairs.map((_,i)=>tile(i,0)).join('')}</div><div>${(q.order||q.pairs.map((_,i)=>i)).map(i=>tile(i,1)).join('')}</div></div><div class="pair-hint" role="status">${esc(r.draft.pairMessage||'')}</div>`;
    }
    if(q.t==='say')html+=`<div class="say-model"><strong>${esc(q.en)}</strong>${am(q.am)}</div>${audioButtons(q.en,r.quiet)}<div class="record-panel ${recordingURL?'recorded':''}"><p id="record-status" role="status">${r.draft.fallback?'Say it out loud. Your voice is enough.':'Listen, record, then compare.'}</p>${btn('🎙 Record my voice','record','button secondary',`${disabled} data-record-start ${recordingURL?'hidden':''}`)}<div id="playback">${recordingURL?recordingComparison(q):''}</div><div class="record-actions">${btn('↻ Try again','record','button secondary',`${disabled} data-record-retry ${!recordingURL?'hidden':''}`)}${btn(r.draft.fallback?'I said it ✓':'Good · I said it ✓','said','button primary',`${disabled} ${!r.draft.fallback&&!recordingURL?'disabled':''}`)}</div>${btn('Say it without recording','mic-fallback','text-button',disabled)}</div>`;
    if(q.tip)html+=`<aside class="pronunciation-tip">💡 ${am(q.tip)}</aside>`;
    html+='</section>';
    const feedback=fb?`<div class="feedback ${fb.ok?'good':'gentle'}" role="status"><strong title="${esc(fb.message)}">${esc(fb.ok?(fb.message.startsWith('Almost!')?fb.message:'Well done!'):'Answer: '+(q.opts?.[q.a]||q.answer||q.en||'Try once more.'))}</strong>${am(fb.ok?C.ui.correct[1]:C.ui.retry[1])}</div>`:'';
    let footer=feedback;
    if(fb)footer+=primary('Continue →','next');
    else if(q.t==='build')footer+=primary('Check my sentence','check-build',` ${(r.draft.chosen?.length||0)!==(q.bank||q.answer.split(' ')).length?'disabled':''}`);
    else if(q.t==='type')footer+=primary('Check my word','check-type',` ${!r.draft.typed?.trim()?'disabled':''}`);
    else if(q.t==='match')footer+='<p class="dock-note">Find a pair. Keep going.</p>';
    else if(q.t==='say')footer+='<p class="dock-note">Your voice gets stronger every time.</p>';
    else footer+='<p class="dock-note">Take your time. Every try counts.</p>';
    layout(html,'Your ride','pause',{nav:false,footer,mode:'ride'});
  }
  function applyAnswer(ok,message=null,translation=null){
    const r=S.active;if(!r||r.feedback)return;
    const q=r.queue[r.index];
    S.answers[ok?'right':'wrong']++;
    if(ok){r.correct++;r.combo++;const bonus=r.combo>=3?5:0;r.xp+=(10+bonus)*(r.double?2:1);tone(r.combo>=3?'combo':'correct');}
    else {r.mistakes++;r.combo=0;r.queue.push(JSON.parse(JSON.stringify(q)));tone('wrong');}
    for(const id of q.cardIds||[])advanceCard(S,id,ok&&!r.draft.hadWrong);
    const answer=q.opts?.[q.a]||q.answer||q.en||'';
    r.feedback={ok,message:message||(ok?(q.why?'You got it! '+q.why:C.ui.correct[0]):`The answer is: ${answer}. Let’s try that one again.`),am:translation||(ok?(q.whyAm||C.ui.correct[1]):(q.whyAm||C.ui.retry[1]))};
    save();renderRide();announce(r.feedback.message);
    if(ok)document.querySelector('.question')?.classList.add('correct-flash');
  }
  function pairAnswer(index,side){
    const r=S.active;if(!r||r.feedback)return;const q=r.queue[r.index],d=r.draft;
    if(!q.pairs[index]||[0,1].indexOf(side)<0)return;
    if(d.matchStarted===undefined)d.matchStarted=r.seconds;
    if(!Array.isArray(d.matched))d.matched=[];
    if(d.matched.includes(index))return;
    const prev=d.pair;
    if(!prev||prev.side===side){d.pair=prev?.side===side&&prev.index===index?null:{index,side};save();renderRide();return;}
    if(prev.index===index){
      d.matched.push(index);d.pair=null;d.pairMessage='Matched. Well done!';tone('correct');
      if(d.matched.length===q.pairs.length){
        if(r.seconds-d.matchStarted<=25&&!d.hadWrong)r.xp+=5*(r.double?2:1);
        if(d.hadWrong){r.queue.push(JSON.parse(JSON.stringify(q)));r.feedback={ok:false,message:'All matched! Let’s practice those pairs once more.',am:'ሁሉንም አዛመድሽ! በጣም ጥሩ።'};save();return renderRide();}
        return applyAnswer(true,'All matched! Well done.','ሁሉንም አዛመድሽ! በጣም ጥሩ።');
      }
    } else {
      d.hadWrong=true;r.mistakes++;S.answers.wrong++;r.combo=0;d.pair=null;
      d.pairMessage=`Try again: ${q.pairs[prev.index][0]} = ${q.pairs[prev.index][1]}.`;
      for(const id of q.cardIds||[])if([q.pairs[index][0],q.pairs[prev.index][0]].includes(C.cards[id]?.en))advanceCard(S,id,false);
      tone('wrong');announce(d.pairMessage);
    }
    save();renderRide();
  }
  function nextQuestion(){
    if(!S.active?.feedback)return;stopMedia();const r=S.active;r.index++;r.feedback=null;r.draft={};
    if(r.free){
      if(r.free.limit&&r.seconds>=r.free.limit)return completeRide();
      if(r.index>=r.queue.length&&r.queue.length<1900){const more=freeBatch(r.free.lineId);r.queue.push(...more);r.cardIds=[...new Set([...r.cardIds,...more.flatMap(q=>q.cardIds||[])])];}
    }
    save();
    if(r.index>=r.queue.length)return completeRide();renderRide();goTop();
  }
  function addXP(amount){const b=S.pets.buddy;if(b)S.pets.growth[b]=(S.pets.growth[b]||0)+amount;S.xp+=amount;const d=dateKey();S.days[d]||={xp:0,rides:0,seconds:0};S.days[d].xp+=amount;}
  function chooseReward(){
    const roll=Math.random(),unowned=stampList.filter(([id])=>!S.stamps.includes(id));
    if(roll<.45)return {type:'xp',amount:10+Math.floor(Math.random()*21)};
    if(roll<.68&&S.shields<3)return {type:'shield'};
    if(unowned.length)return {type:'stamp',stamp:unowned[Math.floor(Math.random()*unowned.length)][0]};
    return {type:'xp',amount:20};
  }
  function completeRide(){
    const r=S.active;if(!r)return;stopMedia();const today=dateKey(),previousDay=S.days[shiftDate(today,-1)]?.rides||0;
    const stars=r.mistakes===0?3:r.mistakes<=2?2:1;
    const stop=stopById[r.stopId];
    if(stop){S.stops[stop.id]=Math.max(S.stops[stop.id]||0,stars);const l=C.lines.find(l=>l.id===stop.lineId);if(l.stops.every(s=>S.stops[s.id])&&!S.stamps.includes(l.stamp))S.stamps.push(l.stamp);}
    const notice=completeDay(S,today);if(notice)S.notice=notice;
    S.rides++;S.seconds+=r.seconds;addXP(r.xp);S.days[today].rides++;S.days[today].seconds+=r.seconds;
    feedEgg(40);
    logSession(r.free?'free':stop?'ride':r.stopId==='guide'?'guide':'review',r.free?.lineId||stop?.lineId||'',r.seconds,r.correct,r.mistakes);
    S.result={free:!!r.free,name:r.name,xp:r.xp,stars,words:Math.max(0,wordCount(S)-r.knownBefore),seconds:r.seconds,correct:r.correct,reward:chooseReward(),open:false,speedAvailable:S.rides%3===0,previousDay};
    S.active=null;save();tone('fanfare');renderResult();confetti();goTop();
  }
  function renderResult(){
    const r=S.result;if(!r)return renderHome();screen='result';
    const enc=C.ui.encourage[(S.rides-1)%C.ui.encourage.length];
    const stamp=r.reward.type==='stamp'?stampList.find(([id])=>id===r.reward.stamp):null;
    const rewardLabel=r.reward.type==='xp'?`+${r.reward.amount} bonus XP`:r.reward.type==='shield'?'A Streak Shield!':`${stamp?.[1]||'🛂'} ${r.reward.stamp} stamp!`;
    layout(`<section class="result-screen"><div class="ticket-label">${r.free?'PRACTICE COMPLETE!':'STOP COMPLETE!'}</div><div class="celebration-stars" aria-label="${r.stars} of 3 stars">${[1,2,3].map(n=>`<span class="${n<=r.stars?'earned':''}">★</span>`).join('')}</div><h1>${r.free?'Look at you go!':'You’re going places!'}</h1><p>${esc(r.name)} · complete!<br>${am('ትምህርቱን ጨርሰሻል! በጣም ጎበዝ።')}</p>${r.free?'':'<div class="arrival-track"><span>●</span><i></i><span class="arriving-train">🚆</span><i></i><span>●</span></div>'}<div class="result-stats"><div><strong>+${r.xp}</strong><small>XP</small></div><div><strong>+${r.words}</strong><small>new ${r.words===1?'word':'words'}</small></div><div><strong>${Math.floor(r.seconds/60)}:${String(Math.floor(r.seconds%60)).padStart(2,'0')}</strong><small>time</small></div></div><div class="encouragement"><strong>${r.correct} answers practiced correctly. ${esc(enc[0])}</strong>${am(enc[1])}${r.previousDay?`<small>You rode ${r.previousDay} time${r.previousDay===1?'':'s'} yesterday. Today: ${daily().rides}.</small>`:''}</div><div class="result-egg">${S.pets.hatch?'<strong>🥚 Your egg is ready to hatch!</strong>':eggBar()}</div><section class="chest-card ${r.open?'opened':''}"><span class="eyebrow">${r.open?'YOUR REWARD':'YOUR SURPRISE REWARD'}</span>${btn(`<span class="chest">${r.open?(r.reward.type==='shield'?'🛡️':r.reward.type==='xp'?'✦':stamp?.[1]||'🛂'):'🎁'}</span><strong>${r.open?esc(rewardLabel):'Tap to open your reward'}</strong>`,'chest','chest-button',r.open?'disabled':'')}${r.open?'<p>Earned by showing up for yourself.</p>':''}</section></section>`,'You did it!',null,{nav:false,mode:'result',footer:r.open?primary('Back to my journey →','result-done')+(r.speedAvailable?btn('⚡ 45-second speed round','speed-start','button secondary'):''):primary('🎁 Open my surprise','chest')});
  }
  function openChest(){
    const r=S.result;if(!r||r.open)return;
    r.open=true;
    if(r.reward.type==='xp')addXP(r.reward.amount);
    if(r.reward.type==='shield')S.shields=Math.min(3,S.shields+1);
    if(r.reward.type==='stamp'&&!S.stamps.includes(r.reward.stamp))S.stamps.push(r.reward.stamp);
    save();tone('fanfare');renderResult();confetti();
  }
  function finishResult(){
    const free=S.result?.free;S.result=null;save();
    const next=()=>checkLevel(()=>{if(free){renderHome();return goTop();}renderMap();goTop();document.getElementById('current-station')?.classList.add('new-station');});
    if(S.pets.hatch){hatchReturn=next;renderHatch();return goTop();}
    next();
  }
  function renderHatch(){
    const id=S.pets.hatch;if(!id)return renderHome();screen='hatch';
    const [,en,amName,rarity]=petById[id],count=S.pets.owned[id],buddyNew=S.pets.buddy===id&&count===1&&Object.keys(S.pets.owned).length===1;
    layout(`<section class="hatch-screen rarity-${rarity}"><span class="ticket-label">${count>1?'ANOTHER ONE!':'A NEW PET!'}</span>${petImg(id,'hatch-pop')}<span class="rarity-tag">${rarity.toUpperCase()}</span><h1>${esc(en)}</h1>${am(amName)}${btn('🔊 Listen','speak','button secondary',`data-text="${esc(en)}"`)}<p>${count>1?`You have ${count} of these now.`:buddyNew?'Your first pet! It will grow as you learn. Give it a name.':'Added to your pet family.'}</p></section>`,'A new friend',null,{nav:false,footer:primary(buddyNew?'Meet my pet →':'Continue →','hatch-done')});
    tone('fanfare');confetti();
  }
  function eggBar(){return `<span class="egg-bar"><span aria-hidden="true">🥚</span><span class="egg-track"><i style="width:${S.pets.egg}%"></i></span><small>${S.pets.egg}/100</small></span>`;}
  function petStrip(){
    const p=S.pets,b=p.buddy;
    if(p.hatch)return btn(`<span class="pet-strip-egg" aria-hidden="true">🥚</span><span class="grow"><strong>Your egg is hatching!</strong><small>Tap to see who it is.</small>${am('እንቁላልሽ እየተፈለፈለ ነው!')}</span>`,'hatch','pet-strip hatching');
    if(!b)return btn(`<span class="pet-strip-egg" aria-hidden="true">🥚</span><span class="grow"><strong>Your first pet is coming!</strong><small>Finish a lesson or a word search to fill the egg.</small>${eggBar()}</span>`,'pets','pet-strip');
    return btn(`${petImg(b,'stage-'+petStage(b))}<span class="grow"><strong>${esc(petName(b))}</strong><small>${PET_STAGES[petStage(b)][1]} · ${Object.keys(p.owned).length} of ${PETS.length} pets</small>${eggBar()}</span>`,'pets','pet-strip');
  }
  function renderPets(){
    screen='pets';const p=S.pets,b=p.buddy,owned=Object.keys(p.owned).length;
    let html=`<section class="page-intro"><span class="eyebrow">MY PETS · ${owned} / ${PETS.length}</span><h1>Your<br><em>pet family.</em></h1><p>Every lesson fills your egg. A full egg hatches a new friend.</p>${am('እያንዳንዱ ትምህርት እንቁላሉን ይሞላል።')}</section>`;
    if(petView&&p.owned[petView]){const [id,en,amName,r]=petById[petView];html+=`<section class="panel pet-detail rarity-${r}">${petImg(id)}<span class="rarity-tag">${r.toUpperCase()}</span><h2>${esc(en)}</h2>${am(amName)}<p class="muted">You have ${p.owned[id]}.</p><div class="pet-actions">${btn('🔊 Listen','speak','button secondary',`data-text="${esc(en)}"`)}${id!==b?btn('❤️ Make my buddy','pet-buddy','button primary',`data-id="${id}"`):''}</div></section>`;}
    if(b){const si=petStage(b),g=p.growth[b]||0,next=PET_STAGES[si+1];
      html+=`<section class="panel buddy-panel">${petImg(b,'stage-'+si)}<span class="eyebrow">YOUR BUDDY · ${PET_STAGES[si][1].toUpperCase()}</span><label for="pet-name">Its name</label><input id="pet-name" type="text" maxlength="24" autocomplete="off" spellcheck="false" value="${esc(petName(b))}"><p class="muted">${next?`${Math.ceil(next[0]-g)} more XP until it is ${next[1].toLowerCase()}. Every lesson helps it grow.`:'Your best friend forever!'}</p>${next?`<div class="league-track"><i style="width:${(g-PET_STAGES[si][0])/(next[0]-PET_STAGES[si][0])*100}%"></i></div>`:''}</section>`;}
    html+=`<section class="panel"><h2>🥚 Your egg</h2><p class="muted">A lesson adds 40. A word search adds 30.</p><div class="league-track"><i style="width:${p.egg}%"></i></div><p>${p.egg} / 100</p>${p.hatch?primary('🥚 Hatch it now!','hatch'):''}</section>`;
    html+=`<div class="rarity-legend"><span class="rarity-common">Common</span><span class="rarity-rare">Rare</span><span class="rarity-epic">Epic</span><span class="rarity-legendary">Legendary</span></div><div class="pet-grid">${PETS.map(([id,en,,r])=>p.owned[id]?btn(`${petImg(id)}<small>${esc(en)}</small>`,'pet-view',`pet-card rarity-${r}${id===b?' is-buddy':''}`,`data-id="${id}"`):`<div class="pet-card locked rarity-${r}">${petImg(id,'silhouette')}<small>?</small></div>`).join('')}</div>`;
    layout(html,'My pets','home');
  }
  function checkLevel(next){
    const l=levelFor(S.xp);if(l<=S.levelSeen)return next();S.levelSeen=l;save();screen='level';levelReturn=next;tone('fanfare');
    layout(`<section class="level-moment"><span class="ticket-label">YOU’RE MOVING FORWARD</span><div>${LEVELS[l][2]}</div><p>Level ${l+1}</p><h1>Hello,<br><em>${LEVELS[l][1]}.</em></h1><p>Your practice brought you here.</p>${am('እንግሊዝኛሽ እየተሻሻለ ነው። በጣም ጎበዝ።')}</section>`,'A new chapter',null,{nav:false,footer:primary('Keep going →','level-done')});confetti();
  }
  function confetti(){
    if(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
    const div=document.createElement('div');div.className='confetti';div.setAttribute('aria-hidden','true');
    div.innerHTML=Array.from({length:26},(_,i)=>`<i style="--x:${Math.random()*100}vw;--delay:${Math.random()*.4}s;--rotation:${Math.random()*600}deg;--color:${['#B0342A','#C98A18','#3C6E4F','#426E85'][i%4]}"></i>`).join('');document.body.append(div);setTimeout(()=>div.remove(),2300);
  }
  function startSpeed(){
    if(S.result){if(!S.result.open||!S.result.speedAvailable)return;S.result.speedAvailable=false;S.result=null;}
    S.speed={endAt:Date.now()+45000,score:0,answered:0,previousBest:S.speedBest,question:null,finished:false};
    nextSpeedQuestion();save();renderSpeed();goTop();
  }
  function nextSpeedQuestion(){const ids=Object.keys(S.cards).filter(id=>S.cards[id].known&&C.cards[id]?.am&&C.cards[id].kind==='word');S.speed.question=cardQuestion(ids[Math.floor(Math.random()*ids.length)]||Object.keys(C.cards)[0]);}
  function renderSpeed(){
    const s=S.speed;if(!s)return renderHome();screen='speed';
    if(!s.finished&&Date.now()>=s.endAt)finishSpeed();
    if(s.finished){const record=s.score>s.previousBest;layout(`<section class="result-screen"><div class="intro-symbol">${record?'🏆':'⚡'}</div><span class="eyebrow">BONUS PRACTICE</span><h1>${record?'Your new<br><em>personal best!</em>':'Quick thinking.<br><em>Growing English.</em>'}</h1><div class="speed-final">${s.score}<small>words in 45 seconds</small></div><p>+${s.score*2} bonus XP · Best: ${S.speedBest}</p>${am('በጣም ጎበዝ።')}</section>`,'Speed round',null,{nav:false,footer:primary('Back to my journey →','speed-done')});return;}
    const q=s.question;layout(`<section class="question"><span class="exercise-label">45 SECONDS · BONUS POINTS</span><h1>Tap the meaning.</h1>${am('ትርጉሙን ምረጪ።')}<div class="read-word">${esc(q.en)}</div><div class="options">${q.opts.map((o,i)=>btn(esc(o),'speed-answer','option am',`data-index="${i}" lang="am"`)).join('')}</div><p id="speed-feedback" role="status">${esc(s.message||'Keep going. Every word counts.')}</p><p class="muted">Personal best: ${S.speedBest}</p></section>`,'Speed round','speed-leave',{nav:false,mode:'speed',footer:btn('Finish bonus round','speed-leave','button secondary')});
  }
  function finishSpeed(){const s=S.speed;if(!s||s.finished)return;s.finished=true;S.speedBest=Math.max(S.speedBest,s.score);addXP(s.score*2);save();if(s.score>s.previousBest){tone('fanfare');confetti();}}

  function recordingComparison(q){return `<div class="record-comparison">${btn('▶ My voice','play-recording','button secondary')}${btn('🔊 Model voice','speak','button secondary',`data-text="${esc(q.en)}"`)}</div>`;}
  async function recordVoice(){
    const r=S.active;if(!r||r.feedback)return;
    if(recordingBusy)return;
    if(recorder?.state==='recording'){recorder.stop();clearTimeout(micTimer);return;}
    if(!navigator.mediaDevices?.getUserMedia||!globalThis.MediaRecorder)return micFallback();
    stopMedia();const generation=micGeneration;recordingBusy=true;
    const recordButton=document.querySelector('[data-action="record"]:not([hidden])');if(recordButton)recordButton.disabled=true;
    try {
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      if(generation!==micGeneration||S.active!==r||screen!=='ride'){stream.getTracks().forEach(t=>t.stop());return;}
      micStream=stream;recordingChunks=[];
      const mime=['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(t=>MediaRecorder.isTypeSupported?.(t));
      recorder=mime?new MediaRecorder(stream,{mimeType:mime}):new MediaRecorder(stream);
      recorder.ondataavailable=e=>{if(e.data.size)recordingChunks.push(e.data);};
      recorder.onerror=()=>micFallback();
      recorder.onstop=()=>{
        micStream?.getTracks().forEach(t=>t.stop());micStream=null;
        if(generation!==micGeneration||screen!=='ride'||S.active!==r)return;
        const blob=new Blob(recordingChunks,{type:recorder?.mimeType||mime||'audio/mp4'});
        recordingURL=URL.createObjectURL(blob);recordingBusy=false;
        keepRecording(blob,r.queue[r.index],r.stopId);
        const playback=document.getElementById('playback');
        if(playback)playback.innerHTML=recordingComparison(r.queue[r.index]);
        document.querySelector('.record-panel')?.classList.add('recorded');
        const recordStart=document.querySelector('[data-record-start]');if(recordStart)recordStart.hidden=true;
        const retry=document.querySelector('[data-record-retry]');if(retry)retry.hidden=false;
        const status=document.getElementById('record-status');if(status)status.textContent='Listen and compare. How did it feel?';
        document.querySelectorAll('[data-action="said"], [data-action="record"]').forEach(b=>b.disabled=false);
        if(recordButton)recordButton.textContent='🎙 Record again';
        announce('Your recording is ready. Listen and compare.');
      };
      recorder.start();recordingBusy=false;
      if(recordButton){recordButton.disabled=false;recordButton.textContent='⏹ Stop recording';}
      document.getElementById('record-status').textContent='Recording… Tap stop when you’re ready.';
      micTimer=setTimeout(()=>{if(recorder?.state==='recording')recorder.stop();},15000);
    }catch(_){if(generation===micGeneration)micFallback();}
  }
  function micFallback(){stopMedia();if(!S.active)return;S.active.draft.fallback=true;save();renderRide();announce('Say it out loud, then tap I said it.');}
  function tick(){
    const now=Date.now(),elapsed=Math.min(3,(now-lastTick)/1000);lastTick=now;
    if(document.hidden)return;
    if(screen==='ride'&&S.active){S.active.seconds+=elapsed;if(S.active.free){const c=document.getElementById('free-clock');if(c)c.textContent=freeClock(S.active);}}
    if(screen==='speed'&&S.speed&&!S.speed.finished){
      if(now>=S.speed.endAt){finishSpeed();renderSpeed();return;}
      const seconds=document.getElementById('speed-seconds'),fill=document.getElementById('speed-fill');
      if(seconds)seconds.textContent=Math.ceil((S.speed.endAt-now)/1000)+'s';if(fill)fill.style.width=(S.speed.endAt-now)/450+'%';
    }
  }
  function pauseRide(){stopMedia();save();renderHome();goTop();}
  let restoreCandidate=null;
  root.addEventListener('input',e=>{
    if(e.target.id==='pet-name'&&S.pets.buddy){S.pets.names[S.pets.buddy]=e.target.value.trim().slice(0,24);save();return;}
    if(e.target.id==='typed-answer'&&S.active&&!S.active.feedback){S.active.draft.typed=e.target.value;save();const b=root.querySelector('[data-action="check-type"]');if(b)b.disabled=!e.target.value.trim();}
  });
  root.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='typed-answer'){e.preventDefault();root.querySelector('[data-action="check-type"]:not(:disabled)')?.click();}});
  root.addEventListener('click',async e=>{
    const b=e.target.closest('button[data-action]');if(!b||b.disabled)return;initAudio();
    const a=b.dataset.action,index=Number(b.dataset.index);
    if(a==='speak'||a==='slow')return speak(b.dataset.text,a==='slow',b);
    if(a==='tab'){stopMedia();save();currentTab=b.dataset.tab;({home:renderHome,map:renderMap,words:renderWords,passport:renderPassport,me:renderMe}[currentTab]||renderHome)();return goTop();}
    if(a==='free'){renderFreeSetup();return goTop();}
    if(a==='free-topic'){freeTopic=b.dataset.line;return renderFreeSetup();}
    if(a==='free-time'){freeLimit=Number(b.dataset.limit)||0;return renderFreeSetup();}
    if(a==='free-start')return startFree();
    if(a==='free-finish')return finishFree();
    if(a==='puzzle'){makePuzzle();renderPuzzle();return goTop();}
    if(a==='cell')return tapCell(index);
    if(a==='progress'){renderProgress();return goTop();}
    if(a==='pets'){petView=null;renderPets();return goTop();}
    if(a==='hatch'){renderHatch();return goTop();}
    if(a==='hatch-done'){const id=S.pets.hatch,first=id&&S.pets.owned[id]===1&&Object.keys(S.pets.owned).length===1;S.pets.hatch=null;save();const next=hatchReturn;hatchReturn=null;if(next&&!first)return next();petView=null;renderPets();return goTop();}
    if(a==='pet-view'){petView=b.dataset.id;renderPets();speak(petById[petView]?.[1]||'');return goTop();}
    if(a==='pet-buddy'&&S.pets.owned[b.dataset.id]){S.pets.buddy=b.dataset.id;petView=null;save();renderPets();toast(`${petName(S.pets.buddy)} is your buddy now!`);return goTop();}
    if(a==='home')return pauseRide();
    if(a==='words'){renderWords();return goTop();}
    if(a==='me'){renderMe();return goTop();}
    if(a==='settings'){renderSettings();return goTop();}
    if(a==='guide'){renderGuide();return goTop();}
    if(a==='guide-ride')return showIntro('guide',b.dataset.card);
    if(a==='goal'||a==='onboard-goal'){S.settings.goal=Number(b.dataset.goal);save();return a==='goal'?renderSettings():renderOnboarding();}
    if(a==='setting'){const k=b.dataset.setting;if(!['am','sound'].includes(k))return;S.settings[k]=!S.settings[k];save();renderSettings();return;}
    if(a==='copy'){
      try {await navigator.clipboard.writeText(document.getElementById('backup').value);toast('Progress code copied. Paste it into Notes.');}
      catch(_){const field=document.getElementById('backup');field.focus();field.select();field.setSelectionRange(0,field.value.length);toast('Your code is selected. Touch and hold, then choose Copy.');}return;
    }
    if(a==='restore-check'){
      const preview=document.getElementById('restore-preview');
      try{restoreCandidate=decodeState(document.getElementById('restore').value);preview.innerHTML=`<div class="notice"><strong>${restoreCandidate.rides} rides · ${wordCount(restoreCandidate)} words · ${restoreCandidate.xp} XP</strong><p>Use this saved progress on this device?</p>${primary('Restore this progress','restore-confirm')}</div>`;}
      catch(_){restoreCandidate=null;preview.textContent='That code couldn’t be read. Please paste the complete English Train progress code.';}return;
    }
    if(a==='restore-confirm'&&restoreCandidate){stopMedia();S=restoreCandidate;S.onboarded=true;restoreCandidate=null;const n=reconcileStreak(S);if(n)S.notice=n;save();renderHome();goTop();toast(storageFailed?'Progress restored for this visit. Save a backup code before leaving.':'Your progress is back. Welcome aboard!');return;}
    if(a==='onboard-skip')return finishOnboarding();
    if(a==='onboard-next'){if(++onboardingStep>2)return finishOnboarding();return renderOnboarding();}
    if(a==='intro')return showIntro(b.dataset.stop);
    if(a==='review')return showIntro('review');
    if(a==='start')return startRide();
    if(a==='resume')return resumeRide();
    if(a==='pause')return pauseRide();
    if(a==='story-done'&&S.active){S.active.phase='questions';if(!S.seenStops.includes(S.active.stopId))S.seenStops.push(S.active.stopId);save();renderRide();return goTop();}
    if(a==='answer'&&S.active&&!S.active.feedback){S.active.draft.selected=index;return applyAnswer(index===S.active.queue[S.active.index].a);}
    if((a==='build'||a==='unbuild')&&S.active&&!S.active.feedback){
      const d=S.active.draft;d.chosen=Array.isArray(d.chosen)?d.chosen:[];
      if(a==='build'&&!d.chosen.includes(index))d.chosen.push(index);if(a==='unbuild')d.chosen.splice(index,1);save();return renderRide();
    }
    if(a==='check-build'&&S.active){const q=S.active.queue[S.active.index];return applyAnswer(normalize((S.active.draft.chosen||[]).map(i=>(q.bank||q.answer.split(' '))[i]).join(' '))===normalize(q.answer));}
    if(a==='check-type'&&S.active){const q=S.active.queue[S.active.index],grade=spelling(S.active.draft.typed,q.answer);return applyAnswer(grade!=='wrong',grade==='almost'?`Almost! Check the spelling: ${q.answer}`:null);}
    if(a==='pair')return pairAnswer(index,Number(b.dataset.side));
    if(a==='next')return nextQuestion();
    if(a==='record')return recordVoice();
    if(a==='mic-fallback')return micFallback();
    if(a==='play-recording'&&recordingURL){try{recordingAudio?.pause();recordingAudio=new Audio(recordingURL);await recordingAudio.play();}catch(_){toast('Tap My voice once more to play.');}return;}
    if(a==='said')return applyAnswer(true,'You used your voice. That’s progress!','በጣም ጎበዝ።');
    if(a==='result')return renderResult();
    if(a==='chest')return openChest();
    if(a==='result-done')return finishResult();
    if(a==='level-done'){const next=levelReturn;levelReturn=null;return next?next():renderHome();}
    if(a==='speed-start')return startSpeed();
    if(a==='resume-speed')return renderSpeed();
    if(a==='speed-answer'&&S.speed&&!S.speed.finished){
      if(Date.now()>=S.speed.endAt){finishSpeed();return renderSpeed();}
      const s=S.speed,ok=index===s.question.a;s.answered++;if(ok)s.score++;
      for(const id of s.question.cardIds||[])advanceCard(S,id,ok);
      s.message=ok?'You got it!':`Remember: ${s.question.en} = ${s.question.opts[s.question.a]}`;tone(ok?'correct':'wrong');nextSpeedQuestion();save();return renderSpeed();
    }
    if(a==='speed-leave'){finishSpeed();return renderSpeed();}
    if(a==='speed-done'){S.speed=null;save();return checkLevel(()=>{renderHome();goTop();});}
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){stopMedia();save();}
    else {lastTick=Date.now();const n=reconcileStreak(S);if(n)S.notice=n;if(screen==='speed')renderSpeed();if(screen==='main'&&currentTab==='map')renderMap();if(screen==='main'&&currentTab==='home')renderHome();}
  });
  globalThis.addEventListener('pagehide',()=>{stopMedia();save();});
  timer=setInterval(tick,1000);
  // Periodic saves also preserve elapsed time when iOS suspends without pagehide.
  setInterval(()=>{if(S.active||S.speed)save();},10000);
  if(location.protocol!=='file:' && 'serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{offlineReady=true;if(screen==='main'&&currentTab==='map')renderMap();}).catch(()=>{toast('Offline saving is unavailable here. Your progress code still works.');});
  }
  if(!S.onboarded)renderOnboarding();else if(S.result)renderResult();else if(S.speed)renderSpeed();else renderHome();
})();
