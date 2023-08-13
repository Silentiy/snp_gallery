import {
  getUserPictureSrc, requestUserData, logInErrorMessage, getUserName,
} from "./common.js";

export async function createloggedInHeader(apiToken) {
  const userData = await requestUserData(apiToken);

  if (!("error" in userData)) {
    putUserDataIntoHeader(userData);
    toggleHeader();
  } else {
    window.localStorage.removeItem("API_TOKEN");
    console.log(userData);
    alert(logInErrorMessage);
  }
}

function putUserDataIntoHeader(data) {
  const userAvatar = document.getElementById("user-avatar");
  userAvatar.src = getUserPictureSrc(data).userPicture50Src;

  const userNameDiv = document.getElementById("username");
  const userName = document.createTextNode(getUserName(data));
  userNameDiv.appendChild(userName);
}

export function toggleHeader() {
  const loggedOutDiv = document.getElementById("logged-out-div");
  const loggedInDiv = document.getElementById("logged-in-div");
  loggedOutDiv.classList.toggle("header-hidden");
  loggedInDiv.classList.toggle("header-hidden");
}
