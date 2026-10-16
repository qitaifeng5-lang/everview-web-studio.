const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const res=await page.goto('http://127.0.0.1:8000');assert.equal(res.status(),200);
for(const size of [{width:1440,height:1000},{width:768,height:1024},{width:390,height:844},{width:320,height:740}]){
await page.setViewportSize(size);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${size.width}`);
if(size.width===390)await page.screenshot({path:'/tmp/markham-mobile.png',fullPage:true});
if(size.width===1440)await page.screenshot({path:'/tmp/markham-desktop.png',fullPage:true});
}
const anchors=await page.locator('a[href^="#"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')));for(const href of anchors)assert(await page.locator(href).count(),href);
await page.setViewportSize({width:390,height:844});await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.locator('#navigation a[href="#services"]').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
for(const name of ['Starter','Business','Premium']){await page.locator(`[data-package="${name}"]`).click();assert.equal(await page.locator('#package').inputValue(),name);}
for(const key of ['homedeer','cut']){await page.locator(`[data-project="${key}"]`).click();assert(await page.locator('dialog').isVisible());await page.keyboard.press('Escape');assert(!(await page.locator('dialog').isVisible()));await page.locator(`[data-project="${key}"]`).click();await page.locator('.dialog-done').click();assert(!(await page.locator('dialog').isVisible()));}
assert(await page.locator('#submit-button').isDisabled());let posts=0;page.on('request',r=>{if(r.method()==='POST')posts++});await page.locator('form').evaluate(f=>f.dispatchEvent(new Event('submit',{cancelable:true})));assert.equal(posts,0);assert.match(await page.locator('#form-status').innerText(),/not connected/);
for(const asset of ['styles.css','script.js','assets/favicon.svg']){const r=await page.request.get(`http://127.0.0.1:8000/${asset}`);assert.equal(r.status(),200);}
// Exercise configured form behavior using intercepted responses; this is not real delivery.
const fs=require('node:fs');let configured=fs.readFileSync(require('node:path').join(__dirname, '../script.js'),'utf8').replace("formspreeEndpoint: ''","formspreeEndpoint: 'https://formspree.io/f/testform'");
await page.route('**/script.js',route=>route.fulfill({contentType:'application/javascript',body:configured}));await page.reload();
assert(!(await page.locator('#submit-button').isDisabled()));await page.locator('[name=name]').fill('Test');await page.locator('[name=email]').fill('test@example.com');await page.locator('[name=message]').fill('Test enquiry for validation.');
await page.route('https://formspree.io/f/testform',route=>route.fulfill({status:500,contentType:'application/json',body:'{}'}));await page.locator('#submit-button').click();await page.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('could not'));assert.equal(await page.locator('[name=message]').inputValue(),'Test enquiry for validation.');
await page.unroute('https://formspree.io/f/testform');await page.route('https://formspree.io/f/testform',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));await page.locator('#submit-button').click();await page.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('has been sent'));assert.equal(await page.locator('[name=message]').inputValue(),'');
assert.deepEqual(errors,[]);console.log('PASS: 4 viewport sizes, internal anchors, mobile menu, 3 pricing buttons, 2 demo dialogs, unconnected form blocks POST, 3 assets, mocked form success/error. No browser errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
