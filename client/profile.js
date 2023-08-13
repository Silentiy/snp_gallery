import {
  requestUserData, getUserPictureSrc, sendRequestToApi, baseUrl, getUserName,
} from "./common.js";

const nickNameInput = document.getElementById("nick_name");
const userDescriptionInput = document.getElementById("about_me");

const sendNickNameButton = document.getElementById("send-nickname");
sendNickNameButton.addEventListener("click", sendNickName);

const apiToken = window.localStorage.getItem("API_TOKEN");

await populateProfilePage();

export default async function populateProfilePage() {
  if (!apiToken) {
    alert("You have to be Logged In to see the data on this page!");
  } else {
    const userData = await requestUserData(apiToken);

    if (!("error" in userData)) {
      const greetingDiv = document.getElementById("greeting");
      const userName = getUserName(userData);
      const userGreeting = document.createTextNode(`Welcome to your account, ${userName}`);
      greetingDiv.appendChild(userGreeting);

      const profilePicture = document.getElementById("profile-picture");
      profilePicture.src = getUserPictureSrc(userData).userPicture200Src;

      const firstNameInput = document.getElementById("first_name");
      firstNameInput.value = userData.first_name;
      const lastNameInput = document.getElementById("last_name");
      lastNameInput.value = userData.last_name;
      const emailInput = document.getElementById("email");
      emailInput.value = userData.email;
      const tokenInput = document.getElementById("api_token");
      tokenInput.value = apiToken;
      nickNameInput.value = userName;

      let method;
      if (userData.gallery_user.nickname) {
        method = "PATCH";
      } else {
        method = "PUT";
      }
    } else {
      alert("We are sorry, but your API_TOKEN has expired. Please, LogIn again");
    }
  }
}

async function sendNickName() {
  const galleryUserDataUrl = `${baseUrl}gallery-user/`;

  const formdata = new FormData();
  const headers = new Headers();

  // formdata.append(userId);
  const nickName = nickNameInput.value;
  formdata.append("nickname", nickName);
  // formdata.append("user_id", 3);
  console.log(formdata.get("nickname"));
  headers.append("Authorization", `Token ${apiToken}`);
  // headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "PUT",
    headers,
    body: formdata,
    redirect: "follow",
  };

  return sendRequestToApi(galleryUserDataUrl, requestOptions);
}
