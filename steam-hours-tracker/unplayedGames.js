document.addEventListener('DOMContentLoaded', () => {
    const games = JSON.parse(localStorage.getItem('unplayedGames') || '[]');
    const list = document.getElementById('unplayedGamesList');
    games.forEach(game => {
        const li = document.createElement('li');
        li.textContent = game.name;
        li.setAttribute('data-appid', game.appid);
        li.addEventListener('click', () => {
            fetchGameDetails(game.appid).then(displayModalGameDetails);
        });
        list.appendChild(li);
    });

    document.getElementById('randomGameButton').addEventListener('click', async () => {
        if (games.length > 0) {
            const randomIndex = Math.floor(Math.random() * games.length);
            const randomGame = games[randomIndex];
            const details = await fetchGameDetails(randomGame.appid);
            displayRandomGameDetails(details, randomGame.appid);
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

function displayRandomGameDetails(details, appId) {
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

function displayModalGameDetails(details) {
    const gameDetailsModal = document.getElementById('gameDetailsModal');
    const gameImage = document.getElementById('gameImage');
    const gameTitle = document.getElementById('gameTitle');
    const gameDescription = document.getElementById('gameDescription');
    const gameReleaseDate = document.getElementById('gameReleaseDate');
    const gameReviewScore = document.getElementById('gameReviewScore');

    gameImage.src = details.data.header_image;
    gameTitle.textContent = details.data.name;
    gameDescription.innerHTML = details.data.short_description;
    gameReleaseDate.textContent = "Release Date: " + details.data.release_date.date;
    gameReviewScore.textContent = "Recommendations: " + details.data.recommendations.total;

    gameDetailsModal.style.display = 'block';
}

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('gameDetailsModal').style.display = 'none';
});