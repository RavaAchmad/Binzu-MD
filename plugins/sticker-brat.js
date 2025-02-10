import { Sticker } from 'wa-sticker-formatter';
    import fs from 'fs';
    import { execSync } from 'child_process';
    import axios from 'axios';
import fetch from 'node-fetch';
import path from 'path';
import { error } from 'console';
const API_URL = "https://fgsi-brat.hf.space/";
var handler = async (m, { args, text, usedPrefix, command }) => {
    text = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.quoted && m.quoted.caption ? m.quoted.caption : m.quoted && m.quoted.description ? m.quoted.description : '';
    if (!text) throw `Example : ${usedPrefix + command} Lagi Ruwet`;

    if (text.endsWith('--gif')) {
        if (text.length > 40) return m.reply(`Karakter terbatas, max 40 huruf character!`);
        const word = text.slice(0, -5);
        const words = word.split(" ");
        const worrd = words.join(" ");
        await generateBrat(encodeURIComponent(worrd), true, true);
        const kntl = fs.readFileSync('brat_output.mp4');
        stiker = await mp4ToWebp(kntl, { pack: stickpack, author: stickauth });
        m.reply(stiker)
    } else {
        const apis1 = `https://vapis.my.id/api/bratv1?q=${encodeURIComponent(text)}`;
        let stiker = await createSticker(apis1, 100, stickpack, stickauth);
        conn.sendFile(m.chat, stiker, 'icikiwir.webp', '', m, false);
    }
}
    
    handler.command = handler.help = ['brat']
    handler.tags = ['sticker']
    handler.limit = 1
    export default handler

    async function createSticker(res, quality) {
        let stickerMetadata = {
            type: 'full',
            pack: stickpack,
            author: stickauth,
            quality
        }
    return (new Sticker(res ? res: error, stickerMetadata)).toBuffer()
    }
 async function mp4ToWebp(file, stickerMetadata) {
    if (stickerMetadata) {
        if (!stickerMetadata.pack) stickerMetadata.pack = stickpack
        if (!stickerMetadata.author) stickerMetadata.author = stickauth
        if (!stickerMetadata.crop) stickerMetadata.crop = false
    } else if (!stickerMetadata) {
        stickerMetadata = { pack: stickpack, author: stickauth, crop: false }
    }
    let getBase64 = file.toString('base64')
    const Format = {
        file: `data:video/mp4;base64,${getBase64}`,
        processOptions: {
            crop: stickerMetadata?.crop,
            startTime: '00:00:00.0',
            endTime: '00:00:10.0',
            loop: 0
        },
        stickerMetadata: {
            ...stickerMetadata
        },
        sessionInfo: {
            WA_VERSION: '2.2106.5',
            PAGE_UA: 'WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
            WA_AUTOMATE_VERSION: '3.6.10 UPDATE AVAILABLE: 3.6.11',
            BROWSER_VERSION: 'HeadlessChrome/88.0.4324.190',
            OS: 'Windows Server 2016',
            START_TS: 1614310326309,
            NUM: '6247',
            LAUNCH_TIME_MS: 7934,
            PHONE_VERSION: '2.20.205.16'
        },
        config: {
            sessionId: 'session',
            headless: true,
            qrTimeout: 20,
            authTimeout: 0,
            cacheEnabled: false,
            useChrome: true,
            killProcessOnBrowserClose: true,
            throwErrorOnTosBlock: false,
            chromiumArgs: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--aggressive-cache-discard',
                '--disable-cache',
                '--disable-application-cache',
                '--disable-offline-load-stale-cache',
                '--disk-cache-size=0'
            ],
            executablePath: 'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
            skipBrokenMethodsCheck: true,
            stickerServerEndpoint: true
         }
    }
    let response = await fetch('https://sticker-api.openwa.dev/convertMp4BufferToWebpDataUrl', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, /',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(Format)
    });
    let responseText = await response.text();
    let parts = responseText.split(';base64,');
    if (!parts[1]) {
        throw error
    }
    return Buffer.from(parts[1], 'base64');
 }

 async function generateBrat(text, isBlur = false, isVideo = false) {
    try {
      const params = new URLSearchParams();
      params.append("text", text);
      if (isBlur) params.append("modeBlur", "true");
      if (isVideo) params.append("isVideo", "true");
  
      const response = await axios.get(API_URL, {
        params,
        responseType: "arraybuffer",
      });
  
      const fileType = isVideo ? "mp4" : "png";
      const fileName = `brat_output.${fileType}`;
  
      fs.writeFileSync(fileName, response.data);
      console.log(`✅ File berhasil disimpan: ${fileName}`);
  
      setTimeout(() => {
        fs.unlink(fileName, (err) => {
          if (err) {
            console.error(`❌ Gagal menghapus file: ${fileName}`, err);
          } else {
            console.log(`🗑️ File berhasil dihapus: ${fileName}`);
          }
        });
      }, 300000); // 300000 milidetik = 5 menit
    } catch (error) {
      console.error("❌ Error:", error.response ? error.response.data : error.message);
    }
  }