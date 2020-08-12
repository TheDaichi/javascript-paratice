const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "d9835cc5",
      s: searchTerm,
    },
  });

  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
};

let leftData;
let rightData;
const onMovieSelect = async (movie, element, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "d9835cc5",
      i: movie.imdbID,
    },
  });
  element.innerHTML = movieTemplate(response.data);
  if (side === "left") {
    leftData = response.data;
  } else {
    rightData = response.data;
  }

  console.log(leftData);
  console.log(rightData);

  if (leftData && rightData) {
    runComparison();
  }
};

function runComparison() {
  const leftStat = document.querySelectorAll("#left-summary .notification");
  const rightStat = document.querySelectorAll("#right-summary .notification");

  leftStat.forEach((leftSt, index) => {
    if (index > 0) {
      const rightSt = rightStat[index];
      const leftSideValue = parseInt(leftSt.dataset.value);
      const rightSideValue = parseInt(rightSt.dataset.value);

      if (rightSideValue > leftSideValue) {
        leftSt.classList.toggle("is-primary");
        leftSt.classList.toggle("is-warning");
      } else {
        rightSt.classList.toggle("is-primary");
        rightSt.classList.toggle("is-warning");
      }
    }
  });
}

const autoCompleteConfig = {
  renderOption: (movie) => {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imgSrc}" />
    ${movie.Title} ${movie.Year}
  `;
  },
  inputValue: (movie) => {
    return movie.Title;
  },
  fetchData,
};

createAutoComplete({
  root: document.querySelector(".left-autocomplete"),
  onOptionSelect: (movie) => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
  ...autoCompleteConfig,
});

createAutoComplete({
  root: document.querySelector(".right-autocomplete"),
  onOptionSelect: (movie) => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
  ...autoCompleteConfig,
});

const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").split(",").join("")
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(",", ""));

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
