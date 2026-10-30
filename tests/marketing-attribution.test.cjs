const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');const code=fs.readFileSync(require('node:path').join(__dirname,'..','images','marketing-attribution.js'),'utf8');
function setup(query='',referrer=''){const data={};const events=[];const ctx={URL,URLSearchParams,location:{search:query,pathname:'/daily-booking'},document:{referrer},sessionStorage:{getItem:k=>data[k]||null,setItem:(k,v)=>{data[k]=v;}},CustomEvent:class{constructor(n,o){this.type=n;this.detail=o.detail;}},dispatchEvent:e=>events.push(e),dataLayer:[]};ctx.window=ctx;vm.runInNewContext(code,ctx);return{api:ctx.BatumiAttribution,ctx,data,events};}
assert.equal(setup('?utm_source=threads').api.getSource(),'threads');
assert.equal(setup('','https://www.threads.com/@example').api.getSource(),'threads');
assert.equal(setup('?utm_source=untrusted').api.getSource(),'other');
const s=setup('?utm_source=threads');assert.equal(s.api.getSource(),'threads');s.ctx.location.search='';assert.equal(s.api.getSource(),'threads');
const p=setup('?utm_source=threads');p.api.track('telegram_handoff',{property:'alliance',rental:'monthly',contact:'secret'});assert.equal(p.events.length,1);assert.equal(p.events[0].detail.source,'threads');assert.equal('contact' in p.events[0].detail,false);assert.equal(p.ctx.dataLayer.length,1);
p.api.track('invalid',{contact:'secret'});assert.equal(p.events.length,1);
console.log('Marketing attribution tests passed (6 cases)');
