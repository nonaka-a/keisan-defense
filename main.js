        document.addEventListener('DOMContentLoaded', () => {
            const BASE_INITIAL_HP = 50;
            const WRONG_ANSWER_PENALTY = 5;
            
            const gameWrapper = document.getElementById('game-wrapper');
            const monsterContainer = document.getElementById('monster-container');
            const effectsContainer = document.getElementById('effects-container');
            const baseElement = document.getElementById('base');
            const baseHpBar = document.getElementById('base-hp-bar');
            const baseHpText = document.getElementById('base-hp-text');
            const startScreen = document.getElementById('start-screen');
            const answerUiWrapper = document.getElementById('answer-ui-wrapper');
            const answerInput = document.getElementById('answer-input');
            const numpad = document.getElementById('numpad');
            const goldDisplay = document.getElementById('gold-display');
            const pauseButton = document.getElementById('pause-button');
            const pauseScreen = document.getElementById('pause-screen');
            const resumeButton = document.getElementById('resume-button');
            const quitButton = document.getElementById('quit-button');
            const killCounter = document.getElementById('kill-counter');
            const shopPanelContainer = document.getElementById('shop-panel-container');
            const itemTooltip = document.getElementById('item-tooltip');
            const tooltipName = document.getElementById('tooltip-name');
            const tooltipDescription = document.getElementById('tooltip-description');
            const tooltipInstruction = document.getElementById('tooltip-instruction');
            const bgmSound = document.getElementById('bgm-sound');
            const bossBgmSound = document.getElementById('boss-bgm-sound');
            const correctSound = document.getElementById('correct-sound');
            const wrongSound = document.getElementById('wrong-sound');
            const baseDamageSound = document.getElementById('base-damage-sound');
            const buySound = document.getElementById('buy-sound');
            const gameoverLowSound = document.getElementById('gameover-low-sound');
            const gameoverMidSound = document.getElementById('gameover-mid-sound');
            const gameoverHighSound = document.getElementById('gameover-high-sound');
            const clickSound = document.getElementById('click-sound');
            const sweepSound = document.getElementById('sweep-sound');
            const placeSound = document.getElementById('place-sound');
            const gameClearSound = document.getElementById('game-clear-sound');
            const manualScreen = document.getElementById('manual-screen');
            const manualButtonStart = document.getElementById('manual-button-start');
            const manualButtonPause = document.getElementById('manual-button-pause');
            const closeManualButton = document.getElementById('close-manual-button');
            const waveStartScreen = document.getElementById('wave-start-screen');
            const waveTitle = document.getElementById('wave-title');
            const waveMonsterPreviews = document.getElementById('wave-monster-previews');
            const waveStartSound = document.getElementById('wave-start-sound');
            const waveClearSound = document.getElementById('wave-clear-sound');
            const resultScreen = document.getElementById('result-screen');
            const resultRestartButton = document.getElementById('result-restart-button');
            const resultTitleButton = document.getElementById('result-title-button');
            const scoreEffectsContainer = document.getElementById('score-effects-container');
 const titleBackground = document.getElementById('title-background');
 const volumeButton = document.getElementById('volume-button');
            const allSounds = document.querySelectorAll('audio');
            let gameActive = false, isPaused = false, isPlacingItem = false, isWaveTransitioning = false;
            let isMuted = false;
            let baseHp, baseMaxHp, monsters = [], activeQuestion = null, monsterIdCounter = 0, killCount = 0;
            let animationTimer;
            let playerGold = 0;
            let itemStates = {}, slowFields = [];
            let currentWaveIndex = -1, monstersToSpawnInWave = [], monsterSpawnTimer;
            let wrongAnswers = [];
            let availableRiddles = [];
            let bossAttackTimer = null;

            const waveData = [
                { title: 'はじまりの「たしざん」', monsters: ['add', 'add', 'add', 'add', 'add'] },
                { title: 'ひきざんも とうじょう！', monsters: ['add', 'subtract', 'add', 'subtract', 'add', 'subtract', 'add'] },
                { title: 'かけざんかいじゅうの しゅうげき！', monsters: ['add', 'subtract', 'multiply', 'add', 'subtract', 'multiply', 'add', 'multiply', 'multiply'] },
                { title: 'そらからの きょうい！', monsters: ['multiply', 'divide', 'multiply', 'divide', 'multiply', 'divide', 'multiply', 'divide', 'multiply', 'divide'] },
                { title: 'ぴょんぴょんパニック！', monsters: ['emoji', 'emoji', 'multiply', 'divide', 'emoji', 'emoji', 'multiply', 'divide', 'emoji', 'emoji'] },
                { title: 'ぶんしょうかいじんの なぞなぞ', monsters: ['word', 'word', 'word', 'word', 'word', 'word', 'word', 'word', 'word'] },
                { title: 'さいごの けっせん！', monsters: ['boss'] }
            ];

            const items = {
                'damage_boost': { name: 'ゆうしゃのけん', description: 'でんせつの けん！ これが あれば、けいさんの こたえが ２ばいの ダメージに なる！', basePrice: 600, icon: 'images/damage-boost.png' },
                'gold_bonus': { name: 'おかねもちモンスター', description: 'モンスターが ゴールドを たくさん おとしてくれるように なるよ！', basePrice: 500, icon: 'images/gold-bonus.png' },
                'slow_field': { name: 'カメあるき', description: 'このうえを とおる てきは、ねばねばに つかまって あしが おそくなるよ。', basePrice: 150, icon: 'images/slow-field-icon.png', image: 'images/slow-field.png' },
                'sweep': { name: 'おおそうじ', description: 'ビューン！っと つよいかぜで、がめんの てきを ぜーんぶ ふきとばす！', basePrice: 100, icon: 'images/sweep.png' },
                'upgrade_base': { name: 'きょてんパワーアップ', description: 'きょてんを しゅうり！HPが ぜんぶ もどって、もっと じょうぶに なるよ！', basePrice: 50, icon: 'images/upgrade-base.png' },
            };

            const wordProblemNouns = {
                names: ["たかしくん", "みつこちゃん", "よしおくん", "エミリーちゃん"],
                items: ["あめ", "ガム", "えんぴつ", "じょうぎ", "けしごむ", "ノート"]
            };
            
            const riddles = [
                { question: '「ショートケーキのひ」ってなんにち？', answer: 22 },
                { question: '1ひくと「しろ」になるすうじは？', answer: 100 },
                { question: 'あめが やむじかんは、なんじ？', answer: 2 },
                { question: 'しっかりつたえているのに へやを まちがえられてしまうのは、なんかいにすんでいるひと？', answer: 5 }
            ];

            const monsterBaseStats = {
                'add':      { hp: 15, baseSpeed: 0.5, firstAppearanceWave: 0 },
                'subtract': { hp: 7, baseSpeed: 0.4, firstAppearanceWave: 1 },
                'multiply': { hp: 50, baseSpeed: 0.25, firstAppearanceWave: 2 },
                'divide':   { hp: 10, baseSpeed: 0.6, isFlying: true, firstAppearanceWave: 3 },
                'emoji':    { hp: 10, baseSpeed: 0.3, isHopping: true, firstAppearanceWave: 4 },
                'word':     { hp: 300, baseSpeed: 0.2, firstAppearanceWave: 5 },
                'boss':     { hp: 230, baseSpeed: 0.25, isBoss: true, firstAppearanceWave: 6 },
                'fire':     { hp: 1, baseSpeed: 0.7, isFlying: true, firstAppearanceWave: 6 }
            };
            
            function initGame() {
                baseMaxHp = BASE_INITIAL_HP; baseHp = baseMaxHp;
                monsters = []; monsterContainer.innerHTML = ''; effectsContainer.innerHTML = ''; slowFields = [];
                activeQuestion = null; monsterIdCounter = 0; killCount = 0;
                playerGold = 0;
                wrongAnswers = [];
                availableRiddles = [...riddles];
                itemStates = { 
                    upgrade_base: { currentPrice: items.upgrade_base.basePrice },
                    sweep: { currentPrice: items.sweep.basePrice },
                    slow_field: { currentPrice: items.slow_field.basePrice },
                    damage_boost: { purchased: false },
                    gold_bonus: { purchased: false }
                };
                updateGoldDisplay(); updateBaseHpUI(); updateKillCounter();
                startScreen.classList.remove('hidden');
                titleBackground.classList.remove('hidden');
                pauseScreen.classList.add('hidden');
                resultScreen.classList.add('hidden');
                manualScreen.classList.add('hidden'); 
                answerUiWrapper.classList.add('hidden');
                pauseButton.classList.add('hidden');
                bgmSound.pause();
                bossBgmSound.pause();
                currentWaveIndex = -1;
                clearTimeout(monsterSpawnTimer);
                clearInterval(animationTimer);
                clearInterval(bossAttackTimer);
            }

            function startGame() {
                renderShopPanels();
                answerUiWrapper.classList.remove('hidden');
                pauseButton.classList.remove('hidden');
                volumeButton.classList.remove('hidden');
                startScreen.classList.add('hidden');
                titleBackground.classList.add('hidden');
                answerInput.value = '';
                answerInput.focus();
                gameActive = true; isPaused = false;
                animationTimer = setInterval(animateMonsters, 300);
                bgmSound.volume = 0.3; playSound(bgmSound);
                requestAnimationFrame(gameLoop);
                startNextWave();
            }
            
           function playSound(sound) {
                // ↓↓ このif文を追加 ↓↓
                if (isMuted) return; // ミュート中なら何もしない

                if (sound) {
                    sound.currentTime = 0;
                    sound.play().catch(e => console.error("Audio play failed:", e));
                }
            }
            
           // ↓↓↓ 関数全体をこれで置き換えてみてください ↓↓↓
function startNextWave() {
                currentWaveIndex++;
                if (currentWaveIndex >= waveData.length) {
                    gameClear();
                    return;
                }

                // --- ここから背景切り替え処理 ---
                let newBackground = '';
                if (currentWaveIndex <= 2) {
                    newBackground = 'images/background.png';
                } else if (currentWaveIndex <= 4) {
                    newBackground = 'images/background2.png';
                } else {
                    newBackground = 'images/background3.png';
                }

                const backgroundOverlay = document.getElementById('background-overlay');
                const currentBackground = getComputedStyle(gameWrapper).backgroundImage;

                const newBackgroundImageName = newBackground.replace('images/', '');
                const isSameBackground = currentBackground.includes(newBackgroundImageName);
                if (!isSameBackground) {
                    backgroundOverlay.style.backgroundImage = `url('${newBackground}')`;
                    gameWrapper.classList.add('fade-in-background');
                    setTimeout(() => {
                        gameWrapper.style.backgroundImage = `url('${newBackground}')`;
                        gameWrapper.classList.remove('fade-in-background');
                    }, 1000);
                }
                // --- ここまで背景切り替え処理 ---

                // BGM切り替え処理
                if (currentWaveIndex === waveData.length - 1) {
                    bgmSound.pause();
                    bossBgmSound.volume = 0.4;
                    playSound(bossBgmSound);
                }

                isWaveTransitioning = true;
                const wave = waveData[currentWaveIndex];
                waveTitle.textContent = `Wave ${currentWaveIndex + 1} ${wave.title}`;
                waveMonsterPreviews.innerHTML = '';
                const uniqueMonsters = [...new Set(wave.monsters)];
                uniqueMonsters.forEach(type => {
                    const img = document.createElement('img');
                    let imagePrefix = '';
                    switch(type) {
                        case 'subtract': imagePrefix = 'sub-'; break;
                        case 'multiply': imagePrefix = 'mul-'; break;
                        case 'divide': imagePrefix = 'div-'; break;
                        case 'word': imagePrefix = 'word-'; break;
                        case 'emoji': imagePrefix = 'emoji-'; break;
                        case 'boss': imagePrefix = 'boss-'; break;
                    }
                    img.src = `images/monster-${imagePrefix}1.png`;
                    img.className = 'wave-monster-preview-img';
                    waveMonsterPreviews.appendChild(img);
                });
                waveStartScreen.classList.remove('hidden');
                playSound(waveStartSound);
                setTimeout(() => {
                    waveStartScreen.classList.add('hidden');
                    isWaveTransitioning = false;
                    monstersToSpawnInWave = [...wave.monsters];
                    spawnWaveMonsters();
                }, 4000);
            }


            function spawnWaveMonsters() {
                if (isPaused || !gameActive || monstersToSpawnInWave.length === 0) return;
                const monsterType = monstersToSpawnInWave.shift();
                spawnMonster(monsterType);
                const interval = currentWaveIndex === 5 ? 4000 : 2500;
                monsterSpawnTimer = setTimeout(spawnWaveMonsters, interval);
            }

            function stopAllTimers() { clearInterval(animationTimer); clearTimeout(monsterSpawnTimer); clearInterval(bossAttackTimer); }
            function pauseGame() { if (!gameActive || isPaused || isWaveTransitioning) return; playSound(clickSound); isPaused = true; bgmSound.pause();bossBgmSound.pause(); pauseScreen.classList.remove('hidden'); }
           function resumeGame() { 
    if (!gameActive || !isPaused) return; 
    playSound(clickSound); 
    isPaused = false; 
     if (currentWaveIndex === waveData.length - 1) {
        playSound(bossBgmSound);
    } else {
        playSound(bgmSound);
    }
    pauseScreen.classList.add('hidden'); 
    answerInput.focus(); 
    spawnWaveMonsters();}
            
            function handleQuitGame() {
                playSound(clickSound);
                pauseScreen.classList.add('hidden');
                gameOver(true);
            }

            function gameLoop() {
                if (gameActive && !isPaused && !isWaveTransitioning) {
                    moveMonsters();
                    checkCollisions();
                }
                if(gameActive) requestAnimationFrame(gameLoop);
            }
            
            function moveMonsters() {
                monsters.forEach(monster => {
                    let currentSpeed = monster.baseSpeed;
                    if (!monster.isFlying) {
                        let isInSlowField = false;
                        for (const field of slowFields) {
                            const monsterCenterX = monster.x + monster.element.offsetWidth / 2;
                            const monsterCenterY = monster.y + monster.element.offsetHeight / 2;
                            if (monsterCenterX > field.x && monsterCenterX < field.x + field.width && monsterCenterY > field.y && monsterCenterY < field.y + field.height) { isInSlowField = true; break; }
                        }
                        if (isInSlowField) { currentSpeed /= 2; }
                    }
                    monster.x += currentSpeed;
                    if (monster.isHopping) {
                        monster.y = monster.initialY + Math.sin(Date.now() / 200 + monster.hopOffset) * 15;
                        monster.element.style.top = `${monster.y}px`;
                    }
                    monster.element.style.left = `${monster.x}px`;
                });
            }

            function checkCollisions() {
                const baseCollisionPoint = gameWrapper.offsetWidth - baseElement.offsetWidth;
                for (let i = monsters.length - 1; i >= 0; i--) {
                    const monster = monsters[i];
                    if (monster.x + monster.element.offsetWidth > baseCollisionPoint) {
                        const damage = monster.type === 'fire' ? 20 : monster.hp;
                        damageBase(damage);
                        if(activeQuestion && activeQuestion.monster.id === monster.id) activeQuestion = null;
                        const monsterIndex = monsters.findIndex(m => m.id === monster.id);
                        if (monsterIndex > -1) {
                            if(monsters[monsterIndex].element) monsters[monsterIndex].element.remove();
                            monsters.splice(monsterIndex, 1);
                        }
                        checkWaveCompletion();
                    }
                }
            }
            
            function killMonster(monster) {
                let gold = 0, score = 0;
                switch(monster.type) {
                    case 'add': gold = 5; score = 1; break;
                    case 'subtract': gold = 10; score = 1; break;
                    case 'multiply': gold = 15; score = 3; break;
                    case 'divide': gold = 20; score = 3; break;
                    case 'word': gold = 30; score = 1; break;
                    case 'emoji': gold = 10; score = 2; break;
                    case 'boss': gold = 0; score = 8; break;
                    case 'fire': gold = 0; score = 0; break;
                }
                if (itemStates.gold_bonus.purchased && monster.type !== 'fire' && monster.type !== 'boss') { gold *= 2; }
                playerGold += gold;
                killCount = Math.min(killCount + score, 100);
                updateGoldDisplay();
                updateKillCounter();
                if (monster.isBoss) {
                    clearInterval(bossAttackTimer);
                }
                if(activeQuestion && activeQuestion.monster.id === monster.id) activeQuestion = null;
                const monsterIndex = monsters.findIndex(m => m.id === monster.id);
                if (monsterIndex > -1) {
                    if(monsters[monsterIndex].element) monsters[monsterIndex].element.remove();
                    monsters.splice(monsterIndex, 1);
                }
                checkWaveCompletion();
            }

            function checkWaveCompletion() {
                if (gameActive && !isWaveTransitioning && monstersToSpawnInWave.length === 0 && monsters.length === 0) {
                    isWaveTransitioning = true;
                    playSound(waveClearSound);
                    const bonusGold = 50 * (currentWaveIndex + 1);
                    playerGold += bonusGold;
                    updateGoldDisplay();
                    showDamagePopup(baseElement, `+${bonusGold}G`, 'gold-popup');
                    setTimeout(startNextWave, 4000);
                }
            }

            function handleAnswerSubmit(e) {
                if ((e.type === 'keydown' && e.key !== 'Enter') || !activeQuestion) return;
                const userAnswer = parseInt(answerInput.value, 10);
                const isCorrect = !isNaN(userAnswer) && userAnswer === activeQuestion.answer;
                const targetMonster = activeQuestion.monster;
                if (isCorrect) {
                    playSound(correctSound);
                    damageMonster(targetMonster, userAnswer);
                } else {
                    playSound(wrongSound);
                    damageBase(WRONG_ANSWER_PENALTY);
                    showDamagePopup(baseElement, `-${WRONG_ANSWER_PENALTY}`, 'wrong-answer');
                    if (activeQuestion) { wrongAnswers.push(activeQuestion.question); }
                }
                activeQuestion = null;
                const monsterEl = targetMonster.element;
                if(monsterEl){
                    monsterEl.classList.remove('active');
                    const questionEl = monsterEl.querySelector('.question-follow');
                    if (questionEl) questionEl.remove();
                }
                answerInput.value = '';
            }
            
           function gameOver(isQuit = false) {
                gameActive = false; isPaused = true; stopAllTimers();
                bgmSound.pause();
                bossBgmSound.pause(); // ★修正：ボスBGMも停止
                if (!isQuit) {
                    if (killCount >= 80) { playSound(gameoverHighSound); }
                    else if (killCount >= 40) { playSound(gameoverMidSound); }
                    else { playSound(gameoverLowSound); }
                }
                showResultScreen(false);
            }
            
            function gameClear() {
                gameActive = false; isPaused = true; stopAllTimers();
                bgmSound.pause();
                bossBgmSound.pause();
                playSound(gameClearSound);
                updateKillCounter();
                showResultScreen(true);
            }

            function damageBase(damage) {
                if(!isPaused && gameActive) playSound(baseDamageSound);
                baseHp = Math.max(0, baseHp - damage);
                updateBaseHpUI();
                baseElement.classList.add('damage');
                setTimeout(() => baseElement.classList.remove('damage'), 300);
                if (baseHp <= 0) { gameOver(); }
            }
            
            function buyItem(itemId) {
                if (isPaused || isPlacingItem || isWaveTransitioning || (itemStates[itemId] && itemStates[itemId].purchased)) return;
                const item = items[itemId];
                if (!item.basePrice) return;
                let currentPrice = (itemStates[itemId] && itemStates[itemId].currentPrice !== undefined) ? itemStates[itemId].currentPrice : item.basePrice;
                if (playerGold >= currentPrice) {
                    if (itemId === 'slow_field') { enterPlacementMode(itemId); hideTooltip(); return; }
                    playSound(buySound);
                    playerGold -= currentPrice;
                    updateGoldDisplay();
                    if (itemId === 'upgrade_base') {
                        baseMaxHp += 50;
                        baseHp = baseMaxHp;
                        updateBaseHpUI();
                        itemStates.upgrade_base.currentPrice += 50;
                    } else if (itemId === 'sweep') {
                        sweepMonsters();
                        itemStates.sweep.currentPrice += 100; // 価格を100G増やす
                    } else if (itemId === 'damage_boost' || itemId === 'gold_bonus') {
                        itemStates[itemId].purchased = true;
                    }
                    
                    renderShopPanels();
                    hideTooltip();
                } else { playSound(wrongSound); }
            }

            function enterPlacementMode(itemId) {
                const currentPrice = itemStates.slow_field.currentPrice;
                if (playerGold < currentPrice) { playSound(wrongSound); return; }
                isPlacingItem = true;
                gameWrapper.classList.add('placing-cursor');
                const previewEl = document.createElement('div');
                previewEl.id = 'placement-preview';
                effectsContainer.appendChild(previewEl);
                const fixedY = 175; previewEl.style.top = `${fixedY}px`;
                const moveListener = (e) => { const rect = gameWrapper.getBoundingClientRect(); previewEl.style.left = `${e.clientX - rect.left - previewEl.offsetWidth / 2}px`; };
                const clickListener = (e) => {
                    const rect = gameWrapper.getBoundingClientRect();
                    const x = e.clientX - rect.left - previewEl.offsetWidth / 2, y = fixedY;
                    placeItem(itemId, x, y);
                    gameWrapper.removeEventListener('mousemove', moveListener);
                    previewEl.remove();
                    gameWrapper.classList.remove('placing-cursor');
                    isPlacingItem = false;
                };
                gameWrapper.addEventListener('mousemove', moveListener);
                setTimeout(() => { gameWrapper.addEventListener('click', clickListener, { once: true }); }, 0);
            }

            function placeItem(itemId, x, y) {
                const item = items[itemId], currentPrice = itemStates.slow_field.currentPrice;
                if (playerGold >= currentPrice) {
                    playSound(placeSound);
                    playerGold -= currentPrice;
                    itemStates.slow_field.currentPrice += 150;
                    updateGoldDisplay(); renderShopPanels();
                    const fieldEl = document.createElement('img');
                    fieldEl.src = item.image; fieldEl.className = 'slow-field';
                    fieldEl.style.left = `${x}px`; fieldEl.style.top = `${y}px`;
                    effectsContainer.appendChild(fieldEl);
                    slowFields.push({ x, y, width: 300, height: 120 });
                } else { playSound(wrongSound); }
            }
            
                       function sweepMonsters() {
                if (monsters.length === 0) return;
                playSound(sweepSound);

                // 問題を選択中ならリセット
                if (activeQuestion) {
                    const monsterEl = activeQuestion.monster.element;
                    if (monsterEl){
                        monsterEl.classList.remove('active');
                        const questionEl = monsterEl.querySelector('.question-follow');
                        if (questionEl) questionEl.remove();
                    }
                    activeQuestion = null;
                    answerInput.value = '';
                }

                // ボス以外のすべてのモンスターを対象にする
                const monstersToSweep = monsters.filter(m => !m.isBoss);
                monstersToSweep.forEach(monster => {
                    if (monster.element) {
                        // 1. sweptクラスを追加して、押し戻しアニメーションを開始
                        monster.element.classList.add('swept');

                        // 2. アニメーションが終わるのを待ってから処理を行う (1秒後)
                        setTimeout(() => {
                            // 3. アニメーション用のクラスを削除
                            monster.element.classList.remove('swept');
                            
                            // 4. モンスターの座標データを開始位置に戻す
                            monster.x = -80;
                            
                            // 5. 見た目（CSS）も開始位置に瞬時に戻す
                            monster.element.style.transform = ''; // 回転などをリセット
                            monster.element.style.left = `${monster.x}px`;
                            
                        }, 1000); // transitionの時間と合わせる
                    }
                });
            }

            function targetFrontMonster() {
                if (isPaused || !gameActive || monsters.length === 0) return;
                let frontMonster = monsters.reduce((prev, curr) => (prev.x > curr.x ? prev : curr));
                handleMonsterClick(frontMonster);
            }
            function updateGoldDisplay() { goldDisplay.textContent = `${playerGold} G`; updateShopAffordability(); }
            function updateKillCounter() { killCounter.textContent = `てんすう：${killCount}てん`; }
            
            function spawnMonster(monsterType, customX = -80, customY = null) {
                if (!gameActive) return;
                const stats = monsterBaseStats[monsterType];
                const monster = { id: monsterIdCounter++, type: monsterType, animationFrame: 1, baseSpeed: stats.baseSpeed, isFlying: !!stats.isFlying, isHopping: !!stats.isHopping, isBoss: !!stats.isBoss };
                const wavesSinceDebut = currentWaveIndex - stats.firstAppearanceWave;
                monster.hp = monster.isBoss ? stats.hp : Math.floor(stats.hp * Math.pow(1.3, wavesSinceDebut));
                let monsterY;
                if (customY !== null) {
                    monsterY = customY;
                } else {
                    if (monster.isBoss) {
                        // ボスは今までの高さ
                        monsterY = (gameWrapper.offsetHeight * 0.25) + (Math.random() * 40 - 20);
                    } else {
                        // ボス以外のモンスターの位置を全体的に下げる
                        if (monster.isFlying) {
                            // 空を飛ぶモンスター
                            monsterY = (gameWrapper.offsetHeight * 0.2); 
                        } else {
                            // 地上のモンスター
                            monsterY = (gameWrapper.offsetHeight * 0.35) + (Math.random() * 40 - 20) + (monster.isHopping ? 0 : 0);
                        }
                    }
                }
                monster.x = customX; monster.y = monsterY; monster.initialY = monsterY; monster.hopOffset = Math.random() * Math.PI * 2;
                monster.maxHp = monster.hp;
                const monsterEl = document.createElement('div');
                monsterEl.className = 'monster';
                if (monster.isFlying) { monsterEl.classList.add('flying'); }
                
                if (monster.isBoss) {
                    monsterEl.classList.add('monster-large');
                } else if (monster.type === 'multiply') {
                    monsterEl.classList.add('monster-medium');
                }

                monsterEl.dataset.id = monster.id;
                monsterEl.style.left = `${monster.x}px`;
                monsterEl.style.top = `${monster.y}px`;
                monsterEl.style.zIndex = Math.floor(monster.initialY);
                
                let imagePrefix = '';
                switch(monster.type) {
                    case 'subtract': imagePrefix = 'sub-'; break;
                    case 'multiply': imagePrefix = 'mul-'; break;
                    case 'divide': imagePrefix = 'div-'; break;
                    case 'word': imagePrefix = 'word-'; break;
                    case 'emoji': imagePrefix = 'emoji-'; break;
                    case 'boss': imagePrefix = 'boss-'; break;
                    case 'fire': imagePrefix = 'fire-'; break;
                }
                
                monsterEl.innerHTML = ` <img class="monster-image" src="images/monster-${imagePrefix}1.png" alt="モンスター"> <div class="monster-status"> <div class="hp-bar-container"><div class="monster-hp-bar" style="width: 100%;"></div></div> <span class="monster-hp-text">HP: ${monster.hp}</span> </div>`;
                monsterEl.addEventListener('click', () => handleMonsterClick(monster));
                monster.element = monsterEl;
                monsters.push(monster);
                monsterContainer.appendChild(monsterEl);
                if (monster.isBoss) {
                    bossAttackTimer = setInterval(() => {
                        const boss = monsters.find(m => m.isBoss);
                        if (boss && !isPaused) {
                            spawnMonster('fire', boss.x, boss.y - 50);
                        }
                    }, 10000);
                }
            }

            function handleMonsterClick(monster) {
                if(isWaveTransitioning) return;
                playSound(clickSound);
                if (activeQuestion && activeQuestion.monster.id !== monster.id) {
                    const oldMonsterEl = activeQuestion.monster.element;
                    if(oldMonsterEl) {
                        oldMonsterEl.classList.remove('active');
                        const oldQuestionEl = oldMonsterEl.querySelector('.question-follow');
                        if (oldQuestionEl) oldQuestionEl.remove();
                    }
                }
                const newQuestion = generateQuestion(monster.type);
                activeQuestion = { monster, ...newQuestion };
                const existingQuestionEl = monster.element.querySelector('.question-follow');
                if(existingQuestionEl) existingQuestionEl.remove();
                const questionEl = document.createElement('div');
                questionEl.className = 'question-follow';
                if (monster.type === 'word') { questionEl.classList.add('long-question'); } 
                else if (monster.type === 'emoji') { questionEl.classList.add('emoji-question'); }
                questionEl.innerHTML = activeQuestion.question;
                monster.element.appendChild(questionEl);
                monster.element.classList.add('active');
                monsterContainer.appendChild(monster.element); // 選択したモンスターを最前面に移動
                answerInput.value = '';
                answerInput.focus();
            }

            function generateQuestion(type) {
                const n1 = Math.floor(Math.random() * 10) + 1;
                const n2 = Math.floor(Math.random() * 10) + 1;
                if (type === 'boss') {
                    const bossQuestionTypes = ['add', 'subtract', 'multiply', 'divide', 'emoji'];
                    const randomType = bossQuestionTypes[Math.floor(Math.random() * bossQuestionTypes.length)];
                    return generateQuestion(randomType);
                }
                switch(type) {
                    case 'add': return { question: `${n1} + ${n2} = ?`, answer: n1 + n2 };
                    case 'fire': return { question: `${n1} + ${n2} = ?`, answer: n1 + n2 };
                    case 'subtract':
                        let s1 = n1, s2 = n2;
                        if (s1 === s2 && Math.random() < 0.9) { s2 = (s1 % 10) + 1; }
                        const s_max = Math.max(s1, s2), s_min = Math.min(s1, s2);
                        return { question: `${s_max} - ${s_min} = ?`, answer: s_max - s_min };
                    case 'multiply': const m1 = Math.floor(Math.random() * 9) + 1, m2 = Math.floor(Math.random() * 9) + 1; return { question: `${m1} × ${m2} = ?`, answer: m1 * m2 };
                    case 'divide': const d_ans = Math.floor(Math.random() * 8) + 2, d2 = Math.floor(Math.random() * 8) + 2; const d1 = d_ans * d2; return { question: `${d1} ÷ ${d2} = ?`, answer: d_ans };
                    case 'word':
                        const useRiddle = Math.random() < 0.5 && availableRiddles.length > 0;
                        if (useRiddle) {
                            const riddleIndex = Math.floor(Math.random() * availableRiddles.length);
                            const selectedRiddle = availableRiddles[riddleIndex];
                            availableRiddles.splice(riddleIndex, 1);
                            return selectedRiddle;
                        } else {
                            if (Math.random() < 0.5) {
                                const name = wordProblemNouns.names[Math.floor(Math.random() * wordProblemNouns.names.length)];
                                const item = wordProblemNouns.items[Math.floor(Math.random() * wordProblemNouns.items.length)];
                                const possibleMoney = [100, 200, 300, 500, 1000];
                                const totalMoney = possibleMoney[Math.floor(Math.random() * possibleMoney.length)];
                                const itemPrice = (Math.floor(Math.random() * (totalMoney / 10 - 2)) + 1) * 10;
                                return { question: `${name}は ${totalMoney}えん もっています。${itemPrice}えんの ${item}を かいました。のこりは いくらでしょう？`, answer: totalMoney - itemPrice };
                            } else {
                                const name = wordProblemNouns.names[Math.floor(Math.random() * wordProblemNouns.names.length)];
                                const [item1, item2] = [...wordProblemNouns.items].sort(() => 0.5 - Math.random());
                                const w_n1 = (Math.floor(Math.random() * 9) + 1) * 10, w_n2 = (Math.floor(Math.random() * 9) + 1) * 10;
                                return { question: `${name}は ${w_n1}えんの ${item1}と ${w_n2}えんの ${item2}を かいました。あわせて いくら？`, answer: w_n1 + w_n2 };
                            }
                        }
                    case 'emoji':
                        const emojis = ['🍩', '🍎', '🍔', '🍕', '🍰', '🍓'];
                        const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        const e1 = Math.floor(Math.random() * 5) + 1;
                        const e2 = Math.floor(Math.random() * 5) + 1;
                        return { question: `${selectedEmoji.repeat(e1)} + ${selectedEmoji.repeat(e2)} = ?`, answer: e1 + e2 };
                    default: return { question: `${n1} + ${n2} = ?`, answer: n1 + n2 };
                }
            }

            function showDamagePopup(target, text, customClass = '') {
                const p = document.createElement('div');
                p.className = `damage-popup ${customClass}`; p.textContent = text;
                p.style.left = `${target.offsetLeft + target.offsetWidth / 2 - 20}px`;
                p.style.top = `${target.offsetTop}px`;
                if(target === baseElement) { p.style.left = `${target.offsetLeft}px`; }
                (target === baseElement ? gameWrapper : monsterContainer).appendChild(p);
                p.addEventListener('animationend',()=>p.remove());
            }
            
            function animateMonsters() {
                if (!gameActive || isPaused) return;
                monsters.forEach(monster => {
                    // ボスなら4フレーム、それ以外のモンスターは3フレームでアニメーションさせる
                    const frameCount = monster.isBoss ? 4 : 3;
                    monster.animationFrame = (monster.animationFrame % frameCount) + 1;
                    
                    const img = monster.element.querySelector('.monster-image');
                    if (img) {
                        let imagePrefix = '';
                        switch(monster.type) {
                            case 'subtract': imagePrefix = 'sub-'; break;
                            case 'multiply': imagePrefix = 'mul-'; break;
                            case 'divide': imagePrefix = 'div-'; break;
                            case 'word': imagePrefix = 'word-'; break;
                            case 'emoji': imagePrefix = 'emoji-'; break;
                            case 'boss': imagePrefix = 'boss-'; break;
                            case 'fire': imagePrefix = 'fire-'; break;
                        }
                        img.src = `images/monster-${imagePrefix}${monster.animationFrame}.png`;
                    }
                });
            }

            function updateMonsterHpUI(monster) {
                const hpBar = monster.element.querySelector('.monster-hp-bar');
                const hpText = monster.element.querySelector('.monster-hp-text');
                const percentage = (monster.hp / monster.maxHp) * 100;
                if(hpBar) hpBar.style.width = `${percentage}%`;
                if(hpText) hpText.textContent = `HP: ${monster.hp}`;
            }

            function damageMonster(monster, damage) {
                let finalDamage = damage;
                if (itemStates.damage_boost.purchased) { finalDamage *= 2; }
                monster.hp -= finalDamage;
                showDamagePopup(monster.element, `-${finalDamage}`);
                if (monster.hp <= 0) { killMonster(monster); }
                else { updateMonsterHpUI(monster); }
            }
            function updateBaseHpUI() {
                const percentage = (baseHp / baseMaxHp) * 100;
                baseHpBar.style.width = `${percentage}%`;
                baseHpText.textContent = `HP: ${baseHp} / ${baseMaxHp}`;
            }
            
            function renderShopPanels() {
                shopPanelContainer.innerHTML = '';
                shopPanelContainer.appendChild(itemTooltip);
                Object.keys(items).forEach(itemId => {
                    const item = items[itemId];
                    const panel = document.createElement('div');
                    panel.className = 'shop-panel'; panel.dataset.itemId = itemId;
                    if (itemStates[itemId] && itemStates[itemId].purchased) {
                        panel.classList.add('sold-out');
                        panel.innerHTML = ` <img class="shop-panel-img" src="${item.icon || ''}"> <div class="shop-panel-price">うりきれ</div>`;
                    } else {
                        let currentPrice = (itemStates[itemId] && itemStates[itemId].currentPrice !== undefined) ? itemStates[itemId].currentPrice : item.basePrice;
                        panel.innerHTML = ` <img class="shop-panel-img" src="${item.icon || ''}"> <div class="shop-panel-price">${currentPrice ? currentPrice + ' G' : '---'}</div>`;
                    }
                    panel.addEventListener('mouseenter', () => showTooltip(itemId, panel));
                    panel.addEventListener('mouseleave', hideTooltip);
                    panel.addEventListener('click', () => buyItem(itemId));
                    shopPanelContainer.appendChild(panel);
                });
                updateShopAffordability();
            }

            function showTooltip(itemId, panel) {
                const item = items[itemId];
                if(itemStates[itemId] && itemStates[itemId].purchased) return;
                let currentPrice = (itemStates[itemId] && itemStates[itemId].currentPrice !== undefined) ? itemStates[itemId].currentPrice : item.basePrice;
                const canAfford = playerGold >= currentPrice;
                tooltipName.textContent = item.name;
                tooltipDescription.textContent = item.description;
                tooltipInstruction.textContent = canAfford ? '(クリックでこうにゅう)' : '(ゴールドがたりません)';
                tooltipInstruction.style.color = canAfford ? '#aaa' : '#e63946';
                if (panel.nextSibling === null || panel.nextSibling.nextSibling === null) { itemTooltip.style.left = `${panel.offsetLeft - panel.offsetWidth / 1.5}px`; }
                else { itemTooltip.style.left = `${panel.offsetLeft + panel.offsetWidth / 2}px`; }
                itemTooltip.classList.remove('hidden');
                setTimeout(() => itemTooltip.classList.add('visible'), 10);
            }
            
            function hideTooltip() { itemTooltip.classList.remove('visible'); setTimeout(() => itemTooltip.classList.add('hidden'), 200); }
            
            function updateShopAffordability() {
                document.querySelectorAll('.shop-panel').forEach(panel => {
                    const itemId = panel.dataset.itemId;
                    const item = items[itemId];
                    if (!item || !item.basePrice || (itemStates[itemId] && itemStates[itemId].purchased)) { panel.classList.remove('unaffordable'); return; }
                    let currentPrice = (itemStates[itemId] && itemStates[itemId].currentPrice !== undefined) ? itemStates[itemId].currentPrice : item.basePrice;
                    panel.classList.toggle('unaffordable', playerGold < currentPrice);
                });
            }

            function showResultScreen(isGameClear = false) {
                answerUiWrapper.classList.add('hidden');
                pauseButton.classList.add('hidden');
                volumeButton.classList.add('hidden');
                const resultScoreEl = document.getElementById('result-score'), resultCommentEl = document.getElementById('result-comment'), resultWaveEl = document.getElementById('result-wave'), resultGoldEl = document.getElementById('result-gold'), wrongListEl = document.getElementById('wrong-questions-list');
                resultScoreEl.textContent = killCount;
                resultCommentEl.textContent = getScoreComment(killCount);
                if (isGameClear) {
                    resultWaveEl.textContent = `Wave ${waveData.length} クリア`;
                } else {
                    resultWaveEl.textContent = `Wave ${currentWaveIndex + 1}`;
                }
                resultGoldEl.textContent = `${playerGold} G`;
                wrongListEl.innerHTML = '';
                if (wrongAnswers.length === 0) {
                    const li = document.createElement('li');
                    li.textContent = 'ひとつもありませんでした！すごい！';
                    wrongListEl.appendChild(li);
                } else {
                    wrongAnswers.slice(0, 10).forEach(q => {
                        const li = document.createElement('li');
                        li.textContent = q.replace(' = ?', '').replace('でしょう？', '');
                        wrongListEl.appendChild(li);
                    });
                    if (wrongAnswers.length > 10) { const li = document.createElement('li'); li.textContent = 'など'; wrongListEl.appendChild(li); }
                }
                
                resultScreen.classList.remove('hidden');
                
                scoreEffectsContainer.innerHTML = '';
                setTimeout(() => {
                    if (killCount >= 90) { playSparkleEffect(scoreEffectsContainer); }
                }, 100);
            }

            function getScoreComment(score) {
                if (score === 100) return "まんてん！たいへんよくできました！";
                if (score >= 90) return "すばらしい！よくできました！";
                if (score >= 80) return "おしい、あとひといき！";
                if (score >= 70) return "すごい！このちょうし！";
                if (score >= 60) return "いいね！かなりわかってきたね！";
                if (score >= 50) return "はんぶんせいかい！がんばったね！";
                if (score >= 40) return "もんだいをよくみてみよう！";
                if (score >= 30) return "すこしずつせいかいをふやそう！";
                if (score >= 20) return "ゆっくりでいいから、ていねいに！";
                if (score >= 10) return "あせらずていねいにとこう！";
                return "つぎはがんばろう！";
            }

            function playSparkleEffect(container) {
                const scoreWrapperRect = document.getElementById('result-score-wrapper').getBoundingClientRect();
                const gameWrapperRect = gameWrapper.getBoundingClientRect();

                for (let i = 0; i < 15; i++) {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'sparkle';
                    const angle = Math.random() * 360;
                    const distance = Math.random() * 50 + (scoreWrapperRect.width / 2);
                    const top = (scoreWrapperRect.top - gameWrapperRect.top + scoreWrapperRect.height / 2) - (Math.cos(angle * Math.PI / 180) * distance);
                    const left = (scoreWrapperRect.left - gameWrapperRect.left + scoreWrapperRect.width / 2) + (Math.sin(angle * Math.PI / 180) * distance);
                    
                    sparkle.style.top = `${top}px`;
                    sparkle.style.left = `${left}px`;
                    sparkle.style.animationDelay = `${Math.random() * 1.2}s`;
                    container.appendChild(sparkle);
                }
            }
            
            const openManual = () => { playSound(clickSound); manualScreen.classList.remove('hidden'); };
            const closeManual = () => { playSound(clickSound); manualScreen.classList.add('hidden'); };

            document.getElementById('start-button').addEventListener('click', () => { playSound(clickSound); initGame(); startGame(); });
            resultRestartButton.addEventListener('click', () => { playSound(clickSound); initGame(); startGame(); });
            resultTitleButton.addEventListener('click', () => { playSound(clickSound); initGame(); });
            
            answerInput.addEventListener('keydown', handleAnswerSubmit);
            // ↓↓ このイベントリスナーを追加してください ↓↓
            answerInput.addEventListener('input', (e) => {
                // 入力された値から、数字(0-9)以外の文字をすべて取り除く
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
            // ↑↑ ここまで ↑↑
            pauseButton.addEventListener('click', pauseGame);
            resumeButton.addEventListener('click', resumeGame);
            quitButton.addEventListener('click', handleQuitGame);
            
            document.addEventListener('keydown', (e) => {
                if(isWaveTransitioning) return;
                if (e.code === 'ArrowRight' && gameActive && !isPaused) { e.preventDefault(); targetFrontMonster(); }
                
                
            });

            numpad.addEventListener('click', (e) => {
                if(isWaveTransitioning) return;
                const target = e.target.closest('.numpad-button'); if (!target) return;
                playSound(clickSound);
                const value = target.textContent;
                if(value >= '0' && value <= '9') { answerInput.value += value; }
                else if (target.id === 'numpad-clear') { answerInput.value = ''; }
                else if (target.id === 'numpad-enter') { handleAnswerSubmit({ type: 'click', key: 'Enter' }); }
                answerInput.focus();
            });
            
            manualButtonStart.addEventListener('click', openManual);
            manualButtonPause.addEventListener('click', openManual);
            closeManualButton.addEventListener('click', closeManual);
            volumeButton.addEventListener('click', () => {
                isMuted = !isMuted; // trueとfalseを切り替える

                if (isMuted) {
                    // ミュートにする処理
                    volumeButton.textContent = '♪ OFF'; // ボタンの文字を変更
                    // 再生中のすべての音を止める
                    allSounds.forEach(sound => {
                        sound.pause();
                    });
                } else {
                    // ミュートを解除する処理
                    volumeButton.textContent = '♪'; // ボタンの文字を元に戻す
                    // BGMを再生する（ゲームの状態に応じて）
                    if (gameActive && !isPaused) {
                         if (currentWaveIndex === waveData.length - 1) {
                            playSound(bossBgmSound);
                        } else {
                            playSound(bgmSound);
                        }
                    }
                }
            });

            
            initGame();
        });
