import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

let pageData = {
  _page: 1,
  get page() {
    return this._page;
  },
  set page(value) {
    if (value >= 1) {
      this._page = value;
    }
  }
}; 
let matches = books;

/**
 * @typedef {object} getHTML
 * @param {string} dataAttr
 * @param {string} [value]
 * @param {HTMLElement} [target]
 * @returns {HTMLElement}
 */
const starting = document.createDocumentFragment();
const getHTML = (dataAttr, value, target) => {
  const selector = value
    ? `[data-${dataAttr}="${value}"]`
    : `[data-${dataAttr}]`;

  const scope = target || document;
  const element = scope.querySelector(selector);
  const isHTMLElement = element instanceof HTMLElement;

  if (!isHTMLElement) {
    throw new Error(`${selector} attribute not found in HTML`);
  }

  return element;
};

/** 
 * 
 * @param {object} book - It contains author, id, images and title.
 * @returns {HTMLElement} - The encapsulated book preview element.
 *
*/
const createBookPreview = (book) => {
  let { author, id, image, title } = book;

  const element = document.createElement("button");

  element.className = "preview";
  element.setAttribute("data-preview", id);

  const setAuthor = (newAuthor) => {
    if (authors[newAuthor]) {
      author = newAuthor;
      element.querySelector(".preview__author").innerText = authors[newAuthor];
    }
  };

  const setTitle = (newTitle) => {
    if (newTitle) {
      title = newTitle;
      element.querySelector(".preview__title").innerText = newTitle;
    }
  };

  const setImage = (newImage) => {
    if (newImage) {
      image = newImage;
      element.querySelector(".preview__image").src = newImage;
    }
  };

  const setId = (newId) => {
    if (newId) {
      id = newId;
      element.setAttribute("data-preview", newId);
    }
  };

  const getAuthor = () => author;
  const getTitle = () => title;
  const getImage = () => image;
  const getId = () => id;

  element.innerHTML = /* html */
    `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;

  return { 
    getElement: () => element,
    get author() {
      return getAuthor();
    },
    set author(newAuthor) {
      setAuthor(newAuthor);
    },
    get title() {
      return getTitle();
    },
    set title(newTitle) {
      setTitle(newTitle);
    },
    get image() {
      return getImage();
    },
    set image(newImage) {
      setImage(newImage);
    },
    get id() {
      return getId();
    },
    set id(newId) {
      setId(newId);
    },
  };
};

books.slice(0, BOOKS_PER_PAGE).forEach((book) => {
  const bookPreview = createBookPreview(book);
  starting.appendChild(bookPreview.getElement());
});

document.getElementById("list-items").appendChild(starting);

const genreHtml = document.createDocumentFragment();
const firstGenreElement = document.createElement("option");
firstGenreElement.value = "any";
firstGenreElement.innerText = "All Genres";
genreHtml.appendChild(firstGenreElement);

for (const [id, name] of Object.entries(genres)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  genreHtml.appendChild(element);
}

const authorsHtml = document.createDocumentFragment();
const firstAuthorElement = document.createElement("option");
firstAuthorElement.value = "any";
firstAuthorElement.innerText = "All Authors";
authorsHtml.appendChild(firstAuthorElement);

for (const [id, name] of Object.entries(authors)) {
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  authorsHtml.appendChild(element);
}

const setTheme = () => {
  const theme =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "night"
      : "day";

  getHTML("settings-theme").value = theme;
  
  document.documentElement.style.setProperty(
    "--color-dark",
    theme === "night" ? "255, 255, 255" : "10, 10, 20"
  );

  document.documentElement.style.setProperty(
    "--color-light",
    theme === "night" ? "10, 10, 20" : "255, 255, 255"
  );
};

//getDom pulls the 

const getDom = () => {
  getHTML("list-items").appendChild(starting);
  getHTML("search-genres").appendChild(genreHtml);
  getHTML("search-authors").appendChild(authorsHtml);
  setTheme();
};

document.addEventListener("DOMContentLoaded", getDom);

const showMoreButton = () => {
  const button = getHTML("list-button");
  button.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
  button.disabled = matches.length - pageData.page * BOOKS_PER_PAGE <= 0;
  button.innerHTML = /* html */
    `    <span>Show more</span>
  <span class="list__remaining"> (${matches.length - pageData.page * BOOKS_PER_PAGE > 0 ? matches.length - pageData.page * BOOKS_PER_PAGE : 0})</span>
`;
};

showMoreButton();

getHTML("search-cancel").addEventListener("click", () => {
  getHTML("search-overlay").open = false;
});

getHTML("settings-cancel").addEventListener("click", () => {
    getHTML("settings-overlay").open = false;
  });

getHTML("header-search").addEventListener("click", () => {
  getHTML("search-overlay").open = true;
  getHTML("search-title").focus();
});

getHTML("header-settings").addEventListener("click", () => {
  getHTML("settings-overlay").open = true;
  });

  getHTML("list-close").addEventListener("click", () => {
    getHTML("list-active").open = false;
});

getHTML("settings-form").addEventListener("submit", (event) => {
    event.preventDefault();

    if (!(event.target instanceof HTMLFormElement)) {
      throw new Error('form not found');
    }
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    if (theme === "night") {
      document.documentElement.style.setProperty(
        "--color-dark",
        "255, 255, 255"
      );
      document.documentElement.style.setProperty("--color-light", "10, 10, 20");
    } else if (theme === "day") {
      document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
      document.documentElement.style.setProperty(
        "--color-light",
        "255, 255, 255"
      );
    }
      getHTML("settings-overlay").open = false;
  });

getHTML("search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (const book of books) {
      const genreMatch =
        filters.genre === "any" || book.genres.includes(filters.genre);
      const titleMatch =
        filters.title.trim() === "" ||
        book.title.toLowerCase().includes(filters.title.toLowerCase());
      const authorMatch =
        filters.author === "any" || book.author === filters.author;

      if (genreMatch && titleMatch && authorMatch) {
        result.push(book);
      }
    }

    pageData.page = 1;
    matches = result;

    if (result.length < 1) {
      getHTML("list-message").classList.add("list__message_show");
    } else {
      getHTML("list-message").classList.remove("list__message_show");
    }

    getHTML("list-items").innerHTML = "";
    const newItems = document.createDocumentFragment();
    result.slice(0, BOOKS_PER_PAGE).forEach((book) => {
      newItems.appendChild(createBookPreview(book));
    });

    getHTML("list-items").appendChild(newItems);
    getHTML("list-button").disabled = matches.length - pageData.page * BOOKS_PER_PAGE < 1;
    getHTML("list-button").innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${matches.length - pageData.page * BOOKS_PER_PAGE > 0 ? matches.length - pageData.page * BOOKS_PER_PAGE : 0})</span>
    `;

    window.scrollTo({ top: 0, behavior: "smooth" });
    getHTML("search-overlay").open = false;
  });

getHTML("list-button").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  matches.slice(pageData.page * BOOKS_PER_PAGE,
    (pageData.page + 1) * BOOKS_PER_PAGE).forEach((book) => {
      fragment.appendChild(createBookPreview(book));
});

getHTML("list-items").appendChild(fragment);
pageData.page += 1;

showMoreButton();
});

getHTML("list-items").addEventListener("click", (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
      if (active) break;

      if (node?.dataset?.preview) {
        let result = null;

        for (const singleBook of books) {
          if (result) break;
          if (singleBook.id === node?.dataset?.preview) result = singleBook;
        }

        active = result;
      }
    }

    if (active) {
      getHTML("list-active").open = true;
      getHTML("list-blur").src = active.image;
      getHTML("list-image").src = active.image;
      getHTML("list-title").innerText = active.title;
      getHTML("list-subtitle").innerText =
        `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
      getHTML("list-description").innerText = active.description;
    }
  });
