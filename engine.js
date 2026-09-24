import {SYSTEMS,CLASSES,SKILLS,BACKGROUND24,WEAPONS,VERSION,isDnd,uid,clone,integer,text,clamp,die,rollDice,formulaRoll,evaluateAttack,derive,attackBonus,attackDamageBonus,totalLevel,newCharacter,classLevelChoices,multiclassWarnings} from './rules.js';
export const ONLINE_WINDOW=65000;
const nowISO=now=>new Date(now).toISOString();
function requireValue(ok,message){if(!ok)throw Error(message);}
function capArray(value,max=100){requireValue(Array.isArray(value)&&value.length<=max,'Too many entries or invalid list.');return value;}
function addAudit(c,what,who,now){c.history=[{id:uid(),at:now,what,who},...(c.history||[])].slice(0,80);}
export function blankState(){return {schema:1,version:VERSION,profiles:[],games:[],characters:[],messages:[],rolls:[],requests:[],targets:{},sessions:{},commands:[],portraitJobs:[]};}
export function demoState(){
 const s=blankState(),gm={id:'demo-gm',name:'Game Master',role:'gm'},p={id:'demo-player',name:'Rowan',role:'player'},q={id:'demo-player-2',name:'Mira',role:'player'};
 s.profiles=[p,q,gm];s.games=[makeGame('The Hollow Crown','dnd24',gm.id,'demo-game'),makeGame('Ash & Ember','dnd14',gm.id,'demo-game-14'),makeGame('Midnight Archives','coc7',gm.id,'demo-game-coc')];
 s.games[0].description='An old oath. A missing heir. One very long night.';
 const c=newCharacter({id:'demo-char',gameId:'demo-game',playerId:p.id,system:'dnd24',name:'Rowan Ashford',className:'Fighter',species:'Human',background:'Soldier',stats:{STR:16,DEX:14,CON:14,INT:10,WIS:12,CHA:8}});
 c.classes=[{name:'Fighter',level:3,subclass:'Champion'}];c.hpRolls=[10,6,6];c.armor='Chain mail';c.shield=true;c.skills={Athletics:1,Perception:1,Survival:1,Intimidation:1};c.fightingStyle='Dueling';c.attacks[0].dueling=true;c.notes='A former caravan guard carrying an unfinished promise.';c.appearance='Weathered human adventurer, dark hair, a scar across one eyebrow, worn steel armor and a green traveling cloak.';c.features=[{name:'Champion',notes:'Review subclass features at the table.',manual:true}];
 const w=newCharacter({id:'demo-char-2',gameId:'demo-game',playerId:q.id,system:'dnd24',name:'Mira Voss',className:'Wizard',species:'Elf',background:'Sage',stats:{STR:8,DEX:14,CON:14,INT:16,WIS:12,CHA:10}});w.classes=[{name:'Wizard',level:3,subclass:'Evoker'}];w.hpRolls=[6,4,4];w.spells=[{name:'Fire Bolt',level:0,className:'Wizard'},{name:'Mage Hand',level:0,className:'Wizard'},{name:'Light',level:0,className:'Wizard'},{name:'Magic Missile',level:1,className:'Wizard'},{name:'Shield',level:1,className:'Wizard'},{name:'Misty Step',level:2,className:'Wizard'}];w.attacks=[{id:'demo-firebolt',name:'Fire Bolt',stat:'INT',proficient:true,bonus:0,damage:'1d10',damageBonus:0,addStatDamage:false,kind:'attack'}];w.skills={Arcana:1,History:1};
 s.characters=[c,w];s.games[0].members=[p.id,q.id];return s;
}
function makeGame(name,system,gmId,id=uid()){return {id,name:text(name,80),system,gmId,description:'',members:[],settings:{natural20:isDnd(system),natural1:isDnd(system),partyRolls:true,allowLevel:true,requireApproval:false,statLock:false,statRules:{sides:6,count:4,keep:'dropLowest',keepCount:1,reroll:0,repeat:false}},notes:'',initiative:[],round:1,turn:0,createdAt:Date.now()};}
export function activeGMs(s,gameId,now=Date.now()){const entries=Object.values(s.sessions).filter(x=>x.role==='gm'&&x.gameId===gameId&&now-x.lastSeen<ONLINE_WINDOW);return [...new Set(entries.map(x=>x.profileId))].map(id=>s.profiles.find(p=>p.id===id)).filter(Boolean);}
function sessionFor(s,actor){const a=s.sessions[actor];requireValue(a,'Choose a name first.');return a;}
function gameFor(s,a,id=a.gameId){const g=s.games.find(x=>x.id===id);requireValue(g,'Choose a game first.');requireValue(a.gameId===g.id,'Join this game before making changes.');return g;}
function characterFor(s,a,id,{edit=false}={}){const c=s.characters.find(x=>x.id===id);requireValue(c&&c.gameId===a.gameId,'Character not found in this game.');requireValue(a.role==='gm'||c.playerId===a.profileId,'This character belongs to another player.');return c;}
function assertGM(a){requireValue(a.role==='gm','This action is available to the GM only.');}
function targetKey(gid,pid){return `${gid}:${pid}`;}
function cleanPortrait(value){value=text(value,430000);if(!value)return '';requireValue(/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value),'Upload a PNG, JPEG or WebP portrait.');return value;}
function validateCharacter(c){
 requireValue(c.name.length>0&&c.name.length<=80,'Give the character a name.');requireValue(SYSTEMS[c.system],'Unknown game system.');
 requireValue(c.stats&&typeof c.stats==='object'&&!Array.isArray(c.stats),'Stats are required.');requireValue(Object.keys(c.stats).length<=30,'At most 30 stats.');
 for(const [key,val]of Object.entries(c.stats)){requireValue(key.length<=40&&key.length>0&&!['__proto__','constructor','prototype'].includes(key),'Stat names must contain 1 to 40 characters.');integer(val,-1000,10000,'Stat');}
 capArray(c.attacks,60);for(const a of c.attacks){a.name=text(a.name,80);requireValue(a.name,'An ability needs a name.');a.id=text(a.id||uid(),80);a.bonus=integer(a.bonus||0,-1000,1000,'Attack modifier');a.damageBonus=integer(a.damageBonus||0,-1000,1000,'Damage modifier');a.stat=text(a.stat,40);a.damage=text(a.damage||'1d6',100);formulaRoll(a.damage,()=>1);}
 capArray(c.spells,200);capArray(c.features,100);capArray(c.conditions,30);capArray(c.feats,50);capArray(c.classes,12);
 if(isDnd(c.system))requireValue(totalLevel(c)<=20,'D&D core automation supports total levels 1 through 20.');
 for(const x of c.classes){x.name=text(x.name,80);requireValue(x.name,'A class or archetype needs a name.');x.subclass=text(x.subclass,120);integer(x.level,1,20,'Class level');}
 for(const o of Object.values(c.overrides||{})){requireValue(['auto','fixed','adjustment'].includes(o.mode),'Unknown override mode.');requireValue(Number.isFinite(Number(o.value))&&Math.abs(Number(o.value))<=10000,'Invalid override value.');o.reason=text(o.reason,200);}
 c.portrait=cleanPortrait(c.portrait);return c;
}
function revisionCheck(c,p){requireValue(Number(p.revision)===c.revision,'This sheet changed on another screen. Close and reopen the editor, then try again.');}
function saveChange(c,a,now,description){c.revision++;c.updatedAt=now;addAudit(c,description,a.profileId,now);}
function publicRoll(r,a){const x=clone(r);if(a?.role!=='gm'){delete x.ac;delete x.targetLabel;delete x.targetSetAt;}return x;}
export function visibleState(s,actor,now=Date.now()){
 const a=s.sessions[actor]||null,g=a?.gameId?s.games.find(x=>x.id===a.gameId):null;
 const games=s.games.map(({notes,initiative,...x})=>({...clone(x),activeGMs:activeGMs(s,x.id,now).map(p=>({id:p.id,name:p.name})),characterCount:s.characters.filter(c=>c.gameId===x.id).length}));
 let characters=[],messages=[],rolls=[],requests=[],targets={},currentGame=null;
 if(g){
  currentGame=clone(g);if(a.role!=='gm')delete currentGame.notes;
  characters=s.characters.filter(c=>c.gameId===g.id&&(a.role==='gm'||c.playerId===a.profileId)).map(clone);
  messages=s.messages.filter(m=>m.gameId===g.id&&(m.channel==='party'||(m.channel==='gm'&&(a.role==='gm'||m.from===a.profileId||m.to===a.profileId)))).slice(-250).map(clone);
  rolls=s.rolls.filter(r=>r.gameId===g.id&&(a.role==='gm'||r.playerId===a.profileId||(g.settings.partyRolls&&r.kind!=='stat'&&!r.private))).slice(-250).map(r=>publicRoll(r,a));
  requests=s.requests.filter(r=>r.gameId===g.id&&(a.role==='gm'||r.playerId===a.profileId)).map(clone);
  if(a.role==='gm')for(const [key,val]of Object.entries(s.targets))if(key.startsWith(g.id+':'))targets[key]=clone(val);
 }
 return {version:VERSION,now,profiles:s.profiles.map(clone),games,session:a?{profileId:a.profileId,role:a.role,gameId:a.gameId}:null,currentGame,characters,messages,rolls,requests,targets,online:g?Object.values(s.sessions).filter(x=>x.gameId===g.id&&now-x.lastSeen<ONLINE_WINDOW).map(x=>({profileId:x.profileId,role:x.role})):[]};
}
function addRoll(s,r){s.rolls.push(r);if(s.rolls.length>2000)s.rolls=s.rolls.slice(-2000);return r;}
function newRoll(s,a,c,kind,label,now){return {id:uid(),gameId:a.gameId,playerId:c?.playerId||a.profileId,characterId:c?.id||null,characterName:c?.name||s.profiles.find(p=>p.id===a.profileId)?.name||'GM',kind,label:text(label,120),createdAt:now,resolvedAt:null,outcome:null};}
export function leveledCharacter(c,p,rng,now=Date.now()){
 const next=clone(c),className=text(p.className||next.classes[0]?.name||next.archetype||'Custom',80),setup=!!p.setup;
 const previous=next.classes.find(x=>x.name===className),nextLevel=(previous?.level||0)+(setup?0:1),dnd=isDnd(c.system);
 requireValue(!next.pendingLevel,'Resolve the pending level-up before making another one.');
 if(dnd){requireValue(setup||totalLevel(c)<20,'This character is already level 20.');requireValue(!setup||previous,'Choose an existing class for initial setup.');}
 const plan=classLevelChoices(c,className,nextLevel||1),warnings=multiclassWarnings(c,className);
 requireValue(!warnings.length||p.overrideReason,`${warnings.join(' ')} Add a manual-override reason to continue.`);
 const before=derive(c),snapshot=clone(c);delete snapshot.undo;delete snapshot.pendingLevel;delete snapshot.history;delete snapshot.portrait;
 next.undo=[snapshot,...(next.undo||[])].slice(0,8);
 if(dnd){
  if(previous)previous.level=nextLevel;else next.classes.push({name:className,level:1,subclass:''});
  const entry=next.classes.find(x=>x.name===className);
  if(plan.subclass){requireValue(text(p.subclass),'Choose a subclass or enter a custom one.');entry.subclass=text(p.subclass,120);}
  if(plan.style){requireValue(text(p.style),'Choose a fighting style or enter a custom one.');next.fightingStyle=text(p.style,80);}
  if(plan.asi){
   requireValue(['asi','feat'].includes(p.choice),'Choose an ability increase or feat.');
   if(p.choice==='asi'){
    const one=text(p.asiOne),two=text(p.asiTwo||one);requireValue(one in next.stats&&two in next.stats,'Select the ability scores to increase.');
    next.stats[one]++;next.stats[two]++;
    requireValue((next.stats[one]<=20&&next.stats[two]<=20)||p.overrideReason,'An ability increase cannot take a score above 20 without a manual override.');
   }else{requireValue(text(p.feat),'Choose a feat or enter a custom one.');next.feats.push(text(p.feat,120));if(p.feat==='Grappler'&&!p.overrideReason){requireValue(c.system==='dnd24'?(c.stats.STR>=13||c.stats.DEX>=13):c.stats.STR>=13,'Grappler prerequisites are not met.');}if(c.system==='dnd24'&&p.feat==='Grappler'){const stat=text(p.featStat||'STR');requireValue(['STR','DEX'].includes(stat),'Grappler increases STR or DEX.');next.stats[stat]=Math.min(20,next.stats[stat]+1);}}
  }
  if(plan.boon){requireValue(text(p.boon),'Record your level-19 feat or Epic Boon.');next.features.push({name:text(p.boon,120),notes:'Manual effects: review ability increase and other benefits.',manual:true});}
  if(plan.expertise){const choices=capArray(p.expertise||[],plan.expertise);requireValue(choices.length===plan.expertise&&new Set(choices).size===choices.length,'Choose distinct skills for Expertise.');for(const skill of choices){requireValue(SKILLS[skill]&&(next.skills[skill]===1||p.overrideReason),'Expertise requires an already proficient skill.');next.skills[skill]=2;}}
  const addSpells=capArray(p.spells||[],40);for(const spell of addSpells){requireValue(text(spell.name),'Spell name required.');integer(spell.level,0,9,'Spell level');requireValue(spell.level<=plan.maxSpell||spell.level===0||p.overrideReason,'Choose spells available to this class level, or provide an override reason.');requireValue(!next.spells.some(x=>x.className===className&&x.name.toLowerCase()===String(spell.name).toLowerCase()),'That spell is already on this class list.');next.spells.push({name:text(spell.name,120),level:Number(spell.level),className,manual:!!spell.manual});}
  if(!setup){const hd=CLASSES[className]?.die||integer(p.hitDie||8,2,100,'Hit Die');let hp= p.hpMode==='roll'?die(hd,rng):p.hpMode==='manual'?integer(p.hpManual,1,1000,'HP before Constitution'):Math.floor(hd/2)+1;next.hpRolls.push(hp);}
 }else{
  next.level=integer((next.level||1)+1,1,999,'Advancement');next.manualHP=Number(next.manualHP||10)+integer(p.hpManual||0,-1000,1000,'HP change');
  const boosts=p.statBoosts||{};for(const [stat,delta]of Object.entries(boosts)){requireValue(stat in next.stats,'Unknown stat.');next.stats[stat]+=integer(delta,-1000,1000,'Stat increase');}
 }
 const custom=text(p.features,6000).split('\n').map(x=>x.trim()).filter(Boolean);for(const name of custom)next.features.push({name:text(name,120),notes:'Manual effect. Configure modifiers or resources on the sheet.',manual:true,level:totalLevel(next)});
 validateCharacter(next);const after=derive(next);return {next,summary:{levelBefore:before.level,levelAfter:after.level,hpBefore:before.maxHP,hpAfter:after.maxHP,pbBefore:before.proficiency,pbAfter:after.proficiency,className,classLevel:nextLevel,setup,overrideReason:text(p.overrideReason,200)}};
}
export function mutate(s,actor,action,p={},now=Date.now(),rng){
 requireValue(s?.schema===1,'Unsupported data format.');let a=s.sessions[actor],result={};
 if(action==='createProfile'){
  const name=text(p.name,60);requireValue(name,'Enter a player or GM name.');requireValue(['player','gm'].includes(p.role),'Choose Player or DM / GM.');requireValue(s.profiles.length<200,'This table has reached its profile limit.');
  requireValue(!s.profiles.some(x=>x.role===p.role&&x.name.toLowerCase()===name.toLowerCase()),'That name already exists. Select it from the list.');
  const profile={id:uid(),name,role:p.role,createdAt:now};s.profiles.push(profile);s.sessions[actor]={profileId:profile.id,role:profile.role,gameId:null,lastSeen:now};return {profile};
 }
 if(action==='selectProfile'){
  const profile=s.profiles.find(x=>x.id===p.profileId);requireValue(profile,'That name is no longer available.');s.sessions[actor]={profileId:profile.id,role:profile.role,gameId:null,lastSeen:now};return {profile};
 }
 if(action==='leave'){if(a){a.gameId=null;a.lastSeen=0;}return {};}
 if(action==='sync'){if(a&&p.heartbeat!==false)a.lastSeen=now;for(const [key,value]of Object.entries(s.sessions))if(now-value.lastSeen>7*86400000)delete s.sessions[key];return {};}
 a=sessionFor(s,actor);a.lastSeen=now;
 if(action==='createGame'){
  assertGM(a);requireValue(SYSTEMS[p.system],'Select a rules system.');requireValue(text(p.name),'Name the game.');requireValue(s.games.length<50,'This workspace supports up to 50 games.');const g=makeGame(p.name,p.system,a.profileId);g.description=text(p.description,400);s.games.push(g);a.gameId=g.id;return {game:g};
 }
 if(action==='joinGame'){const g=s.games.find(x=>x.id===p.gameId);requireValue(g,'Game not found.');a.gameId=g.id;if(a.role==='player'&&!g.members.includes(a.profileId))g.members.push(a.profileId);return {gameId:g.id};}
 const g=gameFor(s,a);
 if(action==='settings'){
  assertGM(a);const settings={...g.settings};for(const key of ['natural20','natural1','partyRolls','allowLevel','requireApproval','statLock'])if(key in p)settings[key]=!!p[key];
  if(p.statRules){const rules={...p.statRules,explode:false};rollDice(rules,sides=>sides);settings.statRules=rules;}
  g.settings=settings;if('name'in p){requireValue(text(p.name),'Game needs a name.');g.name=text(p.name,80);}if('description'in p)g.description=text(p.description,400);return {};
 }
 if(action==='exportGame'){assertGM(a);return {backup:{format:'tablebound-game-backup',version:VERSION,exportedAt:now,game:clone(g),profiles:s.profiles.filter(x=>x.id===g.gmId||g.members.includes(x.id)).map(clone),characters:s.characters.filter(x=>x.gameId===g.id).map(clone),messages:s.messages.filter(x=>x.gameId===g.id).map(clone),rolls:s.rolls.filter(x=>x.gameId===g.id).map(clone),requests:s.requests.filter(x=>x.gameId===g.id).map(clone),targets:Object.fromEntries(Object.entries(s.targets).filter(([key])=>key.startsWith(g.id+':')))}};}
 if(action==='gmNotes'){assertGM(a);g.notes=text(p.notes,20000);return {};}
 if(action==='createCharacter'){
  requireValue(a.role==='player'||p.playerId,'Select a player for this character.');const pid=a.role==='gm'?p.playerId:a.profileId;requireValue(s.profiles.some(x=>x.id===pid&&x.role==='player'),'Choose an existing player.');
  requireValue(s.characters.length<200,'Character limit reached. Export older characters before adding more.');
  const c=newCharacter({gameId:g.id,playerId:pid,system:g.system,name:p.name,className:p.className,species:p.species,background:p.background,stats:p.stats});
  if(p.customStats)c.stats=clone(p.customStats);
  if(g.system==='dnd24'&&p.applyBackground){const bg=BACKGROUND24[c.background];if(bg){requireValue(bg.stats.includes(p.boostOne)&&bg.stats.includes(p.boostTwo)&&p.boostOne!==p.boostTwo,'Choose two different abilities allowed by this background.');c.stats[p.boostOne]+=2;c.stats[p.boostTwo]+=1;bg.skills.forEach(x=>c.skills[x]=1);c.feats.push(bg.feat);}}
  validateCharacter(c);s.characters.push(c);addAudit(c,'Character created',a.profileId,now);return {characterId:c.id};
 }
 if(action==='updateCharacter'){
  const c=characterFor(s,a,p.id,{edit:true});revisionCheck(c,p);requireValue(!c.pendingLevel,'Resolve the pending level-up before editing this sheet.');const editable=['name','species','background','archetype','stats','skills','saves','armor','shield','speed','manualAC','manualHP','manualInitiative','overrides','attacks','spells','features','feats','fightingStyle','notes','inventory','appearance','portrait','conditions','customFields'];
  const next=clone(c);for(const key of editable)if(key in (p.patch||{}))next[key]=clone(p.patch[key]);
  for(const key of ['name','species','background','archetype'])next[key]=text(next[key],80);for(const key of ['notes','inventory','appearance'])next[key]=text(next[key],20000);
  validateCharacter(next);saveChange(next,a,now,'Sheet updated');s.characters[s.characters.indexOf(c)]=next;return {};
 }
 if(action==='deleteCharacter'){const c=characterFor(s,a,p.id,{edit:true});requireValue(p.confirm===c.name,'Type the character name to delete it.');s.characters=s.characters.filter(x=>x.id!==c.id);return {};}
 if(action==='importCharacter'){
  const raw=clone(p.character);requireValue(raw&&typeof raw==='object','Choose a Tablebound character export.');requireValue(raw.system===g.system,'This character uses a different rules system. Switch to a matching game first.');raw.id=uid();raw.gameId=g.id;raw.playerId=a.role==='gm'?p.playerId:a.profileId;requireValue(s.profiles.some(x=>x.id===raw.playerId&&x.role==='player'),'Choose a player to import this character.');raw.revision=0;raw.history=[];raw.undo=[];delete raw.pendingLevel;validateCharacter(raw);s.characters.push(raw);return {characterId:raw.id};
 }
 if(action==='hp'){
  const c=characterFor(s,a,p.id,{edit:true}),d=derive(c);if(p.temp!==undefined)c.tempHP=integer(p.temp,0,10000,'Temporary HP');
  if(p.delta!==undefined){let delta=integer(p.delta,-10000,10000,'HP change');if(delta<0){const absorb=Math.min(c.tempHP||0,-delta);c.tempHP=(c.tempHP||0)-absorb;delta+=absorb;}c.damage=clamp(Number(c.damage||0)-delta,0,d.maxHP);}
  saveChange(c,a,now,'Hit points adjusted');return {};
 }
 if(action==='condition'){const c=characterFor(s,a,p.id,{edit:true}),condition=text(p.condition,80);requireValue(condition,'Enter a condition.');c.conditions=c.conditions.includes(condition)?c.conditions.filter(x=>x!==condition):[...c.conditions,condition];saveChange(c,a,now,'Conditions updated');return {};}
 if(action==='resource'){
  const c=characterFor(s,a,p.id,{edit:true}),d=derive(c);if(p.slot==='pact'){requireValue(d.pact,'No pact slots.');requireValue((c.pactUsed||0)+Number(p.delta)<=d.pact.count,'No pact slots remaining.');c.pactUsed=clamp((c.pactUsed||0)+integer(p.delta,-20,20),0,d.pact.count);}else if(p.slot){const ix=integer(p.slot,1,9,'Spell slot');requireValue(d.slots[ix-1],'No slots at that level.');requireValue((c.slotsUsed[ix]||0)+Number(p.delta)<=d.slots[ix-1],'No slots of that level remaining.');c.slotsUsed[ix]=clamp((c.slotsUsed[ix]||0)+integer(p.delta,-20,20),0,d.slots[ix-1]);}else{const r=d.resources.find(x=>x.name===p.name);requireValue(r,'Resource not found.');requireValue((c.resourcesUsed[r.name]||0)+Number(p.delta)<=r.max,'No uses remaining.');c.resourcesUsed[r.name]=clamp((c.resourcesUsed[r.name]||0)+integer(p.delta,-1000,1000),0,r.max);}saveChange(c,a,now,'Resource adjusted');return {};
 }
 if(action==='rest'){
  const c=characterFor(s,a,p.id,{edit:true}),d=derive(c);requireValue(['short','long'].includes(p.type),'Choose short or long rest.');for(const r of d.resources){if(p.type==='long'||r.reset==='short')c.resourcesUsed[r.name]=0;else if(r.reset==='partial-short')c.resourcesUsed[r.name]=Math.max(0,(c.resourcesUsed[r.name]||0)-1);}c.pactUsed=0;if(p.type==='long'){c.slotsUsed={};c.damage=0;}saveChange(c,a,now,`${p.type==='long'?'Long':'Short'} rest; review Hit Dice and special recovery manually`);return {};
 }
 if(action==='levelUp'){
  const c=characterFor(s,a,p.id,{edit:true});revisionCheck(c,p);requireValue(a.role==='gm'||g.settings.allowLevel,'The GM has locked leveling for this game.');const {next,summary}=leveledCharacter(c,p,rng,now);
  if(g.settings.requireApproval&&a.role!=='gm'){c.pendingLevel={next,summary,requestedAt:now,requestedBy:a.profileId};saveChange(c,a,now,'Level-up submitted for GM approval');return {pending:true,summary};}
  saveChange(next,a,now,summary.setup?'Initial class choices saved':`Advanced ${summary.className} to ${summary.classLevel||next.level}`);s.characters[s.characters.indexOf(c)]=next;return {summary};
 }
 if(action==='approveLevel'){
  assertGM(a);const c=characterFor(s,a,p.id,{edit:true});requireValue(c.pendingLevel,'No pending level-up.');if(p.approve){const next=c.pendingLevel.next;for(const key of ['damage','tempHP','resourcesUsed','slotsUsed','pactUsed','conditions','statPool','history'])next[key]=clone(c[key]);next.revision=c.revision;saveChange(next,a,now,'GM approved level-up');s.characters[s.characters.indexOf(c)]=next;}else{delete c.pendingLevel;saveChange(c,a,now,'GM declined level-up');}return {};
 }
 if(action==='undoLevel'){
  const c=characterFor(s,a,p.id,{edit:true});requireValue(!c.pendingLevel,'Resolve the pending level-up first.');requireValue(a.role==='gm'||!g.settings.requireApproval,'Ask the GM to undo an approved level-up.');requireValue(c.undo?.length,'No earlier level-up snapshot.');const next=clone(c.undo[0]);next.portrait=c.portrait;next.undo=c.undo.slice(1);next.history=c.history;next.revision=c.revision;saveChange(next,a,now,'Previous level-up restored (including the earlier sheet snapshot)');s.characters[s.characters.indexOf(c)]=next;return {};
 }
 if(action==='statRoll'){
  const c=characterFor(s,a,p.id),rules=g.settings.statLock?g.settings.statRules:p.rules;const roll=rollDice(rules,rng);requireValue(c.statPool.length<100,'Assign or clear some unassigned totals first.');const r={...newRoll(s,a,c,'stat','Ability score roll',now),...roll};addRoll(s,r);c.statPool.push({id:r.id,total:roll.total,roll:clone(roll),createdAt:now});saveChange(c,a,now,`Rolled an unassigned stat: ${roll.total}`);return {roll:publicRoll(r,a)};
 }
 if(action==='assignStat'){
  const c=characterFor(s,a,p.id);requireValue(!c.pendingLevel,'Resolve the pending level-up before assigning stats.');const entry=c.statPool.find(x=>x.id===p.rollId);requireValue(entry,'That total was already assigned or removed.');requireValue(p.stat in c.stats,'Choose an existing stat.');c.stats[p.stat]=entry.total;c.statPool=c.statPool.filter(x=>x.id!==entry.id);saveChange(c,a,now,`Assigned ${entry.total} to ${p.stat}`);return {};
 }
 if(action==='discardStat'){const c=characterFor(s,a,p.id);c.statPool=c.statPool.filter(x=>x.id!==p.rollId);saveChange(c,a,now,'Unassigned stat discarded');return {};}
 if(action==='setTarget'){
  assertGM(a);requireValue(g.members.includes(p.playerId),'That player has not joined this game.');const key=targetKey(g.id,p.playerId);s.targets[key]={ac:p.ac===''||p.ac===null?null:integer(p.ac,-1000,10000,'Armor Class / defense'),label:text(p.label,80),setAt:now,by:a.profileId};return {};
 }
 if(action==='resolveRoll'){
  assertGM(a);const r=s.rolls.find(x=>x.id===p.rollId&&x.gameId===g.id);requireValue(r&&r.kind==='attack'&&r.outcome==='pending','This roll is no longer waiting for a target.');r.ac=integer(p.ac,-1000,10000,'Armor Class / defense');r.targetLabel=text(p.label,80);Object.assign(r,evaluateAttack(r.total,r.ac,r.natural,r.resolutionSettings||{}));r.resolvedAt=now;return {roll:clone(r)};
 }
 if(action==='attack'||action==='damage'||action==='check'||action==='freeRoll'){
  const c=p.id?characterFor(s,a,p.id):null;if(!c)assertGM(a);
  let req=null;if(p.requestId){requireValue(action==='freeRoll','Use the requested roll button.');req=s.requests.find(x=>x.id===p.requestId&&x.gameId===g.id&&x.playerId===a.profileId&&x.status==='open');requireValue(req,'This requested roll is no longer available.');p={...p,formula:req.formula};}
  let r=newRoll(s,a,c,action==='freeRoll'?'check':action,p.label||'Roll',now);
  if(action==='attack'||action==='damage'){
   const attack=c.attacks.find(x=>x.id===p.attackId);requireValue(attack,'Ability not found.');r.label=attack.name;r.attackId=attack.id;
   if(action==='damage'){
    const bonus=attackDamageBonus(c,attack),f=attack.damage+(bonus>=0?'+':'')+bonus;Object.assign(r,formulaRoll(f,rng,!!p.critical));r.label+=p.critical?' · critical damage':' · damage';
   }else{
    const mode=SYSTEMS[c.system].mode;
    if(mode==='percentile'){const rr=rollDice({sides:100,count:1},rng);r={...r,...rr};r.threshold=integer(attack.threshold??50,1,100,'Skill target');r.outcome=r.total<=r.threshold?'hit':'miss';r.label+=' · percentile';r.resolvedAt=now;}
    else if(mode==='trait'){const trait=rollDice({sides:attack.sides||6,count:1,explode:true},rng),wild=rollDice({sides:6,count:1,explode:true},rng);r.trait=trait;r.wild=wild;r.total=Math.max(trait.total,wild.total)+Number(attack.bonus||0);r.label+=' · trait / wild';r.outcome='pending';}
    else{const roll=rollDice({sides:20,count:p.advantage==='normal'||!p.advantage?1:2,keep:p.advantage==='advantage'?'highest':p.advantage==='disadvantage'?'lowest':'all',keepCount:1,bonus:attackBonus(c,attack)},rng);Object.assign(r,roll);r.natural=roll.dice.find(x=>x.kept)?.value;r.outcome='pending';}
    if(mode!=='percentile'){
     const target=s.targets[targetKey(g.id,c.playerId)],active=activeGMs(s,g.id,now).length>0;r.ac=active?(target?.ac??null):null;r.targetLabel=target?.label||'';r.targetSetAt=target?.setAt||null;
     r.resolutionSettings={natural20:g.settings.natural20&&isDnd(c.system),natural1:g.settings.natural1&&isDnd(c.system)};
     Object.assign(r,evaluateAttack(r.total,r.ac,r.natural,r.resolutionSettings));if(r.outcome!=='pending')r.resolvedAt=now;
    }
   }
  }else if(action==='check'&&c&&p.skill){
   const d=derive(c);requireValue(p.skill in d.skills||p.skill in d.saves||p.skill==='Initiative','Unknown check.');const bonus=p.skill==='Initiative'?d.initiative:d.skills[p.skill]??d.saves[p.skill];Object.assign(r,rollDice({sides:20,count:p.advantage&&p.advantage!=='normal'?2:1,keep:p.advantage==='advantage'?'highest':p.advantage==='disadvantage'?'lowest':'all',keepCount:1,bonus},rng));r.label=p.skill+(p.skill in d.saves?' save':' check');
  }else{Object.assign(r,formulaRoll(p.formula||'1d20',rng));}
  if(req){r.label=req.label;req.status='done';req.rollId=r.id;}
  r.private=a.role==='gm'&&!!p.private;
  addRoll(s,r);return {roll:publicRoll(r,a)};
 }
 if(action==='message'){
  const body=text(p.body,3000);requireValue(body,'Write a message first.');requireValue(['party','gm'].includes(p.channel),'Unknown message channel.');const to=a.role==='gm'&&p.channel==='gm'?p.to:null;if(a.role==='gm'&&p.channel==='gm')requireValue(g.members.includes(to),'Choose a player to whisper to.');
  const m={id:uid(),gameId:g.id,channel:p.channel,from:a.profileId,to,body,createdAt:now};s.messages.push(m);if(s.messages.length>2000)s.messages=s.messages.slice(-2000);return {};
 }
 if(action==='requestRoll'){
  assertGM(a);const players=p.playerId==='all'?g.members:[p.playerId];requireValue(players.every(x=>g.members.includes(x)),'Choose a player in this game.');formulaRoll(p.formula||'1d20',()=>1);
  for(const pid of players)s.requests.push({id:uid(),gameId:g.id,playerId:pid,label:text(p.label||'GM requested roll',100),formula:text(p.formula||'1d20',100),createdAt:now,status:'open'});s.requests=s.requests.slice(-200);return {};
 }
 if(action==='initiative'){
  assertGM(a);if(p.op==='add'){requireValue(g.initiative.length<50,'Initiative list is full.');g.initiative.push({id:uid(),name:text(p.name,80)||'Combatant',score:integer(p.score,-1000,10000,'Initiative'),hp:text(p.hp,20)});g.initiative.sort((x,y)=>y.score-x.score);}
  else if(p.op==='next'&&g.initiative.length){g.turn++;if(g.turn>=g.initiative.length){g.turn=0;g.round++;}}
  else if(p.op==='remove'){const active=g.initiative[g.turn]?.id;g.initiative=g.initiative.filter(x=>x.id!==p.id);g.turn=Math.max(0,g.initiative.findIndex(x=>x.id===active));}
  else if(p.op==='reset'){g.initiative=[];g.turn=0;g.round=1;}return {};
 }
 throw Error('Unknown action. Update the app and server together.');
}
