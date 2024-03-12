document.addEventListener('DOMContentLoaded', () => {
    const games = JSON.parse(localStorage.getItem('unplayedGames') || '[]');
    const list = document.getElementById('unplayedGamesList');
    games.forEach(game => {
        const li = document.createElement('li');
        li.textContent = game.name;
        list.appendChild(li);
    });

    document.getElementById('randomGameButton').addEventListener('click', () => {
        if (games.length > 0) {
            const randomIndex = Math.floor(Math.random() * games.length);
            const randomGame = games[randomIndex];
            document.getElementById('randomGameDisplay').textContent = `Why not try: ${randomGame.name}`;
        } else {
            document.getElementById('randomGameDisplay').textContent = "No unplayed games found.";
        }
    });
});