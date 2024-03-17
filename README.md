# Steam Hours Tracker

The Steam Hours Tracker is a web application that allows users to view and manage their playtime across their Steam game library. It features functionalities to fetch playtime data, display unplayed games, and explore detailed information about each game.

## Features

- **Fetch Games & Playtime:** Users can enter their Steam ID to fetch and display their game library along with total playtime.
- **Unplayed Games Graveyard:** A special feature that lists games in the user's library that have not been played yet.
- **Detailed Game Information:** Clicking on a game brings up a modal with detailed information about the game, such as the title, description, developer, release date, and amount of recommendations.
- **Random Game Selector:** From the Unplayed Games list, users can use the "Save Random Game From The Graveyard" button to randomly select an unplayed game and view its details.

## Technologies

This project is built using the following technologies:

- HTML/CSS for the frontend interface.
- Vanilla JavaScript for client-side scripting.
- Node.js and Express for the backend server.
- `node-fetch` for making HTTP requests to external APIs.
- CORS to enable cross-origin requests.
- dotenv for managing environment variables.

## Setup and Installation

1. **Clone the Repository**
```
git clone https://github.com/JoonasSal/steam-hours-tracker.git
cd steam-hours-tracker
```

2. **Install Dependencies**
Ensure that you have Node.js and npm installed on your system. Then, run the following command in the server directory to install the required dependencies:
```
npm install
```

3. **Set Up Environment Variables**
Create a .env file in the server directory and add your Steam API key:
```
STEAM_API_KEY=your_steam_api_key_here
```

4. **Start the Server**
Run the following command to start the backend server:
```
npm start
```
The server will run on http://localhost:3000. You can now open the index.html file in your browser to use the application.

## Usage

- Enter your Steam ID (in DEC format ex. 12345678912345678) in the input field on the homepage and click "Fetch Games & Playtime" to view your game library and total playtime.
- Navigate to the Unplayed Games page to see a list of games you haven't played yet.
- Click on any game in the list to view more detailed information about it.
- Let fate decide which unplayed game you should save from the graveyard.






