
import fs from 'fs';
import { join } from 'path';

let lastCheck = 0;
const CHECK_INTERVAL = 45000; 

export async function before(m, { conn, isAdmin: _isAdmin, isBotAdmin: _isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return;

    const now = Date.now();
    if (now - lastCheck < CHECK_INTERVAL) return;
    lastCheck = now;

    try {
        
        const jakartaTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
        const currentMinutes = jakartaTime.getMinutes();
        // Hanya cek jika berada di dekat pergantian jam (0-1 atau 58-59)
        if (currentMinutes > 1 && currentMinutes < 58) return;
        
        // Format tanggal (DD-MM-YYYY) dan ambil jam saat ini
        const currentDate = jakartaTime.getDate().toString().padStart(2, '0') + '-' +
                            (jakartaTime.getMonth() + 1).toString().padStart(2, '0') + '-' +
                            jakartaTime.getFullYear();
        const currentHour = jakartaTime.getHours();
        
        if (!global.db.data.settings.lastRamadanReminder) {
            global.db.data.settings.lastRamadanReminder = {};
        }
        const lastReminder = global.db.data.settings.lastRamadanReminder;
        const currentKey = `${currentDate}_${currentHour}`;
        if (lastReminder[currentKey]) return;
        
        
        const jsonPath = join(process.cwd(), 'json', 'ramadhan.json');
        const jsonData = fs.readFileSync(jsonPath, 'utf-8');
        const data = JSON.parse(jsonData);
        
        const todaySchedule = data.result.data.find(item => 
            item.date.gregorian.date === currentDate
        );
        if (!todaySchedule) {
            console.log('Schedule not found for date:', currentDate);
            return;
        }
        
        const timings = todaySchedule.timings;
        
        // Fungsi untuk parsing waktu dari format "HH:MM (WIB)"
        const parseTime = (timeStr) => {
            const [hour] = timeStr.split(' ')[0].split(':').map(Number);
            return hour;
        };

        // Parsing waktu-waktu relevan dari JSON
        const parsedFajrHour = parseTime(timings.Fajr);
        const parsedMaghribHour = parseTime(timings.Maghrib);
        const parsedMidnightHour = parseTime(timings.Midnight);
      
        const fajrhout = "Pengingat: Waktu mulai puasa telah tiba (Fajr).";
        const maghrbhour = "Pengingat: Waktu berbuka puasa telah tiba (Maghrib).";
        const midnighthout = "Pengingat: Hari baru telah dimulai, siap menjalankan puasa (Midnight).";
        
        // Tentukan pesan yang akan dikirim sesuai dengan waktu saat ini
        let remMessage = "";
        if (currentHour === parsedFajrHour) {
            remMessage = fajrhout;
        } else if (currentHour === parsedMaghribHour) {
            remMessage = maghrbhour;
        } else if (currentHour === parsedMidnightHour) {
            remMessage = midnighthout;
        }
        
        if (remMessage) {
            lastReminder[currentKey] = true;
            await conn.sendMessage(global.info.nomorown + '@s.whatsapp.net', { text: remMessage });
        }
    } catch (e) {
        console.error('Error processing schedule:', e);
    }
    
    return;
}