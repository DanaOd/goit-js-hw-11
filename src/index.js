import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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
let per_page = 40;
let totalPages = 0;
let isNewQuery = false;

refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearchSubmit(event) {
  isNewQuery = false;

  event.preventDefault();
  if (refs.searchQuery.value === '') {
    console.log('no search request');
    refs.gallery.innerHTML = '';
    refs.loadMoreBtn.style.visibility = 'hidden';
    return;
  }

  if (query === refs.searchQuery.value) {
    return;
  }

  if (query !== refs.searchQuery.value) {
    isNewQuery = true;
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

  if (images.hits.length === 0) {
    Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    refs.form.reset();
    refs.loadMoreBtn.style.visibility = 'hidden';
    refs.gallery.innerHTML = '';
    markdown = '';

    return;
  }

  // проверка на то, что это новый запрос, и выводить сообщение с кол-вом найденных картинок
  if (isNewQuery) {
    Notiflix.Notify.success(`"Hooray! We found ${images.totalHits} images."`);
  }

  //сколько страниц приходит
  totalPages = Math.ceil(images.totalHits / per_page);

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

// let gallery = new SimpleLightbox('.gallery div a');
// gallery.on('show.simplelightbox', function () {
//   console.log('gallery on');
// });

//  <a href="${item.webformatURL}"><img src="${item.largeImageURL}" alt="${item.tags}" loading="lazy" /></a>

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

// SIMPLEBOX MODAL OPEN BY CLICK
// gallery.addEventListener('click', onImageClick);

function onImageClick(event) {
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  gallery.open(event.target);
}

function onLoadMore(event) {
  isNewQuery = false;
  refs.loadMoreBtn.style.visibility = 'hidden';
  page += 1;
  let URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

  fetchItems(URL)
    .then(markdown => {
      refs.gallery.insertAdjacentHTML('beforeend', markdown);
    })
    .catch(error => console.log(error));

  // Плавная прокрутка
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

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
