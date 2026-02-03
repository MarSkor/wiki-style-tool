import { wpUrl } from "../settings/baseurl.js";
import loginMenu from "./loginMenu.js";
import { getToken } from "../utils/storage.js";
import msgFunction from "../utils/message.js";

const token = getToken();

if (!token) {
  location.href = "/";
}

loginMenu();

const form = document.querySelector("#form");
const title = document.querySelector("#floatingTextarea");
const excerpt = document.querySelector("#floatingTextarea2");
const content = document.querySelector("#floatingTextarea3");
const messageContainer = document.querySelector(".message-container");

form.addEventListener("submit", formData);

function formData(e) {
  e.preventDefault();

  messageContainer.innerHTML = "";

  const titleValue = title.value.trim();
  const excerptValue = excerpt.value.trim();
  const contentValue = content.value.trim();

  addPost(titleValue, excerptValue, contentValue);
}

async function addPost(title, excerpt, content) {
  const url = wpUrl + "/wp/v2/posts";

  const data = JSON.stringify({
    title: title,
    excerpt: excerpt,
    content: content,
    status: "publish",
  });

  const options = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();

    if (response.ok) {
      const viewPost = `<a href="postdetails.html?id=${json.id}">${json.title.rendered}</a>`;
      msgFunction(
        "success",
        `Post created. Click to view ${viewPost}`,
        ".message-container",
      );
      form.reset();
    } else {
      // console.error("Server Error JSON:", json);
      const errorMessage = json.message || "An unknown error occurred";
      msgFunction("error", errorMessage, ".message-container");
    }
  } catch (error) {
    msgFunction(
      "error",
      "Network error. Please try again.",
      ".message-container",
    );
  }
}
