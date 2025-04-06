// Impor library yang diperlukan
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import Pino from 'pino';
import { useMultiFileAuthState, fetchLatestBaileysVersion } from '@fizzxydev/baileys-pro';
import * as WS from 'ws';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch } from 'fs';
import Yargs from 'yargs';
import { spawn } from 'child_process';
import _ from 'lodash';
import CFonts from 'cfonts';
import NodeCache from 'node-cache';
import SyntaxError from 'syntax-error';
import OS from 'os';
import Chalk from 'chalk';
import { format } from 'util';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Konfigurasi global
global.__filename = (url) => (fileURLToPath(url));
global.__dirname = (url) => (dirname(__filename(url)));
global.APIs = {}; // Tempat menyimpan API key
global.APIKeys = {}; // Manajemen kunci API
global.opts = new Yargs().argv; // Parsing argumen CLI
global.prefix = opts.prefix || /^[!#.]/; // Prefix perintah
global.db = new Low(new JSONFile('database.json')); // Database
global.support = {}; // Status dependensi (ffmpeg, imagemagick, dll)

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('sessions');
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    version: [ 2, 3000, 1015901307 ],
    logger: Pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ['Chrome', '20.0.04'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, Pino().child({ level: 'silent' })),
    },
  });

  // Listener untuk update koneksi
  conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      console.log('Koneksi terputus, mencoba reconnect...');
      await connectToWhatsApp();
    } else if (connection === 'open') {
      console.log('Berhasil terhubung ke WhatsApp!');
    }
  });

  return conn;
}

const pluginFolder = join(__dirname, 'plugins');
const pluginFilter = (file) => /\.js$/.test(file);

global.plugins = {};

async function loadPlugins() {
  readdirSync(pluginFolder).filter(file => /\.js$/.test(file)).forEach(async (file) => {
    try {
      const pluginPath = join(pluginFolder, file);
      const module = await import(pluginPath);
      plugins[file] = module.default || module;
    } catch (e) {
      console.error(`Gagal memuat plugin ${file}:`, e);
    }
  });
}

// Watch perubahan plugin
watch(pluginFolder, (eventType, filename) => {
  if (eventType === 'change' && filename.endsWith('.js')) {
    console.log(`Plugin ${filename} diperbarui, reloading...`);
    delete require.cache[require.resolve(join(pluginFolder, filename))];
    loadPlugins();
  }
});


async function handleMessage(conn, message) {
  // Logika pemrosesan pesan
  const { body, from, sender } = message;
  if (!body.startsWith(prefix)) return;

  const command = body.slice(prefix.length).split(' ')[0];
  const args = body.split(' ').slice(1);

  // Cari plugin yang sesuai
  const plugin = Object.values(plugins).find(p => p.command === command);
  if (plugin) {
    try {
      await plugin.exec(conn, message, args);
    } catch (e) {
      console.error('Error executing plugin:', e);
    }
  }
}

// Binding event handler
conn.ev.on('messages.upsert', async (messages) => {
  const message = messages[0];
  handleMessage(conn, message);
});


async function _quickTest() {
  const tools = [
    spawn('ffmpeg'), 
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['tmp'])
  ];

  const results = await Promise.all(
    tools.map(tool => 
      Promise.race([
        new Promise(resolve => tool.on('exit', code => resolve(code !== 127))),
        new Promise(resolve => tool.on('error', () => resolve(false)))
      ])
    )
  );

  global.support = {
    ffmpeg: results[0],
    ffprobe: results[1],
    ffmpegWebp: results[2],
    convert: results[3],
    magick: results[4],
    gm: results[5],
    find: results[6]
  };

  Object.freeze(global.support);
  
  // Tampilkan peringatan jika ada dependensi yang kurang
  if (!global.support.ffmpeg) 
    console.warn("Please install ffmpeg for sending videos");
  if (global.support.ffmpeg && !global.support.ffmpegWebp) 
    console.warn("Stickers may not animated without libwebp");
  if (!global.support.convert && !global.support.magick && !global.support.gm) 
    console.warn("Install ImageMagick/GraphicsMagick for stickers");
}

function isCommandAvailable(command) {
  return new Promise(resolve => {
    const child = spawn(command, ['-version']);
    child.on('error', () => resolve(false));
    child.on('exit', (code) => resolve(code === 0));
  });
}


async function startBot() {
  await loadPlugins();
  await _quickTest();
  const conn = await connectToWhatsApp();
  console.log('Bot aktif dan berjalan!');
}

startBot().catch(console.error);