module.exports = {
    SERVER: {
        IP: 'oyna.kuramamc.com.tr',       // Sunucu IP adresi
        PORT: 25565                       // Sunucu portu
    },
    TEST: {
        JOIN_DELAY: 6000,     // Ücretsiz proxyler yavaş olduğu için gecikmeyi 6 saniyeye çıkardık
        CHAT_INTERVAL: 1500000 // Tam 25 dakika (ms)
    },
    BOT_NAMES: ['Raffu', 'Nerfixo', 'rootx', 'aslan522', 'Jeb', 'iamdexter', 'Xaneio'],
    
    // Görseldeki HTTP proxylerine göre IP dağılımı:
    PROXIES: [
        null, // Raffu -> Render IP
        null, // Nerfixo -> Render IP
        null, // rootx -> Render IP
        
        'http://78.186.185.152:5253', // aslan522 -> Proxy 1 (Görseldeki 1. sıra)
        'http://78.186.185.152:5253', // Jeb -> Proxy 1
        'http://78.186.185.152:5253', // iamdexter -> Proxy 1
        
        'http://176.88.166.174:8080'  // Xaneio -> Proxy 2 (Görseldeki 3. sıra)
    ],

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
