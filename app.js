const apiKey = "10b61418322794ad92fac0ba28c874e5";
let currentPage = 1;
let query = '';

// Event Listener for Search Form
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    query = document.getElementById('search-input').value;
    currentPage = 1;
    searchMovies(query);
});

// Fetch movies from the API
function searchMovies(query, page = 1) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
            togglePagination(data.total_pages);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Display the list of movies
function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = ''; // Clear previous search results

    movies.forEach(movie => {
        movieList.appendChild(createMovieCard(movie));
    });
}

// Create movie card element
function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>Release Date: ${movie.release_date}</p>
        <button class="favorite-btn">❤️ Favorite</button>
    `;

    movieCard.addEventListener('click', () => showMovieDetails(movie));
    
    // Add event listener for the favorite button
    movieCard.querySelector('.favorite-btn').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering movie details
        addToFavorites(movie);
    });

    return movieCard;
}

// Pagination toggle
function togglePagination(totalPages) {
    document.getElementById('prev-page').style.display = currentPage > 1 ? 'inline-block' : 'none';
    document.getElementById('next-page').style.display = currentPage < totalPages ? 'inline-block' : 'none';
}

// Event listeners for pagination buttons
document.getElementById('prev-page').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        searchMovies(query, currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', function() {
    currentPage++;
    searchMovies(query, currentPage);
});

// Show movie details
function showMovieDetails(movie) {
    const detailsSection = document.getElementById('movie-details');
    detailsSection.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <p>${movie.overview}</p>
        <p>Rating: ${movie.vote_average}</p>
        <p>Release Date: ${movie.release_date}</p>
    `;
    detailsSection.style.display = 'block'; // Show details section
}

// Add movie to favorites
function addToFavorites(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Using some to check if the movie already exists
    const isFavorite = favorites.some(fav => fav.id === movie.id);

    if (!isFavorite) {
        favorites.push({ id: movie.id, title: movie.title, poster_path: movie.poster_path });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${movie.title} added to your favorites!`);
        displayFavorites(); // Update favorites display
    } else {
        alert(`${movie.title} is already in your favorites!`);
    }
}

// Display the list of favorite movies
function displayFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    favoritesList.innerHTML = ''; // Clear previous favorites

    favorites.forEach(fav => {
        favoritesList.appendChild(createFavoriteCard(fav));
    });
}

// Create favorite card element
function createFavoriteCard(fav) {
    const favoriteCard = document.createElement('div');
    favoriteCard.classList.add('favorite-card');
    favoriteCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${fav.poster_path}" alt="${fav.title}">
        <h3>${fav.title}</h3>
    `;

    return favoriteCard;
}

// Initialize favorites display on page load
displayFavorites();