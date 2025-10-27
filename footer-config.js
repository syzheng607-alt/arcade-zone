// Footer 配置 - 统一管理，避免重复
// 修改这里就能更新所有页面的 Footer

const FOOTER_CONFIG = {
    copyright: '© 2025 RockCaveGames. All rights reserved. Built with passion for gaming.',
    logo: 'ArcadeZone',
    description: 'Your ultimate destination for arcade gaming. Experience the thrill of classic and modern games in one comprehensive platform.',
    links: [
        { text: 'Home', href: 'index.html' },
        { text: 'Games', href: 'games.html' },
        { text: 'Purchase', href: 'purchase.html' },
        { text: 'Contact Us', href: 'contact.html' }
    ]
};

// 自动更新页面中的所有 Footer
document.addEventListener('DOMContentLoaded', function() {
    const footerElement = document.querySelector('footer');
    if (!footerElement) return;
    
    // 只更新版权信息部分，保留其他内容
    const copyrightElement = footerElement.querySelector('p.text-gray-400');
    if (copyrightElement) {
        copyrightElement.textContent = FOOTER_CONFIG.copyright;
    }
});
