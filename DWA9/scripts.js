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
  },
};
let matches = books;

/**
 * @param {string} dataAttr
 * @param {string} [value]
 * @param {HTMLElement} [target]
 * @returns {HTMLElement}
 */

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

const starting = document.createDocumentFragment();

class createBookPreview extends HTMLElement {
  static get observedAttributes() {
    return ['id', 'image', 'title', 'authors'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open"});
  }

  connectedCallback() {
    this.render();
  }

  get id(){
    return this.getAttribute('id');
  }

  set id(value) {
    this.setAttribute('id', value);
    this.render();
  }

  get image() {
    return this.getAttribute('image');
  }

  set image(value) {
    this.setAttribute('image', value);
    this.render();
  }

  get title() {
    return this.getAttribute('title');
  }

  set title(value) {
    this.setAttribute('title', value);
    this.render();
  }

  get authors() {
    return this.getAttribute('authors');
  }

  set authors(value) {
    this.setAttribute('authors', value);
    this.render();
  }

  render(){
    this.shadowRoot.innerHTML = `
      <style>
          .book-preview {
            border-width: 0;
            width: 100%;
            font-family: Roboto, sans-serif;
            padding: 0.5rem 1rem;
            display: flex;
            align-items: center;
            cursor: pointer;
            text-align: left;
            border-radius: 8px;
            border: 1px solid rgba(var(--color-dark), 0.15);
            background: rgba(var(--color-light), 1);
          }
          .preview__image {
            width: 48px;
            height: 70px;
            object-fit: cover;
            background: grey;
            border-radius: 2px;
            box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
              0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
          }
          .preview__info {
            padding: 1rem;
          }
          .preview__title {
            margin: 0 0 0.5rem;
            font-weight: bold;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;  
            overflow: hidden;
            color: rgba(var(--color-dark), 0.8)
          }
          .preview__author {
            color: rgba(var(--color-dark), 0.4);
          }

      </style>

      <div class="book-preview">
        <img class="preview__image" src="${this.image}" alt="Book Image">
        <div class="preview__details">
          <h3 class="preview__title">${this.title}</h3>
          <p class="preview__author">${this.authors}</p>
        </div>
      </div>
    `;
  };
};

customElements.define('book-preview', createBookPreview);

document.addEventListener('DOMContentLoaded', () => {
  const listItemsContainer = document.querySelector('[data-list-items]');

  books.forEach(book => {
    const bookPreview = document.createElement('book-preview');
    bookPreview.id = book.id;
    bookPreview.image = book.image;
    bookPreview.title = book.title;
    bookPreview.authors = authors[book.authorId];
    listItemsContainer.appendChild(bookPreview);
  });
})


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
  const theme = window.matchMedia && 
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";

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

const showMoreButton = () => {
  const button = getHTML("list-button");
  button.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
  button.disabled = matches.length - pageData.page * BOOKS_PER_PAGE <= 0;
  button.innerHTML =
    /* html */
    `    <span>Show more</span>
  <span class="list__remaining"> (${Math.max(matches.length - pageData.page * BOOKS_PER_PAGE > 0 ? matches.length - pageData.page * BOOKS_PER_PAGE : 0)})</span>
`;
};
/**
 * This function is responsible for setting up the intial state of the DOM
 * when it has fully loaded.
 */

const getDom = () => {
  getHTML("list-items").appendChild(starting);
  getHTML("search-genres").appendChild(genreHtml);
  getHTML("search-authors").appendChild(authorsHtml);
  setTheme();
  showMoreButton();
};

document.addEventListener("DOMContentLoaded", getDom);

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
    throw new Error("form not found");
  }
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  if (theme === "night") {
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
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
  const result = books.filter(book => (
    (filters.genre === "any" || book.genres.includes(filters.genre)) &&
    (filters.title.trim() === "" || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
    (filters.author === "any" || book.author === filters.author)
  ));

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
    const bookPreview = new createBookPreview();
    bookPreview.id = book.id;
    bookPreview.image = book.image;
    bookPreview.title = book.title;
    bookPreview.authors = authors[book.author];
    newItems.appendChild(bookPreview);
  });

  getHTML("list-items").appendChild(newItems);
  getHTML("list-button").disabled = matches.length - pageData.page * BOOKS_PER_PAGE < 1;
  getHTML("list-button").innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${Math.max(matches.length - pageData.page * BOOKS_PER_PAGE > 0 ? matches.length - pageData.page * BOOKS_PER_PAGE : 0)})</span>
    `;

  window.scrollTo({ top: 0, behavior: "smooth" });
  getHTML("search-overlay").open = false;
});

getHTML("list-button").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  matches.slice(pageData.page * BOOKS_PER_PAGE, (pageData.page + 1) * BOOKS_PER_PAGE).forEach((book) => {
    const bookPreview = new createBookPreview();
    bookPreview.id = book.id;
    bookPreview.image = book.image;
    bookPreview.title = book.title;
    bookPreview.authorsName = authors[book.author];
    fragment.appendChild(bookPreview);
    });

  getHTML("list-items").appendChild(fragment);
  pageData.page += 1;

});

getHTML("list-items").addEventListener("click", (event) => {
  const pathArray = event.composedPath();
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
    (getHTML("list-blur") instanceof HTMLImageElement).src = active.image;
    (getHTML("list-image") instanceof HTMLImageElement).src = active.image;
    getHTML("list-title").innerText = active.title;
    getHTML("list-subtitle").innerText =
      `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
    getHTML("list-description").innerText = active.description;
  }
});
