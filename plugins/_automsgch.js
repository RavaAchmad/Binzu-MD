export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return 
    let chat = global.db.data.chats[m.chat]

    try {
        const res = await fetch('http://worldtimeapi.org/api/timezone/Asia/Jakarta');
        const data = await res.json();
        const currentDate = new Date(data.datetime);
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        
        // Initialize reminder tracker if needed
        const lastReminder = global.db.data.settings.lastRamadanReminder;
        const currentKey = `${currentDate.toISOString().slice(0, 10)}_${hours}`;

        // Only proceed if not already sent for this hour window
        if (!lastReminder[currentKey] && minutes < 1) {
            let remMessage = "";
            if (hours === 4) {
                remMessage = "Selamat Sahur! Jangan lupa makan sahur ya.";
            } else if (hours === 18) {
                remMessage = "Selamat Berbuka! Saatnya berbuka puasa.";
            } else if (hours === 0) {
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