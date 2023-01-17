const divPictures = document.getElementById("pictures");

makeRequestToUnsplash();

async function requestAccessKey() {
  try {
    const response = await fetch("http://localhost:9000");
    const jsonData = await response.json();
    return await jsonData.access_key;
  } catch (error) {
    console.error("The attempt to get API key is rejected!", error);
    return error;
  }
}

async function makeRequestToUnsplash() {
  const ACCESS_KEY = await requestAccessKey();
  const requestUrl = `https://api.unsplash.com/search/photos?page=1&query=buildings&client_id=${ACCESS_KEY}`;
  try {
    const response = await fetch(requestUrl);
    const jsonData = await response.json();
    jsonData.results.forEach((imageObj) => {
      createCard(imageObj);
    });
  } catch (error) {
    console.error("The request to Unsplash is rejected!", error);
  }
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
  image.src = imageObj.urls.regular;
  image.alt = imageObj.alt_description;
  // overlay child (picture description)
  const overlayChild = document.createElement("div");
  overlayChild.classList.add("overlay-text", "overflow-hidden", "text-center", "ps-3", "pe-3");
  const overlayText = document.createTextNode("Short informative description. Possibly, short informative description that takes a lot of space.");
  overlayChild.appendChild(overlayText);

  pictureLink.appendChild(overlayBackgroud);
  pictureLink.appendChild(image);
  pictureLink.appendChild(overlayChild);

  overlayParent.appendChild(pictureLink);

  return overlayParent;
}

function createCardVoteButtons(imageObj) {
  const votesButtonsDiv = document.createElement("div");
  votesButtonsDiv.classList.add("my-auto", "mx-3", "buttons-votes", "text-center");

  const plusSign = document.createTextNode("+");
  const minusSign = document.createTextNode("-");
  const votesNumber = document.createTextNode(imageObj.likes);

  for (let i = 0; i < 2; i += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-sm", "btn-outline-secondary", "vote-btn");
    if (i === 0) {
      button.appendChild(plusSign);
    } else {
      button.appendChild(minusSign);
    }
    votesButtonsDiv.appendChild(button);
  }

  const votesDiv = document.createElement("div");
  votesDiv.classList.add("votes", "d-block", "pt-2", "pb-2", "text-center");
  votesDiv.appendChild(votesNumber);
  const secondButton = votesButtonsDiv.lastChild;
  votesButtonsDiv.insertBefore(votesDiv, secondButton);

  return votesButtonsDiv;
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
