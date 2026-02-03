import loginMenu from "./loginMenu.js";
import { wpUrl } from "../settings/baseurl.js";
import { getToken, getUserId } from "../utils/storage.js";
import ifLoggedIn from "./ifLoggedIn.js";
import { decodeHTMLEntities, highlightCode } from "../utils/highlighter.js";

loginMenu();
ifLoggedIn();

const token = getToken();

marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false,
});

const queryString = document.location.search;
const params = new URLSearchParams(queryString);

const id = params.get("id");
if (!id) {
  document.location.href = "/";
}

const postUrl = wpUrl + "/wp/v2/posts/" + id;
const loading = document.querySelector(".loading");
const detailsContainer = document.querySelector(".details-container");

(async function () {
  try {
    const cacheBuster = `?_=${new Date().getTime()}`;

    const res = await fetch(postUrl + cacheBuster, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const details = await res.json();

    if (res.ok) {
      document.querySelector(".nav-current-post").innerHTML =
        details.title.rendered;
      document.querySelector(".post-title").innerHTML = details.title.rendered;
      document.querySelector(".current-breadcrumb").innerHTML =
        details.title.rendered;
      document.querySelector(".last-edited").innerHTML =
        `Last updated ${new Date(details.modified_gmt).toLocaleDateString("en-us", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}`;

      const postdetailsContainer = document.querySelector(
        ".postdetailscontainer",
      );

      let contentToParse = details.content.raw || details.content.rendered;

      if (!details.content.raw) {
        contentToParse = decodeHTMLEntities(contentToParse);
      }

      const htmlContent = marked.parse(contentToParse);
      postdetailsContainer.innerHTML = htmlContent;

      await highlightCode(".postdetailscontainer");
    }

    const editContainer = document.querySelector(".edit-post-details");
    editContainer.innerHTML = `<a class="btn btn-sm btn-custom-bg" id="edit-link" href="edit-post.html?id=${details.id}">Edit Post<i class="feather-18 edit-icon" data-feather="edit"></i></a>`;

    canEditPosts();
    feather.replace();
  } catch (error) {
    console.log("An error occurred.");
  } finally {
    loading.style.display = "none";
    detailsContainer.style.display = "block";
  }
})();

const userName = getUserId();

function canEditPosts() {
  const editLink = document.querySelectorAll("[id='edit-link']");
  for (var i = 0; i < editLink.length; i++)
    if (userName) {
      editLink[i].style.display = "inline-flex";
    }
}
