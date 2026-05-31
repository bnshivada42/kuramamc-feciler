const mineflayer = require('mineflayer');
const config = require('./config');

class StressBot {
    constructor(botName, index = 0) { 
        this.botName = botName;
        this.index = index; 
        this.password = `Kurama_${this.botName}_123`;
        this.bot = null;
        this.loops = [];
    }

    init() {
        setTimeout(() => {
            console.log(`[${this.botName}] Sunucuya bağlanıyor...`);
            this.bot = mineflayer.createBot({
                host: config.SERVER.IP,
                port: config.SERVER.PORT,
                username: this.botName,
                version: false,
                hideErrors: true,
                checkTimeoutInterval: 60000,
                
                // --- GRIMAC PAKET FİLTRELERİ ---
                loadInternalPlugins: true, 
                storageProvider: null,
                // Mineflayer'ın saniyede attığı paket limitini insani düzeye (20 tps) sabitler
                physicsEnabled: true 
            });

            this.setupEvents();
        }, this.index * config.TEST.JOIN_DELAY); 
    }

    setupEvents() {
        this.bot.on('spawn', () => {
            console.log(`[${this.botName}] Sunucuda doğdu. Kayıt yapılıyor...`);
            
            // Botun fizik motorunun paketleri üst üste bindirmemesi için hızı hafifçe insani düzeye çekiyoruz
            if (this.bot.physics) {
                this.bot.physics.yawSpeed = 3.0; // Ani kafa dönmelerini engeller (Simulation hatasını çözer)
            }

            setTimeout(() => {
                this.bot.chat(`/register ${this.password}`);
                
                setTimeout(() => {
                    this.startAkilliSürekliAI();
                }, 4000);
            }, 3000);
        });

        this.bot.on('kick', (reason) => {
            console.log(`[${this.botName}] Sunucudan atıldı, sebep:`, reason);
            this.handleReconnect();
        });
        this.bot.on('error', (err) => this.handleReconnect());
    }

    startAkilliSürekliAI() {
        console.log(`[${this.botName}] GrimAC Korumalı Sürekli Hareket Modu Aktif.`);

        // Gelişmiş Zamanlayıcı (TickTimer ve GroundSpoof hatalarını engellemek için bas-bırak döngüsü)
        this.loops.push(setInterval(() => {
            if (!this.bot?.entity) return;

            // Paket birikmesini önlemek için her döngü başında hareketleri sıfırla ve sunucuya nefes aldır
            const movements = ['forward', 'back', 'left', 'right', 'jump'];
            movements.forEach(m => this.bot.setControlState(m, false));

            // Chunk Kontrolü
            const botBlock = this.bot.blockAt(this.bot.entity.position.offset(0, -1, 0));
            
            if (botBlock && botBlock.type !== 0) {
                // Rastgele yön seçimi
                const yonler = ['forward', 'left', 'right'];
                const rastgeleYon = yonler[Math.floor(Math.random() * yonler.length)];
                
                // Yönü tetikle
                this.bot.setControlState(rastgeleYon, true);

                // Rastgele kafasını çevirsin ki Simulation (Bakış) simülasyonu tam otursun
                const randomYaw = (Math.random() * 360 - 180) * (Math.PI / 180);
                this.bot.look(randomYaw, 0, true);

                // %25 ihtimalle zıplasın (GroundSpoof yememesi için sadece zemindeyse zıplama tetiklenir)
                if (Math.random() < 0.25 && this.bot.entity.onGround) {
                    this.bot.setControlState('jump', true);
                    // Zıplama paketini havada asılı kalmasın diye 200ms sonra bırakır
                    setTimeout(() => {
                        if (this.bot?.entity) this.bot.setControlState('jump', false);
                    }, 200);
                }
            } else {
                // Güvenli düz yürüyüş
                this.bot.setControlState('forward', true);
            }

        }, 1000)); // Paket yığılmasını (TickTimer) önlemek için kontrolü 1 saniyeye çektik, içerideki hareket akıcı kalır.

        // 2. Chat Döngüsü (Tam 25 Dakikada Bir)
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
        setTimeout(() => this.init(), 35000 + (this.index * 2000)); 
    }
}

module.exports = StressBot;
