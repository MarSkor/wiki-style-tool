import { wpUrl } from "./settings/baseurl.js";
import displayPosts from "./components/listPosts.js";
import loginMenu from "./components/loginMenu.js";
import msgFunction from "./utils/message.js";
import recentPostsList from "./components/recentPosts.js";

const postsUrl =
  wpUrl + "/wp/v2/posts?orderby=date&order=asc&_embed&v=" + Date.now();
const recentPostsUrl =
  wpUrl + "/wp/v2/posts?orderby=date&order=desc&_embed&v=" + Date.now();

loginMenu();

async function fetchPostData() {
  try {
    const [data1, data2] = await Promise.all([
      fetch(postsUrl),
      fetch(recentPostsUrl),
    ]);

    const posts = await data1.json();
    const recentPosts = await data2.json();

    displayPosts(posts);
    recentPostsList(recentPosts);

    return [posts, recentPosts];
  } catch (err) {
    // console.log(err);
    msgFunction("error", "An error occurred", ".list-group-posts");
  }
}

fetchPostData()
  .then(([posts, recentPosts]) => {
    (posts, recentPosts);
  })
  .catch((error) => {
    console.log(error);
  });
