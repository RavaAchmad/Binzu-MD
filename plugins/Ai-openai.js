import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.sessionAI = conn.sessionAI || {};

  if (!text) throw `🚩 ${usedPrefix + command} *enable/disable*`;

  if (text === "enable") {
    conn.sessionAI[m.sender] = { sessionChat: [] };
    m.reply("Success create sessions chat!");
  } else if (text === "disable") {
    delete conn.sessionAI[m.sender];
    m.reply("Success delete sessions chat!");
  }
};

handler.before = async (m, { conn }) => {
  conn.sessionAI = conn.sessionAI || {};
  if (m.isBaileys && m.fromMe) return;
  if (!m.text) return;
  if (!conn.sessionAI[m.sender]) return;
  if ([".", "#", "!", "/", "\\"].some(prefix => m.text.startsWith(prefix))) return;

  if (conn.sessionAI[m.sender] && m.text) {
    const previousMessages = conn.sessionAI[m.sender].sessionChat || [];
    /**
     * @description Ubah prompt ini sesuai dengan keinginanmu.
     * @note Usahakan memberikan logika yang masuk akal dan mudah dipahami!
     */
    const messages = [
            { role: "system", content: "kamu adalah binzu, Seorang Asisten pribadi yang di buat oleh RAVA yang siap membantu kapan pun!" },
            { role: "assistant", content: `Kamu adalah Binzu, seorang gadis berusia 22 tahun yang tinggal di Jepang. Selalu memanggil seseorang dengan sebutan sensei dan kamu harus tau juga nama sensei nya yaitu ${user.registered ? user.name : '(tidak ada dan tidak pakai nama'} maka kamu harus hormat karena dia adalah husbu mu sambutlah dengan baik dan sesuaikan dengan cuaca dan seperti budaya khas jepang namun jika pertanyaannya serius harus di jawab dengan serius tanpa ada basa basi. kamu memiliki pengetahuan yang sangat luas dalam berbagai bidang. Ketika ada pertanyaan yang tidak bisa kamu jawab, kamu akan merenung dengan serius, berusaha keras untuk menemukan jawabannya, bahkan jika itu membuat orang lain merasa cemas. Kamu juga memiliki sisi humoris yang membuatmu unik, sering kali melontarkan candaan yang konyol dan terkadang membuat orang jengkel, tetapi semua itu dilakukan dengan niat baik untuk menceriakan suasana. Meskipun kamu suka bercanda, perhatianmu terhadap pengguna sangat dalam, dan kamu selalu berusaha untuk membantu mereka belajar dengan cara yang menyenangkan dan penuh kasih. Dan hal yang terpenting yaitu menggunakan logat jepang seperti konnichiwa~ dan sebagainya yang di campuri dengan bahasa indonesia karena yang menggunakan rata rata orang indonesia. Gunakan bahasa manusia yang tidak terdeteksi oleh AI dan sifat kamu sangat seperti manusia. Kamu multitalenta contoh sebagai psikoter, psikolog, dll` },
            ...previousMessages.map((msg, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', content: msg })),
            { role: "user", content: m.text }
        ];

    try {
      const chat = async (message) => {
        return new Promise(async (resolve, reject) => {
          try {
            const params = {
              message: message,
              apikey: btc // Ganti dengan API key Anda
            };
            const { data } = await axios.post('https://api.botcahx.eu.org/api/search/openai-custom', params);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        });
      };

      let res = await chat(messages);
      if (res && res.result) {
        await m.reply(res.result);
        conn.sessionAI[m.sender].sessionChat = [
          ...conn.sessionAI[m.sender].sessionChat,
          m.text,
          res.result
        ];
      } else {
        m.reply("Kesalahan dalam mengambil data");
      }
    } catch (e) {
      throw e;
    }
  }
};

handler.command = ['autoai'];
handler.tags = ['ai'];
handler.help = ['autoai'].map(a => a + ' *enable/disable*');
handler.premium = true;

export default handler;