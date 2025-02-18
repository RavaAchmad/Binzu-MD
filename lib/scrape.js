import axios from 'axios'
import * as cheerio from 'cheerio';
import crypto from 'crypto'
import FormData from 'form-data';
import { run } from 'shannz-playwright'

async function sifat_usaha_bisnis(tgl, bln, thn) {
    return new Promise((resolve, reject) => {
        axios({
            url: 'https://primbon.com/'+'sifat_usaha_bisnis.php',
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: new URLSearchParams(Object.entries({
                "tgl": tgl, "bln": bln, "thn": thn, "submit": " Submit! "
            }))
        }).then(({
                data
            }) => {
            let $ = cheerio.load(data)
            let fetchText = $('#body').text()
            let hasil
            try {
                hasil = {
                    status: true,
                    message: {
                        hari_lahir: fetchText.split('Hari Lahir Anda: ')[1].split(thn)[0],
                        usaha: fetchText.split(thn)[1].split('< Hitung Kembali')[0],
                        catatan: 'Setiap manusia memiliki sifat atau karakter yang berbeda-beda dalam menjalankan bisnis atau usaha. Dengan memahami sifat bisnis kita, rekan kita, atau bahkan kompetitor kita, akan membantu kita memperbaiki diri atau untuk menjalin hubungan kerjasama yang lebih baik. Para ahli primbon di tanah Jawa sejak jaman dahulu telah merumuskan karakter atau sifat bisnis seseorang berdasarkan weton hari kelahirannya. Hasil perhitungannya bisa dijadikan referensi untuk memilih bidang usaha atau rekan bisnis yang cocok bagi kita.'
                    }
                }
            } catch {
                hasil = {
                    status: false,
                    message: 'Error, Mungkin Input Yang Anda Masukkan Salah'
                }
            }
            resolve(hasil)
        })
    })
}

async function rejeki_hoki_weton(tgl, bln, thn) {
    return new Promise((resolve, reject) => {
        axios({
            url: 'https://primbon.com/'+'rejeki_hoki_weton.php',
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: new URLSearchParams(Object.entries({
                "tgl": tgl, "bln": bln, "thn": thn, "submit": " Submit! "
            }))
        }).then(({
                data
            }) => {
            let $ = cheerio.load(data)
            let fetchText = $('#body').text()
            let hasil
            try {
                hasil = {
                    status: true,
                    message: {
                        hari_lahir: fetchText.split('Hari Lahir: ')[1].split(thn)[0],
                        rejeki: fetchText.split(thn)[1].split('< Hitung Kembali')[0],
                        catatan: 'Rejeki itu bukan lah tentang ramalan tetapi tentang usaha dan ikhtiar seseorang. From Admin'
                    }
                }
            } catch {
                hasil = {
                    status: false,
                    message: 'Error, Mungkin Input Yang Anda Masukkan Salah'
                }
            }
            resolve(hasil)
        })
    })
}

