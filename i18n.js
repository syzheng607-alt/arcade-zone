// 多语言支持脚本
const translations = {
    en: {
        // 导航
        'nav.home': 'Home',
        'nav.games': 'Games',
        'nav.purchase': 'Purchase',
        'nav.contact': 'Contact Us',
        'nav.language': 'Language',
        
        // 认证
        'auth.login': 'Login',
        'auth.signup': 'Sign Up',
        'auth.logout': 'Logout',
        'auth.profile': 'Profile',
        
        // 游戏
        'game.play': 'PLAY',
        'game.playNow': 'PLAY NOW',
        'game.free': 'FREE',
        'game.players': 'players',
        'game.category.action': 'ACTION',
        'game.category.puzzle': 'PUZZLE',
        'game.category.strategy': 'STRATEGY',
        'game.category.arcade': 'ARCADE',
        'game.category.sports': 'SPORTS',
        'game.category.racing': 'RACING',
        
        // 首页
        'hero.title': 'Welcome to ArcadeZone',
        'hero.subtitle': 'Your ultimate destination for arcade gaming',
        'hero.cta': 'EXPLORE GAMES',
        
        'featured.title': 'Featured Games',
        'featured.subtitle': 'Check out our most popular arcade games',
        
        // 游戏页面
        'games.title': 'All Games',
        'games.subtitle': 'Discover your next favorite game',
        'games.search': 'Search games...',
        'games.allCategories': 'All Categories',
        'games.sortBy': 'Sort by',
        'games.sortPopular': 'Most Popular',
        'games.sortNew': 'Newest',
        'games.sortAZ': 'A-Z',
        
        // Footer
        'footer.description': 'Your ultimate destination for arcade gaming',
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms of Service',
        'footer.copyright': '© 2024 ArcadeZone. All rights reserved. Built with passion for gaming.',
        
        // Chess Master
        'chess.title': 'Chess Master',
        'chess.description': 'Challenge our AI in classic chess. Full rules with promotion and checkmate detection.',
        
        // 其他游戏
        'game1.title': 'Pixel Quest',
        'game1.description': 'Classic 2D adventure with retro graphics',
        'game2.title': 'Space Invaders',
        'game2.description': 'Defend Earth from alien invasion',
        'game3.title': 'Pac-Man Rush',
        'game3.description': 'Collect dots and avoid ghosts',
        'game4.title': 'Tetris Pro',
        'game4.description': 'Stack blocks and clear lines',
        'game5.title': 'Street Fighter',
        'game5.description': 'Battle your way to victory',
        'game6.title': 'Racing Thunder',
        'game6.description': 'High-speed racing action'
    },
    zh: {
        // 导航
        'nav.home': '首页',
        'nav.games': '游戏',
        'nav.purchase': '购买',
        'nav.contact': '联系我们',
        'nav.language': '语言',
        
        // 认证
        'auth.login': '登录',
        'auth.signup': '注册',
        'auth.logout': '登出',
        'auth.profile': '个人资料',
        
        // 游戏
        'game.play': '开始游戏',
        'game.playNow': '立即游戏',
        'game.free': '免费',
        'game.players': '玩家',
        'game.category.action': '动作',
        'game.category.puzzle': '益智',
        'game.category.strategy': '策略',
        'game.category.arcade': '街机',
        'game.category.sports': '体育',
        'game.category.racing': '竞速',
        
        // 首页
        'hero.title': '欢迎来到 ArcadeZone',
        'hero.subtitle': '您的终极街机游戏目的地',
        'hero.cta': '探索游戏',
        
        'featured.title': '精选游戏',
        'featured.subtitle': '查看我们最受欢迎的街机游戏',
        
        // 游戏页面
        'games.title': '所有游戏',
        'games.subtitle': '发现您的下一个最爱游戏',
        'games.search': '搜索游戏...',
        'games.allCategories': '所有类别',
        'games.sortBy': '排序方式',
        'games.sortPopular': '最受欢迎',
        'games.sortNew': '最新',
        'games.sortAZ': 'A-Z',
        
        // Footer
        'footer.description': '您的终极街机游戏目的地',
        'footer.privacy': '隐私政策',
        'footer.terms': '服务条款',
        'footer.copyright': '© 2024 ArcadeZone. 保留所有权利。用心打造游戏体验。',
        
        // Chess Master
        'chess.title': '国际象棋大师',
        'chess.description': '挑战我们的 AI 进行经典国际象棋对战。完整规则，支持升变和将死检测。',
        
        // 其他游戏
        'game1.title': '像素冒险',
        'game1.description': '经典 2D 复古风格冒险游戏',
        'game2.title': '太空入侵者',
        'game2.description': '保卫地球免受外星人入侵',
        'game3.title': '吃豆人冲刺',
        'game3.description': '收集豆子并躲避幽灵',
        'game4.title': '俄罗斯方块专业版',
        'game4.description': '堆叠方块并消除行',
        'game5.title': '街霸',
        'game5.description': '战斗到最后的胜利',
        'game6.title': '雷霆竞速',
        'game6.description': '高速竞速动作游戏'
    }
};

// 获取当前语言
let currentLang = localStorage.getItem('site-language') || 'en';

// 翻译函数
function t(key) {
    return translations[currentLang] && translations[currentLang][key] 
        ? translations[currentLang][key] 
        : key;
}

// 应用翻译到页面
function applyTranslations(lang) {
    currentLang = lang;
    
    // 更新所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            // 根据元素类型决定更新方式
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // 更新语言按钮显示
    const langDisplays = document.querySelectorAll('.lang-display');
    langDisplays.forEach(display => {
        display.textContent = lang === 'en' ? '中文' : 'EN';
    });
    
    // 更新 HTML lang 属性
    document.documentElement.lang = lang;
    
    // 保存到 localStorage
    localStorage.setItem('site-language', lang);
    
    console.log('Language changed to:', lang);
}

// 切换语言
function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'zh' : 'en';
    applyTranslations(newLang);
}

// 初始化语言
function initializeLanguage() {
    // 从 localStorage 读取保存的语言
    const savedLang = localStorage.getItem('site-language');
    if (savedLang) {
        applyTranslations(savedLang);
    } else {
        // 默认使用英文
        applyTranslations('en');
    }
}

// 页面加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguage);
} else {
    initializeLanguage();
}

// 导出供其他脚本使用
window.i18n = {
    t,
    toggleLanguage,
    applyTranslations,
    getCurrentLanguage: () => currentLang
};

