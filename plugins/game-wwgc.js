import Jimp from 'jimp';

const resize = async (imageUrl, width, height) => {
  const image = await Jimp.read(imageUrl);
  const resizedImage = await image.resize(width, height).getBufferAsync(Jimp.MIME_JPEG);
  return resizedImage;
};

import { 
  emoji_role, playerOnGame, playerOnRoom, playerExit, dataPlayer, getPlayerById, 
  roleGenerator, addTimer, startGame, vote, clearAllVote, run, run_vote, run_malam, run_pagi 
} from '../lib/werewolf.js';

let handler = async (message, { conn, command, usedPrefix, args }) => {
  const { sender, chat } = message;
  conn.werewolf = conn.werewolf || {};
  const gameSessions = conn.werewolf;
  const action = args[0];
  const playerNumber = args[1];

  if (action === "create") {
    if (chat in gameSessions) {
      return m.reply("Group masih dalam sesi permainan");
    }
    if (playerOnGame(sender, gameSessions)) {
      return m.reply("Kamu masih dalam sesi game");
    }
    gameSessions[chat] = {
      room: chat,
      owner: sender,
      status: false,
      iswin: null,
      cooldown: null,
      day: 0,
      time: "malem",
      player: [],
      dead: [],
      voting: false,
      seer: false,
      guardian: []
    };
    await m.reply("Room berhasil dibuat, ketik *.ww join* untuk bergabung");
  } else if (action === "join") {
    if (!gameSessions[chat]) {
      return m.reply("Belum ada sesi permainan");
    }
    if (gameSessions[chat].status) {
      return m.reply("Sesi permainan sudah dimulai");
    }
    if (gameSessions[chat].player.length > 15) {
      return m.reply("Maaf jumlah player telah penuh");
    }
    if (playerOnRoom(sender, chat, gameSessions)) {
      return m.reply("Kamu sudah join dalam room ini");
    }
    if (playerOnGame(sender, gameSessions)) {
      return m.reply("Kamu masih dalam sesi game");
    }
    let newPlayer = {
      id: sender,
      number: gameSessions[chat].player.length + 1,
      sesi: chat,
      status: false,
      role: false,
      effect: [],
      vote: 0,
      isdead: false,
      isvote: false
    };
    gameSessions[chat].player.push(newPlayer);
    let mentionedJid = [];
    let playerList = "\n*⌂ W E R E W O L F - P L A Y E R*\n\n";
    for (let i = 0; i < gameSessions[chat].player.length; i++) {
      playerList += gameSessions[chat].player[i].number + ") @" + gameSessions[chat].player[i].id.replace('@s.whatsapp.net', '') + "\n";
      mentionedJid.push(gameSessions[chat].player[i].id);
    }
    playerList += "\nJumlah player minimal adalah 5 dan maximal 15";
    conn.sendMessage(m.chat, {
      text: playerList.trim(),
      contextInfo: {
        externalAdReply: {
          title: "W E R E W O L F",
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnail: await resize("https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg", 300, 175),
          sourceUrl: '',
          mediaUrl: "https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg"
        },
        mentionedJid: mentionedJid
      }
    }, {
      quoted: message
    });
  } else if (action === "start") {
    if (!gameSessions[chat]) {
      return m.reply("Belum ada sesi permainan");
    }
    if (gameSessions[chat].player.length === 0) {
      return m.reply("Room belum memiliki player");
    }
    if (gameSessions[chat].player.length < 5) {
      return m.reply("Maaf jumlah player belum memenuhi syarat");
    }
    if (!playerOnRoom(sender, chat, gameSessions)) {
      return m.reply("Kamu belum join dalam room ini");
    }
    if (gameSessions[chat].cooldown > 0) {
      if (gameSessions[chat].time === "voting") {
        clearAllVote(chat, gameSessions);
        addTimer(chat, gameSessions);
        return await run_vote(conn, chat, gameSessions);
      } else if (gameSessions[chat].time === "malem") {
        clearAllVote(chat, gameSessions);
        addTimer(chat, gameSessions);
        return await run_malam(conn, chat, gameSessions);
      } else if (gameSessions[chat].time === "pagi") {
        clearAllVote(chat, gameSessions);
        addTimer(chat, gameSessions);
        return await run_pagi(conn, chat, gameSessions);
      }
    }
    if (gameSessions[chat].status) {
      return m.reply("Sesi permainan telah dimulai");
    }
    if (gameSessions[chat].owner !== sender) {
      return m.reply("Hanya @" + gameSessions[chat].owner.split('@')[0] + " yang dapat memulai permainan", {
        withTag: true
      });
    }
    let playerList = '';
    let roleList = '';
    let mentionedJid = [];
    roleGenerator(chat, gameSessions);
    addTimer(chat, gameSessions);
    startGame(chat, gameSessions);
    for (let i = 0; i < gameSessions[chat].player.length; i++) {
      playerList += '(' + gameSessions[chat].player[i].number + ") @" + gameSessions[chat].player[i].id.replace("@s.whatsapp.net", '') + "\n";
      mentionedJid.push(gameSessions[chat].player[i].id);
    }
    for (let i = 0; i < gameSessions[chat].player.length; i++) {
      roleList += '(' + gameSessions[chat].player[i].number + ") @" + gameSessions[chat].player[i].id.replace('@s.whatsapp.net', '') + " " + (gameSessions[chat].player[i].role === "werewolf" || gameSessions[chat].player[i].role === 'sorcerer' ? '[' + gameSessions[chat].player[i].role + ']' : '') + "\n";
      mentionedJid.push(gameSessions[chat].player[i].id);
    }
    for (let i = 0; i < gameSessions[chat].player.length; i++) {
      if (gameSessions[chat].player[i].role === "werewolf" && !gameSessions[chat].player[i].isdead) {
        let messageText = "Hai " + conn.getName(gameSessions[chat].player[i].id) + ", Kamu telah dipilih untuk memerankan *Werewolf* " + emoji_role("werewolf") + " pada permainan kali ini, silahkan pilih salah satu player yang ingin kamu makan pada malam hari ini\n*LIST PLAYER*:\n" + roleList + "\n\nKetik *.wwpc kill nomor* untuk membunuh player";
        await conn.sendMessage(gameSessions[chat].player[i].id, {
          text: messageText,
          mentions: mentionedJid
        });
      } else if (gameSessions[chat].player[i].role === "warga" && !gameSessions[chat].player[i].isdead) {
        let messageText = "*⌂ W E R E W O L F - G A M E*\n\nHai " + conn.getName(gameSessions[chat].player[i].id) + " Peran kamu adalah *Warga Desa* " + emoji_role("warga") + ", tetap waspada, mungkin *Werewolf* akan memakanmu malam ini, silakan masuk kerumah masing masing.\n*LIST PLAYER*:\n" + playerList;
        await conn.sendMessage(gameSessions[chat].player[i].id, {
          text: messageText,
          mentions: mentionedJid
        });
      } else if (gameSessions[chat].player[i].role === "seer" && !gameSessions[chat].player[i].isdead) {
        let messageText = "Hai " + conn.getName(gameSessions[chat].player[i].id) + " Kamu telah terpilih  untuk menjadi *Penerawang* " + emoji_role("seer") + ". Dengan sihir yang kamu punya, kamu bisa mengetahui peran pemain pilihanmu.\n*LIST PLAYER*:\n" + playerList + "\n\nKetik *.wwpc dreamy nomor* untuk melihat role player";
        await conn.sendMessage(gameSessions[chat].player[i].id, {
          text: messageText,
          mentions: mentionedJid
        });
      } else if (gameSessions[chat].player[i].role === "guardian" && !gameSessions[chat].player[i].isdead) {
        let messageText = "Hai " + conn.getName(gameSessions[chat].player[i].id) + " Kamu terpilih untuk memerankan *Malaikat Pelindung* " + emoji_role("guardian") + ", dengan kekuatan yang kamu miliki, kamu bisa melindungi para warga, silahkan pilih salah 1 player yang ingin kamu lindungi\n*LIST PLAYER*:\n" + playerList + "\n\nKetik *.wwpc deff nomor* untuk melindungi player";
        await conn.sendMessage(gameSessions[chat].player[i].id, {
          text: messageText,
          mentions: mentionedJid
        });
      } else if (gameSessions[chat].player[i].role === "sorcerer" && !gameSessions[chat].player[i].isdead) {
        let messageText = "Hai " + conn.getName(gameSessions[chat].player[i].id) + " Kamu terpilih sebagai Penyihir " + emoji_role("sorcerer") + ", dengan kekuasaan yang kamu punya, kamu bisa membuka identitas para player, silakan pilih 1 orang yang ingin kamu buka identitasnya\n*LIST PLAYER*:\n" + roleList + "\n\nKetik *.wwpc sorcerer nomor* untuk melihat role player";
        await conn.sendMessage(gameSessions[chat].player[i].id, {
          text: messageText,
          mentions: mentionedJid
        });
      }
    }
    await conn.sendMessage(m.chat, {
      text: "*⌂ W E R E W O L F - G A M E*\n\nGame telah dimulai, para player akan memerankan perannya masing masing, silahkan cek chat pribadi untuk melihat role kalian. Berhati-hatilah para warga, mungkin malam ini adalah malah terakhir untukmu",
      contextInfo: {
        externalAdReply: {
          title: "W E R E W O L F",
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnail: await resize("https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg", 300, 175),
          sourceUrl: '',
          mediaUrl: "https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg"
        },
        mentionedJid: mentionedJid
      }
    });
    await run(conn, chat, gameSessions);
  } else if (action === "vote") {
    if (!gameSessions[chat]) {
      return m.reply("Belum ada sesi permainan");
    }
    if (!gameSessions[chat].status) {
      return m.reply("Sesi permainan belum dimulai");
    }
    if (gameSessions[chat].time !== "voting") {
      return m.reply("Sesi voting belum dimulai");
    }
    if (!playerOnRoom(sender, chat, gameSessions)) {
      return m.reply("Kamu bukan player");
    }
    if (dataPlayer(sender, gameSessions).isdead) {
      return m.reply("Kamu sudah mati");
    }
    if (!playerNumber || playerNumber.length < 1) {
      return m.reply("Masukan nomor player");
    }
    if (isNaN(playerNumber)) {
      return m.reply("Gunakan hanya nomor");
    }
    if (dataPlayer(sender, gameSessions).isvote) {
      return m.reply("Kamu sudah melakukan voting");
    }
    let targetPlayer = getPlayerById(chat, sender, parseInt(playerNumber), gameSessions);
    if (targetPlayer.db.isdead) {
      return m.reply("Player " + playerNumber + " sudah mati.");
    }
    if (gameSessions[chat].player.length < parseInt(playerNumber)) {
      return m.reply("Invalid");
    }
    if (!getPlayerById(chat, sender, parseInt(playerNumber), gameSessions)) {
      return m.reply("Player tidak terdaftar!");
    }
    vote(chat, parseInt(playerNumber), sender, gameSessions);
    return m.reply("✅ Vote");
  } else if (action == "exit") {
    if (!gameSessions[chat]) {
      return m.reply("Tidak ada sesi permainan");
    }
    if (!playerOnRoom(sender, chat, gameSessions)) {
      return m.reply("Kamu tidak dalam sesi permainan");
    }
    if (gameSessions[chat].status) {
      return m.reply("Permainan sudah dimulai, kamu tidak bisa keluar");
    }
    m.reply('@' + sender.split('@')[0] + " Keluar dari permainan", {
      withTag: true
    });
    playerExit(chat, sender, gameSessions);
  } else if (action === "delete") {
    if (!gameSessions[chat]) {
      return m.reply("Tidak ada sesi permainan");
    }
    if (gameSessions[chat].owner !== sender) {
      return m.reply("Hanya @" + gameSessions[chat].owner.split('@')[0] + " yang dapat menghapus sesi permainan ini");
    }
    m.reply("Sesi permainan berhasil dihapus").then(() => {
      delete gameSessions[chat];
    });
  } else if (action === "player") {
    if (!gameSessions[chat]) {
      return m.reply("Tidak ada sesi permainan");
    }
    if (!playerOnRoom(sender, chat, gameSessions)) {
      return m.reply("Kamu tidak dalam sesi permainan");
    }
    if (gameSessions[chat].player.length === 0) {
      return m.reply("Sesi permainan belum memiliki player");
    }
    let mentionedJid = [];
    let playerList = "\n*⌂ W E R E W O L F - G A M E*\n\nLIST PLAYER:\n";
    for (let i = 0; i < gameSessions[chat].player.length; i++) {
      playerList += '(' + gameSessions[chat].player[i].number + ") @" + gameSessions[chat].player[i].id.replace("@s.whatsapp.net", '') + " " + (gameSessions[chat].player[i].isdead ? "☠️ " + gameSessions[chat].player[i].role : '') + "\n";
      mentionedJid.push(gameSessions[chat].player[i].id);
    }
    conn.sendMessage(m.chat, {
      text: playerList,
      contextInfo: {
        externalAdReply: {
          title: "W E R E W O L F",
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnail: await resize("https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg", 300, 175),
          sourceUrl: '',
          mediaUrl: "https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg"
        },
        mentionedJid: mentionedJid
      }
    }, {
      quoted: message
    });
  } else {
    let helpMessage = "\n*⌂ W E R E W O L F - G A M E*\n\nPermainan Sosial Yang Berlangsung Dalam Beberapa Putaran/ronde. Para Pemain Dituntut Untuk Mencari Seorang Penjahat Yang Ada Dipermainan. Para Pemain Diberi Waktu, Peran, Serta Kemampuannya Masing-masing Untuk Bermain Permainan Ini\n\n*⌂ C O M M A N D*\n";
    helpMessage += " • ww create\n";
    helpMessage += " • ww join\n";
    helpMessage += " • ww start\n";
    helpMessage += " • ww exit\n";
    helpMessage += " • ww delete\n";
    helpMessage += " • ww player\n";
    helpMessage += "\nPermainan ini dapat dimainkan oleh 5 sampai 15 orang.";
    conn.sendMessage(m.chat, {
      text: helpMessage.trim(),
      contextInfo: {
        externalAdReply: {
          title: "W E R E W O L F",
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnail: await resize("https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg", 300, 175),
          sourceUrl: '',
          mediaUrl: "https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg"
        }
      }
    }, {
      quoted: message
    });
  }
};

handler.help = ["werewolf"];
handler.tags = ['game'];
handler.command = ['ww', "werewolf"];
handler.group = true;

export default handler;