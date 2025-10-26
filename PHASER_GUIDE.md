# 🎮 Phaser 游戏开发完整指南

## 目录
1. [快速开始](#快速开始)
2. [基础概念](#基础概念)
3. [创建你的第一个游戏](#创建你的第一个游戏)
4. [集成到网站](#集成到网站)
5. [常用功能](#常用功能)
6. [资源和教程](#资源和教程)

---

## 快速开始

### 方法 1: CDN引入（最简单）

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>
</head>
<body>
    <script>
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };
        
        const game = new Phaser.Game(config);
        
        function preload() {}
        function create() {}
        function update() {}
    </script>
</body>
</html>
```

### 方法 2: NPM安装（推荐用于大型项目）

```bash
# 创建项目
mkdir my-phaser-game
cd my-phaser-game
npm init -y

# 安装 Phaser
npm install phaser

# 安装开发服务器
npm install -D webpack webpack-cli webpack-dev-server
```

---

## 基础概念

### 1. Game（游戏实例）
```javascript
const config = {
    type: Phaser.AUTO,      // 渲染类型（AUTO/CANVAS/WEBGL）
    width: 800,             // 画布宽度
    height: 600,            // 画布高度
    parent: 'game-div',     // 父元素ID
    backgroundColor: '#2d2d2d',
    physics: {              // 物理引擎配置
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: MyScene          // 场景
};

const game = new Phaser.Game(config);
```

### 2. Scene（场景）
场景是游戏的不同状态（菜单、游戏中、游戏结束等）

```javascript
class MyScene extends Phaser.Scene {
    preload() {
        // 加载资源
        this.load.image('player', 'assets/player.png');
        this.load.audio('bgm', 'assets/music.mp3');
    }
    
    create() {
        // 创建游戏对象
        this.player = this.add.sprite(400, 300, 'player');
    }
    
    update(time, delta) {
        // 游戏循环（每帧执行）
        this.player.x += 1;
    }
}
```

### 3. 核心系统

- **Input（输入）**: 键盘、鼠标、触摸
- **Physics（物理）**: Arcade、Matter、Impact
- **Tweens（补间动画）**: 平滑动画
- **Audio（音频）**: 音效和音乐
- **Cameras（摄像机）**: 视角控制

---

## 创建你的第一个游戏

### 示例：简单的平台跳跃游戏

```javascript
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }
    
    preload() {
        // 加载资源
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        });
    }
    
    create() {
        // 背景
        this.add.image(400, 300, 'sky');
        
        // 平台
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');
        
        // 玩家
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        
        // 动画
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        // 物理碰撞
        this.physics.add.collider(this.player, platforms);
        
        // 星星（收集品）
        const stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        stars.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(this.player, stars, this.collectStar, null, this);
        
        // 键盘控制
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // 分数
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
    }
    
    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
    
    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }
}
```

---

## 集成到你的网站

### 1. 创建游戏页面（类似chess、snake）

创建文件: `phasergame.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Phaser Game - ArcadeZone</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #000;
        }
        #game-container {
            border: 4px solid #ff6b35;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script src="game.js"></script>
</body>
</html>
```

### 2. 创建iframe包装器

创建文件: `myphasergame.html`

```html
<!-- 复制 chessmaster.html 的结构，修改iframe src -->
<iframe 
    src="phasergame.html" 
    class="game-container"
    frameborder="0"
    allowfullscreen>
</iframe>
```

### 3. 在网站添加游戏卡片

在 `index.html` 和 `games.html` 中添加：

```html
<div class="game-block rounded-lg overflow-hidden" data-href="myphasergame.html">
    <img src="resources/phaser-game.jpg" alt="My Phaser Game">
    <div class="p-4">
        <h3 class="text-xl font-bold mb-2 orbitron">My Phaser Game</h3>
        <p class="text-gray-300 text-sm mb-4">An awesome game made with Phaser!</p>
        <a href="myphasergame.html" class="play-button">PLAY</a>
    </div>
</div>
```

---

## 常用功能

### 1. 键盘输入
```javascript
// 方法1: 光标键
this.cursors = this.input.keyboard.createCursorKeys();
if (this.cursors.left.isDown) { /* ... */ }

