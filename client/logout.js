import { sendRequestToApi, baseUrl } from "./common.js";
import { toggleHeader } from "./header.js";

export default function initializeLogOut() {
  const logOutButton = document.getElementById("logout-btn");
  logOutButton.addEventListener("click", logOut);
}

async function logOut() {
  console.log("on logOut");
  const apiToken = window.localStorage.getItem("API_TOKEN");

  const logOutResponse = await sendDeleteTokenRequest(apiToken);
  if (!("error" in logOutResponse)) {
    window.localStorage.removeItem("API_TOKEN");
    toggleHeader();
  } else {
    console.log("Error on logOut", logOutResponse);
    alert("We are sorry, but something went wrong during logOut. Please, try again later!");
  }
}

async function sendDeleteTokenRequest(apiToken) {
  console.log("we are trying to logOut");
  if (apiToken) {
    const logOutUrl = `${baseUrl}dj-rest-auth/logout/`;

    const formdata = new FormData();
    const headers = new Headers();

    headers.append("Authorization", `Token ${apiToken}`);
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers,
      body: formdata,
      redirect: "follow",
    };
    return sendRequestToApi(logOutUrl, requestOptions);
  }
  return { error: "Perhaps, you are not logged in! Please, logIn prior logOut!" };
}
