const divContent = document.getElementById("content");
// const divLeaveComment = document.getElementById("leave-a-comment");
// const divComments = document.getElementById("comments");

createPageContent();

async function createPageContent() {
  const apiResponse = await makeRequestToUnsplash();
  divContent.prepend(createPictureCard(apiResponse));
  // divContent.appendChild(createLeaveCommentCard(apiResponse));
  // divContent.appendChild(createCommentsCards(apiResponse));
}

async function makeRequestToUnsplash() {
  const ACCESS_KEY = await requestAccessKey();
  const url = window.location.href;
  const photoId = String(url).split("=")[1];
  const requestUrl = `https://api.unsplash.com/photos/${photoId}?client_id=${ACCESS_KEY}`;
  try {
    const response = await fetch(requestUrl);
    const jsonData = await response.json();
    return await jsonData;
  } catch (error) {
    console.error("The request to Unsplash is rejected!", error);
    return error;
  }
}

async function requestAccessKey() {
  try {
    const response = await fetch("http://localhost:8080");
    const jsonData = await response.json();
    return await jsonData.access_key;
  } catch (error) {
    console.error("The attempt to get API key is rejected!", error);
    return error;
  }
}

function createPictureCard(imageObj) {
  const divPicture = document.createElement("div");
  divPicture.id = "picture";
  divPicture.classList.add("col-12", "mb-3");

  // card
  const divPictureCard = document.createElement("div");
  divPictureCard.classList.add("card", "shadow-sm", "mb-3");

  // title
  const pictureCardTitleContainer = document.createElement("h5");
  pictureCardTitleContainer.classList.add("card-title", "text-center", "mt-2", "mx-auto");
  const pictureCardTitle = document.createTextNode(imageObj.description);
  pictureCardTitleContainer.appendChild(pictureCardTitle);

  // picture and buttons
  const divPictureAndButtons = document.createElement("div");
  divPictureAndButtons.classList.add("d-flex");
  // picture
  const imageDiv = document.createElement("div");
  imageDiv.classList.add("img-detailed");
  const image = document.createElement("img");
  image.src = imageObj.urls.regular;
  image.alt = imageObj.alt_description;
  image.classList.add("card-img-top", "img-fluid", "px-3");
  imageDiv.appendChild(image);
  // buttons
  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("m-auto", "me-3", "buttons-votes", "text-center");
  // plus button
  const plusButton = document.createElement("button");
  plusButton.type = "button";
  plusButton.classList.add("btn", "btn-sm", "btn-outline-secondary", "vote-btn");
  const plusSign = document.createTextNode("+");
  plusButton.appendChild(plusSign);
  // likes
  const votesDiv = document.createElement("div");
  votesDiv.classList.add("votes", "d-block", "pt-2", "pb-2", "text-center");
  const votesNumber = document.createTextNode(imageObj.likes);
  votesDiv.appendChild(votesNumber);
  // minus button
  const minusButton = document.createElement("button");
  minusButton.type = "button";
  minusButton.classList.add("btn", "btn-sm", "btn-outline-secondary", "vote-btn");
  const minusSign = document.createTextNode("-");
  minusButton.appendChild(minusSign);
  // construct buttons div
  buttonsDiv.appendChild(plusButton);
  buttonsDiv.appendChild(votesDiv);
  buttonsDiv.appendChild(minusButton);
  // construct picture and buttons div
  divPictureAndButtons.appendChild(imageDiv);
  divPictureAndButtons.appendChild(buttonsDiv);
  // card body
  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body", "pt-1", "pb-2");
  // author and date
  const authorDateContainer = document.createElement("small");
  authorDateContainer.classList.add("card-text", "text-muted");
  const authorDateContent = document.createTextNode(`${imageObj.user.username}, added ${imageObj.created_at.split("T")[0]}`);
  authorDateContainer.appendChild(authorDateContent);
  // description title
  const descriptionTitleContainer = document.createElement("h6");
  descriptionTitleContainer.classList.add("mt-3", "mb-0", "ps-2");
  const descriptionTitleContent = document.createTextNode("Description:");
  descriptionTitleContainer.appendChild(descriptionTitleContent);
  // description content
  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("bg-light", "ps-2", "pe-2", "mb-2");
  const descriptionContent = document.createTextNode("Photo has been made... Somehow long description of the photo which says about place,"
    + " time and circumstances of picture taking, as well as author's thoughts and opinion and"
    + " possibly some technical details used in production of this picture");
  descriptionContainer.appendChild(descriptionContent);
  // construct card body
  cardBodyDiv.appendChild(authorDateContainer);
  cardBodyDiv.appendChild(descriptionTitleContainer);
  cardBodyDiv.appendChild(descriptionContainer);

  // construct card div
  divPictureCard.appendChild(pictureCardTitleContainer);
  divPictureCard.appendChild(divPictureAndButtons);
  divPictureCard.appendChild(cardBodyDiv);

  // add card into outer div
  divPicture.appendChild(divPictureCard);

  return divPicture;
}
