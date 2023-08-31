import { baseUrl } from "./common.js";

const token = window.localStorage.getItem("API_TOKEN");
console.log("upload.js");

const imagePreviewArea = document.getElementById("image_preview_area");
const sendButton = document.getElementById("photo-send");
const fileInput = document.getElementById("input_file");
const nameInput = document.getElementById("photo_name");
const descriptionInput = document.getElementById("photo_description");

//  https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
fileInput.onchange = () => {
  const [file] = fileInput.files;
  if (file) {
    const imagePreviewOld = document.getElementById("image_preview_old");
    imagePreviewOld.remove();
    const imagePreview = document.createElement("img");
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.alt = "image preview";
    imagePreview.id = "image_preview_old";
    imagePreview.classList.add("photo-view", "img-fluid");
    imagePreviewArea.appendChild(imagePreview);
  }
};

sendButton.addEventListener("click", cleanForm);

async function uploadFile() {
  console.log("uploadFile has started");

  const formdata = new FormData();
  const myHeaders = new Headers();

  formdata.append("photo", fileInput.files[0]);
  const photoName = nameInput.value;
  const photoDescription = descriptionInput.value;
  formdata.append("name", photoName);
  formdata.append("description", photoDescription);

  const authorization = `Token ${token}`;
  console.log(authorization);
  myHeaders.append("Authorization", authorization);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  console.log("formdata.get('name')", formdata.get("name"), "formdata.get('description')", formdata.get("description"));

  try {
    const response = await fetch(`${baseUrl}photo-post/`, requestOptions);
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error("The request to upload photo was rejected!", error);
    return error.status;
  }
}

async function cleanForm() {
  const result = await uploadFile();
  console.log(result);
  if ("id" in result) {
    fileInput.value = "";
    nameInput.value = "";
    descriptionInput.value = "";
    const imagePreviewdOld = document.getElementById("image_preview_old");
    imagePreviewdOld.remove();
    const previewTextParagraph = document.createElement("p");
    previewTextParagraph.classList.add("text-center", "text-muted");
    previewTextParagraph.id = "image_preview_old";
    const previewText = document.createTextNode("Image preview...");
    previewTextParagraph.appendChild(previewText);
    imagePreviewArea.appendChild(previewTextParagraph);
    alert("Your photo was successfully uploaded and will appear on the main page after approval!");
  } else {
    alert("You must fill all the fields provided!");
  }
}
