const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"};
const json=(body,status=200)=>Response.json(body,{status,headers});
const sources=['threads','instagram','facebook','google','direct','other'];
function date(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;}
function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tbilisi',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function nextMonth(value){const d=new Date(value+'T12:00:00Z'),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+1);const end=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,end));return d.toISOString().slice(0,10);}
export function validate(data,minimum=today()){
 if(!data||typeof data!=='object'||Array.isArray(data))return null;
 const text=(key,max)=>typeof data[key]==='string'&&data[key].length<=max?data[key].trim():null;
 const id=text('id',36),property=text('property',40),rental=text('rental',10),checkin=text('checkin',10),checkout=text('checkout',10),contactType=text('contactType',10),contact=text('contact',100),budget=text('budget',100),duration=text('duration',100),wishes=text('wishes',2000);
 if(!id||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(id)||!['general','alliance','marina-club','orbi','orbi-c','orbi-d2'].includes(property)||!['daily','monthly','long'].includes(rental))return null;
 if(!date(checkin)||checkin<minimum||!Number.isSafeInteger(data.guests)||data.guests<1||data.guests>100)return null;
 if(property!=='general'&&(!date(checkout)||checkout<=checkin||(rental==='monthly'&&checkout<nextMonth(checkin))))return null;
 if(property!=='general'&&rental==='long'||property==='general'&&rental==='monthly')return null;
 if(contactType==='phone'){if(!contact||!/^\+?[\d\s().-]+$/.test(contact)||!/^\d{7,15}$/.test(contact.replace(/\D/g,'')))return null;}
 else if(contactType==='telegram'){if(!contact||!/^(?:(?:https?:\/\/)?t\.me\/|@)?[A-Za-z][A-Za-z0-9_]{4,31}$/.test(contact))return null;}
 else return null;
 if([budget,duration,wishes].includes(null)||typeof data.earlyCheckin!=='boolean'||typeof data.lateCheckout!=='boolean'||data.website)return null;
 return {id,source:sources.includes(data.source)?data.source:'other',property,rental,checkin,checkout:property==='general'?'':checkout,guests:data.guests,contactType,contact,budget,duration,wishes,earlyCheckin:data.earlyCheckin,lateCheckout:data.lateCheckout};
}
async function readLimited(request){
 const reader=request.body?.getReader();if(!reader)throw new Error('body');let size=0;const chunks=[];
 try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>12000){await reader.cancel();throw new Error('size');}chunks.push(value);}}finally{reader.releaseLock();}
 const all=new Uint8Array(size);let offset=0;for(const chunk of chunks){all.set(chunk,offset);offset+=chunk.length;}return JSON.parse(new TextDecoder().decode(all));
}