async function tanggal_pernikahan(tgl, bln, thn) {
    return new Promise((resolve, reject) => {
        axios.get('https://primbon.com/tanggal_jadian_pernikahan.php?tgl='+tgl+'&bln='+bln+'&thn='+thn+'&proses=+Submit%21+')
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let fetchText = $('#body').text()
            let hasil
            try {
                hasil = {
                    status: true,
                    message: {
                        tanggal: fetchText.split('Tanggal: ')[1].split('Karakteristik: ')[0],
                        karakteristik: fetchText.split('Karakteristik: ')[1].split('< Hitung Kembali')[0],
                        catatan: 'Untuk melihat kecocokan jodoh dengan pasangan, dapat dikombinasikan dengan primbon Ramalan Jodoh (Jawa), Ramalan Jodoh (Bali), numerologi Kecocokan Cinta, tingkat keserasian Nama Pasangan, dan Ramalan Perjalanan Hidup Suami Istri.'
                    }
                }
            } catch {
                hasil = {
                    status: false,
                    message: 'Error, Mungkin Input Yang Anda Masukkan Salah'
                }
            }
            resolve(hasil)
        })
    })
}
async function openailol(userInput, prompt) {
    try {
      const response = await axios.post("https://chateverywhere.app/api/chat/", {
        model: {
          id: "gpt-4",
          name: "GPT-4",
          maxLength: 32000,
          tokenLimit: 8000,
          completionTokenLimit: 5000,
          deploymentName: "gpt-4"
        },
        messages: [{
          pluginId: null,
          content: userInput,
          role: "user"
        }],
        prompt: prompt,
        temperature: 0.5
      }, {
        headers: {
          'Accept': "/*/",
          'User-Agent': "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        }
      });
    //   const formattedResponse = response.data.replace(/\n/g, '\\n');
    //   return formattedResponse;
    return response.data
    } catch (error) {
      console.error("Error occurred:", error);
      return error.message;
    }
  }
async function kecocokan(nama1, nama2) {
    return new Promise((resolve, reject) => {
        axios.get('https://primbon.com/kecocokan_nama_pasangan.php?nama1='+nama1+'&nama2='+nama2+'&proses=+Submit%21+')
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let fetchText = $("#body").text()
            let hasil
            try {
                hasil = {
                    status: true,
                    message: {
                        nama_anda: nama1,
                        nama_pasangan: nama2,
                        sisi_positif: fetchText.split('Sisi Positif Anda: ')[1].split('Sisi Negatif Anda: ')[0],
                        sisi_negatif: fetchText.split('Sisi Negatif Anda: ')[1].split('< Hitung Kembali')[0],
                        gambar: 'https://primbon.com/ramalan_kecocokan_cinta2.png',
                        catatan: 'Untuk melihat kecocokan jodoh dengan pasangan, dapat dikombinasikan dengan primbon Ramalan Jodoh (Jawa), Ramalan Jodoh (Bali), numerologi Kecocokan Cinta, Ramalan Perjalanan Hidup Suami Istri, dan makna dari Tanggal Jadian/Pernikahan.'
                    }
                }
            } catch {
                hasil = {
                    status: false,
                    message: 'Error, Mungkin Input Yang Anda Masukkan Salah'
                }
            }
            resolve(hasil)
        })
    })
}

async function tafsir_mimpi(value) {
    return new Promise((resolve, reject) => {
        axios.get('https://primbon.com/tafsir_mimpi.php?mimpi='+value+'&submit=+Submit+')
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let fetchText = $('#body').text()
            let hasil
            try {
                hasil = {
                    status: true,
                    message: {
                        mimpi: value,
                        arti: fetchText.split(`Hasil pencarian untuk kata kunci: ${value}`)[1].split('\n')[0],
                        solusi: fetchText.split('Solusi -')[1].trim()
                    }
                }
            } catch {
                hasil = {
                    status: false,
                    message: `Tidak ditemukan tafsir mimpi "${value}" Cari dengan kata kunci yang lain.`
                }
            }
            resolve(hasil)
        })
    })
}

async function remini(url, apikey) {
    const content = (await conn.getFile(url)).data
    const md5Hash = crypto.createHash("md5").update(content).digest("base64")
    const client = axios.create({
        baseURL: "https://developer.remini.ai/api",
        headers: {
            Authorization: `Bearer m3yl4zGsURJtiODuVl4OnGhrwfgMwtTnTlaLmYJHW34UhB02`
        },
        timeout: 60000,
    })
    const submitTaskResponse = await client.post("/tasks", {
        tools: [{
            type: "face_enhance",
            mode: "beautify"
        },
            {
                type: "background_enhance",
                mode: "base"
            },
        ],
        image_md5: md5Hash,
        image_content_type: "image/jpeg",
    })
    const taskID = submitTaskResponse.data.task_id
    const uploadURL = submitTaskResponse.data.upload_url
    const uploadHeaders = submitTaskResponse.data.upload_headers
    await axios.put(uploadURL, content, {
        headers: uploadHeaders
    })
    await client.post(`/tasks/${taskID}/process`)
    for (let i = 0; i < 50; i++) {
        const getTaskResponse = await client.get(`/tasks/${taskID}`)
        if (getTaskResponse.data.status === "completed") {
            return getTaskResponse.data.result.output_url
            process.exit(0)
        } else {
            if (getTaskResponse.data.status !== "processing") {
                return "Found illegal status: " + getTaskResponse.data.status
                process.exit(1)
            }
            await new Promise((resolve) => setTimeout(resolve, 2000))
        }
    }
}

