// Import necessary modules
import * as ws from 'ws';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import { clear } from 'console';
import cfonts from 'cfonts';
import nodeCache from 'node-cache';
import syntaxError from 'syntax-error';
import os from 'os';
import chalk from 'chalk';
import { format } from 'util';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import pino from 'pino';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';

// Initialize constants and global variables
const {
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = await import('@adiwajshing/baileys');

const Device = os.platform() === 'win32' ? 'Windows' : os.platform() === 'darwin' ? 'MacOS' : 'Linux';
const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;

protoType();
serialize();

global.API = (platform, endpoint = '/', queryParams = {}, apiKeyParam) => {
  const baseApiUrl = global.APIs[platform] || platform;
  const queryString = new URLSearchParams({
    ...queryParams,
    ...(apiKeyParam ? { [apiKeyParam]: global.APIKeys[platform] } : {})
  }).toString();
  return `${baseApiUrl}${endpoint}?${queryString}`;
};

global.serverStartTime = { start: new Date() };
const __dirname = global.__dirname(import.meta.url);

global.cache = new nodeCache({ stdTTL: 60, checkperiod: 120 });
global.prefixRegex = new RegExp('^[' + (opts.prefix || '.')?.replace(/[|\\{}()[\]^$+*?.\-\^]/g, "\\$&") + ']');

global.db = new Low(
  /https?:\/\//.test(opts.db || '') 
    ? new cloudDBAdapter(opts.db) 
    : /mongodb(\+srv)?:\/\//i.test(opts.db) 
      ? opts.mongodbv2 
        ? new mongoDBV2(opts.db) 
        : new mongoDB(opts.db) 
      : new JSONFile((opts._[0] ? opts._[0] + '_' : '') + 'database.json')
);

global.loadDatabase = async function () {
  if (global.db.READ) {
    return new Promise(resolve => setInterval(async function () {
      if (!global.db.READ) {
        clearInterval(this);
        resolve(global.db.READ ? global.loadDatabase() : global.db.data);
      }
    }, 1000));
  }

  if (global.db.data !== null) return;

  global.db.READ = true;
  try {
    await global.db.read();
  } catch (error) {
    console.error(error);
  }
  global.db.READ = null;

  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    banned: {},
    sticker: {},
    settings: {},
    ...global.db.data
  };

  global.db.chain = lodash.chain(global.db.data);
};

await global.loadDatabase();

global.authFile = opts._[0] || 'default-auth-file';
console.log('Using Auth File:', global.authFile);

const { state, saveCreds } = await useMultiFileAuthState(global.authFile);
const { version, isLatest } = await fetchLatestBaileysVersion();
console.log(`Using WA v${version.join('.')}, Latest: ${isLatest}`);

const connectionOptions = {
    version: [ 2, 3000, 1015901307 ],
    logger: pino({ level: 'silent' }),
    printQRInTerminal: !process.env.PAIRING_CODE,
    browser: [Device, 'Chrome', '20.0.04'],
    generateHighQualityLinkPreview: true,
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent', stream: process.stdout }))
    },
  patchMessageBeforeSending: message => {
    const isViewOnce = !!message.viewOnceMessage || !!message.buttonsMessage || !!message.listMessage;
    if (isViewOnce) {
      return {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadataVersion: 2,
              deviceListMetadata: {}
            },
            ...message
          }
        }
      };
    }
    return message;
  },
  defaultQueryTimeoutMs: undefined,
  syncFullHistory: false
};

global.conn = makeWASocket(connectionOptions);
global.conn.isInit = false;

if (!opts.test) {
  setInterval(async () => {
    if (global.db.data) {
      try {
        await global.db.write();
      } catch (error) {
        console.error(error);
      }
    }
  }, 60000);
}

if (opts.server) {
  (await import('./server.js')).default(global.conn, PORT);
}

async function clearSession() {
  const sessionFiles = readdirSync('sessions').filter(file => file.endsWith('.json'));
  sessionFiles.forEach(file => unlinkSync(`sessions/${file}`));
  console.log(chalk.green('All sessions cleared!'));
}

async function connectionUpdate(update) {
  const { connection, isOnline, lastDisconnect } = update;

  if (update.isNewLogin) {
    global.conn.isInit = true;
  }

  if (connection === 'connecting') {
    console.log(chalk.yellow('Connecting to WhatsApp...'));
  }

  if (connection === 'open') {
    console.log(chalk.green('Connected to WhatsApp!'));
  }

  if (isOnline === true) {
    console.log(chalk.green('Bot is now online!'));
  }

  if (isOnline === false) {
    console.log(chalk.red('Bot is now offline!'));
  }

  if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
    console.log(chalk.red('Reconnecting...'));
    await global.reloadConnection(true);
  }

  global.serverStartTime.lastConnect = new Date();
}

