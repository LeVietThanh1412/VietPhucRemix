import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
const out = 'artifacts/demo-video';
await fs.mkdir(`${out}/raw`,{recursive:true});
const browser = await chromium.launch({executablePath:'/opt/google/chrome/chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const context = await browser.newContext({viewport:{width:1440,height:810},recordVideo:{dir:`${out}/raw`,size:{width:1440,height:810}},acceptDownloads:true});
await context.addInitScript(()=>localStorage.setItem('vietphuc-remix:quiz-seen','1'));
const page = await context.newPage();
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle'});
await page.evaluate(()=>document.fonts.ready);
await page.evaluate(()=>{
  const style=document.createElement('style');style.textContent='html{scroll-behavior:smooth} #demo-pointer{position:fixed;z-index:999999;pointer-events:none;width:22px;height:22px;border:3px solid #b45309;background:#fffbeb88;border-radius:50%;box-shadow:0 0 0 5px #f59e0b22;transform:translate(-50%,-50%);left:-50px;top:-50px;transition:background .15s;}';document.head.append(style);
  const cursor=document.createElement('div');cursor.id='demo-pointer';document.body.append(cursor);
  document.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
  document.addEventListener('mousedown',()=>cursor.style.background='#b45309');document.addEventListener('mouseup',()=>cursor.style.background='#fffbeb88');
});
const timeline=[];const clock=()=>Date.now()/1000;
let start=clock();
const pause=ms=>page.waitForTimeout(ms);
async function click(loc){await loc.scrollIntoViewIfNeeded();await pause(400);const box=await loc.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2,{steps:14});await pause(450);await loc.click();await pause(800);}
async function section(id){await page.evaluate(id=>{const el=document.getElementById(id);window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-80,behavior:'smooth'})},id);await pause(1100);}
async function scene(id,fn){const begin=clock()-start;console.log('SCENE',id);await fn();await pause(2000);await page.screenshot({path:`${out}/${id}.png`});timeline.push({id,start:begin,end:clock()-start});await fs.writeFile(`${out}/timeline.json`,JSON.stringify(timeline,null,2));}
try {
  await scene('home',async()=>{await pause(1200)});
  await scene('quiz',async()=>{
    await click(page.getByRole('button',{name:'Quiz phong cách',exact:true}));
    await pause(700);await click(page.getByRole('dialog').getByRole('button',{name:/Lễ Tốt Nghiệp/}));
    await click(page.getByRole('dialog').getByRole('button',{name:/Không quan trọng/}));
    await click(page.getByRole('dialog').getByRole('button',{name:/Truyền thống chuẩn mực/}));await pause(1700);
  });
  await click(page.getByRole('button',{name:'Mặc thử look này',exact:true}).first());
  await scene('studio',async()=>{
    await section('studio-remix');await pause(1000);
    await click(page.getByRole('button',{name:'2. Màu Sắc',exact:true}));
    await click(page.getByRole('button',{name:/Tím Cố Đô/}).first());
    await pause(1000);await click(page.getByRole('button',{name:/Hồng Cánh Sen/}).first());
    await pause(1000);
  });
  await click(page.getByRole('button',{name:'Lưu look',exact:true}));
  await scene('remix',async()=>{
    await section('studio-remix');
    await click(page.getByText('Streetwear Dạo Phố',{exact:true}));
    await click(page.getByRole('button',{name:'1-Chạm Phối Chuẩn Dịp',exact:true}));
    await click(page.getByRole('button',{name:'6. Giày Dép',exact:true}));
    await click(page.getByText('Chunky Sneaker Trắng Tối Giản',{exact:true}));
    await click(page.getByRole('button',{name:'7. Phụ Kiện',exact:true}));
    await pause(500);await section('studio-remix');
  });
  await click(page.getByRole('button',{name:'Lưu look',exact:true}));
  await scene('heritage',async()=>{
    await section('cultural-checker');
    await click(page.getByRole('button',{name:/^Nguồn gốc/}));await pause(1700);
    await click(page.getByRole('button',{name:'Ý nghĩa chi tiết',exact:true}));await pause(1200);
    await click(page.getByRole('button',{name:'Nguồn & Kiểm chứng',exact:true}));await pause(1700);
  });
  await section('studio-remix');
  await click(page.getByText('Tất cả dịp',{exact:true}));
  await click(page.getByRole('button',{name:'1. Loại Áo',exact:true}));
  await click(page.getByRole('button').filter({has:page.getByRole('heading',{name:'Áo Nhật Bình',exact:true})}));
  await click(page.getByRole('button',{name:'4. Hạ Y',exact:true}));
  await click(page.getByText('Quần Denim Ống Suông Streetwear',{exact:true}));
  await scene('warning',async()=>{
    await section('cultural-checker');await click(page.getByRole('button',{name:'Cảnh báo & Đánh giá',exact:true}));await pause(3000);
  });
  await section('studio-remix');await click(page.getByText('Streetwear Dạo Phố',{exact:true}));await click(page.getByRole('button',{name:'1-Chạm Phối Chuẩn Dịp',exact:true}));
  await scene('weather',async()=>{
    await section('harmony-engine');await pause(1700);
    await click(page.getByRole('button',{name:/Thu Dịu Mát/}));await pause(1300);
  });
  let aiResult;
  await scene('ai',async()=>{
    await section('ai-stylist');
    const field=page.getByPlaceholder(/Hỏi(?: AI)? về/);
    await field.pressSequentially('Nhận xét bản phối này cho dịp dạo phố và gợi ý một điều chỉnh phù hợp.',{delay:26});
    await click(page.getByRole('button',{name:'Tư vấn',exact:true}));
    await page.getByText('Lời khuyên từ Stylist Di Sản:',{exact:true}).waitFor({timeout:32000});
    await section('ai-stylist');await pause(2000);
    aiResult=await page.locator('#ai-stylist').innerText();
    await fs.writeFile(`${out}/ai-response.txt`,aiResult);
  });
  await scene('compare',async()=>{
    await section('tu-do');await pause(1000);
    await click(page.getByRole('button',{name:'So sánh với look hiện tại',exact:true}));await pause(2200);
  });
  await page.keyboard.press('Escape');
  await scene('lookbook',async()=>{
    await click(page.getByRole('button',{name:'Xuất Lookbook',exact:true}));
    await page.locator('img[alt="Xem trước lookbook"]').waitFor();
    await page.waitForFunction(()=>document.querySelector('img[alt="Xem trước lookbook"]')?.naturalWidth===1080);
    await page.getByRole('dialog').getByRole('textbox').fill('Việt phục dạo phố');await pause(1800);
    const downloadPromise=page.waitForEvent('download');await click(page.getByRole('button',{name:'Tải ảnh PNG',exact:true}));
    const download=await downloadPromise;await download.saveAs(`${out}/lookbook-demo.png`);await pause(1300);
  });
  await page.keyboard.press('Escape');
  await scene('ending',async()=>{await section('studio-remix');await pause(1200)});
  await fs.writeFile(`${out}/record-report.json`,JSON.stringify({errors,aiOnline:aiResult.includes('Gemini AI'),timeline},null,2));
} finally {
  await context.close();const raw=await page.video().path();await fs.writeFile(`${out}/raw-video-path.txt`,raw);await browser.close();
}
