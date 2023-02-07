export function initializeVKLogin() {
  const vkLoginButton = document.getElementById("vk-btn");

  const vkRequestCodeUrl = "https://oauth.vk.com/authorize?client_id=51536587&display=page&"
  + "redirect_uri=http://localhost:8080/client/index.html&scope=4194304&response_type=code&v=5.131";

  vkLoginButton.addEventListener("click", () => {
    window.location.replace(vkRequestCodeUrl);
  });
}

export async function isLogged() {
  console.log("is logged started");
  const accessKey = readApiToken();
  if (accessKey) {
    const userData = await requestUserData(accessKey);
    console.log("user data in is_logged", userData);
    createloggedInHeader(userData);
  } else {
    vkLogin();
  }
}

async function requestUserData(apiToken) {
  const userUrl = "http://127.0.0.1:8000/user/";
  try {
    const response = await fetch(userUrl, {
      method: "GET",
      headers: {
        Authorization: `Token ${apiToken}`,
      },
    });
    const responseCode = response.status;
    const responseJson = await response.json();
    console.log(responseCode, responseJson);
    return await responseJson;
  } catch (error) {
    console.error(`The request to ${userUrl} is rejected!`, error);
  }
  return null;
}

export async function vkLogin() {
  console.log("vk login started");
  const codeJson = retieveCode();
  if (codeJson) {
    const userData = await sendCode(codeJson);
    if (userData) {
      const userToken = userData.user_token;
      if (userToken) {
        setApiToken(userToken);
        clearUrl();
        createloggedInHeader(userData);
      }
    }
  }
}

export function retieveCode() {
  console.log("code retrieval started");
  const currentUrl = window.location.href;
  const subString = "?code=";
  if (currentUrl.includes(subString)) {
    const code = currentUrl.split("=")[1];
    console.log(code);
    if (code) {
      const data = { code };
      return data;
    }
  }
  return null;
}

function clearUrl() {
  const currentUrl = window.location.href;
  const baseUrl = currentUrl.split("?")[0];
  window.history.pushState("object", document.title, baseUrl);
  // window.history.replaceState(null, null, window.location.baseUrl);
  // window.location = currentUrl.replace(`?code=${code}`, "");
}

export async function sendCode(data) {
  console.log("function sendCode started");
  console.log(data);
  if (data) {
    console.log("we are trying to send code");
    const dataToSend = data;
    dataToSend.network = "VK";
    console.log(JSON.stringify(dataToSend));
    const codeUrl = "http://127.0.0.1:8000/vk-login/";
    try {
      const response = await fetch(codeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const responseCode = response.status;
      const responseJson = await response.json();
      console.log(responseCode, responseJson);
      return await responseJson;
    } catch (error) {
      console.error(`The request to ${codeUrl} is rejected!`, error);
    }
  }
  return null;
}

export function createloggedInHeader(userData) {
  if (userData) {
    // do we get user_data or error and it's description
    const userName = userData.user.username;
    console.log(userName);
    if (userName) {
      putUserContent(userData);
      toggleHeader();
    } else {
      alert("An error occured during logging: bad user data", userData);
    }
  } else {
    alert("An error occured during logging: no user data", userData);
  }
}

function putUserContent(data) {
  const userAvatar = document.getElementById("user-avatar");
  const userName = document.getElementById("username");
  userAvatar.src = data.social_avatar_url;
  const fullName = document.createTextNode(`${data.user.first_name} ${data.user.last_name}`);
  userName.appendChild(fullName);
}

export function toggleHeader() {
  const loggedOutDiv = document.getElementById("logged-out-div");
  const loggedInDiv = document.getElementById("logged-in-div");
  loggedOutDiv.classList.toggle("header-hidden");
  loggedInDiv.classList.toggle("header-hidden");
}

export function setApiToken(token) {
  window.localStorage.setItem("API_TOKEN", token);
}

export function readApiToken() {
  try {
    return window.localStorage.getItem("API_TOKEN");
  } catch (error) {
    return null;
  }
}

export function deleteApiToken() {
  window.localStorage.removeItem("API_TOKEN");
}

export function initializeLogOut() {
  const vkLogOutButton = document.getElementById("logout-btn");
  vkLogOutButton.addEventListener("click", logOut);
}

export async function logOut() {
  const apiToken = readApiToken();
  const data = { apiToken };
  deleteApiToken();
  toggleHeader();
  if (apiToken) {
    console.log("we are trying to logOut");
    console.log(JSON.stringify(data));
    const logOutUrl = "http://127.0.0.1:8000/vk-logout/";
    try {
      const response = await fetch(logOutUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiToken}`,
        },
      });
      const responseCode = response.status;
      const responseJson = await response.json();
      console.log(responseCode, responseJson);
      return await responseJson;
    } catch (error) {
      console.error(`The request to ${logOutUrl} is rejected!`, error);
    }
  }
  return null;
}
