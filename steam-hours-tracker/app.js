document.getElementById('fetchPlaytimeButton').addEventListener('click', fetchUserGames);
let hideUnplayed = false;

document.getElementById('toggleUnplayedButton').addEventListener('click', () => {
    hideUnplayed = !hideUnplayed;
    updateGamesList();
});

async function fetchUserGames() {
    const steamId = document.getElementById('steamIdInput').value;
    if (!steamId) {
        alert('Please enter a Steam ID');
        return;
    }
    
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = '';
    
    try {
        const response = await fetch(`http://localhost:3000/fetchSteamData?steamid=${steamId}`);
        if (!response.ok) throw new Error(`Data fetch failed with status ${response.status}`);
        const data = await response.json();
        
        const games = data.response.games.sort((a, b) => b.playtime_forever - a.playtime_forever);
        const totalPlaytime = games.reduce((acc, game) => acc + game.playtime_forever, 0) / 60;
        const playedGamesCount = games.filter(game => game.playtime_forever > 0).length;
        const unplayedGamesCount = games.length - playedGamesCount;
        
        document.getElementById('totalPlaytime').textContent = totalPlaytime.toFixed(2);
        document.getElementById('playedGamesCount').textContent = playedGamesCount;
        document.getElementById('unplayedGamesCount').textContent = unplayedGamesCount;
        document.getElementById('totalGamesCount').textContent = games.length;
        
        window.gamesList = games;
        updateGamesList();
    } catch (error) {
        console.error('Error fetching data:', error);
        errorContainer.textContent = `An error occurred: ${error.message}`;
    }
}

function updateGamesList() {
    const gamesListElement = document.getElementById('gamesList');
    gamesListElement.innerHTML = '';

    const filteredGames = window.gamesList.filter(game => !hideUnplayed || game.playtime_forever > 0);

    filteredGames.forEach(game => {
        const li = document.createElement('li');
        li.textContent = `${game.name}: ${(game.playtime_forever / 60).toFixed(2)} hours`;
        gamesListElement.appendChild(li);
    });
}