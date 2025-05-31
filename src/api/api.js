const API_KEY = "09d4d155f252fcf9cec509ee46d291f2";
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280";

// TMDB API functions
export async function getTopMovies() {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}

export async function getMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}


export async function getTrending() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

export async function getPopularTV() {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}

export async function getMovieById(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
  return await res.json();
}

export async function getTvShowById(id) {
  const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`);
  return await res.json();
}

export async function getMovieTrailer(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  return data.results.find((video) => video.type === "Trailer" && video.site === "YouTube");
}

export async function getTvTrailer(id) {
  const res = await fetch(`${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  return data.results.find((video) => video.type === "Trailer" && video.site === "YouTube");
}

export async function searchMovies(term) {
  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${term}&page=1&include_adult=false`);
  const data = await res.json();
  return data.results;
}

// Fetch user profiles by email (from your backend)
export async function getProfiles(email) {  
  if (!email) return [];

  const res = await fetch(`http://localhost:5000/api/profiles?email=${email}`);
  const data = await res.json();
  return data;
}


export async function getFavorites() {
  const profile = JSON.parse(localStorage.getItem("activeProfile"));
  const username = profile?.username || "guest";
  const stored = JSON.parse(localStorage.getItem(`favorites_${username}`)) || [];

  const results = await Promise.all(
    stored.map(async ({ id, type }) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=en-US`
      );
      return await res.json();
    })
  );

  return results.filter(Boolean);
}


function setupArrows() {
  const arrows = document.querySelectorAll(".arrow");

  arrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const movieList = arrow.parentElement.querySelector(".movie-list");
      const scrollAmount = 300; // pixels to scroll
      movieList.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
  });
}

export { setupArrows };


