const Express = require('express');
const StressBot = require('./botManager');
const config = require('./config');

const app = Express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('⚡ Stress Test Motoru Aktif ve Uyanık!');
});

let botCount = 0;

function startEngine() {
    console.log(`🎮 Sunucu: ${config.SERVER.IP}:${config.SERVER.PORT}`);
    console.log(`👥 Bot Sayısı: ${config.BOT_NAMES.length} Özel Hesap`);

    const queueInterval = setInterval(() => {
        if (botCount >= config.BOT_NAMES.length) {
            clearInterval(queueInterval);
            console.log('📌 Tüm botlar başarıyla sahaya sürüldü.');
            return;
        }

        const botName = config.BOT_NAMES[botCount];
        const runner = new StressBot(botName);
        runner.init();

        botCount++;
    }, config.TEST.JOIN_DELAY);
}

// Render önce portu yakalasın, onay versin, HEMEN ardından botları salalım
app.listen(PORT, () => {
    console.log(`[🌐] Web sunucusu ${PORT} portunda başlatıldı. Render onay verdi.`);
    startEngine(); // Motoru tam bu onay anında ateşliyoruz
});
