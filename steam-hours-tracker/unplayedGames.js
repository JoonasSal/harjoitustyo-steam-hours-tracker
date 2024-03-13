document.addEventListener('DOMContentLoaded', () => {
    const games = JSON.parse(localStorage.getItem('unplayedGames') || '[]');
    const list = document.getElementById('unplayedGamesList');
    games.forEach(game => {
        const li = document.createElement('li');
        li.textContent = game.name;
        list.appendChild(li);
    });

    document.getElementById('randomGameButton').addEventListener('click', async () => {
        if (games.length > 0) {
            const randomIndex = Math.floor(Math.random() * games.length);
            const randomGame = games[randomIndex];
            const gameDetails = await fetchGameDetails(randomGame.appid);
            displayGameDetails(gameDetails, randomGame.appid);
        } else {
            document.getElementById('randomGameDisplay').textContent = "No unplayed games found.";
        }
    });
});

async function fetchGameDetails(appId) {
    const response = await fetch(`http://localhost:3000/gameDetails/${appId}`);
    if (!response.ok) throw new Error('Failed to fetch game details');
    return await response.json();
}

function displayGameDetails(details, appId) {
    const infoDiv = document.getElementById('randomGameInfo');
    infoDiv.innerHTML = `
        <h3>${details.data.name}</h3>
        <img src="${details.data.header_image}" alt="${details.data.name}" style="max-width: 100%; height: auto;">
        <p>${details.data.short_description}</p>
        <p>Release Date: ${details.data.release_date.date}</p>
        <p>Recommendations: ${details.data.recommendations.total}</p>
    `;
    infoDiv.style.display = 'block';
}