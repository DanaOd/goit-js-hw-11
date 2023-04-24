const refs = {
  form: document.querySelector('#search-form'),
  searchQuery: document.querySelector('[name="searchQuery"]'),
  searchBtn: document.querySelector('.submit-btn'),
  loadMoreBtn: document.querySelector('.load-more'),
};

// console.log(refs.form, refs.searchBtn, refs.searchQuery, refs.loadMoreBtn);

const API_KEY = '13927284-11be6ffea1679f093739cb091';
refs.form.addEventListener('submit', onSearchSubmit);
let query = '';

function onSearchSubmit(event) {
  event.preventDefault();
  console.log('click');

  query = refs.searchQuery.value;
  console.log(query);

  fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`)
    .then(responce => responce.json())
    .then(data => {
        console.log('data', data);
        console.log('data.hits[0]', data.hits[0]);


        console.log(data.hits[0].webformatURL, data.tags, data.likes);


    })
    .catch(error => console.log(error));
}

let templateMarkDown = `<div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>`;


function makeMarkdown (data){
    return `<div class="photo-card">
    <img src="${data.webformatURL}" alt="${data.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${data.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
      </p>
      <p class="info-item">
        <b>Comments</b>
      </p>
      <p class="info-item">
        <b>Downloads</b>
      </p>
    </div>
  </div>`;
}