const quotesAnime = {
    generate: async () => {
       let URI = "https://jg160007-api.vercel.app/random-quotes-anime/select/random";
       let { data } = await axios.get(URI);
       return data;
    }
 };

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

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

const ddownr = {
    download: async (url, format) => {
      if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
          throw new Error('Format nya gk support wak, coba cek lagi listnya.');
      }
      const agent = await fetchUserAgents(1)
      const config = {
          method: 'GET',
          url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
          headers: {
              'User-Agent': agent
          }
      };
  
      try {
          const response = await axios.request(config);
  
          if (response.data && response.data.success) {
              const { id, title, info } = response.data;
              const { image } = info;
              const downloadUrl = await ddownr.cekProgress(id);
  
              return {
                  id: id,
                  image: image,
                  title: title,
                  downloadUrl: downloadUrl
              };
          } else {
              throw new Error('Failed to fetch video details.');
          }
      } catch (error) {
          console.error('Error:', error);
          throw error;
      }
    },
    cekProgress: async (id) => {
      const config = {
          method: 'GET',
          url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
      };
  
      try {
          while (true) {
              const response = await axios.request(config);
  
              if (response.data && response.data.success && response.data.progress === 1000) {
                  return response.data.download_url;
              }           
              await new Promise(resolve => setTimeout(resolve, 5000));
          }
      } catch (error) {
          console.error('Error:', error);
          throw error;
      }
    }
  }

async function ytdls(query) {
    const form = new FormData();
    form.append('query', query);
  
    try {
        const response = await axios.post('https://yttomp4.pro/', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        if (response.status !== 200) {
            return {
                status: false,
                code: response.status,
                message: 'Failed to fetch data from the server.'
            };
        }

        const $ = cheerio.load(response.data);
        
        // Extract additional information
        const videoId = query.split('v=')[1];
        const title = $('.vtitle').text().trim();
        const description = $('.description').text().trim(); 
        const image = $('.ac img').attr('src');
        const thumbnail = `https://i.ytimg.com/vi/${videoId}/default.jpg`; 

        // durasi(disini susah bet anjg)
        const durationText = $('.res_left p').text().trim(); 
        const durationMatch = durationText.match(/(\d+:\d+:\d+|\d+:\d+|\d+)/);
        const duration = durationMatch ? durationMatch[0] : 'Tidak Tahu'; 

        let video = null;
        let audio = null;

    $('.tab-item-data').each((index, tab) => {
        const tabTitle = $(tab).attr('id');
        const firstRow = $(tab).find('tbody tr').first(); // Mengambil baris pertama
    
        const fileType = firstRow.find('td').eq(0).text().trim();
        const fileSize = firstRow.find('td').eq(1).text().trim();
        const downloadLink = firstRow.find('a.dbtn').attr('href');
    
        if (tabTitle === 'tab-item-1') {
            video = { fileType, fileSize, downloadLink };
        } else if (tabTitle === 'tab-item-2') {
            audio = { fileType, fileSize, downloadLink };
        }
    });

        const results = {
            status: true,
            code: 200,
            creator: "Rava",
            result: {
                id: videoId,
                url: query,
                title,
                description,
                image,
                thumbnail,
                duration,
                audio,
                video
            }
        };

        return results;
    } catch (error) {
        console.log('Error:', error);
        return {
            status: false,
            code: error.response ? error.response.status : 500, 
            message: error.message || 'An unexpected error occurred.'
        };
    }
}

const baseUrl = 'https://cuka.rfivecode.com';

async function downloadFromYoutube(url, format) {
  const formats = ['mp3', 'mp4'];
  
  if (!formats.includes(format)) {
    return { success: false, message: 'Invalid format' };
  }

  try {
    const response = await fetch(`${baseUrl}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, format })
    });

    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: error.message };
  }
}

async function downloadFromTiktok(url) {
  try {
    const response = await fetch(`${baseUrl}/tiktok/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: error.message };
  }
}

const wdtc = {
    check: async (code) => {
      const input = (text) => {
        if (!text?.trim()) {
          throw new Error('Njirr, lah mana code nya?? 🤣 ');
        }
        if (text.length > 5000) {
          throw new Error('Woy, kepanjangan ini code nya .. max nya 5000 karakter doang yak bree 👍🏻');
        }
      };
   
      const result = (text) => {
        return text.split('\n').filter(line => !line.includes('Share this explanation')).join('\n').trim();
      };
      const agent = await fetchUserAgents(1)
      try {
        input(code);
        const { data } = await axios.post('https://whatdoesthiscodedo.com/api/stream-text', 
          { code },
          {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json',
              'Origin': 'https://whatdoesthiscodedo.com',
              'Referer': 'https://whatdoesthiscodedo.com/',
              'User-Agent': agent
            },
            responseType: 'text'
          }
        );
   
        return {
          data: result(data)
        };
      } catch (error) {
        console.log(error);
        return {
          error: 'Dahlah capek 😮‍💨'
        };
      }
    }
  };

