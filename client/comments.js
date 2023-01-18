import { makeRequestToUnsplash, requestAccessKey, createCardVotesAndButtons } from "./common.js";

const divContent = document.getElementById("content");
// const divLeaveComment = document.getElementById("leave-a-comment");
// const divComments = document.getElementById("comments");

createPageContent();

async function createPageContent() {
  const ACCESS_KEY = await requestAccessKey();
  const currentUrl = window.location.href;
  const photoId = String(currentUrl).split("=")[1];
  const url = `https://api.unsplash.com/photos/${photoId}?client_id=${ACCESS_KEY}`;

  const jsonData = await makeRequestToUnsplash(url);
  divContent.prepend(createPictureCard(jsonData));
  // divContent.appendChild(createLeaveCommentCard(apiResponse));
  // divContent.appendChild(createCommentsCards(apiResponse));
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
  image.classList.add("card-img-top", "img-fluid", "ps-3");
  imageDiv.appendChild(image);
  // buttons
  const buttons = createCardVotesAndButtons(imageObj);
  // construct picture and buttons div
  divPictureAndButtons.appendChild(imageDiv);
  divPictureAndButtons.appendChild(buttons);
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
