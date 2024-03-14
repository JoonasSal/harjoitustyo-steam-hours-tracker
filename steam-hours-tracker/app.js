// Globaali muuttuja pelaamattomien pelien piilottamiseen.
let hideUnplayed = false;

// Kun dokumentti on ladattu, suoritetaan alustustoimenpiteet.
document.addEventListener('DOMContentLoaded', () => {
    // Haetaan mahdollisesti tallennettu Steam ID sessionStoragesta.
    const sessionSteamId = sessionStorage.getItem('sessionSteamId');
    if (sessionSteamId) {
        document.getElementById('steamIdInput').value = sessionSteamId;
    }

    // Jos sivu on uudelleenladattu käyttäjän toiminnan jälkeen, haetaan pelit automaattisesti.
    if (sessionStorage.getItem('fetchPerformed') === 'true') {
        fetchUserGames(true);
    }
});

// Määritellään nappi, joka hakee käyttäjän pelitilastot, kun siihen klikataan.
document.getElementById('fetchPlaytimeButton').addEventListener('click', fetchUserGames);

// Funktio käyttäjän pelien tietojen hakemiseksi.
async function fetchUserGames(isPageReload = false) {
    // Elementtien määrittelyä ja alustusta.
    const steamId = document.getElementById('steamIdInput').value;
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = '';
    errorContainer.style.display = 'none';

    // Tallennetaan käyttäjän Steam ID sessionStorageen.
    sessionStorage.setItem('sessionSteamId', steamId);

    // Valmistellaan Steam ID hakuun.
    let finalSteamId = steamId || localStorage.getItem('savedSteamId');
    if (!finalSteamId) {
        showError('Please enter a Steam ID');
        return;
    }

    try {
        // Yritetään hakea pelit localStoragesta tai API-kutsulla.
        let games = JSON.parse(localStorage.getItem('gamesList'));
        if (!games || steamId) {
            const response = await fetch(`http://localhost:3000/fetchSteamData?steamid=${finalSteamId}`);
            if (!response.ok) throw new Error(`Data fetch failed with status ${response.status}`);
            const data = await response.json();
            if (!data.response.games) throw new Error('No games found for this Steam ID');

            games = data.response.games.sort((a, b) => b.playtime_forever - a.playtime_forever);
            localStorage.setItem('gamesList', JSON.stringify(games));
            localStorage.setItem('savedSteamId', finalSteamId);
        }

        // Näytetään haetut pelitiedot.
        displayGameData(games);
    } catch (error) {
        console.error('Error fetching data:', error);
        showError(`An error occurred: ${error.message}`);
    }
}

// Näyttää virheviestin.
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
}

// Näyttää pelien tiedot (kokonaispeliaika, pelattujen pelien määrä jne.).
function displayGameData(games) {
    // Lasketaan ja näytetään pelitilastot.
    const totalPlaytime = games.reduce((acc, game) => acc + game.playtime_forever, 0) / 60;
    const playedGamesCount = games.filter(game => game.playtime_forever > 0).length;
    const unplayedGamesCount = games.length - playedGamesCount;

    // Päivitetään DOM elementtien sisältö.
    document.getElementById('totalPlaytime').textContent = totalPlaytime.toFixed(2);
    document.getElementById('playedGamesCount').textContent = playedGamesCount;
    document.getElementById('unplayedGamesCount').textContent = unplayedGamesCount;
    document.getElementById('totalGamesCount').textContent = games.length;

    // Tallennetaan pelilista myöhempää käyttöä varten ja päivitetään näkymä.
    window.gamesList = games;
    updateGamesList();
    document.getElementById('statsContainer').style.display = 'flex';
    document.getElementById('viewUnplayedButton').style.display = 'block';

    // Merkitään, että pelihaku on suoritettu.
    sessionStorage.setItem('fetchPerformed', 'true');
}

// Päivittää pelilistan näkymän.
function updateGamesList() {
    // Pelilistan elementti ja sen tyhjennys.
    const gamesListElement = document.getElementById('gamesList');
    gamesListElement.innerHTML = '';

    // Filtteröidään ja lisätään pelit listaan.
    window.gamesList.filter(game => !hideUnplayed || game.playtime_forever > 0).forEach(game => {
        // Luodaan lista-item pelin tiedoille.
        const li = document.createElement('li');
        // Pelin nimi.
        const gameNameSpan = document.createElement('span');
        gameNameSpan.className = 'game-name';
        gameNameSpan.textContent = game.name;
        // Peliaika.
        const gameHoursSpan = document.createElement('span');
        gameHoursSpan.className = 'game-hours';
        gameHoursSpan.textContent = `${(game.playtime_forever / 60).toFixed(2)} hours`;

        // Lisätään elementit lista-itemiin ja listaan.
        li.appendChild(gameNameSpan);
        li.appendChild(gameHoursSpan);
        li.setAttribute('data-appid', game.appid);
        li.addEventListener('click', () => fetchGameDetails(game.appid));
        gamesListElement.appendChild(li);
    });
}

// Hakee yksittäisen pelin tarkemmat tiedot.
async function fetchGameDetails(appId) {
    try {
        const response = await fetch(`http://localhost:3000/gameDetails/${appId}`);
        if (!response.ok) throw new Error('Failed to fetch game details');
        const gameDetails = await response.json();
        displayGameDetails(gameDetails);
    } catch (error) {
        console.error('Error fetching game details:', error);
    }
}

// Näyttää yksittäisen pelin tarkemmat tiedot modaalissa.
function displayGameDetails(details) {
    // Asetetaan pelin tiedot ja näytetään modaalinen ikkuna.
    const gameDetailsModal = document.getElementById('gameDetailsModal');
    document.getElementById('gameImage').src = details.data.header_image;
    document.getElementById('gameTitle').textContent = details.data.name;
    document.getElementById('gameDescription').innerHTML = details.data.short_description;
    document.getElementById('gameDeveloper').textContent = "Developer: " + details.data.developers;
    document.getElementById('gameReleaseDate').textContent = "Release Date: " + details.data.release_date.date;
    document.getElementById('gameReviewScore').textContent = "Recommendations: " + details.data.recommendations.total;

    gameDetailsModal.style.display = 'block';
}

// Piilottaa pelin tarkempien tietojen modaalisen ikkunan.
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('gameDetailsModal').style.display = 'none';
});

// Hallinnoi pelaamattomien pelien listan näyttämistä.
document.getElementById('viewUnplayedButton').addEventListener('click', () => {
    const unplayedGames = window.gamesList.filter(game => game.playtime_forever === 0);
    localStorage.setItem('unplayedGames', JSON.stringify(unplayedGames));
    window.location.href = 'unplayedGames.html';
});