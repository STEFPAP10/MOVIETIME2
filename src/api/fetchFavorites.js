const image_path = "https://image.tmdb.org/t/p/w500";
const API_KEY = "09d4d155f252fcf9cec509ee46d291f2";



// 👤 Παίρνει favorites από το localStorage του ενεργού χρήστη
export function get_ls() {
  const activeProfile = JSON.parse(localStorage.getItem("activeProfile"));
  const username = activeProfile?.username || "guest";
  return JSON.parse(localStorage.getItem(`favorites_${username}`)) || [];
}

// 🎬 Φέρνει ταινία από API
export async function get_movie_by_id(id) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`);
  return await res.json();
}

// 📺 Φέρνει TV show από API
export async function get_tv_show_by_id(id) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`);
  return await res.json();
}

// ❤️ Δημιουργεί κάρτες αγαπημένων στο DOM
// export async function fetch_favorite_movies() {
//   const main_grid = document.getElementById("favorites-list");
//   main_grid.innerHTML = "";

//   const favorites = get_ls();
//   if (favorites.length === 0) {
//     main_grid.innerHTML = "<p class='empty-message'>Δεν υπάρχουν αγαπημένα.</p>";
//     return;
//   }

//   const cards = await Promise.all(
//     favorites.map(async ({ id, type }) => {
//       const data = type === "movie" ? await get_movie_by_id(id) : await get_tv_show_by_id(id);
//       const title = data.title || data.name || "Χωρίς τίτλο";
//       const overview = data.overview ? data.overview.slice(0, 100) + "..." : "No description.";

//       return `
//         <div class="movie-list-item" data-id="${id}" data-type="${type}">
//           <img class="movie-list-item-img" src="${image_path + data.poster_path}" />
//           <span class="movie-list-item-title">${title}</span>
//           <p class="movie-list-item-desc">${overview}</p>
//           <button class="movie-list-item-button">Watch</button>
//         </div>
//       `;
//     })
//   );


  
//   main_grid.innerHTML = cards.join("");
// }

export async function fetch_favorite_movies() {
  const main_grid = document.getElementById("favorites-list");

  if (!main_grid) {
    console.error("❌ Δεν βρέθηκε το #favorites-list στο DOM!");
    return;
  }

  console.log("✅ Βρέθηκε το #favorites-list");

  main_grid.innerHTML = "";

  const favorites = get_ls();
  console.log("📦 Αγαπημένα που φορτώθηκαν:", favorites);

  if (favorites.length === 0) {
    main_grid.innerHTML = "<p class='empty-message'>Δεν υπάρχουν αγαπημένα.</p>";
    return;
  }

  const cards = await Promise.all(
    favorites.map(async ({ id, type }) => {
      const data = type === "movie"
        ? await get_movie_by_id(id)
        : await get_tv_show_by_id(id);

      const title = data.title || data.name || "Χωρίς τίτλο";
      const overview = data.overview ? data.overview.slice(0, 100) + "..." : "No description.";

      return `
        <div class="movie-list-item" data-id="${id}" data-type="${type}">
          <img class="movie-list-item-img" src="${image_path + data.poster_path}" />
          <span class="movie-list-item-title">${title}</span>
          <p class="movie-list-item-desc">${overview}</p>
          <button class="movie-list-item-button">Watch</button>
        </div>
      `;
    })
  );

  main_grid.innerHTML = cards.join("");
}
