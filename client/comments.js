
const url = window.location.href;
const photo_id = String(url).split("?")[1];


const divPictures = document.getElementById("picture");
const requestUrlUnsplash = `https://api.unsplash.com/photos/${photo_id}?client_id=JicVlnf0ouBslobOUQ_fcYmb0U3F_T7VShvW6mRvOlM`
console.log(divPictures);

makeRequestToUnsplash(requestUrlUnsplash);

function makeRequestToUnsplash(requestUrl){
    fetch(requestUrl)
    .then(response => response.json())
    .then(json_data => createCard(json_data))
    .catch((error) => {
        console.error("The request to Unsplash is rejected!", error)});
}


function createCard(imageObj) {
    const image = document.createElement("img"); 
    image.src = imageObj.urls.regular;

    divPictures.appendChild(image);
}

