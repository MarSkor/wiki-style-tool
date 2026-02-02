import { getUserId } from "../utils/storage.js";
import logOutUser from "./logOut.js";

export default function loginMenu() {
  const container = document.querySelector(".admin-col");

  const userName = getUserId();

  if (userName) {
    container.innerHTML = `
    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 justify-content-end login-container">
        <li class="nav-item">
            <a class="nav-link text-white" href="./index.html" tabindex="-1">Home</a>
        </li>
        <span class="text-white nav-link"> Hi ${userName}</span> <a class="nav-link text-white" href="#" id="logout">Logout</a>
    </ul>
    `;
  } else {
    container.innerHTML = `
    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 justify-content-end login-container">
        <li class="nav-item">
            <a class="nav-link text-white" href="./index.html" tabindex="-1">Home</a>
        </li>
        <li class="nav-item">
            <a class="nav-link text-white" href="./login.html" tabindex="-1">Login</a>
        </li>
    </ul>
    `;
  }

  feather.replace();

  logOutUser();
}
