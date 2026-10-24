let uiElements = {};

function initUI() {
    uiElements = {
        gameWrapper: document.getElementById('game-wrapper'),
        baseElement: document.getElementById('base'),
        effectsContainer: document.getElementById('effects-container'),
        monsterContainer: document.getElementById('monster-container'),
        answerUiWrapper: document.getElementById('answer-ui-wrapper'),
        pauseButton: document.getElementById('pause-button'),
        volumeButton: document.getElementById('volume-button'),
        resultScreen: document.getElementById('result-screen'),
        resultScore: document.getElementById('result-score'),
        resultComment: document.getElementById('result-comment'),
        resultDetailLabel: document.getElementById('result-detail-label'),
        resultWave: document.getElementById('result-wave'),
        resultGold: document.getElementById('result-gold'),
        wrongQuestionsList: document.getElementById('wrong-questions-list'),
        scoreEffectsContainer: document.getElementById('score-effects-container'),
        manualScreen: document.getElementById('manual-screen'),
        otherGamesScreen: document.getElementById('other-games-screen'),
        endlessSelectScreen: document.getElementById('endless-select-screen'),
        rankingScreen: document.getElementById('ranking-screen'),
        nameInputScreen: document.getElementById('name-input-screen')
    };

    const manualButtonStart = document.getElementById('manual-button-start');
    const manualButtonPause = document.getElementById('manual-button-pause');
    const closeManualButton = document.getElementById('close-manual-button');
    const linkOtherGamesButton = document.getElementById('link-other-games-button');
    const closeOtherGamesButton = document.getElementById('close-other-games-button');

    const openManual = () => { playSound(document.getElementById('click-sound')); uiElements.manualScreen.classList.remove('hidden'); };
    const closeManual = () => { playSound(document.getElementById('click-sound')); uiElements.manualScreen.classList.add('hidden'); };
    const openOtherGames = () => { playSound(document.getElementById('click-sound')); uiElements.otherGamesScreen.classList.remove('hidden'); };
    const closeOtherGames = () => { playSound(document.getElementById('click-sound')); uiElements.otherGamesScreen.classList.add('hidden'); };

    manualButtonStart.addEventListener('click', openManual);
    manualButtonPause.addEventListener('click', openManual);
    closeManualButton.addEventListener('click', closeManual);
    linkOtherGamesButton.addEventListener('click', openOtherGames);
    closeOtherGamesButton.addEventListener('click', closeOtherGames);
}

function showDamagePopup(target, text, customClass = '') {
    const p = document.createElement('div');
    p.className = `damage-popup ${customClass}`;
    p.textContent = text;
    p.style.left = `${target.offsetLeft + target.offsetWidth / 2 - 20}px`;
    p.style.top = `${target.offsetTop}px`;
    if (target === uiElements.baseElement) {
        p.style.left = `${target.offsetLeft}px`;
    }
    (target === uiElements.baseElement ? uiElements.gameWrapper : uiElements.monsterContainer).appendChild(p);
    p.addEventListener('animationend', () => p.remove());
}

function showResultScreen(isGameClear = false, gameMode = 'normal', endlessKills = 0) {
    uiElements.answerUiWrapper.classList.add('hidden');
    uiElements.pauseButton.classList.add('hidden');
    uiElements.volumeButton.classList.add('hidden');

    uiElements.resultScore.textContent = killCount;
    uiElements.resultGold.textContent = `${playerGold} G`;
    uiElements.wrongQuestionsList.innerHTML = '';

    if (gameMode === 'endless') {
        uiElements.resultDetailLabel.textContent = 'たおしたかず';
        uiElements.resultWave.textContent = `${endlessKills} たい`;
        uiElements.resultComment.textContent = `${endlessKills}たい やっつけた！`;
    } else {
        uiElements.resultDetailLabel.textContent = 'とうたつWave';
        uiElements.resultComment.textContent = getScoreComment(killCount);
        if (isGameClear) {
            uiElements.resultWave.textContent = `Wave ${waveData.length} クリア`;
        } else {
            uiElements.resultWave.textContent = `Wave ${currentWaveIndex + 1}`;
        }
    }

    if (wrongAnswers.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'ひとつもありませんでした！すごい！';
        uiElements.wrongQuestionsList.appendChild(li);
    } else {
        wrongAnswers.slice(0, 10).forEach(q => {
            const li = document.createElement('li');
            li.textContent = q.replace(' = ?', '').replace('でしょう？', '');
            uiElements.wrongQuestionsList.appendChild(li);
        });
        if (wrongAnswers.length > 10) {
            const li = document.createElement('li');
            li.textContent = 'など';
            uiElements.wrongQuestionsList.appendChild(li);
        }
    }

    uiElements.resultScreen.classList.remove('hidden');

    uiElements.scoreEffectsContainer.innerHTML = '';
    setTimeout(() => {
        if (killCount >= 90) {
            playSparkleEffect(uiElements.scoreEffectsContainer);
        }
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
    const gameWrapperRect = uiElements.gameWrapper.getBoundingClientRect();

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