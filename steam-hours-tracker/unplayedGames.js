// Kun dokumentti on ladattu, ladataan pelaamattomat pelit ja asetetaan toiminnot napeille.
document.addEventListener('DOMContentLoaded', initializeUnplayedGamesList);

async function initializeUnplayedGamesList() {
    // Haetaan pelaamattomien pelien lista localStoragesta ja näytetään lista.
    const games = JSON.parse(localStorage.getItem('unplayedGames') || '[]');
    const list = document.getElementById('unplayedGamesList');
    games.forEach(game => {
        const li = document.createElement('li');
        li.textContent = game.name;
        li.setAttribute('data-appid', game.appid);
        // Klikkaamalla peliä haetaan pelin yksityiskohtaiset tiedot.
        li.addEventListener('click', () => {
            fetchGameDetails(game.appid).then(displayModalGameDetails);
        });
        list.appendChild(li);
    });

    // Asetetaan satunnaisen pelaamattoman pelin hakuun painike.
    document.getElementById('randomGameButton').addEventListener('click', () => {
        displayRandomUnplayedGame(games);
    });
}

// Hakee pelin yksityiskohtaiset tiedot annetun appId:n perusteella.
async function fetchGameDetails(appId) {
    const response = await fetch(`http://localhost:3000/gameDetails/${appId}`);
    if (!response.ok) throw new Error('Failed to fetch game details');
    return await response.json();
}

// Näyttää satunnaisen pelaamattoman pelin tiedot.
async function displayRandomUnplayedGame(games) {
    if (games.length > 0) {
        const randomIndex = Math.floor(Math.random() * games.length);
        const randomGame = games[randomIndex];
        const details = await fetchGameDetails(randomGame.appid);
        displayRandomGameDetails(details, randomGame.appid);
    } else {
        document.getElementById('randomGameDisplay').textContent = "No unplayed games found.";
    }
}

// Näyttää satunnaisen pelaamattoman pelin yksityiskohtaiset tiedot.
function displayRandomGameDetails(details, appId) {
    const infoDiv = document.getElementById('randomGameInfo');
    infoDiv.innerHTML = `
        <h3>${details.data.name}</h3>
        <img src="${details.data.header_image}" alt="${details.data.name}" style="max-width: 100%; height: auto;">
        <p>${details.data.short_description}</p>
        <p>Developer: ${details.data.developers}</p>
        <p>Release Date: ${details.data.release_date.date}</p>
        <p>Recommendations: ${details.data.recommendations.total}</p>
    `;
    infoDiv.style.display = 'block';
}

// Näyttää pelin yksityiskohtaiset tiedot modaalissa.
function displayModalGameDetails(details) {
    // Asetetaan ja näytetään pelin tiedot modaalissa.
    const gameDetailsModal = document.getElementById('gameDetailsModal');
    document.getElementById('gameImage').src = details.data.header_image;
    document.getElementById('gameTitle').textContent = details.data.name;
    document.getElementById('gameDescription').innerHTML = details.data.short_description;
    document.getElementById('gameDeveloper').textContent = "Developer: " + details.data.developers;
    document.getElementById('gameReleaseDate').textContent = "Release Date: " + details.data.release_date.date;
    document.getElementById('gameReviewScore').textContent = "Recommendations: " + details.data.recommendations.total;

    gameDetailsModal.style.display = 'block';
}

// Asettaa pelin yksityiskohtaisen näkymän modaalisen ikkunan sulkemistoiminnon.
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('gameDetailsModal').style.display = 'none';
});