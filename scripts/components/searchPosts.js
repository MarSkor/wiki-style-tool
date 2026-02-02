import { wpUrl } from "../settings/baseurl.js";

const postsUrl = wpUrl + "/wp/v2/posts?per_page=100";

(async function () {
  try {
    const response = await fetch(postsUrl);
    const posts = await response.json();

    searchPosts(posts);
  } catch (error) {
    console.log(error);
  }
})();

const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector(".search-results");

export default function searchPosts(val) {
  searchInput.onkeyup = function (e) {
    const userInput = e.target.value.toLowerCase().trim();

    if (userInput.length > 0) {
      const filteredArray = val.filter((post) => {
        return post.title.rendered.toLowerCase().includes(userInput);
      });

      showResults(filteredArray, userInput);
    } else {
      searchResults.innerHTML = "";
      searchResults.classList.add("inactive");
    }
  };

  const showResults = (list, userInput) => {
    searchResults.innerHTML = "";
    searchResults.classList.remove("inactive");

    if (list.length === 0) {
      searchResults.innerHTML = `<li class="list-group-item">No results for "${userInput}"</li>`;
    } else {
      list.forEach((post) => {
        const li = document.createElement("li");

        li.innerHTML = `<a href="postdetails.html?id=${post.id}">${post.title.rendered}</a>`;

        li.addEventListener("click", () => {
          searchInput.value = post.title.rendered;
          searchResults.innerHTML = "";
          searchResults.classList.add("inactive");
        });

        searchResults.appendChild(li);
      });
    }
  };
}
