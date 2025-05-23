var $kt = $kt || {};

(() => {
    $kt.ui.showLevelUp();
    $kt.ui.showLevelData('Level 1: あ行', 75, 10, 15);
    setTimeout(() => {
        $kt.ui.showLevelExp('Level 2: か行', 123, 5, 12, [
            { oldExpPercentage: 20, newExpPercentage: 100, addedExp: 3 },
            { char: 'か', oldExpPercentage: 10, newExpPercentage: 100, addedExp: 1 },
            { char: 'き', oldExpPercentage: 20, newExpPercentage: 40, addedExp: 2 }
        ]);
    }, 1000);
})();