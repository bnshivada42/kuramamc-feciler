module.exports = {
    SERVER: {
        IP: 'oyna.kuramamc.com.tr',
        PORT: 25565
    },
    TEST: {
        JOIN_DELAY: 7000, // Proxy gecikmeleri olduğu için süreyi biraz esnettik
        CHAT_INTERVAL: 1500000
    },
    BOT_NAMES: ['Raffu', 'Nerfixo', 'rootx', 'aslan522', 'Jeb', 'iamdexter', 'Xaneio'],
    
    // IP Dağılımı:
    // 0,1,2: Render IP
    // 3,4,5: Proxy 1 (SOCKS4)
    // 6    : Proxy 2 (HTTP)
    PROXIES: [
        null, null, null, // Render
        'socks4://176.236.37.132:1080', // Proxy 1
        'socks4://176.236.37.132:1080', // Proxy 1
        'socks4://176.236.37.132:1080', // Proxy 1
        'http://149.86.151.14:8080'     // Proxy 2
    ],

    SPAM_MESSAGES: [
        'lag var mı sizde de?', 'yetkili alımı var mı?', 'spawn çok güzel!', 
        'sa', 'admin varmı?', 'market fiyatları güzelmiş', 'sunucu çok iyiymiş'
    ]
};
