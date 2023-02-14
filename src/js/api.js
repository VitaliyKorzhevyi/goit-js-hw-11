import axios from 'axios';

const API_KEY = '33612002-bde9b458206774a71788d5215';
const URL = `https://pixabay.com/api/?key=`

function requestImage(searchRequest, page){

return axios.get(`${URL}${API_KEY}&q=${searchRequest}&${searchParams}&page=${page}`)}
const searchParams = new URLSearchParams({
    image_type: "photo",
    orientation:"horizontal",
    safesearch:true,
    per_page:40
  });

export {requestImage};

