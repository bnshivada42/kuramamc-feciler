const StressBot = require('./botManager');
const config = require('./config');

let botCount = 0;

function startEngine() {
    console.log(`🎮 Sunucu: ${config.SERVER.IP}:${config.SERVER.PORT}`);
    console.log(`👥 Bot Sayısı: ${config.BOT_NAMES.length} Özel Hesap`);

    const queueInterval = setInterval(() => {
        if (botCount >= config.BOT_NAMES.length) {
            clearInterval(queueInterval);
            console.log('📌 Botlar Suncuuy Giriş Yaptı...');
            return;
        }

        const botName = config.BOT_NAMES[botCount];
        const runner = new StressBot(botName);
        runner.init();

        botCount++;
    }, config.TEST.JOIN_DELAY);
}

// Canavarı en gelişmiş haliyle başlat
startEngine();
