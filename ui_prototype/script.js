var $kt = $kt || {};

(() => {
    console.log('script working!')
    $kt.ui.showLevelUp();
    
    const levelDiv = document.getElementById('level');
    const listener = () => {
        levelDiv.removeEventListener('transitionend', listener);
        $kt.ui._fadeOut(levelDiv, '2s', '1s');
    };
    levelDiv.addEventListener('transitionend', listener);
    $kt.ui._fadeIn(levelDiv, '2s');
})();