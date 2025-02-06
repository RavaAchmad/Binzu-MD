import ytdl from 'ytdl-core';
import {
    exec
} from 'child_process';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
let handler = async (m, {
    conn,
    text
}) => {
    const url = text.trim();
    try {
        const webs = await fetch(`https://ytdownloader.nvlgroup.my.id/download?url=${encodeURIComponent(url)}&resolution=720`, { method: 'HEAD' });
        const fileSize = webs.headers.get('content-length');

        if (fileSize > 5 * 1024 * 1024 * 1024) { // 5 GB
            return conn.reply(m.chat, 'File terlalu besar untuk dikirim. Maksimum ukuran file adalah 5 GB.', m);
        }

        if (fileSize > 1.5 * 1024 * 1024 * 1024) { // 1.5 GB
            return conn.reply(m.chat, 'File melebihi batas 1.5 GB.', m);
        }

        const web = await (await fetch(`https://ytdownloader.nvlgroup.my.id/download?url=${encodeURIComponent(url)}&resolution=720`)).buffer();
        const outputPath = path.join('/tmp', `output_${Date.now()}.mp4`);
        await fs.promises.writeFile(outputPath, web);

        if (fileSize <= 100 * 1024 * 1024) { // 100 MB
            await conn.sendMessage(m.chat, {
                video: {
                    url: outputPath
                },
                mimetype: 'video/mp4',
                fileName: `toktok.mp4`,
            }, {
                quoted: m
            });
        } else {
            await conn.sendMessage(m.chat, {
                document: {
                    url: outputPath
                },
                mimetype: 'video/mp4',
                fileName: `toktok.mp4`,
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