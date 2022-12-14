import axios from 'axios';
export { fetchImages };

axios.defaults.baseURL = `https://pixabay.com/api/`;
const KEY = '31618598-dd0b87f36bc5180b6dfd99237';

async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&horizontal=true&page=${page}&per_page=${perPage}`
  );

  return response;
}
