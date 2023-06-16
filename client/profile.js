import { getUserName, getUserPictureSrc, readLocalStorage } from "./header.js";
import { baseUrl } from "./common.js";

const nickNameInput = document.getElementById("nick_name");
const userDescriptionInput = document.getElementById("about_me");
const token = readLocalStorage("API_TOKEN");

const sendNickNameButton = document.getElementById("send-nickname");
sendNickNameButton.addEventListener("click", sendNickName);

export default async function createProfilePage(user) {
  const greetingDiv = document.getElementById("greeting");
  const userName = getUserName(user);
  const userGreeting = document.createTextNode(`Welcome to your account, ${userName}`);
  greetingDiv.appendChild(userGreeting);

  const profilePicture = document.getElementById("profile-picture");
  profilePicture.src = getUserPictureSrc(user);

  const firstNameInput = document.getElementById("first_name");
  firstNameInput.value = user.first_name;
  const lastNameInput = document.getElementById("last_name");
  lastNameInput.value = user.last_name;
  const emailInput = document.getElementById("email");
  emailInput.value = user.email;
  const tokenInput = document.getElementById("api_token");
  tokenInput.value = token;

  let method;
  if (user.gallery_user.nickname) {
    method = "PATCH";
  } else {
    method = "POST";
  }
}

async function sendNickName() {
  console.log("send nickName started");

  const galleryUserDataUrl = `${baseUrl}gallery-user/`;

  const formdata = new FormData();
  const headers = new Headers();

  // formdata.append(userId);
  const nickName = nickNameInput.value;
  formdata.append("nickname", nickName);
  // formdata.append("user_id", 3);

  const authorization = `Token ${token}`;
  headers.append("Authorization", authorization);
  // headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "PUT",
    headers,
    body: formdata,
    redirect: "follow",
  };

  try {
    const response = await fetch(galleryUserDataUrl, requestOptions);
    const jsonData = await response.json();
    console.log(jsonData);
    return await jsonData;
  } catch (error) {
    console.error(`The request to gallery-user/ is rejected!, ${error}`);
    return error;
  }
}
