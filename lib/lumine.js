const axios = require('axios');

export async function fetchUserAgents(limit) {
    const URLs = 'https://user-agents.net/random';
  try {
    const response = await axios.get(URLs);
    const $ = cheerio.load(response.data);

    const userAgents = [];
    $('ol > li > a').each((_, el) => {
      userAgents.push($(el).text());
    });

    const randomUserAgents = [];
    for (let i = 0; i < limit; i++) {
      const randomIndex = Math.floor(Math.random() * userAgents.length);
      randomUserAgents.push(userAgents[randomIndex]);
    }

    return randomUserAgents;
  } catch (error) {
    console.error('Error fetching user-agents:', error.message);
    return [];
  }
};

const agents = await fetchUserAgents(1)

const api = axios.create({
    baseURL: 'https://luminai.my.id',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': agents,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept-Encoding': 'gzip, deflate, br'
    }
});

/**
 * Mengirimkan permintaan untuk membuat gambar berdasarkan konten yang diberikan.
 * @param {string} content - Konten yang akan digunakan untuk membuat gambar.
 * @returns {Promise<string>} URL gambar yang dihasilkan.
 */
async function imageCreator(content) {
    return new Promise(async (resolve, reject) => {
        const payload = {
            content,
            cName: 'ImageGenerationLV45LJp',
            cID: 'ImageGenerationLV45LJp'
        };

        try {
            const response = await api.post('/', payload);
            const urlRegex = /https:\/\/storage\.googleapis\.com\/[^\s")]+/;
            const imageUrlMatch = urlRegex.exec(JSON.stringify(response.data.result));
            resolve(imageUrlMatch[0]);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan permintaan ke model dengan konten dan model yang ditentukan.
 * @param {string} content - Konten yang akan digunakan sebagai input untuk model.
 * @param {string} model - Nama model yang akan digunakan. 
 *        Model yang diperbolehkan:
 *        - 'gpt-4o'
 *        - 'gemini-pro'
 *        - 'claude-sonnet-3.5'
 *        - 'blackboxai-pro'
 *        - 'blackboxai'
 * @returns {Promise<any>} Hasil dari model Ai.
 */
async function requestModel(content, model) {
    return new Promise(async (resolve, reject) => {
        const payload = {
            content,
            model
        };

        try {
            const response = await api.post('/', payload);
            resolve(response.data.result);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan permintaan ke agen dengan konten, cID, dan cName yang ditentukan.
 * @param {string} content - Konten yang akan digunakan dalam permintaan.
 * @param {string} cID - ID dari agen yang dapat dilihat di https://cai.my.id.
 * @param {string} cName - Nama agen yang dapat dilihat di https://cai.my.id.
 * @returns {Promise<any>} Hasil dari agen.
 */
async function requestAgent(content, cID, cName) {
    return new Promise(async (resolve, reject) => {
        const payload = {
            content,
            cID,
            cName
        };

        try {
            const response = await api.post('/', payload);
            resolve(response.data.result);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan permintaan dengan konten dan file (gambar, teks, skrip, dll) 
 * yang dapat berupa buffer atau link.
 * @param {string} content - Konten yang akan digunakan dalam permintaan.
 * @param {(Buffer|string)} imageBuffer - Buffer file atau link file yang akan dikirimkan.
 *        Dapat mendukung berbagai MIME type untuk file seperti:
 *        - Gambar (jpg, png, dll)
 *        - File teks (.txt)
 *        - File skrip (.js, .py, dll)
 *        - Jenis file lainnya
 * @returns {Promise<any>} Hasil dari permintaan.
 */
async function requestAndFile(content, imageBuffer) {
    return new Promise(async (resolve, reject) => {
        const payload = {
            content,
            imageBuffer
        };

        try {
            const response = await api.post('/', payload);
            resolve(response.data.result);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

async function requestSesion(content, user) {
    return new Promise(async (resolve, reject) => {
        const payload = {
            content,
            user
        };

        try {
            const response = await api.post('/', payload);
            resolve(response.data.result);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan permintaan dengan konten dan sesi chat berdasarkan identitas pengguna.
 * Sesi ini akan direset setelah 10 menit tidak aktif dan menggunakan `user` sebagai identifikasi sesi.
 * @param {string} content - Konten yang akan digunakan dalam permintaan sesi chat.
 * @param {string} user - Identifikasi unik untuk sesi chat. 
 *        Ini bisa berupa `chat id` untuk bot seperti WhatsApp atau Telegram. 
 *        Jangan mengganti `user` jika ingin sesi chat tetap aktif. 
 *        Sesi akan reset jika tidak ada aktivitas selama 10 menit.
 * @returns {Promise<any>} Hasil dari permintaan sesi chat.
 */
async function requestSesion(content, user) {
    return new Promise(async (resolve, reject) => {
        const payload = {
            content,
            user
        };

        try {
            const response = await api.post('/', payload);
            resolve(response.data.result);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan permintaan ke Luminai dengan konten yang diberikan.
 * @param {string} content - Konten yang akan digunakan dalam permintaan ke Luminai.
 * @returns {Promise<any>} Hasil dari permintaan Luminai.
 */
async function requestLuminai(content) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.post('/', { content });
            resolve(response.data.result);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan permintaan dengan konten dan sistem prompt untuk karakter AI.
 * @param {string} content - Konten utama yang akan digunakan dalam permintaan.
 * @param {string} prompt - Prompt sistem yang menentukan karakter atau perilaku AI.
 * @returns {Promise<any>} Hasil dari permintaan dengan sistem prompt.
 */
async function requestPrompt(content, prompt) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.post('/', { content, prompt });
            resolve(response.data.result);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan permintaan untuk memperbaiki prompt AI dengan teks yang diberikan.
 * @param {string} text - Teks prompt yang ingin diperbaiki atau ditingkatkan.
 * @returns {Promise<any>} Hasil dari permintaan perbaikan prompt AI.
 */
async function improvePrompt(text) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.post('/improve-prompt', { text });
            resolve(response.data.improvedPrompt.prompt);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengonversi screenshot ke kode berdasarkan jenis kode yang diinginkan.
 * @param {string} imageUrl - URL gambar screenshot yang akan dikonversi.
 * @param {string} typecode - Jenis kode yang diinginkan. 
 *        Jenis yang diperbolehkan:
 *        - 'html_css'
 *        - 'html_tailwind'
 *        - 'react_tailwind'
 *        - 'vue_tailwind'
 *        - 'Ionic_tailwind'
 *        - 'bootstrap'
 *        - 'svg'
 * @returns {Promise<any>} Hasil konversi screenshot menjadi kode.
 */
async function ss2code(imageUrl, typecode) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.post('/screenshot-to-code', { imageUrl, typecode });
            resolve(response.data.result.data);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan permintaan ke endpoint NAW dengan prompt dan API key.
 * @param {string} prompt - Prompt yang digunakan untuk permintaan.
 * @param {string} apiKey - API key untuk otentikasi.
 * @returns {Promise<any>} Respon chat dari NAW API.
 */
async function requestNaw(prompt, apiKey) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.post('/naw', { prompt, apiKey });
            resolve(response.data.chatResponse);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan teks ke Duck AI untuk diproses.
 * @param {string} text - Teks yang akan diproses oleh Duck AI.
 * @returns {Promise<any>} Respon dari Duck AI.
 */
async function requestDuckAi(text) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.post('/v2', { text });
            resolve(response.data.reply.reply);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan teks ke Duck AI dengan sesi yang diidentifikasi oleh userId.
 * @param {string} text - Teks yang akan diproses oleh Duck AI.
 * @param {string} userId - ID pengguna untuk mengidentifikasi sesi chat.
 * @returns {Promise<any>} Respon dari Duck AI.
 */
async function requestDuckSesi(text, userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.post('/v2', { text, userId });
            resolve(response.data.reply.reply);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan teks ke Bard API untuk diproses.
 * @param {string} text - Teks yang akan diproses oleh Bard API.
 * @returns {Promise<any>} Respon dari Bard API.
 */
async function requestBard(text) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.post('/v3', { text });
            resolve(response.data);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan teks ke Bard API dengan sesi yang diidentifikasi oleh userId.
 * @param {string} text - Teks yang akan diproses oleh Bard API.
 * @param {string} userId - ID pengguna untuk mengidentifikasi sesi chat.
 * @returns {Promise<any>} Respon dari Bard API.
 */
async function requestBardSesi(text, user) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.post('/v3', { text, user });
            resolve(response.data);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan teks dan gambar ke Bard API untuk diproses.
 * @param {string} text - Teks yang akan diproses oleh Bard API.
 * @param {Buffer} image - Gambar dalam format buffer yang akan diproses oleh Bard API.
 * @returns {Promise<any>} Respon dari Bard API.
 */
async function requestBardImg(text, image) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.post('/v3', { text, image });
            resolve(response.data);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan teks ke Bing AI API untuk diproses.
 * @param {string} text - Teks yang akan diproses oleh Bing AI.
 * @param {string} cookie - Cookie otentikasi yang diperlukan untuk mengakses Bing AI API.
 * @param {string} variant - Mode respon Bing AI. Pilih salah satu dari:
 *        - 'Creative'
 *        - 'Balanced'
 *        - 'Precise'
 * @returns {Promise<any>} Respon dari Bing AI API.
 */
async function requestBingAi(text, cookie, variant = "Balanced") {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await api.post('/v3', { text, variant, cookie });
            resolve(response.data);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

/**
 * Mengirimkan permintaan ke Cloudflare AI dengan prompt dan teks pengguna.
 * @param {string} model - Model AI yang akan digunakan (misalnya: 'mistral-7b-instruct-v0.1').
 * @param {number} maxTokens - Jumlah maksimum token dalam respon.
 * @param {string} prompt - Prompt sistem untuk mendefinisikan perilaku AI.
 * @param {string} text - Teks dari pengguna yang akan diproses oleh AI.
 * @returns {Promise<any>} Respon dari Cloudflare AI API.
 */
async function requestCloudflareAi(model, maxTokens, prompt, text) {
    return new Promise(async (resolve, reject) => {
        try {
            const payload = {
                model,
                max_tokens: maxTokens,
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: text }
                ]
            };
            const response = await api.post('/v5', payload);
            resolve(response.data);
        } catch (error) {
            reject(error.response ? error.response.data : error.message);
        }
    });
};

module.exports = { imageCreator, requestModel, requestAgent, requestAndFile, requestSesion, requestSesion, requestLuminai, improvePrompt, requestPrompt, ss2code, requestNaw, requestDuckAi, requestDuckSesi, requestBard, requestBardSesi, requestBardImg, requestBingAi, requestBingAi, requestCloudflareAi };