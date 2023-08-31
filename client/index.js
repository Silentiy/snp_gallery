import { sendRequestToApi, baseUrl } from "./common.js";
import { createCardVoteButtons } from "./vote.js";

const divPictures = document.getElementById("pictures");
createPageContent();

async function createPageContent() {
  console.log("createPageContent");
  const url = `${baseUrl}photos/`;

  const jsonData = await sendRequestToApi(url);

  if (!("error" in jsonData)) {
    if (jsonData.result.length > 0) {
      const results = jsonData.result;
      results.forEach((imageObj) => {
        createCard(imageObj);
      });
    } else {
      const noPicturesText = document.createTextNode(`Surprisingly, there seems to be no photos yet!
      Please, refresh the page a bit later or be the first to post an image!`);
      divPictures.appendChild(noPicturesText);
    }
  } else {
    const getPicturesErrorText = document.createTextNode(`Regrettably, an error occured
     while downloading photos. Please, refresh the page`);
    divPictures.appendChild(getPicturesErrorText);
    console.error("Error in createPageContent", jsonData);
  }
}

function detailedPageLink(imageObj) {
  return `comments.html?id=${imageObj.id}`;
}

function createCard(imageObj) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card", "card-main", "shadow-sm", "ms-2", "me-2", "mb-4");
  cardDiv.setAttribute("id", imageObj.id);
  // fictious div for the left margin of the picture
  const fiction = document.createElement("div");
  fiction.classList.add("fiction", "ps-3");
  // card top part div
  const cardTopPart = document.createElement("div");
  cardTopPart.classList.add("d-flex");
  cardTopPart.appendChild(fiction);
  cardTopPart.appendChild(createCardPicture(imageObj));
  cardTopPart.appendChild(createCardVoteButtons(imageObj));
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
  titleTag.classList.add("card-title", "text-center", "d-block", "text-truncate", "px-3", "py-1", "mx-auto");
  const titleText = document.createTextNode(imageObj.name);

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
  image.src = imageObj.photo_200_100_url;
  image.alt = imageObj.description;
  image.setAttribute("id", imageObj.id);
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
  const addedDate = imageObj.created_at.split("T")[0];
  const authorDate = document.createTextNode(`Author: ${imageObj.user.username}, added: ${addedDate}`);
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
