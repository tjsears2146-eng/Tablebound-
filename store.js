import {uid,VERSION} from './rules.js';
import {demoState,mutate,visibleState} from './engine.js';
const PREFIX='tablebound-v1',STATE_KEY=PREFIX+'-demo',CONFIG_KEY=PREFIX+'-connection';
function readJSON(key,fallback=null,storage=localStorage){try{return JSON.parse(storage.getItem(key))??fallback;}catch{return fallback;}}
export function validateConfig(config){
 const url=String(config.supabaseUrl||'').trim().replace(/\/+$/,''),key=String(config.publishableKey||'').trim();
 if(!url&&!key)return {...config,supabaseUrl:'',publishableKey:''};
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)&&!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(url))throw Error('Use your Supabase project URL, for example https://your-project.supabase.co.');
 if(!key)throw Error('A publishable key is required.');
 if(key.startsWith('sb_secret_')||key.startsWith('sk-'))throw Error('That is a secret key. Do not put it in a browser or GitHub.');
 if(key.startsWith('eyJ')){try{const payload=JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));if(payload.role!=='anon')throw Error('Only a public anon/publishable key belongs here.');}catch(e){throw Error('Use a publishable key or a legacy anon key, never a service_role key.');}}
 else if(!key.startsWith('sb_publishable_'))throw Error('Use the project’s publishable key (sb_publishable_...).');
 return {...config,supabaseUrl:url,publishableKey:key,functionName:'table-api',pollMs:Math.max(2000,Number(config.pollMs)||2500)};
}
export function saveConfig(config){const value=validateConfig(config);localStorage.setItem(CONFIG_KEY,JSON.stringify(value));return value;}
export class Store {
 constructor(){
  this.config=validateConfig(readJSON(CONFIG_KEY,window.TABLEBOUND_CONFIG||{}));this.live=!!this.config.supabaseUrl;
  this.tabId=uid();this.actor='demo:'+this.tabId;this.version=VERSION;this.pending=null;this.offline=false;
  this.authKey=PREFIX+'-auth-'+(this.config.supabaseUrl||'demo');
  this.channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel(PREFIX):null;
  if(!this.live&&!localStorage.getItem(STATE_KEY))localStorage.setItem(STATE_KEY,JSON.stringify(demoState()));
 }
 async auth(){
  const work=async()=>{
   let session=readJSON(this.authKey);
   if(session?.access_token&&session.expires_at>Date.now()/1000+45)return session;
   const path=session?.refresh_token?'/token?grant_type=refresh_token':'/signup',body=session?.refresh_token?{refresh_token:session.refresh_token}:{data:{}};
   const response=await fetch(this.config.supabaseUrl+'/auth/v1'+path,{method:'POST',headers:{'Content-Type':'application/json',apikey:this.config.publishableKey},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
   const data=await response.json();if(!response.ok)throw Error(data.msg||data.message||data.error_description||'Anonymous sign-in failed. Enable Anonymous Sign-Ins in Supabase Authentication settings.');
   if(!data.access_token)throw Error('Supabase did not return an anonymous session. Check Authentication settings.');
   data.expires_at=data.expires_at||Math.floor(Date.now()/1000)+data.expires_in;localStorage.setItem(this.authKey,JSON.stringify(data));return data;
  };
  return navigator.locks?navigator.locks.request(PREFIX+'-auth-lock',work):work();
 }
 async request(action,payload={},commandId=uid()){
  if(!this.live){
   const execute=async()=>{let state=readJSON(STATE_KEY);if(!state||state.schema!==1)throw Error('Local demo data is invalid. Export it or reset the demo in Connection settings.');let result=mutate(state,this.actor,action,payload);localStorage.setItem(STATE_KEY,JSON.stringify(state));if(action!=='sync')this.channel?.postMessage({tab:this.tabId});return {state:visibleState(state,this.actor),result,mode:'demo'};};
   return navigator.locks?navigator.locks.request(PREFIX+'-state-lock',execute):execute();
  }
  const session=await this.auth();const url=`${this.config.supabaseUrl}/functions/v1/${this.config.functionName||'table-api'}`;
  let response;
  try{response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',apikey:this.config.publishableKey,Authorization:'Bearer '+session.access_token},body:JSON.stringify({action,payload,clientId:this.tabId,commandId,version:VERSION}),signal:AbortSignal.timeout(action==='portrait'?180000:30000)});}catch(error){this.offline=true;throw Error('Connection interrupted. Your screen may be out of date. A submitted action may have reached the server; refresh before retrying.');}
  let data;try{data=await response.json();}catch{throw Error('The server did not return valid data. Check that table-api is deployed.');}
  if(!response.ok){if(response.status===401){localStorage.removeItem(this.authKey);}throw Error(data.error||`Server error (${response.status}).`);}
  this.offline=false;return data;
 }
 async sync(){return this.request('sync',{});}
 resetDemo(){if(this.live)throw Error('Switch to local demo first.');localStorage.setItem(STATE_KEY,JSON.stringify(demoState()));this.channel?.postMessage({reset:true});}
 exportDemo(){return readJSON(STATE_KEY);}
 close(){this.channel?.close();}
}
