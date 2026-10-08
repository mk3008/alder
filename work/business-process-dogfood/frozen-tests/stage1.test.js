import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Client } from 'pg';
import { createApplication } from '../src/app.js';
const connectionString = process.env.DATABASE_URL ?? 'postgres://dogfood:dogfood@localhost:55432/dogfood';
async function app() { const c=new Client({connectionString}); await c.connect(); await c.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;'); await c.query(await readFile(new URL('../../../../../../docs/business-process-dogfood/ddl.sql', import.meta.url),'utf8')); return [createApplication({connectionString}),c]; }
test('Stage 1 saves and searches an expiring quotation with lines', async () => { const [a,c]=await app(); const q=await a.createQuotation({customerId:'c1',expiresAt:'2030-01-01T00:00:00Z',lines:[{productId:'p1',quantity:2,unitPrice:50}]}); assert.ok(q.quotationId); assert.equal((await a.searchQuotations({customerId:'c1'}))[0].quotationId,q.quotationId); await c.end(); });
