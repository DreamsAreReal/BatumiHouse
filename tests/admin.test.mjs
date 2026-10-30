import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.mjs';
const env={ASSETS:{fetch:async()=>new Response('public ok')},LEADS:{prepare(){throw Error('Database must not be accessed for unauthorized user')}}};
test('public static assets are unchanged',async()=>{const r=await worker.fetch(new Request('https://example.com/'),env,{});assert.equal(r.status,200);assert.equal(await r.text(),'public ok')});
test('admin listing fails closed with no Access configuration',async()=>{const r=await worker.fetch(new Request('https://example.com/api/admin/leads'),env,{});assert.equal(r.status,403)});
test('admin status mutation fails closed with no Access configuration',async()=>{const r=await worker.fetch(new Request('https://example.com/api/admin/leads/status',{method:'PATCH',headers:{'origin':'https://example.com','content-type':'application/json'},body:JSON.stringify({id:'123',status:'closed'})}),env,{});assert.equal(r.status,403)});
test('forged Access header does not grant access',async()=>{const r=await worker.fetch(new Request('https://example.com/api/admin/leads',{headers:{'Cf-Access-Jwt-Assertion':'fake.fake.fake'}}),{...env,ACCESS_TEAM_DOMAIN:'example.cloudflareaccess.com',ACCESS_AUD:'test'},{});assert.equal(r.status,403)});
