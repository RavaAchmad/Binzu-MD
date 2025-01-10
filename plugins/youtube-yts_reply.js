
import { ytdls, ddownr } from '../lib/scrape.js';
const threshold = 0.72
export async function before(m) {
    let id = 'yts-' + m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/Ketik.*hytss/i.test(m.quoted.text) || /.*hytss/i.test(m.text))
        return !0
    this.ytss = this.ytss ? this.ytss : {}
    if (!(id in this.ytss))
        return m.reply('Soal itu telah berakhir')
    if (m.quoted.id == this.ytss[id][0].id) {
        if (m.text.toLowerCase() == "mp3") {
          m.reply("tunggu!")
          const yt = await ytdls(hasil.url)
          //mulai
          try{
            const aurio = yt.result.audio.downloadLink
			  await conn.sendMessage(m.chat, {         
					audio: {
						url: aurio
					},
					mimetype: 'audio/mpeg',
					contextInfo: {
						externalAdReply: {
							title: "Silahkan audionya kak",
							body: "▶︎ Now Playing...",
							thumbnailUrl: global.maximus,
							sourceUrl: args[0],
							mediaType: 1,
							showAdAttribution: true,
							renderLargerThumbnail: true
						}
					}
				}, {
					quoted: m
				});
			
	  } catch (e) {
		console.log(e);
		  m.reply('Yahhh sinyalnya error, bentar ya pake jalur alternatif dulu~ ૮ ˶ᵔ ᵕ ᵔ˶ ა');
		  let api = await ddownr.download(args[0], "mp3");
		await conn.sendMessage(m.chat, { audio: { url: api.downloadUrl }, mimetype: 'audio/mpeg' }, { quoted: m });
	  }
    //batas
            clearTimeout(this.ytss[id][3])
            delete this.ytss[id]
        } else throw "error kang"
    }
    return !0
}
export const exp = 0