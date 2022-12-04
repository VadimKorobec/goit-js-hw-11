import './css/styles.css';
import { fetchImages } from './js/fetch-images';
import { renderGallery } from './js/render-gallery';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard'),
};

let query = '';
let page = 1;
const perPage = 40;
let simpleLightBox;

const options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(onLoad, options);
refs.searchForm.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();
  page = 1;
  refs.gallery.innerHTML = '';
  query = event.currentTarget.searchQuery.value.trim();

  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        observer.observe(refs.guard);
      }
    })
    .catch(err => console.log(err));
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchImages(query, page, perPage)
        .then(({ data }) => {
          renderGallery(data.hits);
          simpleLightBox = new SimpleLightbox('.gallery a').refresh();
          if (data.page === data.totalHits) {
            observer.unobserve(refs.guard);
          }
        })
        .catch(err => {
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(refs.guard);
        });
    }
  });
  console.log(entries);
}
