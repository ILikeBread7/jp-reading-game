(() => {
    console.log('script working!')
    document.getElementById('answer-input').focus();

    document.getElementById('level-up-hint-close-button').addEventListener('click', () => {
        document.getElementById('level-up-container').style.display = 'none';
        document.getElementById('answer-input').focus();
    });

})();