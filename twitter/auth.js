import config from "../config.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const authTwitter = async (browser, user_email, user_handle, password) => {

     let logged = config.logged;

     if(logged == false) {
          const page = await browser.newPage();
          await page.goto("https://twitter.com/i/flow/login");
          await page.waitForNetworkIdle({ idleTime: 1500 });
          

          await page.waitForSelector("[autocomplete=username]");
          await page.type("input[autocomplete=username]", user_email, { delay: 50 });
          
          await page.evaluate(() =>
          document.querySelectorAll('div[role="button"]')[2].click()
          );
          await page.waitForNetworkIdle({ idleTime: 1500 });
          
          const extractedText = await page.$eval("*", (el) => el.innerText);
          if (extractedText.includes("Enter your phone number or username")) {
          await page.waitForSelector("[autocomplete=on]");
          await page.type("input[autocomplete=on]", user_handle, { delay: 50 });
          await page.evaluate(() =>
               document.querySelectorAll('div[role="button"]')[1].click()
          );
          await page.waitForNetworkIdle({ idleTime: 1500 });
          }
          
          await page.waitForSelector('[autocomplete="current-password"]');
          await page.type('[autocomplete="current-password"]', password, { delay: 50 });
          
          await page.evaluate(() =>
          document.querySelectorAll('div[role="button"]')[2].click()
          );
          await page.waitForNetworkIdle({ idleTime: 2000 });
          
          const configPath = path.join(__dirname, "../config.js");
          console.log(configPath)
          fs.readFile(configPath, 'utf8', (err, data) => {
               if (err) {
                   console.error('Error reading file:', err);
                   return;
               }
          
          const updatedData = data.replace(/logged:\s*false/, 'logged: true');
     
          fs.writeFile(configPath, updatedData, 'utf8', (writeErr) => {
                    if (writeErr) {
                    console.error('Error writing file:', writeErr);
                    return;
                    }
                    console.log('Value updated successfully.');
               });
          });
     }
}

export default authTwitter;