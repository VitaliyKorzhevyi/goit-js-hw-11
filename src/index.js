import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { requestImage } from './js/api.js';
import { createMarkupImageCard } from './js/markupGallery.js';

const refs = {
    searchFormEl: document.getElementById('search-form'),
    galleryEl: document.querySelector(".gallery"),
    loadMoreBtnEl: document.querySelector('.load-more'),
}

let gallery = new SimpleLightbox('.gallery a');
let page = 1;

// функція для додавання елементів у вигляді готової розмітки у галерею
function appendMarkupImage(cards) {
    const markup = cards.map(createMarkupImageCard).join('');
    refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}

// асинхрона функція для очищення,відтворення галереї та помилок
refs.searchFormEl.addEventListener('submit',searchHandler);
async function searchHandler(event){
    event.preventDefault();
    page = 1;
    refs.galleryEl.innerHTML = '';
    const requestData = event.target.searchQuery.value.trim();

    if(!requestData){
        return;
    }

    try{
        const {data} = await requestImage(requestData,page);

        if(data.hits.length){
            refs.loadMoreBtnEl.classList.remove('hidden');
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }else{
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            refs.loadMoreBtnEl.classList.add('hidden');
        }

        appendMarkupImage(data.hits);
        gallery.refresh();
    
    }catch(err){
        Notiflix.Notify.failure(`Some ${err} broken all staff`)
    }
}

// додати ще картинки при скролі
async function loadMoreHandler(){
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    page++;
    const requestData = refs.searchFormEl.searchQuery.value;
    try{
        if (scrollTop + clientHeight >= scrollHeight - 5){
        const {data} = await requestImage(requestData,page);
 
        if(page===Math.floor(data.totalHits / 40)){
        refs.loadMoreBtnEl.classList.add('hidden');
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
        }
        appendMarkupImage(data.hits);
        gallery.refresh();}
    }catch(err){
        Notiflix.Notify.failure(`Some ${err} broken all staff`)
    }
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
});
}

// додаємо прослуховувач для прокручування подій
window.addEventListener('scroll',() => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMoreHandler()
    }
}, {
    passive: true
});