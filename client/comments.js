import { sendRequestToApi, baseUrl } from "./common.js";
import { createCardVoteButtons } from "./vote.js";

const divContent = document.getElementById("content");
// const divLeaveComment = document.getElementById("leave-a-comment");
// const divComments = document.getElementById("comments");

createPageContent();

async function createPageContent() {
  restoreIdFromStateParameter();

  const picId = new URLSearchParams(window.location.search).get("id");
  const url = `${baseUrl}photos/${picId}`;
  const jsonData = await sendRequestToApi(url);
  console.log(jsonData);
  divContent.prepend(createPictureCard(jsonData));
  // divContent.appendChild(createLeaveCommentCard(apiResponse));
  // divContent.appendChild(createCommentsCards(apiResponse));
}

function restoreIdFromStateParameter() {
  const searchParams = new URLSearchParams(document.location.search);
  const id = searchParams.get("id");

  if (id) {
    return;
  }

  let state;
  state = searchParams.get("state");
  if (!state) {
    state = window.localStorage.getItem("STATE");
  }

  if (state) {
    const stateParameters = JSON.parse(atob(decodeURIComponent(state)));
    if (stateParameters.id) {
      const url = new URL(document.location.href);
      url.searchParams.append("id", stateParameters.id);
      window.history.pushState(null, "", url.toString());
      // theoretically, we may end up in a situation where clearUrl()
      // from login.js will have cleaned URL prior the ending of this function,
      // but probability of such case seems to be neglectably low
    }
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
  const pictureCardTitle = document.createTextNode(imageObj.name);
  pictureCardTitleContainer.appendChild(pictureCardTitle);

  // picture and buttons
  const divPictureAndButtons = document.createElement("div");
  divPictureAndButtons.classList.add("d-flex", "text-center", "mx-auto");
  // picture
  const imageDiv = document.createElement("div");
  imageDiv.classList.add("img-detailed");
  const image = document.createElement("img");
  image.src = imageObj.photo_url;
  image.alt = imageObj.alt_description;
  image.classList.add("card-img-top", "img-fluid", "ps-3");
  imageDiv.appendChild(image);
  // buttons
  const buttons = createCardVoteButtons(imageObj);
  // construct picture and buttons div
  divPictureAndButtons.appendChild(imageDiv);
  divPictureAndButtons.appendChild(buttons);
  // card body
  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body", "pt-1", "pb-2");
  // author and date
  const authorDateContainer = document.createElement("small");
  authorDateContainer.classList.add("card-text", "text-muted", "ps-2");
  const authorDateContent = document.createTextNode(`${imageObj.user.username} added ${imageObj.created_at.split("T")[0]}`);
  authorDateContainer.appendChild(authorDateContent);
  // description title
  const descriptionTitleContainer = document.createElement("h6");
  descriptionTitleContainer.classList.add("mt-3", "mb-0", "ps-2");
  const descriptionTitleContent = document.createTextNode("Description:");
  descriptionTitleContainer.appendChild(descriptionTitleContent);
  // description content
  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("bg-light", "ps-2", "pe-2", "mb-2");
  const descriptionContent = document.createTextNode(imageObj.description);
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
