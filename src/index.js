import Notiflix from 'notiflix';
import axios from 'axios';

// const axios = require('axios');

const refs = {
  form: document.querySelector('#search-form'),
  searchQuery: document.querySelector('[name="searchQuery"]'),
  searchBtn: document.querySelector('.submit-btn'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const API_KEY = '13927284-11be6ffea1679f093739cb091';
refs.form.addEventListener('submit', onSearchSubmit);
let query = '';
let page = 1;
let per_page = 20;
let totalPages = 0;

refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearchSubmit(event) {
  event.preventDefault();
  if (refs.searchQuery.value === '') {
    console.log('no search request');
    refs.gallery.innerHTML = '';
    refs.loadMoreBtn.style.visibility = 'hidden';
    return;
  }

  if (query !== refs.searchQuery.value) {
    console.log('set up new query value');
    refs.gallery.innerHTML = '';
    query = refs.searchQuery.value;
  }

  page = 1;
  query = refs.searchQuery.value;

  let URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

  try {
    fetchItems(URL).then(markdown =>
      refs.gallery.insertAdjacentHTML('afterbegin', markdown)
    );
  } catch (error) {
    console.log(error);
  }
}

async function fetchItems(url) {
  const responce = await axios.get(url);
  const images = responce.data;
  console.log(images);

  if (images.hits.length === 0) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.form.reset();
    return;
  }
  //сколько страниц приходит
  totalPages = Math.ceil(images.totalHits / per_page);
  console.log('totalPages', images.totalHits, totalPages);

  //показывать ли load more 1й раз
  if (totalPages > 1 && page === 1) {
    refs.loadMoreBtn.style.visibility = 'visible';
  }

  let markdown = '';

  images.hits.map(image => {
    const imageMarkDown = makeMarkdown(image);
    markdown += imageMarkDown;
  });
  return markdown;
}

// return fetch(url)
//     .then(responce => responce.json())
//     .then(images => {
//         if (images.hits.length === 0) {
//             Notiflix.Notify.warning(
//                 'Sorry, there are no images matching your search query. Please try again.'
//             );
//             refs.form.reset();
//             return;
//         }

//         //сколько страниц приходит
//         totalPages = Math.ceil(images.totalHits / per_page);
//         console.log('totalPages', images.totalHits, totalPages);

//         //показывать ли load more 1й раз
//         if (totalPages > 1 && page === 1) {
//             refs.loadMoreBtn.style.visibility = 'visible';
//         }

//         let markdown = '';

//         images.hits.map(image => {
//             const imageMarkDown = makeMarkdown(image);
//             markdown += imageMarkDown;
//         });
//         return markdown;
//     });
// }

function makeMarkdown(item) {
  return `<div class="photo-card">
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b> 
         ${item.likes}
      </p>
      <p class="info-item">
        <b>Views</b> 
         ${item.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
         ${item.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> 
         ${item.downloads}
      </p>
    </div>
  </div>`;
}

function onLoadMore(event) {
  refs.loadMoreBtn.style.visibility = 'hidden';
  page += 1;
  let URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

  console.log('click on load more, page: ', page);

  fetchItems(URL)
    .then(markdown => {
      refs.gallery.insertAdjacentHTML('beforeend', markdown);
    })
    .catch(error => console.log(error));

  // показывать ли load more
  if (page == totalPages) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadMoreBtn.style.visibility = 'hidden';
  } else if (page < totalPages) {
    refs.loadMoreBtn.style.visibility = 'visible';
  }
}
