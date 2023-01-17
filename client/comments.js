const url = window.location.href;
const photoId = String(url).split('?')[1];

const divPictures = document.getElementById('picture');
const requestUrlUnsplash = `https://api.unsplash.com/photos/${photoId}?client_id=`;

function createCard(imageObj) {
  const image = document.createElement('img');
  image.src = imageObj.urls.regular;
  divPictures.appendChild(image);
}

function makeRequestToUnsplash(requestUrl) {
  fetch(requestUrl)
    .then((response) => response.json())
    .then((jsonData) => createCard(jsonData))
    .catch((error) => {
      console.error('The request to Unsplash is rejected!', error);
    });
}

makeRequestToUnsplash(requestUrlUnsplash);
