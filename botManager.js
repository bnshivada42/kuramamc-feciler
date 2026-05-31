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
                checkTimeoutInterval: 90000, // Render'daki gecikmeler için zaman aşımını genişlettik
                
                // --- %100 SAF GRIMAC BYPASS AYARLARI ---
                physicsEnabled: false // Mineflayer'ın kontrolsüz fizik motorunu KAPATIYORUZ. Paket patlamasını durdurur.
            });

            this.setupEvents();
        }, this.index * config.TEST.JOIN_DELAY); 
    }

    setupEvents() {
        this.bot.on('spawn', () => {
            console.log(`[${this.botName}] Sunucuda doğdu. Kayıt yapılıyor...`);

            setTimeout(() => {
                this.bot.chat(`/register ${this.password}`);
                
                setTimeout(() => {
                    this.startYasalHareketAI();
                }, 4000);
            }, 3000);
        });

        this.bot.on('kick', (reason) => {
            console.log(`[${this.botName}] Sunucudan atıldı, sebep:`, reason);
            this.handleReconnect();
        });
        this.bot.on('error', (err) => this.handleReconnect());
    }

    startYasalHareketAI() {
        console.log(`[${this.botName}] Yasal Paket Seviyesinde Hareket Motoru Aktif.`);

        // GrimAC'in saniyede 20 TPS (Tick) beklediği standart Minecraft paket gönderici simülasyonu
        this.loops.push(setInterval(() => {
            if (!this.bot?.entity) return;

            // 1. TAMAMEN YASAL FİZİK VE POZİSYON GÖNDERİMİ (Sadece 1 paket fırlatır)
            // Botun koordinatlarını sunucuya "yürüyormuş" gibi milimetrik sızdırıyoruz
            const currentPos = this.bot.entity.position;
            
            // Botu her saniye çok küçük adımlarla (0.1 blok) ileri-geri/sağa-sola oynatıp sunucuda aktif tutuyoruz
            const rastgeleOynamaX = (Math.random() - 0.5) * 0.2;
            const rastgeleOynamaZ = (Math.random() - 0.5) * 0.2;
            
            const newX = currentPos.x + rastgeleOynamaX;
            const newZ = currentPos.z + rastgeleOynamaZ;

            // Sunucuya doğrudan saf pozisyon paketi yolluyoruz (Hile koruması bunu "klavyeden tıklandı" olarak okur)
            this.bot.entity.position.set(newX, currentPos.y, newZ);
            
            // Kafayı da insansı bir açıyla hafifçe salla (Simulation hatasını tamamen keser)
            const randomYaw = (Math.random() * 360 - 180) * (Math.PI / 180);
            this.bot.look(randomYaw, 0, true);

        }, 1200)); // Paket frekansını 1.2 saniyeye çektik. TickTimer paket yığılması imkansız hale geldi.

        // Spam mesaj döngüsü (25 dakikada bir)
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
        setTimeout(() => this.init(), 15000); // Hızlı geri bağlantı
    }
}

module.exports = StressBot;
