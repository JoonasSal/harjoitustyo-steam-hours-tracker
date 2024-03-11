document.addEventListener('DOMContentLoaded', () => {
    const games = JSON.parse(localStorage.getItem('unplayedGames') || '[]');
    const list = document.getElementById('unplayedGamesList');
    games.forEach(game => {
        const li = document.createElement('li');
        li.textContent = game.name;
        list.appendChild(li);
    });
});