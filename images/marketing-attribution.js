/* Batumi Home attribution: non-identifying marketing events only. */
(function(root){
  'use strict';
  var STORE='batumihouse_attribution_v1';
  var ALLOWED=['threads','instagram','facebook','google','direct','other'];
  function classify(query,referrer){
    var q=new URLSearchParams(query||'');
    var utm=(q.get('utm_source')||'').toLowerCase().trim();
    var src=(q.get('source')||'').toLowerCase().trim();
    var raw=utm||src;
    if(ALLOWED.includes(raw))return raw;
    if(raw)return 'other';
    var host='';
    try{host=new URL(referrer).hostname.toLowerCase();}catch(e){}
    if(host==='threads.net'||host==='threads.com'||host.endsWith('.threads.net')||host.endsWith('.threads.com'))return 'threads';
    if(host==='instagram.com'||host.endsWith('.instagram.com'))return 'instagram';
    if(host==='facebook.com'||host.endsWith('.facebook.com')||host==='fb.com')return 'facebook';
    if(host==='google.com'||host.endsWith('.google.com'))return 'google';
    return host?'other':'direct';
  }
  function safeStorage(){
    try{return root.sessionStorage;}catch(e){return null;}
  }
  function getSource(){
    var storage=safeStorage(),saved='';
    try{saved=storage&&storage.getItem(STORE)||'';}catch(e){}
    var query=root.location?root.location.search:'';
    var ref=root.document?root.document.referrer:'';
    var q=new URLSearchParams(query||'');
    var externalRef=false;try{externalRef=!!ref&&new URL(ref).origin!==(root.location&&root.location.origin);}catch(e){}
    var fresh=q.has('utm_source')||q.has('source')||externalRef;
    var selected=fresh?classify(query,ref):ALLOWED.includes(saved)?saved:classify(query,ref);
    if(storage){try{storage.setItem(STORE,selected);}catch(e){}}
    return selected;
  }
  function label(source){
    return ALLOWED.includes(source)?source:'other';
  }
  function track(name,extra){
    if(!['lead_form_ready','booking_form_ready','telegram_handoff'].includes(name))return;
    var detail={event:name,source:getSource(),page:(root.location&&root.location.pathname||'/').slice(0,100)};
    if(extra&&['daily','monthly','long'].includes(extra.rental))detail.rental=extra.rental;
    if(extra&&typeof extra.property==='string'&&/^[a-z0-9-]{1,40}$/.test(extra.property))detail.property=extra.property;
    try{if(root.CustomEvent&&root.dispatchEvent)root.dispatchEvent(new root.CustomEvent('batumihouse:marketing',{detail:detail}));}catch(e){}
    if(Array.isArray(root.dataLayer))root.dataLayer.push(detail);
  }
  var api={classify:classify,getSource:getSource,label:label,track:track};
  root.BatumiAttribution=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
