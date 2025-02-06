import ytdl from 'ytdl-core';
import {
    exec
} from 'child_process';
import fs from 'fs';
import path from 'path';

const downloadVideoAndAudio = async (url, selectedResolution) => {
    const info = await ytdl.getInfo(url);
    let videoFormat;

    if (selectedResolution) {
        videoFormat = info.formats.find(f => f.height === selectedResolution && f.container === 'mp4');
    }

    if (!videoFormat) {
        videoFormat = info.formats.find(f => f.height === 720 && f.container === 'mp4');
    }

    if (!videoFormat) {
        videoFormat = info.formats.filter(f => f.container === 'mp4').sort((a, b) => b.height - a.height)[0];
    }

    const audioFormat = ytdl.chooseFormat(info.formats, {
        quality: 'highestaudio',
        filter: 'audioonly'
    });

    if (!videoFormat) {
        throw new Error('Tidak ditemukan format video yang sesuai.');
    }
    if (!audioFormat) {
        throw new Error('Tidak ditemukan format audio.');
    }

    const videoPath = path.join('/tmp', `video_${Date.now()}.mp4`);
    const audioPath = path.join('/tmp', `audio_${Date.now()}.mp4`);
    const outputPath = path.join('/tmp', `output_${Date.now()}.mp4`);

    await new Promise((resolve, reject) => {
        ytdl(url, {
                format: videoFormat
            })
            .pipe(fs.createWriteStream(videoPath))
            .on('finish', resolve)
            .on('error', reject);
    });

    await new Promise((resolve, reject) => {
        ytdl(url, {
                format: audioFormat
            })
            .pipe(fs.createWriteStream(audioPath))
            .on('finish', resolve)
            .on('error', reject);
    });

    await new Promise((resolve, reject) => {
        exec(`ffmpeg -i ${videoPath} -i ${audioPath} -c:v copy -c:a aac ${outputPath}`, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`ffmpeg error: ${error.message}`));
                return;
            }
            resolve();
        });
    });

    await fs.promises.unlink(videoPath);
    await fs.promises.unlink(audioPath);

    const {
        videoDetails
    } = info;
    const resolutions = info.formats
        .filter(f => f.hasVideo && f.height)
        .map(f => f.height)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => b - a);

    const duration = new Date(videoDetails.lengthSeconds * 1000).toISOString().substr(11, 8);

    return {
        outputPath,
        videoDetails,
        resolution: videoFormat.height,
        resolutions,
        duration
    };
};

let handler = async (m, {
    conn,
    text
}) => {
    const url = text.trim()
	const selectedResolution = 720;
    if (!ytdl.validateURL(url)) {
        return conn.reply(m.chat, 'URL YouTube tidak valid. Pastikan URL diawali dengan http:// atau https://', m);
    }

    try {
        const resolution = selectedResolution ? parseInt(selectedResolution, 10) : null;
        if (resolution && isNaN(resolution)) {
            return conn.reply(m.chat, 'Resolusi tidak valid. Harap masukkan resolusi dalam angka, misalnya: 720 atau 360.', m);
        }

        const {
            outputPath,
            videoDetails,
            resolution: videoResolution,
            resolutions,
            duration
        } = await downloadVideoAndAudio(url, resolution);
        const fileSize = calculateFileSize(outputPath);

        if (fileSize > 5 * 1024 * 1024 * 1024) { // 5 GB
            return conn.reply(m.chat, 'File terlalu besar untuk dikirim. Maksimum ukuran file adalah 5 GB.', m);
        }

        if (fileSize > 1.5 * 1024 * 1024 * 1024) { // 1.5 GB
            return conn.reply(m.chat, 'File melebihi batas 1.5 GB.', m);
        }

        if (fileSize <= 100 * 1024 * 1024) { // 100 MB
            await conn.sendMessage(m.chat, {
                video: {
                    url: outputPath
                },
                mimetype: 'video/mp4',
                fileName: `${videoDetails.title}.mp4`,
                caption: `YTMP4 DOWNLOADER resolusi ${videoResolution}p\n\n*Judul:* ${videoDetails.title}\n*Deskripsi:* ${videoDetails.description}\n*Nama Pengupload:* ${videoDetails.author.name}\n*Jumlah Views:* ${videoDetails.viewCount}\n*Durasi:* ${duration}\n*Resolusi yang Tersedia:* ${resolutions.join(', ')}p`
            }, {
                quoted: m
            });
        } else {
            await conn.sendMessage(m.chat, {
                document: {
                    url: outputPath
                },
                mimetype: 'video/mp4',
                fileName: `${videoDetails.title}.mp4`,
                caption: `YTMP4 DOWNLOADER resolusi ${videoResolution}p\n\n*Judul:* ${videoDetails.title}\n*Deskripsi:* ${videoDetails.description}\n*Nama Pengupload:* ${videoDetails.author.name}\n*Jumlah Views:* ${videoDetails.viewCount}\n*Durasi:* ${duration}\n*Resolusi yang Tersedia:* ${resolutions.join(', ')}p`
            }, {
                quoted: m
            });
        }

        await fs.promises.unlink(outputPath);

    } catch (e) {
        console.error('Error downloading video:', e);
        conn.reply(m.chat, `Terjadi kesalahan saat mengunduh video: ${e.message}`, m);
    }
};

handler.help = ['ytmp4'];
handler.tags = ['downloader'];
handler.command = /^(ytmp4|ytv|ytvideo)$/i;
handler.limit = true;

export default handler;

function calculateFileSize(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size;
}