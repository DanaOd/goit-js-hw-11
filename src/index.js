import Notiflix from 'notiflix';


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
let markdown = '';
let page = 1;
let per_page = 40;


refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearchSubmit(event) {
    event.preventDefault();
    if (query) {
        console.log('erase previous data');
        query = '';
        refs.gallery.innerHTML = '';
        return;
    }

    page = 1;
    query = refs.searchQuery.value;

    let URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

    fetch(URL)
        .then(responce => responce.json())
        .then(images => {
            if (images.hits.length === 0) {
                Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
                refs.form.reset();
                return;
            }

            //сколько страниц приходит
            let totalPages = images.totalHits / per_page;
            console.log('totalPages', images.totalHits, totalPages);

            //показывать ли load more
            if (totalPages > 1) {
                refs.loadMoreBtn.style.visibility = "visible";
            }


            const imagesArray = images.hits.map(image => {
                const imageMarkDown = makeMarkdown(image);
                markdown += imageMarkDown;
            })

            refs.gallery.insertAdjacentHTML('afterbegin', markdown);

        })
        .catch(error => console.log(error));
}


// function fetchItems (url){}

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
    console.log('click on load more');
    page += 1;

    fetch(URL).then(responce => responce.json()).then(images => {
        const imagesArray = images.hits.map(image => {
            const imageMarkDown = makeMarkdown(image);
            markdown += imageMarkDown;
       
        }).catch(error => console.log(error));
        refs.gallery.insertAdjacentHTML('afterbegin', markdown);


    }
)}