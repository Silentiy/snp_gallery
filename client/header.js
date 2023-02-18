export function initializeLogin() {
  const currentUrl = window.location.href.split("?")[0];

  const vkLoginButton = document.getElementById("vk-btn");
  const googleLoginButton = document.getElementById("google-btn");

  const vkRequestCodeUrl = "https://oauth.vk.com/authorize?client_id=51536587&display=page&"
  + `redirect_uri=${currentUrl}&scope=4194304&response_type=code&v=5.131`;

  const googleRequestCodeUrl = "https://accounts.google.com/o/oauth2/auth?response_type=code&"
  + "scope=https://www.googleapis.com/auth/userinfo.profile+"
  + "https://www.googleapis.com/auth/userinfo.email&"
  + "client_id=227202273006-afmkvi18g9tg4d0eksbhgrdo537bnu7l.apps.googleusercontent.com&"
  + `redirect_uri=${currentUrl}`;

  vkLoginButton.addEventListener("click", () => {
    window.location.replace(vkRequestCodeUrl);
    window.localStorage.setItem("PROVIDER", "VK");
  });

  googleLoginButton.addEventListener("click", () => {
    window.location.replace(googleRequestCodeUrl);
    window.localStorage.setItem("PROVIDER", "Google");
  });
}

export async function isLogged() {
  console.log("is logged started");
  const apiToken = readLocalStorage("API_TOKEN");
  if (apiToken) {
    const userData = await requestUserData(apiToken);
    console.log("user data in is_logged", userData);
    createloggedInHeader(userData);
  } else {
    socialLogin();
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

export async function socialLogin() {
  console.log("social login started");
  const codeJson = retieveCode();
  clearUrl();
  if (codeJson) {
    const tokenJson = await sendCode(codeJson);
    if (tokenJson) {
      const apiToken = tokenJson.key;
      if (apiToken) {
        setApiToken(apiToken);
        const userData = await requestUserData(apiToken);
        createloggedInHeader(userData);
      }
    }
  }
}

export function retieveCode() {
  console.log(document.location.search);
  const searchParams = new URLSearchParams(document.location.search);
  console.log(searchParams);
  let code = searchParams.get("code");
  console.log("code", code);
  if (code) {
    code = decodeURIComponent(code);
    // code = encodeURIComponent(code);
    const data = { code };
    return data;
  }
  return null;
}

function clearUrl() {
  const currentUrl = window.location.href;
  console.log("clearUrl: currentUrl", currentUrl);
  const baseUrl = currentUrl.split("?")[0];
  window.history.replaceState(null, null, baseUrl);
}

export async function sendCode(data) {
  let codeUrl;

  console.log("function sendCode started");

  if (data) {
    console.log("we are trying to send code");
    console.log("window.location.href", document.location.href);
    const callbackUrl = window.location.href.split("?")[0];
    const provider = readLocalStorage("PROVIDER");
    const dataToSend = data;
    dataToSend.network = provider;
    dataToSend.callback_url = callbackUrl;

    console.log(JSON.stringify(dataToSend));

    if (provider === "VK") {
      codeUrl = "http://127.0.0.1:8000/dj-rest-auth/vk/";
    } else if (provider === "Google") {
      codeUrl = "http://127.0.0.1:8000/dj-rest-auth/google/";
    } else {
      codeUrl = null;
      alert("Social authentication provider was not set");
    }

    if (codeUrl) {
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
        window.localStorage.removeItem("PROVIDER");
        return await responseJson;
      } catch (error) {
        console.error(`The request to ${codeUrl} is rejected!`, "error:", error);
      }
    }
  }
  return null;
}

export function createloggedInHeader(userData) {
  if (userData) {
    // do we get user_data or error and it's description
    if ("email" in userData) {
      putUserContent(userData);
      toggleHeader();
    } else {
      alert(`An error occured during logging: bad user data, ${userData}`);
    }
  } else {
    alert(`An error occured during logging: no user data, ${userData}`);
  }
}

function putUserContent(data) {
  const userAvatar = document.getElementById("user-avatar");
  const userNameDiv = document.getElementById("username");
  let userName;
  if (data.gallery_user.avatar !== null) {
    userAvatar.src = data.gallery_user.avatar;
  } else {
    userAvatar.src = data.social_user.avatar;
  }

  if (data.gallery_user.nickname !== null) {
    userName = document.createTextNode(data.gallery_user.nickname);
  } else {
    userName = document.createTextNode(`${data.first_name} ${data.last_name}`);
  }
  userNameDiv.appendChild(userName);
}

export function toggleHeader() {
  const loggedOutDiv = document.getElementById("logged-out-div");
  const loggedInDiv = document.getElementById("logged-in-div");
  loggedOutDiv.classList.toggle("header-hidden");
  loggedInDiv.classList.toggle("header-hidden");
}

export function setApiToken(token) {
  console.log(token);
  window.localStorage.setItem("API_TOKEN", token);
}

export function readLocalStorage(item) {
  try {
    return window.localStorage.getItem(item);
  } catch (error) {
    return null;
  }
}

export function deleteApiToken() {
  window.localStorage.removeItem("API_TOKEN");
}

export function initializeLogOut() {
  const logOutButton = document.getElementById("logout-btn");
  logOutButton.addEventListener("click", logOut);
}

export async function logOut() {
  console.log("on logOut", window.location.href);
  const apiToken = readLocalStorage("API_TOKEN");
  deleteApiToken();
  toggleHeader();
  const deleteResponse = await sendDeleteTokenRequest(apiToken);
  if (deleteResponse) {
    document.location.search = "";
  }
}

async function sendDeleteTokenRequest(apiToken) {
  if (apiToken) {
    console.log("we are trying to logOut");
    const logOutUrl = "http://127.0.0.1:8000/dj-rest-auth/logout/";
    try {
      const response = await fetch(logOutUrl, {
        method: "POST",
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
