export const baseUrl = (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") ? "http://localhost:8000/api/" : "http://silentiy.beget.tech/api/";

export const logInErrorMessage = `We are sorry, but something went wrong during logIn.
Please, try again later or contact the owner of this site if the problem persist`;

export async function sendRequestToApi(requestUrl, requestOptions) {
  try {
    const response = await fetch(requestUrl, requestOptions);
    const jsonData = await response.json();
    return await jsonData;
  } catch (error) { // which errors would be catched?
    console.error(`The request to ${requestUrl} is rejected!`, error);
    return { error };
  }
}

export async function requestUserData(apiToken) {
  const userUrl = `${baseUrl}user/`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Token ${apiToken}`,
    },
  };
  return sendRequestToApi(userUrl, options);
}

export function getUserPictureSrc(userData) {
  let userPicture50Src;
  let userPicture200Src;
  if (userData.gallery_user.avatar_50_50_url) {
    userPicture50Src = userData.gallery_user.avatar_50_50_url;
    userPicture200Src = userData.gallery_user.avatar_200_200_url;
  } else {
    userPicture50Src = userData.social_user.avatar_50_50_url;
    userPicture200Src = userData.social_user.avatar_200_200_url;
  }
  return { userPicture50Src, userPicture200Src };
}

export function getUserName(userData) {
  console.log("user data in getUserName", userData);
  let userName;
  if (userData.gallery_user.nickname) {
    userName = userData.gallery_user.nickname;
  } else if (userData.first_name || userData.last_name) {
    userName = `${userData.first_name} ${userData.last_name}`;
  } else {
    userName = `user_${userData.pk}`;
  }
  return userName;
}

export function clearUrl(save) {
  const url = new URL(window.location.href);
  const entries = Array.from(url.searchParams.keys());

  let saveArray;

  if (!save) {
    saveArray = [];
  } else if (!Array.isArray(save)) {
    saveArray = new Array(save);
  } else {
    saveArray = save;
  }

  for (let i = 0; i <= entries.length; i++) {
    if (!(saveArray.includes(entries[i]))) {
      url.searchParams.delete(entries[i]);
    }
  }

  console.log("save_array", saveArray);
  console.log("clear_url", url.toString());

  window.history.pushState(null, "", url.toString());
}
