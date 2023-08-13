import { isLogged } from "./login.js";

export function sendVote(evnt) {
  if (isLogged() === true) {
    const picId = evnt.currentTarget.closest(".card").getAttribute("id");
    const vote = evnt.currentTarget.getAttribute("vote");
    alert(`Click! ${picId}; ${vote}`);
  } else {
    alert("You have to be Loged In to participate in a vote");
  }
}

export function createCardVoteButtons(imageObj) {
  const votesButtonsDiv = document.createElement("div");
  votesButtonsDiv.classList.add("my-auto", "mx-3", "buttons-votes", "text-center");

  const plusSign = document.createTextNode("+");
  const minusSign = document.createTextNode("-");
  const votesNumber = document.createTextNode(imageObj.likes);

  for (let i = 0; i < 2; i += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-sm", "btn-outline-secondary", "vote-btn");
    button.addEventListener("click", sendVote);
    if (i === 0) {
      button.appendChild(plusSign);
      button.setAttribute("vote", 1);
    } else {
      button.appendChild(minusSign);
      button.setAttribute("vote", -1);
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
