import
{
  sendRequestToApi, requestUserData, baseUrl, logInErrorMessage, clearUrl,
}
  from "./common.js";
import { createloggedInHeader } from "./header.js";

export default async function initializeLogIn() {
  console.log("initializeLogIn has started");

  setLoginButtons();

  const apiToken = window.localStorage.getItem("API_TOKEN");
  const provider = window.localStorage.getItem("PROVIDER");
  const state = new URLSearchParams(document.location.search).get("state");

  if (state) {
    window.localStorage.setItem("STATE", state);
  }

  if (apiToken) {
    const userData = await requestUserData(apiToken);
    createloggedInHeader(userData);
  }

  if (provider && state) { // we have tried to Log In in this tab
    socialLogin(); // let's continue what was started
    window.localStorage.removeItem("PROVIDER");
  }
}

function setLoginButtons() {
  const currentBaseUrl = window.location.href.split("?")[0];

  const state = prepareStateParameter();

  const vkLoginButton = document.getElementById("vk-btn");
  const googleLoginButton = document.getElementById("google-btn");

  const vkRequestCodeUrl = "https://oauth.vk.com/authorize?"
  + "client_id=51536587&"
  + `redirect_uri=${currentBaseUrl}&`
  + "display=page&"
  + "scope=4194304&"
  + "response_type=code&"
  + `state=${encodeURIComponent(state)}&`
  + "v=5.207";

  const googleRequestCodeUrl = "https://accounts.google.com/o/oauth2/auth?"
  + "response_type=code&"
  + `state=${state}&`
  + "scope=https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/userinfo.email&"
  + "client_id=227202273006-afmkvi18g9tg4d0eksbhgrdo537bnu7l.apps.googleusercontent.com&"
  + `redirect_uri=${currentBaseUrl}`;

  vkLoginButton.addEventListener("click", () => {
    window.localStorage.setItem("PROVIDER", "VK");
    window.location.replace(encodeURI(vkRequestCodeUrl));
  });

  googleLoginButton.addEventListener("click", () => {
    window.localStorage.setItem("PROVIDER", "Google");
    window.location.replace(googleRequestCodeUrl);
  });
}

function prepareStateParameter() {
  const stateParameters = { log_in: "yes" };
  const id = new URL(window.location.href).searchParams.get("id");
  if (id) {
    stateParameters.id = id;
  }
  return btoa(JSON.stringify(stateParameters));
}

async function socialLogin() {
  console.log("socialLogin has started");
  const state = new URLSearchParams(document.location.search).get("state");
  const codeJson = retieveCode();

  clearUrl(["id"]);

  if ("error" in codeJson && state !== null) { // we have tried to Log In
    console.log("Error in socialLogin", codeJson);
    alert(logInErrorMessage); // 'no code' situation is a problem
  }

  const tokenJson = await sendCode(codeJson);
  console.log("tokenJson", tokenJson);
  if (!("error" in tokenJson)) {
    const apiToken = tokenJson.key;
    if (apiToken) {
      window.localStorage.setItem("API_TOKEN", apiToken);
      const userData = await requestUserData(apiToken);
      createloggedInHeader(userData);
    } else {
      console.log("Error in socialLogin: there was no value witn API_TOKEN in json-response", apiToken);
      alert(logInErrorMessage);
    }
  } else {
    console.log("Error in socialLogin", tokenJson);
    alert(logInErrorMessage);
  }
}

function retieveCode() {
  const searchParams = new URLSearchParams(document.location.search);
  let code = searchParams.get("code");
  if (code) {
    code = decodeURIComponent(code);
    return { code };
  }
  return { error: "No code was found to extract from URL" };
}

async function sendCode(code) {
  console.log("sendCode has started");

  if (!(code || "error" in code)) {
    return { error: "Code was not provided or is invalid!" };
  }

  const provider = window.localStorage.getItem("PROVIDER");
  const codeUrl = determineCodeUrl(provider);

  if ("error" in codeUrl) {
    return codeUrl;
  }

  const dataToSend = code;
  const currentBaseUrl = window.location.href.split("?")[0];
  const callbackUrl = currentBaseUrl;
  dataToSend.network = provider;
  dataToSend.callback_url = callbackUrl;

  console.log(JSON.stringify(dataToSend));

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(dataToSend),
    redirect: "follow",
  };

  console.log(codeUrl.url);

  return sendRequestToApi(codeUrl.url, requestOptions);
}

function determineCodeUrl(provider) {
  if (!(provider)) {
    return { error: "Social authentication provider was not set" };
  }
  let codeUrl;
  if (provider === "VK") {
    codeUrl = { url: `${baseUrl}dj-rest-auth/vk/` };
  } else if (provider === "Google") {
    codeUrl = { url: `${baseUrl}dj-rest-auth/google/` };
  } else {
    codeUrl = { error: "Unknown social authentication provider" };
  }
  return codeUrl;
}

export function isLogged() {
  const apiToken = window.localStorage.getItem("API_TOKEN");
  const userNameDiv = document.getElementById("username");
  if (apiToken && userNameDiv.hasChildNodes()) {
    return true;
  }
  return false;
}
