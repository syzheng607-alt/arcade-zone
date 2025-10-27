// 通用 Footer 组件
// 统一的版权信息，便于维护

export const FOOTER_CONFIG = {
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

// 渲染 Footer 的 JavaScript 函数
export function renderFooter(element) {
    if (!element) return;
    
    element.innerHTML = `
        <div class="bg-black bg-opacity-80 border-t border-orange py-12 px-4">
            <div class="max-w-7xl mx-auto text-center">
                <div class="mb-8">
                    <h3 class="text-2xl font-bold orbitron neon-glow mb-4">${FOOTER_CONFIG.logo}</h3>
                    <p class="text-gray-400 max-w-2xl mx-auto">
                        ${FOOTER_CONFIG.description}
                    </p>
                </div>
                
                <div class="flex justify-center space-x-8 mb-8">
                    ${FOOTER_CONFIG.links.map(link => 
                        `<a href="${link.href}" class="nav-link font-semibold">${link.text}</a>`
                    ).join('')}
                </div>
                
                <div class="border-t border-gray-700 pt-8">
                    <p class="text-gray-400">
                        ${FOOTER_CONFIG.copyright}
                    </p>
                </div>
            </div>
        </div>
    `;
}

// 自动初始化（如果页面有 footer 容器）
document.addEventListener('DOMContentLoaded', function() {
    const footerContainer = document.getElementById('dynamic-footer');
    if (footerContainer) {
        renderFooter(footerContainer);
    }
});
