import { wpUrl } from "../settings/baseurl.js";
import loginMenu from "./loginMenu.js";
import { getToken } from "../utils/storage.js";
import deletePost from "./deletePost.js";
import msgFunction from "../utils/message.js";

const token = getToken();

if (!token) {
  location.href = "/";
}

loginMenu();

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");

if (!id) {
  document.location.href = "/";
}

const postUrl = wpUrl + "/wp/v2/posts/" + id;

const form = document.querySelector("#form");
const title = document.querySelector("#floatingTextarea");
const excerpt = document.querySelector("#floatingTextarea2");
const content = document.querySelector("#floatingTextarea3");
const idInput = document.querySelector("#id");
const messageContainer = document.querySelector(".message-container");
const loading = document.querySelector(".loading");

// code from https://stackoverflow.com/a/47140708
// to remove html from the rendered json in the form
function strip(html) {
  let doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

(async function () {
  try {
    const cacheBuster = `&_=${new Date().getTime()}`;
    const res = await fetch(postUrl + "?" + cacheBuster, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const post = await res.json();

    title.value = strip(post.title.rendered);
    excerpt.value = strip(post.excerpt.rendered);
    content.value = post.content.raw || post.content.rendered;
    idInput.value = post.id;

    deletePost(post.id);
  } catch (error) {
    console.log(error);
  } finally {
    loading.style.display = "none";
    form.style.display = "block";
  }
})();

form.addEventListener("submit", editForm);

function editForm(e) {
  e.preventDefault();

  messageContainer.innerHTML = "";

  const titleValue = title.value.trim();
  const excerptValue = excerpt.value.trim();
  const contentValue = content.value.trim();
  const idValue = idInput.value;

  if (
    titleValue.length === 0 ||
    excerptValue.length === 0 ||
    contentValue.length === 0
  ) {
    return msgFunction(
      "failed",
      "Please provide propler values",
      ".message-container",
    );
  }

  updatePost(titleValue, excerptValue, contentValue, idValue);
}

async function updatePost(title, excerpt, content, id) {
  const url = wpUrl + "/wp/v2/posts/" + id;

  const data = JSON.stringify({
    title: title,
    excerpt: excerpt,
    content: content,
    status: "publish",
  });

  const options = {
    method: "PUT",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await fetch(url, options);
    const json = await res.json();

    if (res.ok) {
      //   console.log("Update successful. New content saved:", json.content.raw);
      const viewPost = `<a href="postdetails.html?id=${json.id}">${json.title.rendered}</a>`;
      msgFunction(
        "success",
        `Post updated. Click to view ${viewPost}`,
        ".message-container",
      );
    } else {
      const errorMsg = json.message || "An error occurred";
      msgFunction("error", errorMsg, ".message-container");
    }
  } catch (error) {
    // console.log("Network error:", error);
    msgFunction(
      "error",
      "Network error, please try again",
      ".message-container",
    );
  }
}
