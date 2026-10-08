import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {}),headless:true,args:['--no-sandbox']});
const base=(process.env.TEST_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/,'');const start=base+'/?look=1-125010-04-3-2-1';const key='vietphuc-remix:saved-looks';const errors=[];const results=[];
async function pageFor(context){const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.route('https://api.open-meteo.com/**',r=>r.abort());return p;}
async function color(p,hex){await p.getByRole('button',{name:'2. Màu Sắc',exact:true}).click();await p.getByRole('textbox',{name:'Mã màu Hex'}).fill(hex);await p.getByRole('textbox',{name:'Mã màu Hex'}).press('Enter');}
async function count(p,n){await p.waitForFunction(({key,n})=>JSON.parse(localStorage.getItem(key)||'[]').length===n,{key,n});}
try{
 const ctx=await browser.newContext({acceptDownloads:true});const a=await pageFor(ctx),b=await pageFor(ctx);await Promise.all([a.goto(start),b.goto(start)]);
 const request=ctx.request;
 for(const [path,status] of [['/api/missing',404],['/assets/missing.js',404],['/studio-remix',200]])assert.equal((await request.get(base+path)).status(),status);
 assert.match((await request.get(base+'/index.html')).headers()['cache-control'],/no-cache/);
 assert.equal((await request.post(base+'/api/ai-stylist',{data:'{broken',headers:{'Content-Type':'application/json'}})).status(),400);
 const large=await request.post(base+'/api/ai-stylist',{data:{query:'a'.repeat(17000)}});assert.equal(large.status(),413);assert.ok((await large.json()).error);
 assert.equal((await request.post(base+'/api/ai-stylist',{data:{query:{bad:true}}})).status(),400);
 results.push('API malformed/oversized/invalid type, asset 404, HTML cache policy');
 await color(b,'123456');await Promise.all([a.getByRole('button',{name:'Lưu look',exact:true}).click(),b.getByRole('button',{name:'Lưu look',exact:true}).click()]);await Promise.all([count(a,2),count(b,2)]);
 const looks=await a.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);assert.equal(new Set(looks.map(l=>l.id)).size,2);assert.ok(looks.some(l=>l.config.customColorHex==='#123456'));
 await a.getByRole('button',{name:'So sánh với look hiện tại',exact:true}).click();await a.getByRole('dialog').waitFor();await a.getByRole('dialog').getByText(/\(3\/3\)/).waitFor();
 await b.getByRole('button',{name:'Xóa',exact:true}).first().click();await count(a,1);await a.getByRole('dialog').getByText(/\(2\/3\)/).waitFor();
 for(let i=0;i<25;i++){await a.keyboard.press('Tab');assert.ok(await a.evaluate(()=>!!document.activeElement.closest('[role="dialog"]')));}
 await a.keyboard.press('Escape');await a.getByRole('dialog').waitFor({state:'hidden'});assert.equal(await a.evaluate(()=>document.activeElement.textContent),'So sánh với look hiện tại');
 results.push('Concurrent tabs retain both looks; deletion reconciles comparison; keyboard stays in dialog and restores focus');
 await b.getByRole('button',{name:'Đổi tên',exact:true}).click();const rename=b.locator('#tu-do input');await rename.fill('SHOULD NOT SAVE');await rename.press('Escape');assert.notEqual((await b.evaluate(key=>JSON.parse(localStorage.getItem(key))[0].name,key)),'SHOULD NOT SAVE');
 results.push('Escape cancels wardrobe rename');await ctx.close();
 // Exercise the IndexedDB mutex used on HTTP LAN origins where Web Locks are absent.
 const lan=await browser.newContext();await lan.addInitScript(()=>Object.defineProperty(navigator,'locks',{value:undefined,configurable:true}));
 const l1=await pageFor(lan),l2=await pageFor(lan);await Promise.all([l1.goto(start),l2.goto(start)]);await color(l2,'654321');
 await Promise.all([l1.getByRole('button',{name:'Lưu look',exact:true}).click(),l2.getByRole('button',{name:'Lưu look',exact:true}).click()]);
 await Promise.all([count(l1,2),count(l2,2)]);results.push('Concurrent saves remain safe without Web Locks (HTTP LAN fallback)');await lan.close();
 const denied=await browser.newContext();await denied.addInitScript(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='vietphuc-remix:saved-looks')throw new DOMException('Quota exceeded','QuotaExceededError');return original.call(this,k,v);};});
 const d=await pageFor(denied);await d.goto(start);await d.getByRole('button',{name:'Lưu look',exact:true}).click();await d.getByRole('alert').getByText(/Không lưu được Tủ đồ/).waitFor();assert.equal(await d.getByRole('button',{name:'Đã lưu',exact:true}).count(),0);await count(d,0);results.push('Quota denial reports failure and leaves wardrobe unchanged');await denied.close();
 const tieCtx=await browser.newContext({acceptDownloads:true});const t=await pageFor(tieCtx);await t.goto(start);await t.getByRole('button',{name:'Lưu look',exact:true}).click();await count(t,1);await t.getByRole('button',{name:'So sánh với look hiện tại',exact:true}).click();await t.getByRole('dialog').getByText(/đồng điểm/).waitFor();await t.keyboard.press('Escape');
 await t.evaluate(()=>{Object.defineProperty(navigator,'canShare',{value:()=>{throw new Error('Policy denied');},configurable:true});Object.defineProperty(navigator,'share',{value:async()=>{},configurable:true});});
 await t.getByRole('button',{name:'Xuất Lookbook',exact:true}).click();await t.waitForFunction(()=>document.querySelector('img[alt="Xem trước lookbook"]')?.naturalWidth===1080);
 const [png]=await Promise.all([t.waitForEvent('download'),t.getByRole('button',{name:'Chia sẻ lên Story / Mạng Xã Hội',exact:true}).click()]);const pngData=await fs.readFile(await png.path());assert.equal(pngData.readUInt32BE(16),1080);assert.equal(pngData.readUInt32BE(20),1920);
 const [jpg]=await Promise.all([t.waitForEvent('download'),t.getByRole('button',{name:'Tải ảnh JPG',exact:true}).click()]);const jpgData=await fs.readFile(await jpg.path());assert.equal(jpgData[0],255);assert.equal(jpgData[1],216);
 results.push('Tied comparison is honest; throwing canShare downloads PNG fallback; JPG export works');await tieCtx.close();
 const broken=await browser.newContext();const e=await pageFor(broken);await e.route('**/assets/LookbookCardModal-*.js',r=>r.abort());await e.goto(start);await e.getByRole('button',{name:'Xuất Lookbook',exact:true}).click();await e.getByRole('button',{name:'Tải lại trang',exact:true}).waitFor();results.push('Failed lazy chunk shows a recoverable message');await broken.close();
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:results,pageErrors:errors},null,2));
}finally{await browser.close();}
