import { makeRequestToApi, createCardVotesAndButtons } from "./common.js";

const divPictures = document.getElementById("pictures");

createPageContent();

async function createPageContent() {
  const url = "http://127.0.0.1:8000/photos/";

  const jsonData = await makeRequestToApi(url);
  console.log(jsonData);

  jsonData.forEach((imageObj) => {
    createCard(imageObj);
  });
}

function detailedPageLink(imageObj) {
  return `comments.html?id=${imageObj.id}`;
}

function createCard(imageObj) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card", "card-main", "shadow-sm", "ms-2", "me-2", "mb-4");
  // fictious div for the left margin of the picture
  const fiction = document.createElement("div");
  fiction.classList.add("fiction", "ps-3");
  // card top part div
  const cardTopPart = document.createElement("div");
  cardTopPart.classList.add("d-flex");
  cardTopPart.appendChild(fiction);
  cardTopPart.appendChild(createCardPicture(imageObj));
  cardTopPart.appendChild(createCardVotesAndButtons(imageObj));
  // card bottom part div
  const cardBottomPart = createCardBottomPart(imageObj);
  // append content into cardDiv
  cardDiv.appendChild(createCardTitile(imageObj));
  cardDiv.appendChild(cardTopPart);
  cardDiv.appendChild(cardBottomPart);

  divPictures.append(cardDiv);
}

function createCardTitile(imageObj) {
  const titleLink = document.createElement("a");
  titleLink.classList.add("link-dark", "pt-2");
  titleLink.href = detailedPageLink(imageObj);
  const titleTag = document.createElement("h5");
  titleTag.classList.add("card-title", "text-center", "d-block", "text-truncate", "px-3", "mx-auto");
  const titleText = document.createTextNode(imageObj.description);

  titleTag.appendChild(titleText);
  titleLink.appendChild(titleTag);

  return titleLink;
}

function createCardPicture(imageObj) {
  // overlay parent (contains pictureLink)
  const overlayParent = document.createElement("div");
  overlayParent.classList.add("overlay-parent", "mx-auto");
  // picture link (contains nodes below)
  const pictureLink = document.createElement("a");
  pictureLink.classList.add("link-dark");
  pictureLink.href = detailedPageLink(imageObj);
  // overlay background
  const overlayBackgroud = document.createElement("div");
  overlayBackgroud.classList.add("overlay-background");
  // picture
  const image = document.createElement("img");
  image.classList.add("card-img-top", "img-main");
  image.src = imageObj.file;
  image.alt = imageObj.description;
  // overlay child (picture description)
  const overlayChild = document.createElement("div");
  overlayChild.classList.add("overlay-text", "overflow-hidden", "text-center", "ps-3", "pe-3");
  const overlayText = document.createTextNode(imageObj.description);
  overlayChild.appendChild(overlayText);

  pictureLink.appendChild(overlayBackgroud);
  pictureLink.appendChild(image);
  pictureLink.appendChild(overlayChild);

  overlayParent.appendChild(pictureLink);

  return overlayParent;
}

function createCardBottomPart(imageObj) {
  const bottomDiv = document.createElement("div");
  bottomDiv.classList.add("card-body", "pt-1", "pb-2");
  // author and date content
  const authorDateContainer = document.createElement("small");
  authorDateContainer.classList.add("card-text", "text-muted");
  const addedDate = imageObj.upload_date.split("T")[0];
  const authorDate = document.createTextNode(`Author: ${imageObj.user}, added: ${addedDate}`);
  authorDateContainer.appendChild(authorDate);
  // comments
  const commentsDiv = document.createElement("div");
  commentsDiv.classList.add("d-flex", "justify-content-between", "align-items-center");
  const commentsLink = document.createElement("a");
  commentsLink.classList.add("text-muted");
  commentsLink.href = detailedPageLink(imageObj);
  const commentsText = document.createTextNode("0 comments");
  const commentsContainer = document.createElement("small");
  commentsContainer.appendChild(commentsText);
  commentsLink.appendChild(commentsContainer);
  commentsDiv.appendChild(commentsLink);

  bottomDiv.appendChild(authorDateContainer);
  bottomDiv.appendChild(commentsDiv);

  return bottomDiv;
}

export default function addPaginationButtonsToFooter() {
  const paginationSection = document.getElementById("pagination");
  paginationSection.className = "";
  paginationSection.classList.add("text-center", "py-1", "bg-white");

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.classList.add("btn", "btn-outline-secondary", "btn-sm", "my-2");
  const backButtonText = document.createTextNode("\u2190 back");
  backButton.appendChild(backButtonText);

  const forwardButton = document.createElement("button");
  forwardButton.type = "button";
  forwardButton.classList.add("btn", "btn-outline-secondary", "btn-sm", "my-2");
  const forwardButtonText = document.createTextNode("forward \u2192 ");
  forwardButton.appendChild(forwardButtonText);

  paginationSection.appendChild(backButton);
  paginationSection.appendChild(forwardButton);
}
