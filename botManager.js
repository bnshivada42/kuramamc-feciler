const mineflayer = require('mineflayer');
const config = require('./config');

class StressBot {
    // index parametresi ekledik, varsayılan olarak 0 verdik
    constructor(botName, index = 0) { 
        this.botName = botName;
        this.index = index; // Her botun sırasını burada tutuyoruz
        // AuthMe kilitlenmesin diye şifreyi isme özel sabitliyoruz (Her restartta değişmez)
        this.password = `Kurama_${this.botName}_123`;
        this.bot = null;
        this.loops = [];
    }

    init() {
        // config.TEST.JOIN_DELAY kullanarak her botu sırayla sunucuya gönderiyoruz
        setTimeout(() => {
            console.log(`[${this.botName}] Sunucuya bağlanıyor...`);
            this.bot = mineflayer.createBot({
                host: config.SERVER.IP,
                port: config.SERVER.PORT,
                username: this.botName,
                version: false,
                hideErrors: true,
                checkTimeoutInterval: 60000,
                
                // --- CHUNK VE DÜNYA AYARLARI ---
                // Botların harita ve fizik paketlerini zorunlu işlemesini sağlar
                loadInternalPlugins: true, 
                // Chunk verilerini disk yerine RAM'de geçici tutarak Render'ı yormaz
                storageProvider: null      
            });

            this.setupEvents();
        }, this.index * config.TEST.JOIN_DELAY); // index * 1800ms (veya config'deki değer) gecikmeyle girerler
    }

    setupEvents() {
        this.bot.on('spawn', () => {
            console.log(`[${this.botName}] Sunucuda doğdu. Kayıt yapılıyor...`);
            
            // Sunucu giriş paketlerinin çakışmaması için asenkron gecikme
            setTimeout(() => {
                // AuthMe tek şifreye çektiğimiz için direkt gönderiyoruz
                this.bot.chat(`/register ${this.password}`);
                
                // Kayıttan 3 saniye sonra sakin hareketleri başlat
                setTimeout(() => {
                    this.startSakinAI();
                }, 3000);
            }, 3000);
        });

        // Hata ve düşme durumlarında sistemi kilitlemeden asenkron yeniden bağlanma
        this.bot.on('kick', (reason) => {
            console.log(`[${this.botName}] Sunucudan atıldı, sebep:`, reason);
            this.handleReconnect();
        });
        this.bot.on('error', (err) => this.handleReconnect());
    }

    startSakinAI() {
        console.log(`[${this.botName}] Sakin hareket simülasyonu başlatıldı.`);

        // 1. Arada Bir Yürüme ve Zıplama Döngüsü (Her 4 saniyede bir kontrol eder)
        this.loops.push(setInterval(() => {
            if (!this.bot?.entity) return;

            // Önceki hareket durumlarını tamamen sıfırla
            const movements = ['forward', 'back', 'left', 'right', 'jump'];
            movements.forEach(m => this.bot.setControlState(m, false));

            // CRITICAL CHUNK KONTROLÜ: Botun tam olarak bastığı yerdeki bloğu buluyoruz (Y ekseni -1)
            const botBlock = this.bot.blockAt(this.bot.entity.position.offset(0, -1, 0));
            
            // Eğer botun altındaki blok yüklendiyse ve hava (0) değilse güvenle hareket etsin
            if (botBlock && botBlock.type !== 0) {
                // %60 ihtimalle hareket etsin, %40 ihtimalle durup izlesin
                if (Math.random() < 0.60) {
                    const yonler = ['forward', 'left', 'right'];
                    const rastgeleYon = yonler[Math.floor(Math.random() * yonler.length)];
                    
                    // Yönü aktif et
                    this.bot.setControlState(rastgeleYon, true);

                    // %30 ihtimalle yürürken bir de zıplasın
                    if (Math.random() < 0.30) {
                        this.bot.setControlState('jump', true);
                    }

                    // Bastığı tuşları 1.5 saniye sonra bıraksın ki kesik kesik, insansı yürüsün
                    setTimeout(() => {
                        if (this.bot?.entity) {
                            movements.forEach(m => this.bot.setControlState(m, false));
                        }
                    }, 1500);
                }
            }
        }, 4000));

        // 2. Kesin Zamanlı Chat Döngüsü (Tam 25 Dakikada Bir)
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
        // Düştüğünde yine kendi sırasına göre güvenli süre bekleyip (32 saniye + sıra) temizce dönsün
        setTimeout(() => this.init(), 32000 + (this.index * 2000)); 
    }
}

module.exports = StressBot;
