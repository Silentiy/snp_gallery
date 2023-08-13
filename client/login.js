import { sendRequestToApi, baseUrl, logInErrorMessage } from "./common.js";
import { createloggedInHeader } from "./header.js";

export default async function initializeLogIn() {
  console.log("initializeLogIn has started");

  setLoginButtons();

  const apiToken = window.localStorage.getItem("API_TOKEN");
  const provider = window.localStorage.getItem("PROVIDER");

  if (apiToken) {
    createloggedInHeader(apiToken);
  }

  if (provider) {
    socialLogin();
    window.localStorage.removeItem("PROVIDER");
  }
}

function setLoginButtons() {
  const currentBaseUrl = window.location.href.split("?")[0];

  const vkLoginButton = document.getElementById("vk-btn");
  const googleLoginButton = document.getElementById("google-btn");

  const vkRequestCodeUrl = "https://oauth.vk.com/authorize?client_id=51536587&display=page&"
      + `redirect_uri=${currentBaseUrl}&scope=4194304&response_type=code&v=5.131`;

  const googleRequestCodeUrl = "https://accounts.google.com/o/oauth2/auth?response_type=code&"
      + "scope=https://www.googleapis.com/auth/userinfo.profile+"
      + "https://www.googleapis.com/auth/userinfo.email&"
      + "client_id=227202273006-afmkvi18g9tg4d0eksbhgrdo537bnu7l.apps.googleusercontent.com&"
      + `redirect_uri=${currentBaseUrl}`;

  vkLoginButton.addEventListener("click", () => {
    window.location.replace(vkRequestCodeUrl);
    window.localStorage.setItem("PROVIDER", "VK");
  });

  googleLoginButton.addEventListener("click", () => {
    window.location.replace(googleRequestCodeUrl);
    window.localStorage.setItem("PROVIDER", "Google");
  });
}

async function socialLogin() {
  console.log("socialLogin has started");
  const codeJson = retieveCode();
  clearUrl();
  if (!("error" in codeJson)) {
    const tokenJson = await sendCode(codeJson);
    if (!("error" in tokenJson)) {
      const apiToken = tokenJson.key;
      if (apiToken) {
        window.localStorage.setItem("API_TOKEN", apiToken);
        createloggedInHeader(apiToken);
      } else {
        console.log("Error in socialLogin: there was no value witn API_TOKEN in json-response", apiToken);
        alert(logInErrorMessage);
      }
    } else {
      console.log("Error in socialLogin", tokenJson);
      alert(logInErrorMessage);
    }
  } else {
    console.log("Error in socialLogin", codeJson);
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

function clearUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  window.history.pushState(null, "", url.toString());
  // window.history.replaceState(null, null, baseWindowUrl);
}

async function sendCode(code) {
  console.log("sendCode has started");

  if (!(code)) {
    return { error: "Code was not provided!" };
  }

  const provider = window.localStorage.getItem("PROVIDER");
  const codeUrl = determineCodeUrl(provider);

  if ("error" in codeUrl) {
    return codeUrl;
  }

  const dataToSend = code;
  const callbackUrl = window.location.href.split("?")[0];
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
  const logOutButton = document.getElementById("logout-btn");
  if (apiToken && logOutButton) {
    return true;
  }
  return false;
}