async function downloadFromSpotify(url) {
  try {
    const response = await fetch(`${baseUrl}/spotify/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: error.message };
  }
}
async function iask(query) {
    const code = `const { chromium } = require('playwright');
   
    async function iask(query) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
   
    try {
    await page.goto(\`https://iask.ai/?mode=question&q=\${query}\`);
    await page.waitForSelector('.mt-6.md\\\\:mt-4.w-full.p-px.relative.self-center.flex.flex-col.items-center.results-followup', { timeout: 0 });
    
    const outputDiv = await page.$('#output');
   
           if (!outputDiv) {
               return {
                   status: false,
                   code: 404,
                   creator: "Rava",
                   result: {
                       id: null,
                       url: query,
                       answer: null,
                       image: [],
                       sources: [],
                       videoSource: [],
                       webSearch: []
                   }
               };
           }
   
   
       const answerElement = await outputDiv.$('#text');
       const answerText = await answerElement.evaluate(el => el.innerText);
       const [answer, sourcesText] = answerText.split('Top 3 Authoritative Sources Used in Answering this Question');
       const cleanedAnswer = answer.replace(/According to Ask AI & Question AI www\\.iAsk\\.ai:\\s*/, '').trim();
       const sources = sourcesText ? sourcesText.split('\\n').filter(source => source.trim() !== '') : [];
       
       const imageElements = await outputDiv.$$('img');
       const images = await Promise.all(imageElements.map(async (img) => {
       return await img.evaluate(img => img.src);
       }));
   
       const videoSourceDiv = await page.$('#related-videos');
       const videoSources = [];
       if (videoSourceDiv) {
       const videoElements = await videoSourceDiv.$$('a');
       for (const videoElement of videoElements) {
       const videoLink = await videoElement.evaluate(el => el.href);
       const videoTitle = await videoElement.$eval('h3', el => el.innerText).catch(() => 'No title found');
       const videoThumbnail = await videoElement.$eval('img', el => el.src).catch(() => 'No thumbnail found');
   
       if (videoTitle !== 'No title found' && videoThumbnail !== 'No thumbnail found') {
       videoSources.push({ title: videoTitle, link: videoLink, thumbnail: videoThumbnail });
       }
       }
       }
   
       const webSearchDiv = await page.$('#related-links');
       const webSearchResults = [];
       if (webSearchDiv) {
       const linkElements = await webSearchDiv.$$('a');
       for (const linkElement of linkElements) {
       const linkUrl = await linkElement.evaluate(el => el.href);
       const linkTitle = await linkElement.evaluate(el => el.innerText);
       const linkImage = await linkElement.$eval('img', el => el.src).catch(() => 'No image found');
       const linkDescription = await linkElement.evaluate(el => el.nextElementSibling.innerText).catch(() => 'No description found');
   
       if (linkTitle && linkUrl) {
       webSearchResults.push({
       title: linkTitle,
       link: linkUrl,
       image: linkImage,
       description: linkDescription
       });
       }
       }
       }
    
    const src = sources.map(source => source.trim());
           const result = {
               id: null, // You can set a specific ID if needed
               url: query,
               answer: cleanedAnswer,
               image: images,
               sources: src,
               videoSource: videoSources,
               webSearch: webSearchResults
           };
           const akhir = {
               status: false,
               code: 500,
               creator: "Rava",
               results: result
           }
           return JSON.stringify(akhir, null, 2);
   
    } catch (error) {
    console.error('Error fetching data:', error);
           return {
               status: false,
               code: 500,
               creator: "Rava",
               result: {
                   id: null,
                   url: query,
                   answer: null,
                   image: [],
                   sources: [],
                   videoSource: [],
                   webSearch: []
               }
           };
    } finally {
    await browser.close();
    }
    }
   
    iask(\`${query}\`).then(a => console.log(a));`;
   
    const start = await run('javascript', code);
    const string = start.result.output;
    return JSON.parse(string);
   }
async function brats(texts) {
    const brat = {
        create: async (
          prompt = texts,
          font_text = "100",
          blur_level = "5"
        ) => {
        
          const url = 'https://www.bestcalculators.org/wp-admin/admin-ajax.php';
          
          const headers = {
            'authority': 'www.bestcalculators.org',
            'accept': '*/*',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'origin': 'https://www.bestcalculators.org',
            'referer': 'https://www.bestcalculators.org/online-generators/brat-text-generator/',
            'user-agent': 'Postify/1.0.0',
            'x-requested-with': 'XMLHttpRequest'
          };
          const data = new URLSearchParams({
            'action': 'generate_brat_text',
            'text': prompt,
            'fontSize': font_text,
            'blurLevel': blur_level
          });
          
          try {
            const response = await axios.post(url, data.toString(), { headers });
            if (response.status !== 200) {
              throw new Error(response.status);
            }
            return `data:image/png;base64,${response.data}`;
          } catch (e) {
            console.log(e);
            throw e;
          }
        }
      };
}

async function cerpen(category) {
    return new Promise((resolve, reject) => {
        let title = category.toLowerCase().replace(/[()*]/g, "")
        let judul = title.replace(/\s/g, "-")
        let page = Math.floor(Math.random() * 5)
        axios.get('http://cerpenmu.com/category/cerpen-'+judul+'/page/'+page)
        .then((get) => {
            let $ = cheerio.load(get.data)
            let link = []
            $('article.post').each(function (a, b) {
                link.push($(b).find('a').attr('href'))
            })
            let random = link[Math.floor(Math.random() * link.length)]
            axios.get(random)
            .then((res) => {
                let $$ = cheerio.load(res.data)
                let hasil = {
                    title: $$('#content > article > h1').text(),
                    author: $$('#content > article').text().split('Cerpen Karangan: ')[1].split('Kategori: ')[0],
                    kategori: $$('#content > article').text().split('Kategori: ')[1].split('\n')[0],
                    lolos: $$('#content > article').text().split('Lolos moderasi pada: ')[1].split('\n')[0],
                    cerita: $$('#content > article > p').text()
                }
                resolve(hasil)
            })
        })
    })
}

async function wiki(query) {
    const res = await axios.get(`https://id.m.wikipedia.org/wiki/${query}`)
    const $ = cheerio.load(res.data)
    const hasil = []
    let wiki = $('#mf-section-0').find('p').text()
    let thumb = $('meta[property="og:image"]').attr('content')
    hasil.push({
        wiki, thumb
    })
    return hasil
}

async function cariresep(query) {
    return new Promise(async(resolve, reject) => {
        axios.get('https://resepkoki.id/?s=' + query).then(({
            data
        }) => {
            const $ = cheerio.load(data)
            const link = [];
            const judul = [];
            const upload_date = [];
            const format = [];
            const thumb = [];
            $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-media > a').each(function(a, b) {
                link.push($(b).attr('href'))
            })
            $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-content > header > h3 > a').each(function(c, d) {
                let jud = $(d).text();
                judul.push(jud)
            })
            for (let i = 0; i < link.length; i++) {
                format.push({
                    judul: judul[i],
                    link: link[i]
                })
            }
            const result = {
                creator: 'Fajar Ihsana',
                data: format.filter(v => v.link.startsWith('https://resepkoki.id/resep'))
            }
            resolve(result)
        })
        .catch(reject)
    })
}

