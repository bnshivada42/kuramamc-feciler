const mineflayer = require('mineflayer');
const config = require('./config');

class StressBot {
    constructor(botName) {
        this.botName = botName;
        this.password = this.generatePassword();
        this.bot = null;
        this.loops = [];
    }

    generatePassword() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let pass = '';
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
    }

    init() {
        this.bot = mineflayer.createBot({
            host: config.SERVER.IP,
            port: config.SERVER.PORT,
            username: this.botName,
            version: false,
            hideErrors: true,
            checkTimeoutInterval: 60000
        });

        this.setupEvents();
    }

    setupEvents() {
        this.bot.on('spawn', () => {
            // Sunucu giriş paketlerinin çakışmaması için asenkron gecikme
            setTimeout(() => {
                this.bot.chat(`/register ${this.password}`);
                this.startAI();
            }, 3000);
        });

        // Hata ve düşme durumlarında sistemi kitlemeden asenkron yeniden bağlanma
        this.bot.on('kick', () => this.handleReconnect());
        this.bot.on('error', () => this.handleReconnect());
    }

    startAI() {
        if (this.bot.physics) {
            this.bot.physics.maxGroundSpeed = 5.6;
            this.bot.setControlState('sprint', true);
        }

        // 1. Gelişmiş Fizik ve Jump-Sprint Döngüsü (0.5 saniyede bir)
        this.loops.push(setInterval(() => {
            if (!this.bot?.entity) return;

            // Akıcı ve hızlı kafa rotasyon paketleri (Sunucu işlemcisini yorar)
            const yaw = Math.random() * Math.PI * 2;
            const pitch = (Math.random() - 0.5) * Math.PI;
            this.bot.look(yaw, pitch, false);

            // Gelişmiş Jump-Sprint Fizik Algoritması
            const movements = ['forward', 'left', 'right', 'jump'];
            const randomMove = movements[Math.floor(Math.random() * movements.length)];

            movements.forEach(m => this.bot.setControlState(m, false));
            this.bot.setControlState('sprint', true);
            this.bot.setControlState(randomMove, true);

            // Sunucuya sürekli "ArmAnimation" paketi fırlatır
            this.bot.swingArm('mainhand');
        }, 500));

        // 2. Akıllı Blok Etkileşimi (0.3 saniyede bir)
        // Botun tam karşısındaki blokları algılayıp kazma isteği (Dig Packet) gönderir ve iptal eder
        this.loops.push(setInterval(() => {
            if (!this.bot?.entity) return;
            const block = this.bot.blockAtCursor(4);
            if (block) {
                this.bot.dig(block, 'ignore').catch(() => {});
            }
        }, 300));

        // 3. Hızlı Slot Değişimi ve Sneak Flood (0.7 saniyede bir)
        this.loops.push(setInterval(() => {
            if (!this.bot?.entity) return;
            
            // Slot değiştirme paketi gönderimi
            const randomSlot = Math.floor(Math.random() * 9);
            this.bot.setQuickBarSlot(randomSlot);

            // Eğilip kalkma (Shift) paketi gönderimi
            const isSneaking = this.bot.getControlState('sneak');
            this.bot.setControlState('sneak', !isSneaking);
        }, 700));

        // 4. Kesin Zamanlı Chat Döngüsü (Tam 25 Dakikada Bir)
        this.loops.push(setInterval(() => {
            if (!this.bot?.entity) return;
            const randomMsg = config.SPAM_MESSAGES[Math.floor(Math.random() * config.SPAM_MESSAGES.length)];
            this.bot.chat(randomMsg);
        }, config.TEST.CHAT_INTERVAL));
    }

    clearLoops() {
        this.loops.forEach(clearInterval);
        this.loops = [];
    }

    handleReconnect() {
        this.clearLoops();
        if (this.bot) {
            this.bot.removeAllListeners();
            this.bot.end();
        }
        setTimeout(() => this.init(), 5000);
    }
}

module.exports = StressBot;
