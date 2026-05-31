module.exports = {
    SERVER: {
        IP: 'oyna.kuramamc.com.tr',       // Sunucu IP adresi
        PORT: 25565                       // Sunucu portu
    },
    TEST: {
        JOIN_DELAY: 5000,     // Botlar arası giriş gecikmesi 5 saniyeye çıkarıldı (Sıkışma engellendi)
        CHAT_INTERVAL: 1500000 // Tam 25 dakika (ms)
    },
    // Tamamen sade, ek kelimesiz özel isim listesi
    BOT_NAMES: ['Raffu', 'Nerfixo', 'rootx', 'aslan522', 'Jeb', 'iamdexter', 'Xaneio'],
    
    // IP Başına 3 Oyuncu Limitini Aşmak İçin Proxy Havuzu
    // NULL olanlar Render'ın kendi IP'sini kullanır (İlk 3 bot için)
    PROXIES: [
        null, // Raffu -> Normal IP
        null, // Nerfixo -> Normal IP
        null, // rootx -> Normal IP
        
        'socks5://Kullanici:Sifre@ProxyIP1:Port', // aslan522 -> Proxy 1
        'socks5://Kullanici:Sifre@ProxyIP1:Port', // Jeb -> Proxy 1
        'socks5://Kullanici:Sifre@ProxyIP1:Port', // iamdexter -> Proxy 1
        
        'socks5://Kullanici:Sifre@ProxyIP2:Port'  // Xaneio -> Proxy 2 (Farklı IP)
    ],

    // Genişletilmiş ve optimize edilmiş mesaj havuzu
    SPAM_MESSAGES: [
        'lag var mı sizde de?',
        'yetkili alımı var mı sunucuda?',
        'spawn çok güzel olmuş elinize sağlık',
        'sa',
        'admin varmı?',
        'market fiyatları güzelmiş',
        'sunucu çok iyiymiş la valla çok sardı',
        'etiket atmayın rahatsız oluyorum',
        'sunucuda hile koruması var mı?',
        'vip fiyatlarına nereden bakıyoruz?'
    ]
};
