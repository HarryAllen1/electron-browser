// @ts-check

const { ipcRenderer } = require('electron');

/**
 * @param {string} url
 */
const visit = (url) => {
  ipcRenderer.invoke('visit', url);
};

/** @type {HTMLFormElement | null} */
const form = document.querySelector('#url');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  /** @type {string} */
  // @ts-ignore
  const url = form.elements[0].value;

  visit(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
      url
    )
      ? url
      : `https://www.google.com/search?q=${encodeURIComponent(
          url.replace(/ /g, '+')
        )}`
  );
});
