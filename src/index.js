const refs = {
  form: document.querySelector('#search-form'),
  searchQuery: document.querySelector('[name="searchQuery"]'),
  searchBtn: document.querySelector('.submit-btn'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
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
    .then(images => {
        console.log('images.hits', images.hits);
        let markdown='';

        const imagesArray = images.hits.map(image =>{
            const imageMarkDown = makeMarkdown(image);
            markdown +=imageMarkDown;


        })
        // console.log(data.hits[0].webformatURL, data.tags, data.likes);

        console.log(markdown);
        refs.gallery.insertAdjacentHTML('afterbegin', markdown);

    })
    .catch(error => console.log(error));
}



function makeMarkdown (item){
    console.log('creating markup', item);
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