process.on('uncaughtException', error => console.error(error));

global.reloadConnection = async function (forceReload = false) {
  try {
    const handler = await import('./handler.js?' + Date.now()).catch(console.error);
    if (Object.keys(handler || {}).length) {
      global.handler = handler;
    }
  } catch (error) {
    console.error(error);
  }

  if (forceReload) {
    try {
      global.conn.ws.close();
    } catch {}
    global.conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions);
    global.conn.isInit = true;
  }

  if (!global.conn.isInit) {
    global.conn.ev.on('messages.upsert', global.handler.handleMessages);
    global.conn.ev.on('group-participants.update', global.handler.handleGroupParticipantsUpdate);
    global.conn.ev.on('groups.update', global.handler.handleGroupsUpdate);
    global.conn.ev.on('chats.update', global.handler.handleChatsUpdate);
    global.conn.ev.on('connection.update', connectionUpdate);
    global.conn.ev.on('creds.update', saveCreds);

    global.conn.welcome = '@user has joined the group!';
    global.conn.bye = '@user has left the group!';
    global.conn.spromote = '@user sekarang admin!';
    global.conn.sdemote = '@user sekarang bukan admin!';
    global.conn.sIcon = 'Icon grup telah diubah!';
    global.conn.sRevoke = 'Link group telah diubah!';
  }

  global.conn.isInit = false;
  return true;
};

await global.reloadConnection();

const pluginFolder = global.__dirname(join(__dirname, 'plugins'));
const pluginFilter = file => /\.js$/.test(file);

global.plugins = {};

async function loadPlugins() {
  for (let plugin of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const pluginPath = join(pluginFolder, plugin);
      const pluginModule = await import(pluginPath);
      global.plugins[plugin] = pluginModule.default || pluginModule;
    } catch (error) {
      console.error(error);
      delete global.plugins[plugin];
    }
  }
}

loadPlugins().then(() => console.log(Object.keys(global.plugins))).catch(console.error);

global.reloadPlugin = async (pluginName, reload = false) => {
  if (pluginFilter(pluginName)) {
    const pluginPath = global.__filename(join(pluginFolder, pluginName), true);
    if (pluginName in global.plugins) {
      if (existsSync(pluginPath)) {
        console.warn(`Reloading plugin '${pluginName}'`);
      } else {
        console.warn(`Deleting plugin '${pluginName}'`);
        delete global.plugins[pluginName];
        return;
      }
    } else {
      console.info(`Loading new plugin '${pluginName}'`);
    }

    try {
      const pluginModule = await import(pluginPath + '?' + Date.now());
      global.plugins[pluginName] = pluginModule.default || pluginModule;
    } catch (error) {
      console.error(`Failed to reload plugin '${pluginName}':`, error);
    }
  }
};

Object.freeze(global.reloadPlugin);
watch(pluginFolder, global.reloadPlugin);

await global.reloadConnection();

const readline = require('readline');
const more = String.fromCharCode(0x200e);
const readMore = more.repeat(8192);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = prompt => new Promise(resolve => rl.question(prompt, resolve));

if (process.env.PAIRING_CODE && !global.conn.authState.creds.registered) {
  await sleep(5000);
  clear();
  cfonts.say('XM4ZE BOT', { font: 'block', align: 'center', gradient: ['red', 'yellow'] });
  console.log(chalk.bold.green('Please enter your phone number:'));
  const phoneNumber = await question(chalk.bgBlackBright.greenBright('> '));
  const code = await global.conn.requestPairingCode(phoneNumber.replace(/[^0-9]/g, ''));
  console.log(chalk.bold.green('Your pairing code:'), chalk.bold.yellow(code));
  rl.close();
}

async function quickTest() {
  const testResults = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['~'])
  ].map(child => Promise.race([new Promise(resolve => child.on('exit', code => resolve(code !== -1))), new Promise(resolve => child.on('error', () => resolve(false)))])));

  const [
    ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find
  ] = testResults;

  global.support = Object.freeze({
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  });

  if (!global.support.ffmpeg) {
    console.warn('Please install ffmpeg for sending videos (pkg install ffmpeg)');
  }

  if (global.support.ffmpeg && !global.support.ffmpegWebp) {
    console.warn('Stickers may not be animated without libwebp on ffmpeg (--enable-libwebp while compiling ffmpeg)');
  }

  if (!global.support.magick && !global.support.gm) {
    console.warn('Stickers may not work without imagemagick if libwebp on ffmpeg isn\'t installed (pkg install imagemagick)');
  }
}

quickTest()
  .then(() => console.log('Quick Test Done'))
  .catch(console.error);