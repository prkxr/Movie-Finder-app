import { API_KEY } from './config.js';  

const moviesContainer = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const errorMsg = document.getElementById("error");

async function fetchMovies(query) {
  errorMsg.textContent = "";
  moviesContainer.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>Loading...</p>";

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await res.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      moviesContainer.innerHTML = "";
      errorMsg.textContent = "No movies found. Try another title.";
    }
  } catch (error) {
    moviesContainer.innerHTML = "";
    errorMsg.textContent = "Something went wrong. Please try again.";
  }
}

async function fetchMovieDetails(imdbID) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`);
    const data = await res.json();

    if (data.Response === "True") {
      showMovieModal(data);
    } else {
      alert("Movie details not found!");
    }
  } catch (error) {
    alert("Error fetching movie details.");
  }
}

function displayMovies(movies) {
  moviesContainer.innerHTML = movies
    .map(
      (movie) => `
      <div class="movie-card" data-id="${movie.imdbID}">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450"}" alt="${movie.Title}">
        <div class="movie-info">
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
        </div>
      </div>
    `
    )
    .join("");

  document.querySelectorAll(".movie-card").forEach((card) => {
    card.addEventListener("click", async () => {
      const imdbID = card.getAttribute("data-id");
      fetchMovieDetails(imdbID);
    });
  });
}

function showMovieModal(movie) {
  const modal = document.getElementById("movieModal");
  const modalBody = document.getElementById("modalBody");
  const closeModal = document.getElementById("closeModal");

  modalBody.innerHTML = `
    <div class="modal-movie">
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450"}" alt="${movie.Title}">
      <div class="modal-info">
        <h2>${movie.Title} (${movie.Year})</h2>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Cast:</strong> ${movie.Actors}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>IMDb Rating:</strong> ⭐ ${movie.imdbRating}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
      </div>
    </div>
  `;

  modal.style.display = "block";

  closeModal.onclick = () => (modal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
}


searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchMovies(query);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

fetchMovies("Spirited Away");
