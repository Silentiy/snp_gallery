export const baseUrl = (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") ? "http://localhost:8000/api/" : "http://silentiy.beget.tech/api/";

export async function makeRequestToApi(requestUrl) {
  try {
    const response = await fetch(requestUrl);
    const jsonData = await response.json();
    return await jsonData;
  } catch (error) {
    console.error(`The request to ${requestUrl} is rejected!`, error);
    return error;
  }
}

export async function requestAccessKey() {
  try {
    const response = await fetch("http://localhost:8090");
    const jsonData = await response.json();
    return await jsonData.access_key;
  } catch (error) {
    console.error("The attempt to get API key is rejected!", error);
    return error;
  }
}

export function createCardVotesAndButtons(imageObj) {
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
