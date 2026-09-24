/* Tablebound 0.1.0. Original implementation of numerical rules; see LICENSES.md.
   Rules support is intentionally explicit. Templates are not complete rules engines. */
export const VERSION = '0.1.0';
export const SYSTEMS = {
  dnd24:{name:'D&D 5e · 2024', short:'5E / 2024', badge:'Core automation', stats:['STR','DEX','CON','INT','WIS','CHA'], mode:'d20', level:true},
  dnd14:{name:'D&D 5e · 2014', short:'5E / 2014', badge:'Core automation', stats:['STR','DEX','CON','INT','WIS','CHA'], mode:'d20', level:true},
  pf2:{name:'Pathfinder 2e Remaster',short:'PF2E',badge:'Editable template',stats:['STR','DEX','CON','INT','WIS','CHA'],mode:'d20',level:true},
  coc7:{name:'Call of Cthulhu 7e',short:'CoC / 7E',badge:'Editable template',stats:['STR','CON','SIZ','DEX','APP','INT','POW','EDU'],mode:'percentile',level:false},
  swade:{name:'Savage Worlds Adventure Edition',short:'SWADE',badge:'Editable template',stats:['Agility','Smarts','Spirit','Strength','Vigor'],mode:'trait',level:false},
  custom:{name:'Universal / Homebrew',short:'CUSTOM',badge:'Build your rules',stats:['Strength','Agility','Mind','Spirit'],mode:'custom',level:true}
};
export const CLASSES = {
  Barbarian:{die:12, saves:['STR','CON'], subclass14:3, sub14:'Path of the Berserker',sub24:'Path of the Berserker', requires:[['STR']]},
  Bard:{die:8,saves:['DEX','CHA'],spell:'CHA',caster:'full',subclass14:3,sub14:'College of Lore',sub24:'College of Lore',requires:[['CHA']]},
  Cleric:{die:8,saves:['WIS','CHA'],spell:'WIS',caster:'full',subclass14:1,sub14:'Life Domain',sub24:'Life Domain',requires:[['WIS']]},
  Druid:{die:8,saves:['INT','WIS'],spell:'WIS',caster:'full',subclass14:2,sub14:'Circle of the Land',sub24:'Circle of the Land',requires:[['WIS']]},
  Fighter:{die:10,saves:['STR','CON'],subclass14:3,sub14:'Champion',sub24:'Champion',requires:[['STR','DEX']]},
  Monk:{die:8,saves:['STR','DEX'],subclass14:3,sub14:'Way of the Open Hand',sub24:'Warrior of the Open Hand',requires:[['DEX'],['WIS']]},
  Paladin:{die:10,saves:['WIS','CHA'],spell:'CHA',caster:'half',subclass14:3,sub14:'Oath of Devotion',sub24:'Oath of Devotion',requires:[['STR'],['CHA']]},
  Ranger:{die:10,saves:['STR','DEX'],spell:'WIS',caster:'half',subclass14:3,sub14:'Hunter',sub24:'Hunter',requires:[['DEX'],['WIS']]},
  Rogue:{die:8,saves:['DEX','INT'],subclass14:3,sub14:'Thief',sub24:'Thief',requires:[['DEX']]},
  Sorcerer:{die:6,saves:['CON','CHA'],spell:'CHA',caster:'full',subclass14:1,sub14:'Draconic Bloodline',sub24:'Draconic Sorcery',requires:[['CHA']]},
  Warlock:{die:8,saves:['WIS','CHA'],spell:'CHA',caster:'pact',subclass14:1,sub14:'The Fiend',sub24:'Fiend Patron',requires:[['CHA']]},
  Wizard:{die:6,saves:['INT','WIS'],spell:'INT',caster:'full',subclass14:2,sub14:'School of Evocation',sub24:'Evoker',requires:[['INT']]}
};
export const SPECIES={dnd14:['Human','Dwarf','Elf','Halfling','Dragonborn','Gnome','Half-Elf','Half-Orc','Tiefling'],dnd24:['Human','Dwarf','Elf','Halfling','Dragonborn','Gnome','Goliath','Orc','Tiefling'],pf2:['Human','Dwarf','Elf','Gnome','Goblin','Halfling','Leshy','Orc'],coc7:['Human'],swade:['Human'],custom:[]};
export const BACKGROUNDS={dnd14:['Acolyte'],dnd24:['Acolyte','Criminal','Sage','Soldier'],pf2:['Acolyte','Artisan','Criminal','Farmhand','Scholar','Warrior'],coc7:['Antiquarian','Artist','Detective','Doctor','Journalist','Professor','Soldier'],swade:['Adventurer','Scholar','Soldier','Outlaw','Healer'],custom:[]};
export const BACKGROUND24={Acolyte:{stats:['INT','WIS','CHA'],skills:['Insight','Religion'],feat:'Magic Initiate'},Criminal:{stats:['DEX','CON','INT'],skills:['Sleight of Hand','Stealth'],feat:'Alert'},Sage:{stats:['CON','INT','WIS'],skills:['Arcana','History'],feat:'Magic Initiate'},Soldier:{stats:['STR','DEX','CON'],skills:['Athletics','Intimidation'],feat:'Savage Attacker'}};
export const SKILLS={'Acrobatics':'DEX','Animal Handling':'WIS','Arcana':'INT','Athletics':'STR','Deception':'CHA','History':'INT','Insight':'WIS','Intimidation':'CHA','Investigation':'INT','Medicine':'WIS','Nature':'INT','Perception':'WIS','Performance':'CHA','Persuasion':'CHA','Religion':'INT','Sleight of Hand':'DEX','Stealth':'DEX','Survival':'WIS'};
export const ARMORS = {
  'Unarmored':{base:10,dex:99},'Leather':{base:11,dex:99},'Studded leather':{base:12,dex:99},'Hide':{base:12,dex:2},'Chain shirt':{base:13,dex:2},'Scale mail':{base:14,dex:2},'Breastplate':{base:14,dex:2},'Half plate':{base:15,dex:2},'Ring mail':{base:14,dex:0},'Chain mail':{base:16,dex:0},'Splint':{base:17,dex:0},'Plate':{base:18,dex:0},'Mage armor':{base:13,dex:99},'Barbarian defense':{base:10,dex:99,extra:'CON'},'Monk defense':{base:10,dex:99,extra:'WIS'}
};
export const WEAPONS={
  'Dagger':{damage:'1d4',stat:'finesse',type:'Piercing'},'Shortsword':{damage:'1d6',stat:'finesse',type:'Piercing'},'Rapier':{damage:'1d8',stat:'finesse',type:'Piercing'},'Longsword':{damage:'1d8',stat:'STR',type:'Slashing'},'Longsword (two hands)':{damage:'1d10',stat:'STR',type:'Slashing'},'Greatsword':{damage:'2d6',stat:'STR',type:'Slashing'},'Greataxe':{damage:'1d12',stat:'STR',type:'Slashing'},'Mace':{damage:'1d6',stat:'STR',type:'Bludgeoning'},'Quarterstaff':{damage:'1d6',stat:'STR',type:'Bludgeoning'},'Warhammer':{damage:'1d8',stat:'STR',type:'Bludgeoning'},'Handaxe':{damage:'1d6',stat:'STR',type:'Slashing'},'Spear':{damage:'1d6',stat:'STR',type:'Piercing'},'Shortbow':{damage:'1d6',stat:'DEX',type:'Piercing',ranged:true},'Longbow':{damage:'1d8',stat:'DEX',type:'Piercing',ranged:true},'Light crossbow':{damage:'1d8',stat:'DEX',type:'Piercing',ranged:true},'Heavy crossbow':{damage:'1d10',stat:'DEX',type:'Piercing',ranged:true}
};
export const CONDITIONS=['Blinded','Charmed','Deafened','Frightened','Grappled','Incapacitated','Invisible','Paralyzed','Petrified','Poisoned','Prone','Restrained','Stunned','Unconscious','Concentrating'];
export const SLOT_TABLE=[[],[2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]];
const FULL_PREP=[0,4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22];
const SORC24_PREP=[0,2,4,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22];
const HALF_PREP=[0,2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15];
const BARD14_KNOWN=[0,4,5,6,7,8,9,10,11,12,14,15,15,16,18,19,19,20,22,22,22];
const SORC14_KNOWN=[0,2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15];
const WARLOCK_KNOWN=[0,2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15];
export const FEATS={dnd14:['Grappler'],dnd24:['Alert','Magic Initiate','Savage Attacker','Skilled','Grappler']};
export const STYLES=['Archery','Defense','Dueling','Great Weapon Fighting','Protection','Two-Weapon Fighting'];
export const SPELLS = [
 ['Acid Splash',0,'Sorcerer Wizard'],['Chill Touch',0,'Sorcerer Warlock Wizard'],['Dancing Lights',0,'Bard Sorcerer Wizard'],['Druidcraft',0,'Druid'],['Eldritch Blast',0,'Warlock'],['Fire Bolt',0,'Sorcerer Wizard'],['Guidance',0,'Cleric Druid'],['Light',0,'Bard Cleric Sorcerer Wizard'],['Mage Hand',0,'Bard Sorcerer Warlock Wizard'],['Mending',0,'Bard Cleric Druid Sorcerer Wizard'],['Message',0,'Bard Sorcerer Wizard'],['Minor Illusion',0,'Bard Sorcerer Warlock Wizard'],['Poison Spray',0,'Druid Sorcerer Warlock Wizard'],['Prestidigitation',0,'Bard Sorcerer Warlock Wizard'],['Produce Flame',0,'Druid'],['Ray of Frost',0,'Sorcerer Wizard'],['Resistance',0,'Cleric Druid'],['Sacred Flame',0,'Cleric'],['Shillelagh',0,'Druid'],['Shocking Grasp',0,'Sorcerer Wizard'],['Spare the Dying',0,'Cleric'],['Thaumaturgy',0,'Cleric'],['True Strike',0,'Bard Sorcerer Warlock Wizard'],['Vicious Mockery',0,'Bard'],
 ['Alarm',1,'Ranger Wizard'],['Animal Friendship',1,'Bard Druid Ranger'],['Bane',1,'Bard Cleric'],['Bless',1,'Cleric Paladin'],['Burning Hands',1,'Sorcerer Wizard'],['Charm Person',1,'Bard Druid Sorcerer Warlock Wizard'],['Command',1,'Cleric Paladin'],['Comprehend Languages',1,'Bard Sorcerer Warlock Wizard'],['Cure Wounds',1,'Bard Cleric Druid Paladin Ranger'],['Detect Magic',1,'Bard Cleric Druid Paladin Ranger Sorcerer Wizard'],['Disguise Self',1,'Bard Sorcerer Wizard'],['Divine Favor',1,'Paladin'],['Entangle',1,'Druid'],['Faerie Fire',1,'Bard Druid'],['False Life',1,'Sorcerer Wizard'],['Feather Fall',1,'Bard Sorcerer Wizard'],['Find Familiar',1,'Wizard'],['Fog Cloud',1,'Druid Ranger Sorcerer Wizard'],['Goodberry',1,'Druid Ranger'],['Grease',1,'Wizard'],['Guiding Bolt',1,'Cleric'],['Healing Word',1,'Bard Cleric Druid'],['Hellish Rebuke',1,'Warlock'],['Heroism',1,'Bard Paladin'],['Hex',1,'Warlock'],["Hunter's Mark",1,'Ranger'],['Identify',1,'Bard Wizard'],['Inflict Wounds',1,'Cleric'],['Jump',1,'Druid Ranger Sorcerer Wizard'],['Longstrider',1,'Bard Druid Ranger Wizard'],['Mage Armor',1,'Sorcerer Wizard'],['Magic Missile',1,'Sorcerer Wizard'],['Sanctuary',1,'Cleric'],['Shield',1,'Sorcerer Wizard'],['Shield of Faith',1,'Cleric Paladin'],['Silent Image',1,'Bard Sorcerer Wizard'],['Sleep',1,'Bard Sorcerer Wizard'],['Speak with Animals',1,'Bard Druid Ranger'],['Thunderwave',1,'Bard Druid Sorcerer Wizard'],
 ['Aid',2,'Cleric Paladin'],['Alter Self',2,'Sorcerer Wizard'],['Arcane Lock',2,'Wizard'],['Augury',2,'Cleric'],['Barkskin',2,'Druid Ranger'],['Blindness/Deafness',2,'Bard Cleric Sorcerer Wizard'],['Blur',2,'Sorcerer Wizard'],['Calm Emotions',2,'Bard Cleric'],['Darkness',2,'Sorcerer Warlock Wizard'],['Darkvision',2,'Druid Ranger Sorcerer Wizard'],['Detect Thoughts',2,'Bard Sorcerer Wizard'],['Enhance Ability',2,'Bard Cleric Druid Sorcerer'],['Enlarge/Reduce',2,'Sorcerer Wizard'],['Find Steed',2,'Paladin'],['Flaming Sphere',2,'Druid Wizard'],['Heat Metal',2,'Bard Druid'],['Hold Person',2,'Bard Cleric Druid Sorcerer Warlock Wizard'],['Invisibility',2,'Bard Sorcerer Warlock Wizard'],['Knock',2,'Bard Sorcerer Wizard'],['Lesser Restoration',2,'Bard Cleric Druid Paladin Ranger'],['Levitate',2,'Sorcerer Wizard'],['Locate Object',2,'Bard Cleric Druid Paladin Ranger Wizard'],['Magic Weapon',2,'Paladin Wizard'],['Mirror Image',2,'Sorcerer Warlock Wizard'],['Misty Step',2,'Sorcerer Warlock Wizard'],['Moonbeam',2,'Druid'],['Pass without Trace',2,'Druid Ranger'],['Prayer of Healing',2,'Cleric'],['Scorching Ray',2,'Sorcerer Wizard'],['Shatter',2,'Bard Sorcerer Warlock Wizard'],['Silence',2,'Bard Cleric Ranger'],['Spider Climb',2,'Sorcerer Warlock Wizard'],['Spike Growth',2,'Druid Ranger'],['Spiritual Weapon',2,'Cleric'],['Suggestion',2,'Bard Sorcerer Warlock Wizard'],['Web',2,'Sorcerer Wizard'],
 ['Animate Dead',3,'Cleric Wizard'],['Beacon of Hope',3,'Cleric'],['Bestow Curse',3,'Bard Cleric Wizard'],['Blink',3,'Sorcerer Wizard'],['Call Lightning',3,'Druid'],['Clairvoyance',3,'Bard Cleric Sorcerer Wizard'],['Counterspell',3,'Sorcerer Warlock Wizard'],['Daylight',3,'Cleric Druid Paladin Ranger Sorcerer'],['Dispel Magic',3,'Bard Cleric Druid Paladin Sorcerer Warlock Wizard'],['Fear',3,'Bard Sorcerer Warlock Wizard'],['Fireball',3,'Sorcerer Wizard'],['Fly',3,'Sorcerer Warlock Wizard'],['Gaseous Form',3,'Sorcerer Warlock Wizard'],['Haste',3,'Sorcerer Wizard'],['Hypnotic Pattern',3,'Bard Sorcerer Warlock Wizard'],['Lightning Bolt',3,'Sorcerer Wizard'],['Magic Circle',3,'Cleric Paladin Warlock Wizard'],['Mass Healing Word',3,'Cleric'],['Remove Curse',3,'Cleric Paladin Warlock Wizard'],['Revivify',3,'Cleric Paladin'],['Sending',3,'Bard Cleric Wizard'],['Sleet Storm',3,'Druid Sorcerer Wizard'],['Slow',3,'Sorcerer Wizard'],['Speak with Dead',3,'Bard Cleric'],['Spirit Guardians',3,'Cleric'],['Stinking Cloud',3,'Bard Sorcerer Wizard'],['Vampiric Touch',3,'Warlock Wizard'],['Water Breathing',3,'Druid Ranger Sorcerer Wizard'],
 ['Banishment',4,'Cleric Paladin Sorcerer Warlock Wizard'],['Blight',4,'Druid Sorcerer Warlock Wizard'],['Confusion',4,'Bard Druid Sorcerer Wizard'],['Death Ward',4,'Cleric Paladin'],['Dimension Door',4,'Bard Sorcerer Warlock Wizard'],['Freedom of Movement',4,'Bard Cleric Druid Ranger'],['Greater Invisibility',4,'Bard Sorcerer Wizard'],['Ice Storm',4,'Druid Sorcerer Wizard'],['Polymorph',4,'Bard Druid Sorcerer Wizard'],['Stone Shape',4,'Cleric Druid Wizard'],['Stoneskin',4,'Druid Ranger Sorcerer Wizard'],['Wall of Fire',4,'Druid Sorcerer Wizard'],
 ['Animate Objects',5,'Bard Sorcerer Wizard'],['Cloudkill',5,'Sorcerer Wizard'],['Cone of Cold',5,'Sorcerer Wizard'],['Contagion',5,'Cleric Druid'],['Dispel Evil and Good',5,'Cleric Paladin'],['Dominate Person',5,'Bard Sorcerer Wizard'],['Flame Strike',5,'Cleric'],['Greater Restoration',5,'Bard Cleric Druid'],['Hold Monster',5,'Bard Sorcerer Warlock Wizard'],['Mass Cure Wounds',5,'Bard Cleric Druid'],['Raise Dead',5,'Bard Cleric Paladin'],['Scrying',5,'Bard Cleric Druid Warlock Wizard'],['Telekinesis',5,'Sorcerer Wizard'],['Teleportation Circle',5,'Bard Sorcerer Wizard'],['Wall of Force',5,'Wizard'],
 ['Chain Lightning',6,'Sorcerer Wizard'],['Disintegrate',6,'Sorcerer Wizard'],['Heal',6,'Cleric Druid'],['Heroes’ Feast',6,'Cleric Druid'],['Sunbeam',6,'Druid Sorcerer Wizard'],['True Seeing',6,'Bard Cleric Sorcerer Warlock Wizard'],['Wall of Ice',6,'Wizard'],
 ['Etherealness',7,'Bard Cleric Sorcerer Warlock Wizard'],['Finger of Death',7,'Sorcerer Warlock Wizard'],['Fire Storm',7,'Cleric Druid Sorcerer'],['Plane Shift',7,'Cleric Druid Sorcerer Warlock Wizard'],['Regenerate',7,'Bard Cleric Druid'],['Resurrection',7,'Bard Cleric'],['Teleport',7,'Bard Sorcerer Wizard'],
 ['Antimagic Field',8,'Cleric Wizard'],['Dominate Monster',8,'Bard Sorcerer Warlock Wizard'],['Earthquake',8,'Cleric Druid Sorcerer'],['Mind Blank',8,'Bard Wizard'],['Sunburst',8,'Druid Sorcerer Wizard'],
 ['Foresight',9,'Bard Druid Warlock Wizard'],['Gate',9,'Cleric Sorcerer Wizard'],['Mass Heal',9,'Cleric'],['Meteor Swarm',9,'Sorcerer Wizard'],['Power Word Kill',9,'Bard Sorcerer Warlock Wizard'],['Time Stop',9,'Sorcerer Wizard'],['True Resurrection',9,'Cleric Druid'],['Wish',9,'Sorcerer Wizard']
].map(([name,level,classes])=>({name,level,classes:classes.split(' ')}));
export const isDnd = s => s === 'dnd14' || s === 'dnd24';
export const clone = obj => JSON.parse(JSON.stringify(obj));
export const uid = () => { if(crypto.randomUUID)return crypto.randomUUID();const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;const h=Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`; };
export const clamp = (n,min,max)=>Math.max(min,Math.min(max,Number(n)||0));
export const mod = score=>Math.floor((Number(score)-10)/2);
export const signed = n=>Number(n)>=0?`+${n}`:`${n}`;
export function integer(n,min,max,label='Value') { n=Number(n); if(!Number.isInteger(n)||n<min||n>max) throw Error(`${label} must be a whole number from ${min} to ${max}.`); return n; }
export function text(s,max=120) {return String(s??'').trim().slice(0,max);}
export function die(sides, rng) {
 sides=integer(sides,2,10000,'Die sides'); if(rng){const v=rng(sides);return integer(v,1,sides,'Random result');}
 const range=4294967296, limit=range-range%sides, a=new Uint32Array(1); do{crypto.getRandomValues(a);}while(a[0]>=limit); return 1+a[0]%sides;
}
export function rollDice(options={},rng) {
 const sides=integer(options.sides??6,2,10000,'Die sides'),count=integer(options.count??1,1,100,'Dice count');
 const threshold=integer(options.reroll??0,0,2,'Reroll threshold');
 if(threshold>=sides) throw Error('The reroll rule must leave at least one possible result.');
 const repeat=!!options.repeat, explode=!!options.explode, dice=[];
 for(let i=0;i<count;i++){
  const attempts=[die(sides,rng)]; let rerolls=0;
  while(threshold && attempts.at(-1)<=threshold && (repeat||rerolls===0)) {if(++rerolls>200)throw Error('Reroll safety limit reached. No roll was saved.');attempts.push(die(sides,rng));}
  const explosions=[]; let value=attempts.at(-1),last=value;
  while(explode&&last===sides){if(explosions.length>=100)throw Error('Explosion safety limit reached.');last=die(sides,rng); explosions.push(last);value+=last;}
  dice.push({index:i,attempts,explosions,value,kept:true});
 }
 const keep=text(options.keep||'all'), number=integer(options.keepCount??1,1,count,'Keep/drop count');
 if(!['all','highest','lowest','dropLowest','dropHighest'].includes(keep))throw Error('Unknown keep/drop rule.');
 if(keep!=='all'){
  if(keep.startsWith('drop')&&number>=count)throw Error('At least one die must be kept.');
  const sorted=[...dice].sort((a,b)=>a.value-b.value||a.index-b.index);
  let kept=keep==='highest'?sorted.slice(-number):keep==='lowest'?sorted.slice(0,number):keep==='dropLowest'?sorted.slice(number):sorted.slice(0,count-number);
  const ids=new Set(kept.map(d=>d.index));dice.forEach(d=>d.kept=ids.has(d.index));
 }
 const bonus=integer(options.bonus??0,-10000,10000,'Modifier');
 return {sides,count,reroll:threshold,repeat,explode,keep,keepCount:number,bonus,dice,total:dice.filter(d=>d.kept).reduce((sum,d)=>sum+d.value,0)+bonus};
}
export function formulaRoll(formula,rng,critical=false) {
 const source=text(formula,120).replace(/\s/g,'');
 if(!source||!/^[+\-]?(?:\d*d\d+|\d+)(?:[+\-](?:\d*d\d+|\d+))*$/i.test(source)) throw Error('Use a dice formula such as 2d6 + 3. No code or multiplication.');
 const terms=source.match(/[+\-]?(?:\d*d\d+|\d+)/gi); let total=0, rolled=0, parts=[];
 if(terms.length>20)throw Error('Use at most 20 formula terms.');
 for(const term of terms){const sign=term.startsWith('-')?-1:1,t=term.replace(/^[+\-]/,'');if(/d/i.test(t)){const [a,b]=t.toLowerCase().split('d');const count=integer(a||1,1,100)*(critical?2:1); rolled+=count;if(rolled>100)throw Error('At most 100 dice per formula.');const result=rollDice({count,sides:Number(b)},rng);total+=sign*result.total;parts.push({sign,...result});}else{const bonus=integer(t,0,10000,'Constant');total+=sign*bonus;parts.push({sign,constant:bonus});}}
 return {formula:source,total,parts,critical};
}
export function evaluateAttack(total,ac,natural,settings={}) {
 if(ac===null||ac===undefined||ac==='')return {outcome:'pending',critical:false};
 ac=Number(ac);if(!Number.isFinite(ac))throw Error('Defense must be a number.');
 if(settings.natural20&&natural===20)return {outcome:'hit',critical:true};
 if(settings.natural1&&natural===1)return {outcome:'miss',critical:false};
 return {outcome:total>=ac?'hit':'miss',critical:false};
}
export function applyOverride(calculated,override) {
 if(!override||override.mode==='auto')return Number(calculated);
 const value=Number(override.value);if(!Number.isFinite(value))return Number(calculated);
 return override.mode==='fixed'?value:Number(calculated)+value;
}
export function totalLevel(c){return Math.max(1,(c.classes||[]).reduce((n,x)=>n+Number(x.level||0),0)||Number(c.level)||1);}
export function slotInfo(c) {
 if(!isDnd(c.system))return {slots:[],pact:null,byClass:[]};
 const entries=(c.classes||[]).filter(x=>CLASSES[x.name]?.caster), standard=entries.filter(x=>CLASSES[x.name].caster!=='pact');let casterLevel=0;
 for(const x of standard){const kind=CLASSES[x.name].caster;if(kind==='full')casterLevel+=x.level;else if(c.system==='dnd24')casterLevel+=Math.ceil(x.level/2);else casterLevel+=standard.length===1? (x.level>=2?Math.ceil(x.level/2):0):Math.floor(x.level/2);}
 const war=entries.find(x=>x.name==='Warlock'),pact=war?{count:war.level===1?1:war.level<11?2:war.level<17?3:4,level:Math.min(5,Math.ceil(war.level/2))}:null;
 return {slots:clone(SLOT_TABLE[Math.min(20,casterLevel)]||[]),pact,byClass:entries.map(x=>({name:x.name,...spellCapacity(c,x.name,x.level)}))};
}
export function spellCapacity(c,name,level) {
 const meta=CLASSES[name];if(!meta?.caster||level<1)return {cantrips:0,prepared:0,maxSpell:0,book:0};
 const modern=c.system==='dnd24';let maxSpell=meta.caster==='half'? (modern?Math.min(5,Math.ceil(level/4)):level<2?0:Math.min(5,Math.ceil(level/4))):Math.min(9,Math.ceil(level/2));
 if(meta.caster==='pact')maxSpell=Math.min(5,Math.ceil(level/2));
 let cantrips=meta.caster==='half'?0:({Bard:2,Cleric:3,Druid:2,Sorcerer:4,Warlock:2,Wizard:3}[name]||0)+(level>=4?1:0)+(level>=10?1:0);
 let prepared=0,book=0;
 if(name==='Warlock')prepared=WARLOCK_KNOWN[level];
 else if(modern)prepared=meta.caster==='half'?HALF_PREP[level]:name==='Sorcerer'?SORC24_PREP[level]:name==='Wizard'?[0,4,5,6,7,9,10,11,12,14,15,16,16,17,18,19,21,22,23,24,25][level]:FULL_PREP[level];
 else if(name==='Bard')prepared=BARD14_KNOWN[level];
 else if(name==='Sorcerer')prepared=SORC14_KNOWN[level];
 else if(name==='Ranger')prepared=level<2?0:Math.min(11,Math.ceil(level/2)+1);
 else prepared=Math.max(1,(meta.caster==='half'?Math.floor(level/2):level)+mod(c.stats?.[meta.spell]||10));
 if(name==='Wizard')book=6+2*(level-1);
 return {cantrips,prepared,maxSpell,book};
}
export function derive(c) {
 const level=totalLevel(c),dnd=isDnd(c.system),stats=c.stats||{},classes=c.classes||[],mods={};
 for(const [key,val]of Object.entries(stats))mods[key]=dnd?mod(val):Number(val);
 let basePB=dnd?2+Math.floor((level-1)/4):0;
 const proficiency=applyOverride(basePB,c.overrides?.proficiency);let calculatedAC=Number(c.manualAC??10),calculatedHP=Number(c.manualHP??10);
 if(dnd){const armor=ARMORS[c.armor]||ARMORS.Unarmored;
 calculatedAC=armor.base+(armor.dex===0?0:Math.min(mods.DEX||0,armor.dex))+(armor.extra?(mods[armor.extra]||0):0)+(c.shield&&c.armor!=='Monk defense'?2:0);
 if(c.fightingStyle==='Defense'&&!['Unarmored','Mage armor','Barbarian defense','Monk defense'].includes(c.armor))calculatedAC++;
 const bases=c.hpRolls?.length?c.hpRolls:[CLASSES[classes[0]?.name]?.die||8];
 calculatedHP=bases.reduce((sum,x)=>sum+Math.max(1,Number(x)+(mods.CON||0)),0);
 }
 const maxHP=Math.max(1,applyOverride(calculatedHP,c.overrides?.hp)),ac=applyOverride(calculatedAC,c.overrides?.ac),initiative=applyOverride(dnd?(mods.DEX||0)+(c.system==='dnd24'&&(c.feats||[]).includes('Alert')?proficiency:0):Number(c.manualInitiative||0),c.overrides?.initiative);
 let attacks=1;for(const x of classes){if(['Barbarian','Fighter','Monk','Paladin','Ranger'].includes(x.name)&&x.level>=5)attacks=Math.max(attacks,2);if(x.name==='Fighter'&&x.level>=11)attacks=Math.max(attacks,x.level>=20?4:3);}
 const spellcasting={};for(const x of classes){const stat=CLASSES[x.name]?.spell;if(stat)spellcasting[x.name]={ability:stat,attack:applyOverride((mods[stat]||0)+proficiency,c.overrides?.spellAttack),dc:applyOverride(8+(mods[stat]||0)+proficiency,c.overrides?.spellDC)};}
 const skills={};if(dnd)for(const [skill,stat]of Object.entries(SKILLS)){const rank=c.skills?.[skill]||0;skills[skill]=(mods[stat]||0)+Math.floor(proficiency*rank);}
 const saves={};if(dnd)for(const stat of SYSTEMS[c.system].stats)saves[stat]=(mods[stat]||0)+(c.saves?.includes(stat)?proficiency:0);
 const resources=[];for(const x of classes){const n=x.level;if(x.name==='Barbarian')resources.push({name:'Rage',max:n>=20&&c.system==='dnd14'?999:n>=17?6:n>=12?5:n>=6?4:n>=3?3:2,reset:c.system==='dnd24'?'partial-short':'long'});if(x.name==='Monk'&&n>=2)resources.push({name:c.system==='dnd24'?'Focus points':'Ki points',max:n,reset:'short'});if(x.name==='Sorcerer'&&n>=2)resources.push({name:'Sorcery points',max:n,reset:'long'});if(x.name==='Paladin')resources.push({name:'Lay on Hands',max:5*n,reset:'long'});if(x.name==='Bard')resources.push({name:'Bardic Inspiration',max:Math.max(1,mods.CHA||0),reset:n>=5?'short':'long'});if(x.name==='Fighter'){resources.push({name:'Second Wind',max:c.system==='dnd24'?(n>=10?4:n>=4?3:2):1,reset:c.system==='dnd24'?'partial-short':'short'});if(n>=2)resources.push({name:'Action Surge',max:n>=17?2:1,reset:'short'});}}
 const rogue=classes.find(x=>x.name==='Rogue');
 return {level,mods,proficiency,basePB,maxHP,calculatedHP,ac,calculatedAC,initiative,attacks,spellcasting,skills,saves,resources,...slotInfo(c),sneakAttack:rogue?`${Math.ceil(rogue.level/2)}d6`:null};
}
export function attackBonus(c,a) {
 const d=derive(c);if(!isDnd(c.system))return Number(a.bonus||0);
 let stat=a.stat;if(stat==='finesse')stat=(d.mods.DEX||0)>(d.mods.STR||0)?'DEX':'STR';
 let bonus=(d.mods[stat]||0)+(a.proficient?d.proficiency:0)+Number(a.bonus||0);
 if(a.ranged&&c.fightingStyle==='Archery')bonus+=2;
 return applyOverride(bonus,a.override);
}
export function attackDamageBonus(c,a) {
 const d=derive(c);let stat=a.stat;if(stat==='finesse')stat=(d.mods.DEX||0)>(d.mods.STR||0)?'DEX':'STR';
 return (isDnd(c.system)&&a.addStatDamage?(d.mods[stat]||0):0)+Number(a.damageBonus||0)+(a.dueling&&c.fightingStyle==='Dueling'?2:0);
}
export function subclassOptions(system,name){const m=CLASSES[name];return m?[system==='dnd24'?m.sub24:m.sub14]:[];}
export function classLevelChoices(c,name,level) {
 const m=CLASSES[name],modern=c.system==='dnd24';if(!isDnd(c.system)||!m)return {manual:true,className:name,nextClassLevel:level,notices:['Custom advancement: enter increases and features manually.']};
 const prev=c.classes.find(x=>x.name===name),subLevel=modern?3:m.subclass14;
 const asi=(modern?[4,8,12,16]:[4,8,12,16,19]).includes(level)||(name==='Fighter'&&[6,14].includes(level))||(name==='Rogue'&&level===10);
 const cap=spellCapacity(c,name,level),old=spellCapacity(c,name,level-1);let skillCount=0;
 if(name==='Rogue'&&[1,6].includes(level))skillCount=2;
 if(name==='Bard'&&(modern?[2,9]:[3,10]).includes(level))skillCount=2;
 return {className:name,nextClassLevel:level,die:m.die,subclass:level>=subLevel&&!prev?.subclass,asi,boon:modern&&level===19,style:(name==='Fighter'&&level===1)||(['Paladin','Ranger'].includes(name)&&level===2),expertise:skillCount,spells:cap,maxSpell:cap.maxSpell,newCantrips:Math.max(0,cap.cantrips-old.cantrips),newSpells:name==='Wizard'?(level===1?6:2):Math.max(0,cap.prepared-old.prepared),notices:[...(name==='Warlock'?['Invocations, pact choices and Mystic Arcanum use the custom-feature checklist.']:[]),...(name==='Sorcerer'&&level>1?['Choose or review Metamagic in the custom-feature checklist when required.']:[]),...(modern&&['Barbarian','Fighter','Paladin','Ranger','Rogue'].includes(name)?['Weapon masteries are recorded in your features. Their tactical effects are resolved at the table.']:[]),'Subclass feature effects, conditional bonuses and nonstandard spell lists require review.']};
}
export function multiclassWarnings(c,name) {
 if(!isDnd(c.system)||c.classes.length===1&&c.classes[0].name===name)return [];
 const warnings=[];for(const n of new Set([c.classes[0]?.name,name])){const m=CLASSES[n];if(!m){warnings.push(`${n}: custom prerequisites require GM review.`);continue;}for(const group of m.requires||[]){if(!group.some(stat=>Number(c.stats[stat])>=13))warnings.push(`${n} requires ${group.join(' or ')} 13.`);}}
 return warnings;
}
export function newCharacter({id=uid(),gameId,playerId,system='dnd24',name='New character',className='Fighter',species='Human',background='',stats}={}) {
 const dnd=isDnd(system),m=CLASSES[className];
 const c={id,gameId,playerId,system,name:text(name,80),species:text(species),background:text(background),classes:dnd?[{name:className,level:1,subclass:''}]:[],level:1,archetype:dnd?'':className,stats:stats||Object.fromEntries(SYSTEMS[system].stats.map((s,i)=>[s,system==='swade'?4:system==='coc7'?50:[15,14,13,12,10,8][i]||10])),skills:{},saves:dnd?(m?.saves||[]):[],armor:'Unarmored',shield:false,speed:30,manualAC:10,manualHP:10,manualInitiative:0,hpRolls:dnd?[m?.die||8]:[],damage:0,tempHP:0,conditions:[],overrides:{},attacks:[],spells:[],features:[],feats:[],resourcesUsed:{},slotsUsed:{},pactUsed:0,notes:'',inventory:'',appearance:'',portrait:'',statPool:[],history:[],revision:0,createdAt:Date.now()};
 if(dnd){c.attacks=[{id:uid(),name:'Longsword',...WEAPONS.Longsword,proficient:true,bonus:0,damageBonus:0,addStatDamage:true,kind:'attack'}];}
 else c.attacks=[{id:uid(),name:system==='coc7'?'Firearms check':system==='swade'?'Fighting':'Basic attack',stat:'',bonus:0,damage:'1d6',damageBonus:0,addStatDamage:false,kind:'attack',sides:system==='swade'?6:20,threshold:50}];
 return c;
}