async function detailresep(query) {
    return new Promise(async(resolve,
        reject) => {
        axios.get(query).then(({
            data
        }) => {
            const $ = cheerio.load(data)
            const abahan = [];
            const atakaran = [];
            const atahap = [];
            $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-name').each(function(a, b) {
                let bh = $(b).text();
                abahan.push(bh)
            })
            $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-recipe-ingredients-nutritions > div > table > tbody > tr > td:nth-child(2) > span.ingredient-amount').each(function(c, d) {
                let uk = $(d).text();
                atakaran.push(uk)
            })
            $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-content > div.single-steps > table > tbody > tr > td.single-step-description > div > p').each(function(e, f) {
                let th = $(f).text();
                atahap.push(th)
            })
            const judul = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-title.title-hide-in-desktop > h1').text();
            const waktu = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-cooking-time > span').text();
            const hasil = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-serves > span').text().split(': ')[1]
            const level = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-main > div.single-meta > ul > li.single-meta-difficulty > span').text().split(': ')[1]
            const thumb = $('body > div.all-wrapper.with-animations > div.single-panel.os-container > div.single-panel-details > div > div.single-main-media > img').attr('src')
            let tbahan = 'bahan\n'
            for (let i = 0; i < abahan.length; i++) {
                tbahan += abahan[i] + ' ' + atakaran[i] + '\n'
            }
            let ttahap = 'tahap\n'
            for (let i = 0; i < atahap.length; i++) {
                ttahap += atahap[i] + '\n\n'
            }
            const tahap = ttahap
            const bahan = tbahan
            const result = {
                creator: 'Fajar Ihsana',
                data: {
                    judul: judul,
                    waktu_masak: waktu,
                    hasil: hasil,
                    tingkat_kesulitan: level,
                    thumb: thumb,
                    bahan: bahan.split('bahan\n')[1],
                    langkah_langkah: tahap.split('tahap\n')[1]
                }
            }
            resolve(result)
        })
        .catch(reject)
    })
}

