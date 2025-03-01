import fetch from 'node-fetch'; 
export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return 
    let chat = global.db.data.chats[m.chat]

    try {
        const res = await fetch('https://api.botcahx.eu.org/api/tools/jadwalshalat?kota=jakarta&apikey=ravaja');
        const data = await res.json();
        // Extract first day's timings
        const jadwal = data.result.data[0];
        const timings = jadwal.timings;
        // Parse scheduled times from strings (format "HH:MM (WIB)")
        const [fajrHour]     = timings.Fajr.split(' ')[0].split(':').map(Number);
        const [maghribHour]  = timings.Maghrib.split(' ')[0].split(':').map(Number);
        const [midnightHour] = timings.Midnight.split(' ')[0].split(':').map(Number);
        // Use local time for current hour/minutes
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Initialize reminder tracker if needed
        const lastReminder = global.db.data.settings.lastRamadanReminder;
        const currentKey = `${now.toISOString().slice(0, 10)}_${hours}`;

        // Only proceed if not already sent for this hour window
        if (!lastReminder[currentKey] && minutes < 1) {
            let remMessage = "";
            if (hours === fajrHour) {
                remMessage = "Selamat Sahur! Jangan lupa makan sahur ya.";
            } else if (hours === maghribHour) {
                remMessage = "Selamat Berbuka! Saatnya berbuka puasa.";
            } else if (hours === midnightHour) {
                remMessage = "Hari baru telah dimulai. Semoga hari ini penuh berkah selama Ramadan.";
            }
            if (remMessage) {
                lastReminder[currentKey] = true;
                await conn.sendMessage("status@broadcast", { text: remMessage });
            }
        }
    } catch (e) {
        console.error(e);
    }

    return
}