async function notifyTelegram(env,data){
 if(!env.TELEGRAM_BOT_TOKEN||!env.TELEGRAM_CHAT_ID)return false;
 const safe=v=>String(v||'').slice(0,300);
 const lines=['🏠 Новая заявка Batumi Home','ID: '+safe(data.id),'Источник: '+safe(data.source),'Объект: '+safe(data.property),'Аренда: '+safe(data.rental),'Заезд: '+safe(data.checkin),'Выезд: '+safe(data.checkout),'Гостей: '+safe(data.guests),'Контакт: '+safe(data.contactType)+' '+safe(data.contact)];
 const response=await fetch('https://api.telegram.org/bot'+env.TELEGRAM_BOT_TOKEN+'/sendMessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:env.TELEGRAM_CHAT_ID,text:lines.join('\n'),disable_web_page_preview:true,reply_markup:{inline_keyboard:[[{text:'🏠 Открыть Batumi House',url:'https://batumihouse.alexxstalkerxx.workers.dev/'}]]}}),signal:AbortSignal.timeout(8000)});
 if(!response.ok)throw Error('Telegram notification failed: HTTP '+response.status);
 return true;
}

function decodeJwtPart(part){
 const raw=part.replace(/-/g,'+').replace(/_/g,'/');
 return JSON.parse(atob(raw+'='.repeat((4-raw.length%4)%4)));
}
async function authorizedAdmin(request,env){
 const domain=(env.ACCESS_TEAM_DOMAIN||'').trim().replace(/^https?:\/\//,'').replace(/\/$/,'');
 const aud=(env.ACCESS_AUD||'').trim();
 if(!/^[a-z0-9-]+\.cloudflareaccess\.com$/i.test(domain)||!aud)return false;
 const token=request.headers.get('Cf-Access-Jwt-Assertion');
 if(!token)return false;
 try{
  const parts=token.split('.');
  if(parts.length!==3)return false;
  const header=decodeJwtPart(parts[0]),claims=decodeJwtPart(parts[1]);
  const now=Math.floor(Date.now()/1000);
  if(header.alg!=='RS256'||!header.kid||claims.iss!=='https://'+domain||!Array.isArray(claims.aud)||!claims.aud.includes(aud)||!Number.isFinite(claims.exp)||claims.exp<=now||!Number.isFinite(claims.nbf)||claims.nbf>now)return false;
  const response=await fetch('https://'+domain+'/cdn-cgi/access/certs');
  if(!response.ok)return false;
  const certs=await response.json(),jwk=certs.keys?.find(k=>k.kid===header.kid&&k.kty==='RSA');
  if(!jwk)return false;
  const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  const raw=parts[2].replace(/-/g,'+').replace(/_/g,'/');
  const bin=atob(raw+'='.repeat((4-raw.length%4)%4));
  const signature=Uint8Array.from(bin,c=>c.charCodeAt(0));
  return await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,signature,new TextEncoder().encode(parts[0]+'.'+parts[1]));
 }catch{return false;}
}
async function adminApi(request,env,url){
 if(!await authorizedAdmin(request,env))return json({error:'Access required'},403);
 if(request.method==='GET'&&url.pathname==='/api/admin/leads'){
  const status=url.searchParams.get('status')||'all';
  if(!['all','new','working','closed','lost'].includes(status))return json({error:'Invalid filter'},400);
  const limit=50;
  const rows=await (status==='all'
    ?env.LEADS.prepare('SELECT id,received_at,status,source,property,rental,checkin,checkout,guests,contact_type,contact,budget,duration,wishes FROM leads ORDER BY received_at DESC LIMIT ?').bind(limit)
    :env.LEADS.prepare('SELECT id,received_at,status,source,property,rental,checkin,checkout,guests,contact_type,contact,budget,duration,wishes FROM leads WHERE status=? ORDER BY received_at DESC LIMIT ?').bind(status,limit)).all();
  const summary=await env.LEADS.prepare("SELECT status,COUNT(*) AS count FROM leads GROUP BY status").all();
  const sources=await env.LEADS.prepare("SELECT source,COUNT(*) AS count FROM leads GROUP BY source").all();
  return json({leads:rows.results||[],statuses:summary.results||[],sources:sources.results||[],limit});
 }
 if(request.method==='PATCH'&&url.pathname==='/api/admin/leads/status'){
  if(request.headers.get('origin')!==url.origin||!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Forbidden'},403);
  let data;try{data=await readLimited(request);}catch{return json({error:'Bad request'},400);}
  if(!data||typeof data.id!=='string'||! /^[a-f0-9-]{36}$/.test(data.id)||!['new','working','closed','lost'].includes(data.status))return json({error:'Invalid status'},422);
  const result=await env.LEADS.prepare('UPDATE leads SET status=? WHERE id=?').bind(data.status,data.id).run();
  return json({ok:true,updated:result.meta?.changes||0});
 }
 return json({error:'Not found'},404);
}

export default {
 async fetch(request,env,ctx){
  const url=new URL(request.url);
  if(!url.pathname.startsWith('/api/'))return env.ASSETS.fetch(request);
  if(url.pathname.startsWith('/api/admin/'))return adminApi(request,env,url);
  // No public read/list/export route. Records are available only through the Cloudflare account.
  if(url.pathname!=='/api/leads')return json({error:'Not found'},404);
  if(request.method!=='POST')return json({error:'Method not allowed'},405);
  if(request.headers.get('origin')!==url.origin||!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Forbidden'},403);
  try{
   const limit=await env.LEAD_LIMITER.limit({key:request.headers.get('cf-connecting-ip')||'unknown'});
   if(!limit.success)return json({error:'Please try again in one minute'},429);
   let data;try{data=validate(await readLimited(request));}catch{return json({error:'Invalid request'},400);}
   if(!data)return json({error:'Check dates, guests and contact'},422);
   const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(data)));
   const fingerprint=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
   const inserted=await env.LEADS.prepare('INSERT INTO leads (id,source,property,rental,checkin,checkout,guests,contact_type,contact,budget,duration,wishes,early_checkin,late_checkout,fingerprint) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(data.id,data.source,data.property,data.rental,data.checkin,data.checkout,data.guests,data.contactType,data.contact,data.budget,data.duration,data.wishes,Number(data.earlyCheckin),Number(data.lateCheckout),fingerprint).run();
   const saved=await env.LEADS.prepare('SELECT fingerprint FROM leads WHERE id = ?').bind(data.id).first();
   if(saved?.fingerprint!==fingerprint)return json({error:'Request identifier conflict'},409);
   if(inserted.meta?.changes===1&&env.TELEGRAM_BOT_TOKEN&&env.TELEGRAM_CHAT_ID){ctx.waitUntil(notifyTelegram(env,data).catch(()=>console.error('Telegram notification failed')));}
   return json({ok:true,id:data.id},201);
  }catch{console.error('Lead submission unavailable');return json({error:'Temporarily unavailable'},503);}
 },
 async scheduled(event,env){await env.LEADS.prepare("DELETE FROM leads WHERE received_at < strftime('%Y-%m-%dT%H:%M:%fZ','now','-180 days')").run();}
};
