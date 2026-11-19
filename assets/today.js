/* AatmikJoy Today: private local-first practices and temporary emotional release. */
(()=>{'use strict';
const $=selector=>document.querySelector(selector);
const $$=selector=>Array.from(document.querySelectorAll(selector));
const storageKey='aatmikjoy-care-v1',journalKey='aatmikjoy-journal-v1';
const dateKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const esc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const examples={
 meditation:{name:'Meditation',kind:'minutes',target:3,when:'Anytime'},
 eyes:{name:'Gentle eye rest and exercises',kind:'minutes',target:3,when:'Throughout the day'},
 nostril:{name:'Alternate-nostril breathing',kind:'minutes',target:5,when:'Anytime'},
 breaths:{name:'Five mindful breaths',kind:'minutes',target:2,when:'Anytime'},
 feelings:{name:'Check in with your feelings',kind:'minutes',target:2,when:'Anytime'},
 movement:{name:'Move with awareness',kind:'minutes',target:5,when:'Throughout the day'},
 gratitude:{name:'A moment of gratitude',kind:'minutes',target:2,when:'Evening'},
 inquiry:{name:'Listen inward',kind:'minutes',target:5,when:'Anytime'},
 wake:{name:'Rise with the morning',kind:'times',target:1,when:'Morning'},
 meals:{name:'Enjoy regular meals',kind:'times',target:1,when:'Throughout the day'},
 water:{name:'Stay comfortably hydrated',kind:'times',target:1,when:'Throughout the day'},
 daylight:{name:'Connect with daylight',kind:'minutes',target:10,when:'Morning'},
 sleep:{name:'Wind down for rest',kind:'times',target:1,when:'Evening'}
};
const guidance={
 meditation:{intro:'Sit comfortably and notice your natural breath. There is nothing to achieve.',middle:'Halfway there. Soften your shoulders and return to this breath.'},
 eyes:{intro:'Look away from your screen. Blink naturally, rest your gaze at a distance, and never press on your eyes.',middle:'A gentle nudge: soften your eyes and let your gaze rest.'},
 nostril:{intro:'Sit comfortably and gently alternate nostrils at a natural pace, without breath retention. Stop if uncomfortable.',middle:'Halfway there. Keep your breathing unforced, or simply breathe normally.'},
 breaths:{intro:'Notice the feeling of one natural breath, then the next.',middle:'Return to the next easy breath.'},
 feelings:{intro:'Notice what you feel, without needing to fix or judge it.',middle:'Can you allow this feeling to be noticed gently?'},
 movement:{intro:'Move in a way that feels comfortable. Notice your posture and surroundings.',middle:'Check your pace. A gentler movement is always welcome.'},
 gratitude:{intro:'Recall something simple that you appreciate.',middle:'Let that appreciation settle, without forcing any particular emotion.'},
 inquiry:{intro:'Sit with one question, without needing an immediate answer.',middle:'Notice what has emerged. There is no right answer.'},
 daylight:{intro:'Find a little daylight, if it is comfortable and safe.',middle:'Notice the light and air around you.'}
};
const emotionPrompts=[
 'Where do I notice this feeling in my body?',
 'What might this feeling be trying to tell me?',
 'Can I name this feeling without judging myself?',
 'What would make this moment a little gentler?',
 'Would a breath, a boundary, or a moment of rest help?',
 'What am I ready to release from my attention for now?'
];
let data={habits:[],progress:{}};
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved&&Array.isArray(saved.habits)&&saved.progress&&typeof saved.progress==='object')data={habits:saved.habits.filter(h=>h&&typeof h.id==='string'&&typeof h.name==='string'),progress:saved.progress};}catch(_){}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(data));return true}catch(_){feedback('Browser storage is unavailable; export your plan if you need a copy.');return false}}
function feedback(str){$('#care-feedback').textContent=str}
function today(){return data.progress[dateKey()]||(data.progress[dateKey()]={})}
function download(name,content,type='application/json'){
 const url=URL.createObjectURL(new Blob([content],{type}));
 const link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();
 window.setTimeout(()=>URL.revokeObjectURL(url),1500);
}
const timer={id:null,seconds:180,total:180,active:false,deadline:0,interval:null,nudged:false,ctx:null};
function findHabit(id){return data.habits.find(h=>h.id===id)}
function playChime(){
 if(!$('#focus-sound').checked)return;
 try{
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
 if(!timer.ctx)timer.ctx=new AC();
 const ctx=timer.ctx;
 if(ctx.state==='suspended')ctx.resume().catch(()=>{});
 const start=ctx.currentTime+.03;
 [523.25,659.25,783.99].forEach((frequency,i)=>{
  const oscillator=ctx.createOscillator(),gain=ctx.createGain();
  oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,start+i*.19);
  gain.gain.setValueAtTime(.0001,start+i*.19);
  gain.gain.exponentialRampToValueAtTime(.095,start+i*.19+.025);
  gain.gain.exponentialRampToValueAtTime(.0001,start+i*.19+.85);
  oscillator.connect(gain);gain.connect(ctx.destination);
  oscillator.start(start+i*.19);oscillator.stop(start+i*.19+.9);
 });
 }catch(_){$('#focus-nudge').textContent='Your moment is complete. Sound was unavailable in this browser.'}
}
function warmAudio(){
 if(!$('#focus-sound').checked)return;
 try{
 const AC=window.AudioContext||window.webkitAudioContext;
 if(AC){if(!timer.ctx)timer.ctx=new AC();if(timer.ctx.state==='suspended')timer.ctx.resume().catch(()=>{});}
 }catch(_){}
}
function formatTime(seconds){return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')}
function paintTimer(){
 $('#focus-timer').textContent=formatTime(timer.seconds);
 const progress=timer.total?100*(timer.total-timer.seconds)/timer.total:0;
 $('#focus-ring').style.setProperty('--aj-progress',progress.toFixed(2)+'%');
 $('#focus-toggle').textContent=timer.active?'Pause':'Start practice';
 const h=findHabit(timer.id);
 $('#focus-toggle').disabled=!h||h.kind!=='minutes';
 $('#focus-reset').disabled=!h||h.kind!=='minutes';
 $('#focus-timer-state').textContent=timer.active?'In your moment':timer.seconds===0?'Complete':'Ready when you are';
}
function stopTicker(){if(timer.interval!==null){clearInterval(timer.interval);timer.interval=null}timer.active=false;}
function choosePractice(id){
 const h=findHabit(id);if(!h||h.kind!=='minutes')return;
 stopTicker();timer.id=id;timer.total=Math.max(60,Math.min(5400,Number(h.target)*60||180));timer.seconds=timer.total;timer.nudged=false;
 $('#focus-practice-title').textContent=h.name;
 $('#focus-practice-description').textContent=(guidance[h.id.replace(/^example-/,'')]||{}).intro||'Take this time in your own way. Rest whenever you need.';
 $('#focus-nudge').textContent='A quiet beginning. Take your time.';
 paintTimer();drawList();
}
function finishTimer(){
 stopTicker();timer.seconds=0;timer.nudged=true;paintTimer();$('#focus-nudge').textContent='Your moment is complete. Notice how you feel.';
 const h=findHabit(timer.id);
 if(h){today()[h.id]=h.target;save();drawList();}
 playChime();
}
function tick(){
 if(!timer.active)return;
 timer.seconds=Math.max(0,Math.ceil((timer.deadline-Date.now())/1000));
 if(!timer.nudged&&timer.seconds<=timer.total/2&&timer.seconds>0){
  timer.nudged=true;
  if($('#focus-midway').checked){const h=findHabit(timer.id);$('#focus-nudge').textContent=(guidance[(h&&h.id||'').replace(/^example-/,'')]||{}).middle||'Halfway through. Let your breath and attention soften.';}
 }
 if(timer.seconds===0){finishTimer();return}
 paintTimer();
}
function toggleTimer(){
 if(timer.active){timer.seconds=Math.max(0,Math.ceil((timer.deadline-Date.now())/1000));stopTicker();paintTimer();$('#focus-nudge').textContent='Paused. Continue when ready.';return;}
 if(!findHabit(timer.id))return;
 if(timer.seconds===0){timer.seconds=timer.total;timer.nudged=false;}
 warmAudio();timer.deadline=Date.now()+timer.seconds*1000;timer.active=true;
 $('#focus-nudge').textContent='You have made room for yourself.';paintTimer();
 timer.interval=setInterval(tick,200);
}
function resetTimer(){if(!findHabit(timer.id))return;stopTicker();timer.seconds=timer.total;timer.nudged=false;$('#focus-nudge').textContent='A fresh beginning is always available.';paintTimer();}
function refreshQuickButtons(){
 $$('[data-care-example]').forEach(button=>{
  const id=button.dataset.careExample;const exists=!!findHabit('example-'+id);
  button.disabled=exists;
  if(exists)button.setAttribute('aria-label',examples[id].name+' already added');
  else button.setAttribute('aria-label','Add '+examples[id].name);
  button.classList.toggle('aj-added',exists);
 });
}
function drawList(){
 const list=$('#care-list'),values=today();
 list.innerHTML=data.habits.length?data.habits.map(h=>{
  const count=Math.min(h.target,Math.max(0,Number(values[h.id]||0)));
  const done=count>=h.target;
  const timed=h.kind==='minutes';
  return '<li class="aj-moment'+(h.id===timer.id?' aj-selected':'')+'"><label><input type="checkbox" data-complete="'+esc(h.id)+'" '+(done?'checked':'')+' aria-label="Mark '+esc(h.name)+' complete"><span><strong>'+esc(h.name)+'</strong><small>'+esc(h.when)+' · '+(timed?h.target+' min':count+' / '+h.target+' times')+(done?' · completed':'')+'</small></span></label><div class="aj-moment-actions">'+(timed?'<button type="button" data-focus="'+esc(h.id)+'" class="aj-start-item" aria-label="Select timer for '+esc(h.name)+'">Timer</button>':(!done?'<button type="button" data-add="'+esc(h.id)+'">+ Once</button>':'') )+'<button type="button" data-remove="'+esc(h.id)+'" class="aj-remove-item" aria-label="Remove '+esc(h.name)+'">×</button></div></li>';
 }).join(''):'<li class="aj-moment-empty">Choose a practice above, or create one of your own.</li>';
 const finished=data.habits.filter(h=>Number(values[h.id]||0)>=h.target).length;
 $('#care-progress').textContent=data.habits.length?finished+' of '+data.habits.length+' moments tended':'One small moment is enough.';
 refreshQuickButtons();
}
function addExample(id){
 const h=examples[id];if(!h||findHabit('example-'+id))return;
 const practice={id:'example-'+id,...h};data.habits.push(practice);
 save();drawList();feedback('Added '+h.name+' to your moments.');
 $('#today-add-drawer').open=false;
 if(h.kind==='minutes')choosePractice(practice.id);
}
function changeChoice(e){
 const id=e.target.dataset.complete,h=findHabit(id);if(!h)return;
 today()[id]=e.target.checked?h.target:0;save();drawList();
 feedback(e.target.checked?'A moment of care noted.':'Your check-in has been updated.');
}
function handleListButton(e){
 const button=e.target.closest('button');if(!button)return;
 if(button.dataset.focus){choosePractice(button.dataset.focus);return}
 if(button.dataset.add){const h=findHabit(button.dataset.add);if(!h)return;today()[h.id]=Math.min(h.target,Number(today()[h.id]||0)+1);save();drawList();return}
 if(button.dataset.remove){
  const id=button.dataset.remove;
  data.habits=data.habits.filter(h=>h.id!==id);
  Object.values(data.progress).forEach(day=>delete day[id]);
  if(timer.id===id){stopTicker();timer.id=null;timer.seconds=180;timer.total=180;$('#focus-practice-title').textContent='Choose a moment';$('#focus-practice-description').textContent='Add a practice to make a little space for yourself.';$('#focus-nudge').textContent='Nothing to accomplish. Simply arrive.';paintTimer();}
  save();drawList();feedback('Removed from your moments.');
 }
}
function renderDaily(){
 const thoughts=[
 ['You can begin again, as often as you need.','What would a kinder beginning look like today?','I can honor my needs without comparison.'],
 ['There is wisdom in noticing what nourishes you.','When did you last feel truly at ease?','My own rhythm deserves respect.'],
 ['A little attention can transform an ordinary moment.','What is asking for your attention today?','I can return to the present moment.'],
 ['Rest is part of living, not a reward for finishing.','Where might you allow yourself more ease?','I have permission to pause.'],
 ['You are unique; your practices can be, too.','What practice genuinely supports your nature?','I am allowed to find my own way.']
 ];
 const wisdom=[
 ['AYURVEDA · DINACHARYA','Ayurveda invites awareness of the everyday rhythms of waking, nourishment, movement and rest.'],
 ['YOGA · ABHYASA','Abhyasa is steady practice. What small act could you return to gently today?'],
 ['YOGA · SVADHYAYA','Self-study begins with noticing your patterns without judging them.'],
 ['YOGA · AHIMSA','Ahimsa encourages a compassionate approach to yourself, including when plans change.'],
 ['AYURVEDA · NOURISHMENT','Notice the pace of one meal, your appetite and how you feel afterward.'],
 ['NATURE · DAILY RHYTHM','Your needs vary with seasons and responsibilities. Let routines be adaptable.'],
 ['YOGA · INNER OBSERVATION','What helped you make room for yourself today?']
 ];
 const d=new Date(), day=Math.floor((new Date(d.getFullYear(),d.getMonth(),d.getDate())-new Date(d.getFullYear(),0,1))/86400000);
 const [thought,prompt,affirmation]=thoughts[day%thoughts.length];
 $('#today-thought').textContent=thought;$('#today-prompt').textContent=prompt;$('#today-affirmation').textContent=affirmation;
 $('#today-date').textContent=d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
 const [label,copy]=wisdom[day%wisdom.length];$('#today-learning-label').textContent=label;$('#today-learning-text').textContent=copy;
 $('#today-journal-question').textContent=prompt;
}
function start(){
 if(!$('#page-today'))return;
 renderDaily();drawList();paintTimer();
 const tabs=$$('[data-idea-tab]');
 tabs.forEach(b=>b.addEventListener('click',()=>{
  tabs.forEach(x=>{const selected=x===b;x.classList.toggle('is-active',selected);x.setAttribute('aria-pressed',String(selected))});
  ['inner','nature','own'].forEach(name=>{$('#today-panel-'+name).hidden=name!==b.dataset.ideaTab});
  if(b.dataset.ideaTab==='own')$('#care-name').focus();
 }));
 $$('#page-today [data-care-example]').forEach(b=>b.addEventListener('click',()=>addExample(b.dataset.careExample)));
 $('#care-form').addEventListener('submit',e=>{
  e.preventDefault();const name=$('#care-name').value.trim().slice(0,90),kind=$('#care-kind').value,target=Number($('#care-target').value),when=$('#care-when').value;
  if(!name||!Number.isInteger(target)||target<1||target>90){feedback('Please choose a practice and a goal between 1 and 90.');return}
  const h={id:'h'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name,kind,target,when};data.habits.push(h);save();drawList();feedback('Added '+name+'.');
  e.target.reset();$('#today-add-drawer').open=false;if(kind==='minutes')choosePractice(h.id);
 });
 $('#care-list').addEventListener('click',handleListButton);
 $('#care-list').addEventListener('change',changeChoice);
 $('#focus-toggle').addEventListener('click',toggleTimer);
 $('#focus-reset').addEventListener('click',resetTimer);
 $('#care-export').addEventListener('click',()=>download('aatmikjoy-self-care-plan.json',JSON.stringify(data,null,2)));
 $('#care-reset').addEventListener('click',()=>{
  if(!window.confirm('Reset only today’s check-ins? Your chosen practices will remain.'))return;
  delete data.progress[dateKey()];save();drawList();feedback('Today’s check-ins have been reset.');
 });
 if(data.habits.some(h=>h.kind==='minutes'))choosePractice(data.habits.find(h=>h.kind==='minutes').id);
 // Personal journal is stored locally; emotion-release writing is deliberately not stored.
 const journal=$('#today-journal');
 try{const saved=JSON.parse(localStorage.getItem(journalKey)||'{}');journal.value=saved[dateKey()]||'';}catch(_){}
 journal.addEventListener('input',()=>{
  try{const all=JSON.parse(localStorage.getItem(journalKey)||'{}');all[dateKey()]=journal.value;localStorage.setItem(journalKey,JSON.stringify(all));$('#journal-status').textContent='Saved on this device; anyone with access to this browser may see it.';}
  catch(_){$('#journal-status').textContent='Saving is unavailable. Export a copy instead.';}
 });
 $('#journal-export').addEventListener('click',()=>download('aatmikjoy-reflection-'+dateKey()+'.txt',journal.value,'text/plain'));
 let feeling='';
 $$('[data-feeling]').forEach(b=>b.addEventListener('click',()=>{
  feeling=feeling===b.dataset.feeling?'':b.dataset.feeling;
  $$('[data-feeling]').forEach(other=>other.setAttribute('aria-pressed',String(other.dataset.feeling===feeling)));
  $('#release-status').textContent=feeling?'You have named: '+feeling+'. You can add words below, or flush the note.':'';
 }));
 $('#release-flush').addEventListener('click',()=>{
  const field=$('#release-text');
  if(!field.value.trim()&&!feeling){$('#release-status').textContent='There is nothing written to flush. You can begin whenever you are ready.';return;}
  field.classList.add('aj-flushing');
  field.value='';feeling='';$$('[data-feeling]').forEach(b=>b.setAttribute('aria-pressed','false'));
  $('#release-status').textContent='The note has been cleared from this page. Take one easy breath; your feelings are welcome.';
  window.setTimeout(()=>field.classList.remove('aj-flushing'),450);
  field.focus();
 });
 let promptIndex=0,emotionInterval=null;
 const changeEmotionNudge=()=>{promptIndex=(promptIndex+1)%emotionPrompts.length;$('#emotion-nudge').textContent=emotionPrompts[promptIndex]};
 $('#emotion-next').addEventListener('click',changeEmotionNudge);
 $('#emotion-auto').addEventListener('change',()=>{
  if(emotionInterval){clearInterval(emotionInterval);emotionInterval=null;}
  if($('#emotion-auto').checked){emotionInterval=setInterval(changeEmotionNudge,60000);$('#emotion-nudge-status').textContent='A new gentle prompt will appear here each minute while this tab is open.';}
  else $('#emotion-nudge-status').textContent='Automatic prompts are off.';
 });
 window.addEventListener('pagehide',()=>{stopTicker();if(emotionInterval)clearInterval(emotionInterval);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();