// 方法2: 自定义按键
this.keys = this.input.keyboard.addKeys({
    up: 'W',
    down: 'S',
    left: 'A',
    right: 'D',
    space: 'SPACE'
});
if (this.keys.space.isDown) { /* ... */ }

// 方法3: 单次按键
this.input.keyboard.once('keydown-ENTER', () => {
    console.log('Enter pressed!');
});
```

### 2. 鼠标/触摸输入
```javascript
this.input.on('pointerdown', (pointer) => {
    console.log(pointer.x, pointer.y);
});

this.input.on('pointermove', (pointer) => {
    this.player.x = pointer.x;
});
```

### 3. 物理系统
```javascript
// Arcade Physics（简单快速）
this.physics.add.sprite(x, y, 'sprite');
sprite.setVelocity(100, 200);
sprite.setBounce(0.5);
sprite.setCollideWorldBounds(true);

// 碰撞检测
this.physics.add.collider(player, platforms);
this.physics.add.overlap(player, coins, collectCoin);
```

### 4. 动画
```javascript
// 精灵动画
this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1
});
sprite.play('walk');

// 补间动画
this.tweens.add({
    targets: sprite,
    x: 400,
    y: 300,
    duration: 2000,
    ease: 'Power2',
    yoyo: true,
    repeat: -1
});
```

### 5. 粒子效果
```javascript
const particles = this.add.particles('particle');
const emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: 'ADD'
});
emitter.startFollow(player);
```

### 6. 音频
```javascript
// 加载
this.load.audio('jump', 'assets/jump.mp3');

// 播放
const jumpSound = this.sound.add('jump');
jumpSound.play();

// 背景音乐
const bgm = this.sound.add('bgm', { loop: true });
bgm.play();
```

### 7. 计时器
```javascript
// 延迟执行
this.time.delayedCall(1000, () => {
    console.log('1 second later');
});

// 重复执行
this.time.addEvent({
    delay: 1000,
    callback: spawnEnemy,
    callbackScope: this,
    loop: true
});
```

---

## 资源和教程

### 官方资源
- **官方网站**: https://phaser.io/
- **官方文档**: https://photonstorm.github.io/phaser3-docs/
- **官方示例**: https://phaser.io/examples (700+ 示例！)
- **官方教程**: https://phaser.io/tutorials

### 推荐教程
1. **Making Your First Phaser 3 Game**
   - https://phaser.io/tutorials/making-your-first-phaser-3-game
   - 官方入门教程，非常详细

2. **Phaser 3 Examples Lab**
   - https://labs.phaser.io/
   - 可以在线测试和修改代码

3. **YouTube教程**
   - Ourcade: https://www.youtube.com/c/Ourcade
   - Phaser官方频道: https://www.youtube.com/c/PhaserGameFramework

### 免费资源网站
- **游戏素材**:
  - OpenGameArt: https://opengameart.org/
  - Itch.io: https://itch.io/game-assets/free
  - Kenney: https://kenney.nl/assets (2D/3D素材)
  
- **音效**:
  - Freesound: https://freesound.org/
  - Zapsplat: https://www.zapsplat.com/
  
- **音乐**:
  - Incompetech: https://incompetech.com/music/
  - Purple Planet: https://www.purple-planet.com/

### 社区
- **Discord**: https://discord.gg/phaser
- **论坛**: https://phaser.discourse.group/
- **GitHub**: https://github.com/photonstorm/phaser

---

## 项目结构建议

```
my-phaser-game/
├── index.html
├── assets/
│   ├── images/
│   │   ├── player.png
│   │   ├── enemy.png
│   │   └── background.png
│   ├── audio/
│   │   ├── bgm.mp3
│   │   └── sfx/
│   │       ├── jump.wav
│   │       └── coin.wav
│   └── fonts/
│       └── game-font.ttf
├── src/
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   └── GameOverScene.js
│   ├── sprites/
│   │   ├── Player.js
│   │   └── Enemy.js
│   └── config.js
└── game.js (主入口)
```

---

## 下一步

1. ✅ 打开 `phaser-demo.html` 查看运行效果
2. 📚 阅读官方教程 "Making Your First Game"
3. 🎨 从 OpenGameArt 下载免费素材
4. 🎮 创建你的第一个完整游戏
5. 🌐 集成到 ArcadeZone 网站

**祝你创作愉快！🎮✨**