async function ttslide(text) {
    let response = await axios.get(`https://dlpanda.com/id?url=${text}&token=G7eRpMaa`)
    const html = response.data
    const $ = cheerio.load(html)
    let asd = []
    let imgSrc = []
    let creator = 'Jikarinka'
    $('div.col-md-12 > img').each((index,
        element) => {
        imgSrc.push($(element).attr('src'))
    })
    asd.push({
        creator,
        imgSrc
    })
    let fix = imgSrc.map((e,
        i) => {
        return {
            img: e,
            creator: creator[i]
        }
    })
    for (let i of asd) {
        return i
    }
}


async function artinama(value) {
    return new Promise((resolve, reject) => {
        axios.get('https://primbon.com/arti_nama.php?nama1='+value+'&proses=+Submit%21+')
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let fetchText = $('#body').text()
            let hasil
            try {
                hasil = {
                    status: true,
                    message: {
                        nama: value,
                        arti: fetchText.split('memiliki arti: ')[1].split('Nama:')[0].trim(),
                        catatan: 'Gunakan juga aplikasi numerologi Kecocokan Nama, untuk melihat sejauh mana keselarasan nama anda dengan diri anda.'
                    }
                }
            } catch {
                hasil = {
                    status: false,
                    message: `Tidak ditemukan arti nama "${value}" Cari dengan kata kunci yang lain.`
                }
            }
            resolve(hasil)
        })
    })
}

// Replace existing LoveTik scraper implementation
async function LoveTik(url) {
    const response = await fetch('https://lovetik.com/api/ajax/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `query=${encodeURIComponent(url)}`
    });
    const data = await response.json();
    if (!data.images) data.images = [];
    const result = { video: [], audio: [] };
    data.links.forEach(item => {
        if (!item.a) return;
        const formatted = {
            format: item.t.replace(/<.*?>|♪/g, '').trim(),
            resolution: item.s || 'Audio Only',
            link: item.a
        };
        if (item.ft == 1) {
            result.video.push(formatted);
        } else {
            result.audio.push(formatted);
        }
    });
    data.render = async () => {
        const rendered = await fetch('https://lovetik.com/api/ajax/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: `c_data=${encodeURIComponent(data.links.filter(m => m.c)[0].c)}`
        });
        return rendered.json();
    };
    console.log({ ...data, ...result });
    return { ...data, ...result };
}

export {
    artinama,
    cariresep,
    detailresep, 
    ttslide,
    wiki,
    cerpen,
    remini,
    tafsir_mimpi,
    kecocokan,
    tanggal_pernikahan,
    rejeki_hoki_weton,
    sifat_usaha_bisnis,
    brats,
    ytdls,
    downloadFromSpotify,
    downloadFromTiktok,
    downloadFromYoutube,
    iask,
    openailol,
    ddownr,
    wdtc,
    quotesAnime,
    LoveTik
}