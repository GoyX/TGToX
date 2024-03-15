import config from "../config.js";
import fs from 'fs';
import path from 'path';
import puppeteer from "puppeteer";

const tweet = async (browser, text, media, photoId) => {
     const page = await browser.newPage();
     await page.goto(`https://twitter.com/compose/post`);
     await page.waitForNetworkIdle({ idleTime: 1500 });

     if(media == true) {
          await page.waitForSelector('input[type=file]');
          await page.waitForNetworkIdle({ idleTime: 1500 });

          const inputUploadHandle = await page.$('input[type=file]');

          let fileToUpload = `./imgs/output_${photoId}.jpg`

          await inputUploadHandle.uploadFile(fileToUpload);

          await page.waitForSelector('.DraftEditor-root')
          await page.keyboard.type(text, {delay: 10});

          await page.waitForNetworkIdle({ idleTime: 500 });
          await page.click('text/Post')
          await page.waitForNetworkIdle({ idleTime: 2500 });
          await page.close()
          fs.rmSync(fileToUpload)
     } else {
          await page.waitForSelector('.DraftEditor-root')
          await page.keyboard.type(text, {delay: 10}); 

          await page.click('text/Post')
          await page.waitForNetworkIdle({ idleTime: 750 });
          await page.close()
     }
     
}

export default tweet;