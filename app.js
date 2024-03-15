import puppeteer from "puppeteer";
import authTwitter from "./twitter/auth.js";
import { authTelegram } from './telegram/auth.js'
import { client, Api } from './telegram/auth.js'
import {} from 'dotenv/config'
import fs from 'fs'
import config from "./config.js";
import tweet from "./twitter/tweet.js";
const browser = await puppeteer.launch({
     headless: true,
     executablePath: "./chrome/win64-122.0.6261.128/chrome-win64/chrome.exe",
     userDataDir: './userDate',
});

async function run() {
     authTwitter(browser, config.email, config.username_handle, config.password)
    await authTelegram()
async function listenChannel(channelId) { 
    client.addEventHandler(async (event) => {
        if(event.className == 'UpdateNewChannelMessage' && event.message.peerId.channelId.value == channelId) {
             
             if(event.message.media !== null) {
                  console.log(event.message)
                       const buffer = await client.downloadFile(
                            new Api.InputPhotoFileLocation({
                                id: event.message.media.photo.id,
                                accessHash: event.message.media.photo.accessHash,
                                fileReference: event.message.media.photo.fileReference,
                                thumbSize: "y"
                            }),
                            {
                                dcId: event.message.media.photo.dcId,
                            }
                        );
        
                       fs.writeFileSync(`./imgs/output_${event.message.media.photo.id}.jpg`, buffer, (error) => {
                            client.sendMessage("me", { message: error });
                       });
                       console.log(event.message.message)
                       await tweet(browser, event.message.message, true, event.message.media.photo.id)
                       
                 
             } else {
                  console.log(event.message.message)
                  await tweet(browser, event.message.message, false)
                  return event.message.message;
             }
        }
   });
}
    await listenChannel(1844702414n)
}

run()