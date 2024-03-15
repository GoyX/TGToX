import { TelegramClient, Api } from 'telegram'
import { StringSession } from 'telegram/sessions/StringSession.js'
import input from 'input'
import {} from 'dotenv/config'

const apiId = Number(process.env.API_ID)
const apiHash = process.env.API_HASH
const stringSession = new StringSession(process.env.STRING_SESSION);

const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })

const authTelegram = async () => {
  try {
      client.setLogLevel("error")
      await client.start({
        phoneNumber: process.env.PHONE,
        password: async () => process.env.TG_PASSWORD,
        phoneCode: async () => await input.text('Code ?'),
        onError: (err) => console.log(err),
    });
    await client.sendMessage('me', { message: `Session String (TGTOX): \n ${client.session.save()}` });
    console.log("Authenticated.")
  } catch (error) {
    return error;
  }
}

export { authTelegram, client, Api }