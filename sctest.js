import axios from 'axios';

async function aioSaveTheVideo(videoUrl, format) {
  try {
    for (let i = 0; i < 5; i++) { // max 5x ngulang
      const response = await axios.post(
        'https://api.v02.savethevideo.com/tasks',
        {
          type: 'convert',
          url: videoUrl,
          format
        },
        {
          headers: {
            accept: 'application/json',
            'accept-language': 'id;q=0.9',
            'content-type': 'application/json',
            origin: 'https://www.savethevideo.com',
            referer: 'https://www.savethevideo.com/',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
          }
        }
      );
      if (response.data.state === 'completed') {
        return response.data;
      } else if (
        response.data.state === 'pending' ||
        response.data.state === 'active'
      ) {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // delay 3 dtk
      } else {
        throw 'Unexpected response state';
      }
    }
    throw 'Max retries reached, conversion still pending';
  } catch (error) {
    if (error.message && error.message.includes('429')) {
      await new Promise((resolve) => setTimeout(resolve, 10000)); // delay 10 dtk
    }
    console.log(error);
    throw error.message; // kbnykn req, try again later
  }
}

aioSaveTheVideo(
  'https://www.instagram.com/reel/DGNXdUjvhyg/?igsh=ODN0ZTJtNTYyZWdv',
  'mp4'
)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));