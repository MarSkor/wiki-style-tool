import { wpUrl } from "../settings/baseurl.js";
import { saveToken, saveUser, getToken } from "../utils/storage.js";
import msgFunction from "../utils/message.js";
import loginMenu from "./loginMenu.js";

loginMenu();

const token = getToken();

if (token) {
  location.href = "index.html";
}

const form = document.querySelector("#form");
const username = document.querySelector("#username");
const usernameError = document.querySelector("#usernameError");
const password = document.querySelector("#password");
const passwordError = document.querySelector("#passwordError");
const messageContainer = document.querySelector(".message-container");

form.addEventListener("submit", loginForm);

function loginForm(e) {
  e.preventDefault();

  messageContainer.innerHTML = "";

  const usernameValue = username.value;
  const passwordValue = password.value;

  if (checkLength(usernameValue, 0) === true) {
    usernameError.style.display = "none";
  } else {
    usernameError.style.display = "block";
  }

  if (checkLength(passwordValue, 0) === true) {
    passwordError.style.display = "none";
  } else {
    passwordError.style.display = "block";
  }

  loginUser(usernameValue, passwordValue);
}

function checkLength(value, len) {
  if (value.trim().length > len) {
    return true;
  } else {
    return false;
  }
}

async function loginUser(username, password) {
  const url = wpUrl + "/jwt-auth/v1/token";
  const data = JSON.stringify({ username: username, password: password });

  const options = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await fetch(url, options);
    const json = await res.json();

    if (res.ok) {
      saveToken(json.token);
      saveUser(json);
      location.href = "index.html";
    } else {
      msgFunction(
        "error",
        "Could not log in. Please try again.",
        ".message-container",
      );
    }
  } catch (error) {
    console.log(error);
  }
}
