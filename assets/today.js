/* AatmikJoy Today — private, local-first daily self-care. No accounts or remote requests. */
(()=>{'use strict';
const $=s=>document.querySelector(s), key='aatmikjoy-care-v1', journalKey='aatmikjoy-journal-v1';
const dateKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
// Example invitations remain optional; the personal list starts empty.
const seeds=[];
const examples={
 breaths:{name:'Five mindful breaths',kind:'minutes',target:2,when:'Anytime'},
 feelings:{name:'Check in with your feelings',kind:'minutes',target:2,when:'Anytime'},
 eyes:{name:'Rest your eyes',kind:'minutes',target:3,when:'Throughout the day'},
 movement:{name:'Move with awareness',kind:'minutes',target:5,when:'Throughout the day'},
 gratitude:{name:'A moment of gratitude',kind:'minutes',target:2,when:'Evening'},
 inquiry:{name:'Listen inward',kind:'minutes',target:5,when:'Anytime'},
 wake:{name:'Rise with the morning',kind:'times',target:1,when:'Morning'},
 meals:{name:'Nourish at regular times',kind:'times',target:1,when:'Throughout the day'},
 water:{name:'Stay comfortably hydrated',kind:'times',target:1,when:'Throughout the day'},
 daylight:{name:'Connect with daylight',kind:'minutes',target:10,when:'Morning'},
 sleep:{name:'Wind down for rest',kind:'times',target:1,when:'Evening'}
};
let state={habits:seeds,progress:{}};
try{const raw=JSON.parse(localStorage.getItem(key)||'null');if(raw&&Array.isArray(raw.habits)&&raw.progress&&typeof raw.progress==='object')state=raw;}catch(_){}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));return true}catch(_){msg('Saving is unavailable in this browser. You can still export your plan.');return false}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const msg=s=>{$('#care-feedback').textContent=s};
const today=()=>state.progress[dateKey()]||(state.progress[dateKey()]={});
function refreshExamples(){
 document.querySelectorAll('[data-care-example]').forEach(button=>{
  const id=button.dataset.careExample, exists=state.habits.some(h=>h.id==='example-'+id);
  button.disabled=exists;
  button.textContent=exists?'Added to my plan ✓':'Add to my plan';
  button.setAttribute('aria-label',exists?examples[id].name+' is in your plan':'Add '+examples[id].name+' to my plan');
 });
}
function render(){
 const entries=today(), el=$('#care-list');if(!el)return;
 el.innerHTML=state.habits.length?state.habits.map(h=>{
 const n=Math.min(h.target,Math.max(0,Number(entries[h.id]||0))),done=n>=h.target;
 return '<li class="care-item"><div class="care-item-main"><input type="checkbox" aria-label="Mark '+esc(h.name)+' complete" data-complete="'+esc(h.id)+'" '+(done?'checked':'')+'><span><strong>'+esc(h.name)+'</strong><small>'+esc(h.when)+' · '+(h.kind==='times'?n+' of '+h.target+' times':h.target+' minutes · '+(done?'completed':'not yet completed'))+'</small></span></div><div class="care-actions">'+(h.kind==='times'?'<button type="button" data-add="'+esc(h.id)+'" aria-label="Record one more '+esc(h.name)+'">+ Once</button><button type="button" class="care-remove" data-sub="'+esc(h.id)+'" aria-label="Undo one '+esc(h.name)+'">−</button>':'')+'<button type="button" class="care-remove" data-remove="'+esc(h.id)+'" aria-label="Remove '+esc(h.name)+' from plan">Remove</button></div></li>';
 }).join(''):'<li class="care-empty">Your plan is open. Add a small act of care when you are ready.</li>';
 const total=state.habits.length,completed=state.habits.filter(h=>Number(entries[h.id]||0)>=h.target).length;
 $('#care-progress').textContent=total?completed+' of '+total+' intentions tended today':'Make your self-care plan your own.';
 refreshExamples();
}
function renderDaily(){
 const thoughts=[
 ['You can begin again, as often as you need.','What would a kinder beginning look like today?','I can honor my needs without comparison.'],
 ['There is wisdom in noticing what nourishes you.','When did you last feel truly at ease?','My own rhythm deserves respect.'],
 ['A little attention can transform an ordinary moment.','What is asking for your attention today?','I can return to the present moment.'],
 ['Rest is part of living, not a reward for finishing.','Where might you allow yourself more ease?','I have permission to pause.'],
 ['You are unique; your practices can be, too.','What practice genuinely supports your nature?','I am allowed to find my own way.']
 ];
 const d=new Date(), day=Math.floor((new Date(d.getFullYear(),d.getMonth(),d.getDate())-new Date(d.getFullYear(),0,1))/86400000);
 const [thought,prompt,affirmation]=thoughts[day%thoughts.length];
 $('#today-thought').textContent=thought;$('#today-prompt').textContent=prompt;$('#today-affirmation').textContent=affirmation;
 $('#today-date').textContent=d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
}
function download(name,content,type='application/json'){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function start(){
 if(!$('#page-today'))return;
 renderDaily();render();
 $('#page-today').addEventListener('click',e=>{
  const button=e.target.closest('button[data-care-example]');
  if(!button)return;
  const id=button.dataset.careExample,choice=examples[id];
  if(!choice||state.habits.some(h=>h.id==='example-'+id))return;
  state.habits.push({id:'example-'+id,...choice});
  save();render();msg('Added “'+choice.name+'” to your plan. You can track it below.');
 });

 const j=$('#today-journal');
 try{j.value=JSON.parse(localStorage.getItem(journalKey)||'{}')[dateKey()]||''}catch(_){}
 $('#care-form').addEventListener('submit',e=>{
 e.preventDefault();const name=$('#care-name').value.trim().slice(0,90),kind=$('#care-kind').value,target=Number($('#care-target').value),when=$('#care-when').value;
 if(!name||!Number.isInteger(target)||target<1||target>200)return msg('Please enter a name and a target between 1 and 200.');
 state.habits.push({id:'h'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name,kind,target,when});
 save();e.target.reset();render();msg('Added to your personal plan.');
 });
 $('#care-list').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;const id=b.dataset.add||b.dataset.sub||b.dataset.remove;if(!id)return;
 if(b.dataset.remove){state.habits=state.habits.filter(h=>h.id!==id);Object.values(state.progress).forEach(v=>delete v[id]);msg('Removed from your plan.')}
 else {const h=state.habits.find(h=>h.id===id);if(!h)return;today()[id]=Math.max(0,Math.min(h.target,Number(today()[id]||0)+(b.dataset.add?1:-1)));msg('Your daily check-in has been updated.')}
 save();render();
 });
 $('#care-list').addEventListener('change',e=>{
 const id=e.target.dataset.complete;if(!id)return;const h=state.habits.find(h=>h.id===id);if(!h)return;today()[id]=e.target.checked?h.target:0;save();render();msg(e.target.checked?'A moment of care noted.':'Updated your check-in.');
 });
 j.addEventListener('input',()=>{try{const obj=JSON.parse(localStorage.getItem(journalKey)||'{}');obj[dateKey()]=j.value;localStorage.setItem(journalKey,JSON.stringify(obj));$('#journal-status').textContent='Saved on this device.'}catch(_){$('#journal-status').textContent='Not saved: local storage unavailable. Export your writing instead.'}});
 $('#care-export').addEventListener('click',()=>download('aatmikjoy-self-care-plan.json',JSON.stringify(state,null,2)));
 $('#journal-export').addEventListener('click',()=>download('aatmikjoy-reflection-'+dateKey()+'.txt',j.value,'text/plain'));
 $('#care-reset').addEventListener('click',()=>{if(!confirm('Reset only today’s check-ins? Your habits will remain.'))return;delete state.progress[dateKey()];save();render();msg('Today’s check-ins have been reset.')});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();