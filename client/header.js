export function initializeVKLogin() {
  const vkLoginButton = document.getElementById("vk-btn");

  vkLoginButton.addEventListener("click", () => {
    window.location.replace("https://oauth.vk.com/authorize?client_id=51536587&display=page&redirect_uri=http://localhost:8080/client/index.html&scope=4194304&response_type=code&v=5.131");
  });
}

export function retieveCode() {
  console.log("code retrieval?");
  const code = window.location.href.split("=")[1];
  console.log(code);
  if (code) {
    const data = { code };
    return data;
  }
  return null;
}

export async function sendCode(data) {
  console.log("function sendCode started");
  console.log(data);
  if (data) {
    console.log("we are trying to send code");
    const dataToSend = data;
    dataToSend.network = "VK";
    console.log(JSON.stringify(data));
    const codeUrl = "http://127.0.0.1:8000/code/";
    try {
      const response = await fetch(codeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseJson = await response.json();
      const responseCode = response.status;
      console.log(responseCode, responseJson);
    } catch (error) {
      console.error(`The request to ${codeUrl} is rejected!`, error);
    }
  }
}
