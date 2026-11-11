
/* Aatmik Joy - dependency-free front-end prototype.
 * Public navigation, filters, search and the sample member journey work offline.
 * IMPORTANT: This is NOT authentication. There is no API, database, persistence,
 * real approval, email delivery or health-record storage. Never add real intake
 * collection to this demo without a separately designed, secure backend.
 */
(() => {
 'use strict';
 const start = () => {
  /** @param {string} selector @returns {HTMLElement} */
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const asset = name => (window.AATMIK_ASSETS && window.AATMIK_ASSETS[name]) || `assets/${name}`;
  const icon = name => `<svg class="icon" viewBox="0 0 48 48" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = value => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const motion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

  // Highlight text using escaped fragments. User input is never used as markup
  // or as a regular expression; queries such as "[" are safe.
  const highlight = (text, query) => {
   const needle = String(query).trim().toLowerCase();
   if (!needle) return escapeHTML(text);
   let result = '', cursor = 0;
   const haystack = String(text).toLowerCase();
   let index = haystack.indexOf(needle, cursor);
   while (index !== -1) {
    result += escapeHTML(text.slice(cursor,index)) + '<mark>' + escapeHTML(text.slice(index,index+needle.length)) + '</mark>';
    cursor = index + needle.length;
    index = haystack.indexOf(needle,cursor);
   }
   return result + escapeHTML(text.slice(cursor));
  };

  // These URLs and titles came from the material supplied for this website.
  // Short questions are editorial prompts, not claimed article quotations.
  const articles = [
   {id:'health-healing',category:'health',label:'Health & Healing',title:'What is Health and Healing?',prompt:'What does it mean to explore health and healing as a whole-person journey?',image:'reflection-health.webp',alt:'A cup and flowers on a table in the morning light',source:'Read on AatmikJoy',url:'reflections/what-is-health-and-healing/',local:true},
   {id:'ayurveda-living',category:'ayurveda',label:'Ayurveda',title:'Ayurveda - A Pathway to Healthy Living',prompt:'How might Ayurvedic wisdom become part of the way we approach everyday life?',image:'reflection-ayurveda.webp',alt:'A mortar, herbs and a brass vessel on a sunlit table',source:'Original page on Notion',url:'https://app.notion.com/Ayurveda-a-pathway-to-healthy-living-3244aeae774f80b1815ec13dc37841de?pvs=21'},
   {id:'yoga-identity',category:'yoga',label:'Yoga & Inner Inquiry',title:'Yoga - What Are We Identified With?',prompt:'A question to sit with: what do we take ourselves to be?',image:'reflection-yoga.webp',alt:'A person sitting quietly with a view of sunrise hills',source:'Original page on Notion',url:'https://app.notion.com/Yoga-What-are-we-identified-with-3244aeae774f800bab36ff6075629405?pvs=21'},
   {id:'ayurveda-professionals',category:'ayurveda',label:'Ayurveda',title:'Ayurveda for Professionals',prompt:'Explore the resource you shared from Kerala Ayurveda Academy - USA.',image:'reflection-professionals.webp',alt:'A stack of books with small flowers in warm light',source:'Resource linked through Notion',url:'https://app.notion.com/Ayurveda-for-Professionals-Sridevi-Nagaraj-Kerala-Ayurveda-Academy-USA-3864aeae774f80cd9045f22207957721?pvs=21'},
   {id:'equanimity',category:'yoga',label:'Yoga & Inner Inquiry',title:'Equanimity through Right Perspective',prompt:'An invitation to reflect on perspective and the way we meet life.',image:'reflection-equanimity.webp',alt:'Balanced stones and a small flower overlooking hills',source:'Yoga Bharati',url:'https://yogabharati.org/article-blog/equanimity-through-right-perspective-2024'},
   {id:'samyoga',category:'women',label:"Women's Wellbeing",title:"Samyoga for Women's Wellbeing",prompt:'Explore the shared resource on a whole-person approach to women\u2019s wellbeing.',image:'reflection-women.webp',alt:'A pink lotus opening in golden sunlight',source:'Original page on Notion',url:'https://app.notion.com/Samyoga-for-Women-s-Wellbeing-32e4aeae774f80d2ad90f51c0085d479?pvs=21'}
  ];

  let selectedCategory = 'all';
  let reflectionDisplay = 'text';
  const reflectionSearch = $('#reflection-search');
  const renderReflections = () => {
   const query = reflectionSearch.value.trim().slice(0,120);
   const q = normalize(query);
   const matches = articles.filter(a => (selectedCategory === 'all' || a.category === selectedCategory) && normalize(`${a.title} ${a.label} ${a.prompt}`).includes(q));
   $('#reflection-grid').dataset.cardStyle = reflectionDisplay;
   $('#reflection-grid').innerHTML = matches.map(a => `
    <article class="reflection-card">
     <a class="reflection-image-wrap" href="${escapeHTML(a.url)}" ${a.local ? '' : 'target="_blank" rel="noopener noreferrer"'} aria-label="Open ${escapeHTML(a.title)}"><img class="reflection-image" src="${asset(a.image)}" alt="${escapeHTML(a.alt)}" loading="lazy" width="640" height="292"></a>
     <div class="reflection-body"><span class="article-tag ${a.category==='women'?'rose':''}">${highlight(a.label,query)}</span><h2><a href="${escapeHTML(a.url)}" ${a.local ? '' : 'target="_blank" rel="noopener noreferrer"'}>${highlight(a.title,query)}${a.local ? '' : '<span class="sr-only"> (opens in a new tab)</span>'}</a></h2><p>${highlight(a.prompt,query)}</p><span class="reflection-source">${escapeHTML(a.source)}</span><a class="text-link" href="${escapeHTML(a.url)}" ${a.local ? '' : 'target="_blank" rel="noopener noreferrer"'}>${a.local ? 'Read reflection' : 'Read original reflection'} ${icon(a.local ? 'arrow' : 'external')}${a.local ? '' : '<span class="sr-only"> (opens in a new tab)</span>'}</a></div>
    </article>`).join('');
   $('#no-reflections').hidden = matches.length !== 0;
   $('#reflection-count').textContent = `${matches.length} ${matches.length===1?'reflection':'reflections'}${q?' matching your search':''}`;
   $('#clear-reflection-search').hidden = query.length === 0;
   $$('.filter').forEach(button => {
    const active = button.dataset.filter === selectedCategory;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
   });
  };
  $$('[data-reflection-style]').forEach(button => button.addEventListener('click',() => {
   reflectionDisplay = button.dataset.reflectionStyle;
   $$('[data-reflection-style]').forEach(other => {
    const active = other.dataset.reflectionStyle === reflectionDisplay;
    other.classList.toggle('is-active',active);
    other.setAttribute('aria-pressed',String(active));
   });
   $('#reflection-style-status').textContent = reflectionDisplay === 'text' ? 'Text-only reflection cards selected.' : 'Subtle imagery reflection cards selected.';
   renderReflections();
  }));
  $$('.filter').forEach(button => button.addEventListener('click',() => {selectedCategory = button.dataset.filter;renderReflections();}));
  reflectionSearch.addEventListener('input',renderReflections);
  $('#clear-reflection-search').addEventListener('click',() => {reflectionSearch.value='';renderReflections();reflectionSearch.focus();});
  $('#reset-reflections').addEventListener('click',() => {selectedCategory='all';reflectionSearch.value='';renderReflections();$('.filter').focus();});

  $('#jump-to-request').addEventListener('click',e => { e.preventDefault(); document.getElementById('journey-content').scrollIntoView({behavior:'smooth',block:'start'}); });
  // Mobile menu: all page links remain available at small widths.
  const menuButton = $('#menu-toggle'), nav = $('#primary-nav');
  const setMenu = open => {
   menuButton.setAttribute('aria-expanded',String(open));
   menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');
   menuButton.querySelector('use').setAttribute('href',open?'#i-close':'#i-menu');
   nav.classList.toggle('is-open',open);
  };
  menuButton.addEventListener('click',() => setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
  document.addEventListener('click',e => {if (!e.target.closest('.site-header')) setMenu(false);});
  document.addEventListener('keydown',e => {
   if (e.key==='Escape' && menuButton.getAttribute('aria-expanded')==='true') {setMenu(false);menuButton.focus();}
  });
  window.matchMedia('(min-width: 931px)').addEventListener('change',e => {if(e.matches)setMenu(false);});

  // In-memory demo state only. Nothing is written to storage, cookies or a URL.
  const demo = {stage:'request',name:'Alex',approved:false,requested:false,memberOpen:false,intakePart:0,complete:false};
  const pageTitles = {home:'Exploring the Joy of Being',paths:'Paths to Aatmik Joy',today:'Today, in your own rhythm',connect:'Connect',reflections:'My Reflections',products:'Products',vedini:'Vedini',bitbybit:'BitbyBit',swaadhaya:'Swaadhaya',join:'Join',member:'Member Preview'};
  let lastRoute = '';
  const focusHeading = container => {
   const heading = Array.from(container.querySelectorAll('h1,h2')).find(h => h.getClientRects().length);
   if (heading) {heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
  };
  const renderMember = () => {
   $('#member-gate').hidden = demo.memberOpen;
   $('#member-dashboard').hidden = !demo.memberOpen;
   $('#member-name').textContent = demo.name || 'Alex';
  };
  const parseRoute = () => {
   let hash = window.location.hash.replace(/^#\/?/,'');
   try { hash=decodeURIComponent(hash); } catch (_) { hash='home'; }
   const [rawPage='home',sub=''] = hash.split('/');
   // Backward-compatible old bookmarks now open Daily Rhythm under Connect.
   const page = rawPage === 'home' && sub === 'rhythm' ? 'paths' : rawPage;
   return {page:Object.hasOwn(pageTitles,page)?page:'home',sub};
  };
  const renderRoute = (initial=false) => {
   if($('#site-search-dialog').open) $('#site-search-dialog').close();
   const {page,sub} = parseRoute();
   const samePage = lastRoute === page;
   $$('.page').forEach(el => {el.hidden=el.dataset.page!==page;});
   $$('[data-nav]').forEach(link => {
    if(link.dataset.nav===page || (['vedini','bitbybit','swaadhaya'].includes(page) && link.dataset.nav==='products')) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
   });
   setMenu(false);
   if(page==='member') renderMember();
   document.title = `Aatmik Joy | ${pageTitles[page]}`;
   const view = $(`#page-${page}`);
   if(!initial) focusHeading(view);
   if(page==='paths' && sub) {
    const detail = document.getElementById(`path-${sub}`);
    if(detail && detail.classList.contains('path-detail')) {
     // Nested practice deep links must also open their parent Inner Connection.
     const parent=detail.closest('details#path-inner');
     if(parent && parent!==detail) parent.open=true;
     detail.open=true;
     requestAnimationFrame(() => {
      detail.scrollIntoView({behavior:initial?'auto':motion(),block:'center'});
      detail.querySelector('summary').focus({preventScroll:true});
     });
    } else if(!samePage || !initial) {window.scrollTo({top:0,behavior:'instant'});}

   } else if(!initial || !window.location.hash) {
    window.scrollTo({top:0,behavior:'instant'});
   }
   lastRoute=page;
  };
  const go = page => {
   const hash=`#/${page}`;
   if(window.location.hash===hash) renderRoute();
   else window.location.hash=hash;
  };
  window.addEventListener('hashchange',() => renderRoute());
  $('.skip-link').addEventListener('click',e => {e.preventDefault();$('#main-content').focus();$('#main-content').scrollIntoView();});
  document.addEventListener('click',e => {
   const link=e.target.closest('a[href^="#/"]');
   if(!link || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
   if($('#site-search-dialog').open) $('#site-search-dialog').close();
   if(link.getAttribute('href')===window.location.hash) {e.preventDefault();renderRoute();}
  });

  // Day tabs support click, arrow keys, Home and End.
  const rhythmCopy = {
   morning:{kicker:'A gentle beginning',title:'Arrive before you rush.',text:"Notice the light. Take a quiet moment to check in with yourself before the day's demands begin.",prompt:'What kind of beginning would feel nourishing today?'},
   midday:{kicker:'A moment to nourish',title:'Make room for a pause.',text:'Step away from the rush for a moment. Notice your meal, your surroundings, and the pace at which you move through the middle of the day.',prompt:'Where could you create a little more space today?'},
   evening:{kicker:'A softer landing',title:'Let the day settle.',text:'Make a little space between doing and resting. A quiet page, a gentle stretch, or a moment of gratitude can become a personal evening ritual.',prompt:'What would help you leave the day with kindness?'}
  };
  const selectDay = day => {
   const copy=rhythmCopy[day];
   if(!copy)return;
   $$('[data-day]').forEach(tab => {const active=tab.dataset.day===day;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
   $('#rhythm-panel').setAttribute('aria-labelledby',`day-${day}`);
   for (const key of ['kicker','title','text','prompt']) $(`#rhythm-${key}`).textContent=copy[key];
   $('.rhythm-card').dataset.day=day;
  };
  const dayTabs=$$('[data-day]');
  dayTabs.forEach((tab,index) => {
   tab.addEventListener('click',() => selectDay(tab.dataset.day));
   tab.addEventListener('keydown',e => {
    let next;
    if(e.key==='ArrowRight') next=(index+1)%dayTabs.length;
    else if(e.key==='ArrowLeft') next=(index+dayTabs.length-1)%dayTabs.length;
    else if(e.key==='Home') next=0;
    else if(e.key==='End') next=dayTabs.length-1;
    else return;
    e.preventDefault();selectDay(dayTabs[next].dataset.day);dayTabs[next].focus();
   });
  });

  // Native <dialog> search: actual searchable links, no decorative dummy input.
  const searchPages = [
   {title:'What is Health and Healing?',label:'Reflection - full article on AatmikJoy',url:'reflections/what-is-health-and-healing/',keywords:'health healing balance function integrity self-regulation modalities body mind spirit holistic'},
   {title:'Paths to Aatmik Joy',label:'Page - practices and perspectives',url:'#/paths',keywords:'paths ayurveda yoga breath rhythm compassion eft self study presence'},
   {title:'Connect',label:'Page - how to connect with me',url:'#/connect',keywords:'contact email connect me sridevi conversation inquiry'},
   {title:'Products',label:'Page - Vedini BitbyBit Swaadhaya',url:'#/products',keywords:'products vedini bitbybit swaadhaya coming soon'},
   {title:'Vedini',label:'Product - coming soon',url:'#/vedini',keywords:'chanting learning vedini'},
   {title:'BitbyBit',label:'Product - coming soon',url:'#/bitbybit',keywords:'bitbybit daily practice'},
   {title:'Swaadhaya',label:'Product - coming soon',url:'#/swaadhaya',keywords:'swaadhaya self-study reflection'},
   {title:'Being Present',label:'Pathway - present-moment awareness',url:'#/paths/presence',keywords:'present mindfulness awareness'},
   {title:'Conscious Breathing',label:'Pathway - observe the breath',url:'#/paths/breath',keywords:'breath breathing breathwork'},
   {title:'Compassionate Inquiry',label:'Pathway - compassion and understanding',url:'#/paths/compassion',keywords:'gabor mate compassionate inquiry'},
   {title:'Emotional Freedom Technique',label:'Pathway - tapping and awareness',url:'#/paths/eft',keywords:'eft tapping emotional freedom'},
   {title:'Self-Study & Reflection',label:'Pathway - Svadhyaya',url:'#/paths/reflection',keywords:'reflection svadhyaya self study'},
   {title:'My Reflections',label:'Page - ideas to sit with and explore',url:'#/reflections',keywords:'blog articles reading reflections writing health healing'},
   {title:'Ayurveda',label:'Pathway - wisdom for everyday living',url:'#/paths/ayurveda',keywords:'ayurveda constitution dosha prakriti digestion seasons herbs'},
   {title:'Daily Rhythm',label:'Pathway - live in rhythm with nature',url:'#/paths/rhythm',keywords:'dinacharya dinachari dinachariya routine sleep morning midday evening habits lifestyle'},
   {title:'Yoga',label:'Pathway - movement, breath and awareness',url:'#/paths/yoga',keywords:'yoga breathing movement posture rest awareness'},
   {title:'Food & Nutrition',label:'Pathway - nourish with awareness',url:'#/paths/food',keywords:'diet nutrition food meals nourishment digestion'},
   {title:'Emotional Wellbeing',label:'Pathway - make room for your inner world',url:'#/paths/emotions',keywords:'emotional work stress feelings emotions journaling self observation'},
   {title:'Inner Connection',label:'Pathway - reflection and self-inquiry',url:'#/paths/inner',keywords:'inner spiritual spirit connection meaning awareness self inquiry being'},
   {title:'Request to Join',label:'Prototype - request, review, profile and intake',url:'#/join',keywords:'join request membership approval profile intake invitation'},
   {title:'Member Area',label:'Prototype - sample member space',url:'#/member',keywords:'member login sign in account practices dashboard'}
  ];
  const searchIndex = [...searchPages,...articles.map(a => ({title:a.title,label:`Reflection - ${a.label}`,url:a.url,keywords:a.prompt,external:!a.local}))];
  const dialog=$('#site-search-dialog');
  const updateSearch = () => {
   const query=$('#site-search-input').value.trim().slice(0,120), q=normalize(query);
   const matches=q?searchIndex.filter(item=>normalize(`${item.title} ${item.label} ${item.keywords}`).includes(q)):searchPages.filter((_,i)=>[0,1,2,3,8,9].includes(i));
   $('#site-search-results').innerHTML=matches.length?matches.map(item=>`<a class="search-result" href="${escapeHTML(item.url)}" ${item.external?'target="_blank" rel="noopener noreferrer"':''}><span><strong>${highlight(item.title,query)}</strong><small>${highlight(item.label,query)}${item.external?' - opens original in a new tab':''}</small></span>${icon(item.external?'external':'arrow')}</a>`).join(''):'<p class="search-none">No matches. Try a topic such as Ayurveda, Yoga, rhythm or healing.</p>';
   $('#site-search-status').textContent=`${matches.length} ${q?'results':'suggestions'}`;
  };
  $('#open-site-search').addEventListener('click',() => {
   setMenu(false);updateSearch();dialog.showModal();document.body.classList.add('dialog-open');$('#site-search-input').focus();
  });
  $('#close-site-search').addEventListener('click',()=>dialog.close());
  $('#site-search-input').addEventListener('input',updateSearch);
  dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();dialog.close();}});
  dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click',e=> {if(e.target===dialog) {const r=dialog.getBoundingClientRect();if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom)dialog.close();}});

  // Join progression is demonstrative, and must never be treated as an access
  // control boundary. Only a server can authorize real access in a live service.
  const setIntakePart = part => {
   demo.intakePart=Math.max(0,Math.min(2,part));
   $$('.intake-part').forEach(fieldset=> {const active=Number(fieldset.dataset.intakePart)===demo.intakePart;fieldset.hidden=!active;fieldset.disabled=!active;});
   $('#intake-progress-text').textContent=`Part ${demo.intakePart+1} of 3`;
   $('#intake-progress-fill').style.width=`${(demo.intakePart+1)/3*100}%`;
   $('#intake-back').hidden=demo.intakePart===0;
   $('#intake-next').hidden=demo.intakePart===2;
   $('#intake-finish').hidden=demo.intakePart!==2;
  };
  const showStage = (stage,shouldFocus=true) => {
   if(['profile','intake','complete'].includes(stage) && !demo.approved) stage='request';
   demo.stage=stage;
   $$('.journey-stage').forEach(el=> {el.hidden=el.dataset.stage!==stage;});
   const step={request:1,pending:2,approved:2,profile:3,intake:4,complete:4}[stage] || 1;
   $$('[data-journey-step]').forEach(el=> {
    const num=Number(el.dataset.journeyStep);
    if(num===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');
    el.classList.toggle('completed',num<step || stage==='complete');
   });
   if(shouldFocus && !$('#page-join').hidden) {
    const active=$(`[data-stage="${stage}"]`);
    requestAnimationFrame(()=>{focusHeading(active);$('#journey-content').scrollIntoView({behavior:motion(),block:'start'});});
   }
  };
  const resetDemo = () => {
   Object.assign(demo,{stage:'request',name:'Alex',approved:false,requested:false,memberOpen:false,intakePart:0,complete:false});
   for(const id of ['#join-request-form','#profile-form','#intake-form']) $(id).reset();
   $('#join-name').setCustomValidity('');$('#profile-name').setCustomValidity('');
   $$('[data-practice]').forEach(input=>{input.checked=false;});
   $('#practice-count').textContent='0 of 3 sample practices explored';
   setIntakePart(0);showStage('request',false);renderMember();
  };
  $('#fill-sample').addEventListener('click',()=> {
   $('#join-name').value='Alex';$('#join-name').setCustomValidity('');$('#join-email').value='alex@example.com';
   $('#join-intention').value='I am exploring a gentler daily rhythm. These are sample details.';
   $('#join-interest').value='whole';$('#demo-consent').checked=true;
  });
  const validateName = input => {
   const valid=input.value.trim().length>0;
   input.setCustomValidity(valid?'':'Please enter a fictional name.');
   if(!valid)input.reportValidity();return valid;
  };
  $('#join-name').addEventListener('input',()=>$('#join-name').setCustomValidity(''));
  $('#profile-name').addEventListener('input',()=>$('#profile-name').setCustomValidity(''));
  $('#join-request-form').addEventListener('submit',e=> {
   e.preventDefault();
   if(!validateName($('#join-name')) || !e.currentTarget.reportValidity())return;
   demo.name=$('#join-name').value.trim().slice(0,80);demo.requested=true;demo.approved=false;
   showStage('pending');
  });
  $('#demo-approve').addEventListener('click',()=> {if(!demo.requested)return;demo.approved=true;showStage('approved');});
  $('#begin-profile').addEventListener('click',()=> {if(!demo.approved)return;$('#profile-name').value=demo.name;showStage('profile');});
  $('#profile-form').addEventListener('submit',e=> {
   e.preventDefault();if(!demo.approved || !validateName($('#profile-name')) || !e.currentTarget.reportValidity())return;
   demo.name=$('#profile-name').value.trim().slice(0,80);setIntakePart(0);showStage('intake');
  });
  $('#intake-next').addEventListener('click',()=> {if(!demo.approved)return;setIntakePart(demo.intakePart+1);});
  $('#intake-back').addEventListener('click',()=>setIntakePart(demo.intakePart-1));
  $('#intake-form').addEventListener('submit',e=> {
   e.preventDefault();
   if(!demo.approved || demo.intakePart!==2 || !e.currentTarget.reportValidity())return;
   demo.complete=true;showStage('complete');
  });
  $$('[data-restart-journey]').forEach(button=>button.addEventListener('click',()=> {resetDemo();showStage('request');}));
  $('#open-demo-space').addEventListener('click',()=> {demo.memberOpen=true;go('member');});
  $('#preview-member').addEventListener('click',()=> {demo.name=demo.name||'Alex';demo.approved=true;demo.memberOpen=true;renderMember();focusHeading($('#member-dashboard'));});
  $('#leave-demo').addEventListener('click',()=> {resetDemo();focusHeading($('#member-gate'));});
  $('#review-demo-profile').addEventListener('click',()=> {
   demo.approved=true;$('#profile-name').value=demo.name;showStage('profile',false);go('join');
   setTimeout(()=>showStage('profile'),80);
  });
  $$('[data-practice]').forEach(input=>input.addEventListener('change',()=> {
   const n=$$('[data-practice]').filter(el=>el.checked).length;
   $('#practice-count').textContent=`${n} of 3 sample practices explored`;
  }));


  // Today: lightweight, opt-in tools with no accounts, tracking or saved personal data.
  const todayDate = $('#today-current-date');
  if (todayDate) {
   const now = new Date();
   todayDate.textContent = new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric'}).format(now);
   todayDate.dateTime = [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
  }
  const careChoices = $('[data-today-care]');
  const updateCare = () => {
   const done=careChoices.filter(c=>c.checked).length;
   $('#today-care-progress').textContent=done ? done+' small '+(done===1?'act':'acts')+' chosen for today. Take them at your own pace.' : 'Choose one small act to begin.';
  };
  careChoices.forEach(choice=>choice.addEventListener('change',updateCare));
  let meditationRemaining=300, meditationInterval=null;
  const meditationDisplay=()=>{
   const mm=String(Math.floor(meditationRemaining/60)).padStart(2,'0');
   const ss=String(meditationRemaining%60).padStart(2,'0');
   $('#today-timer').textContent=mm+':'+ss;
  };
  const stopMeditation=()=>{if(meditationInterval!==null){clearInterval(meditationInterval);meditationInterval=null;}$('#today-timer-toggle').textContent='Start timer';};
  $('#today-timer-toggle').addEventListener('click',()=>{
   if(meditationInterval!==null){stopMeditation();$('#today-timer-status').textContent='Paused. Continue whenever you feel ready.';return;}
   if(meditationRemaining===0)meditationRemaining=300;
   const startedAt=Date.now(), startingSeconds=meditationRemaining;
   $('#today-timer-toggle').textContent='Pause timer';
   $('#today-timer-status').textContent='A quiet moment, just for you.';
   meditationInterval=setInterval(()=>{
    meditationRemaining=Math.max(0,startingSeconds-Math.floor((Date.now()-startedAt)/1000));
    meditationDisplay();
    if(meditationRemaining===0){stopMeditation();$('#today-timer-status').textContent='Your five minutes are complete. Notice how you feel.';}
   },250);
  });
  $('#today-timer-reset').addEventListener('click',()=>{stopMeditation();meditationRemaining=300;meditationDisplay();$('#today-timer-status').textContent='Ready when you are.';});
  let movementInterval=null;
  const moveToggle=$('#today-move-reminder');
  const moveStatus=$('#today-reminder-status');
  moveToggle.addEventListener('change',async()=>{
   if(movementInterval!==null){clearInterval(movementInterval);movementInterval=null;}
   if(!moveToggle.checked){moveStatus.textContent='Reminders are off.';return;}
   // Request permission only as a direct consequence of the user's opt-in.
   if('Notification' in window && window.isSecureContext && Notification.permission==='default'){
    try{await Notification.requestPermission();}catch(_){}
   }
   if(!moveToggle.checked)return;
   const enabled=('Notification' in window && Notification.permission==='granted');
   moveStatus.textContent=enabled?'Enabled. A gentle notification every hour while this page is open.':'Enabled. An in-page reminder appears while this tab is open.';
   movementInterval=setInterval(()=>{
    if(!moveToggle.checked)return;
    if('Notification' in window && Notification.permission==='granted'){
     try{new Notification('A small moment to move',{body:'Stand, stretch, or take a few steps — in your own rhythm.'});return;}catch(_){}
    }
    moveStatus.textContent='A gentle nudge: perhaps stand, stretch or take a few steps.';
   },60*60*1000);
  });

  // Clear browser-restored form controls on a fresh load. This application makes
  // zero network requests beyond local files, and uses no analytics or storage.
  resetDemo();renderReflections();renderRoute(true);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

