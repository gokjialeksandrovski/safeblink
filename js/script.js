//Load functions
function performOperations() {
  editProfileInputFields();
  displayUserCreditendialsFromSessionStorage();
  changeUserNameAndPassword();
  changeNavSignInButtonToProfilePic(document.querySelectorAll(".nav-sign-in"));
  showSlide(currentIndex);
  showVideosBadges();
  changeSocialIconsForPhone();
  handleLogOut(".sign-in");
}

function performOperations2() {
  loadSavedCards();
  filterContentCards();
  addContentCardOverlay();
  changeSocialIconsForPhone();
}

window.onload = performOperations2();
window.addEventListener("resize", changeSocialIconsForPhone);

function attachEventListeners() {
  window.addEventListener("hashchange", performOperations);
  document.addEventListener("routeChange", performOperations);
  document.addEventListener("DOMContentLoaded", performOperations);
}

if (sessionStorage.getItem("loggedIn") === "true") {
  attachEventListeners();
}

//Sign-in page
function handleLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const requestData = {
    username: username,
    password: password,
  };

  fetch("http://localhost:5000/api/authentication", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (response.ok) {
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("password", password);
        sessionStorage.setItem(
          "email",
          document.querySelector("#profileEmail").value
        );
        sessionStorage.setItem(
          "birthYear",
          document.querySelector("#profileBirthYear").value
        );
        displayOverlay();
        const signInPopUp = document.querySelector(".sign-in-pop-up");
        if (signInPopUp) {
          signInPopUp.scrollIntoView({ behavior: "smooth" });
        }
        performOperations();
      } else {
        alert("Invalid username or password");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    });
}

function displayOverlay() {
  const overlayDiv = document.createElement("div");
  overlayDiv.classList.add("sign-in-pop-up");

  const title = document.createElement("h2");
  title.textContent = "Добредојде!";
  title.classList.add("sign-in-pop-up-title");

  const text = document.createElement("p");
  text.textContent = "Успешно креиран профил";
  text.classList.add("sign-in-pop-up-text");

  const button = document.createElement("button");
  button.textContent = "Продолжи кон Safeblink";
  button.classList.add("sign-in-pop-up-button");
  button.addEventListener("click", function () {
    window.location.hash = "landingPage";
    overlayDiv.style.display = "none";
    location.reload();
  });

  overlayDiv.appendChild(title);
  overlayDiv.appendChild(text);
  overlayDiv.appendChild(button);

  document.body.appendChild(overlayDiv);
}

document.getElementById("loginButton").addEventListener("click", () => {
  handleLogin();
});

function displayUserCreditendialsFromSessionStorage() {
  const savedUsername = sessionStorage.getItem("username");
  const savedPassword = sessionStorage.getItem("password");
  let maskedPassword = "";

  if (savedUsername) {
    document.querySelector("#changeToUserName").innerText = savedUsername;
    document.querySelector("#profileUsername").value = savedUsername;
  }

  if (savedPassword) {
    maskedPassword = "*".repeat(savedPassword.length);
  }

  document.querySelector("#profilePassword").value = maskedPassword;
}

//Navbar
const hamburgerMenus = document.querySelectorAll(".hamburger-menu");
const body = document.querySelector("body");
let overlays = [];

function createOverlay() {
  const overlay = document.createElement("div");
  overlay.classList.add("hamburger-overlay");

  const navLinks = document.createElement("ul");
  navLinks.classList.add("nav-links-2");
  navLinks.innerHTML = `
      <li><a href="#contentPage">Информирај се</a></li>
      <li><a href="#discussionBoardPage">Дискусии</a></li>
      <li><a href="#contactPage">Контакт</a></li>
      <li><a href="#profilePage">Профил</a></li>
    `;

  const navSignIn = document.createElement("div");
  navSignIn.classList.add("nav-sign-in-2");

  const signInContent = `
      <div class="sign-in-2">
        <button>Најави се</button>
      </div>
      <div class="mk-al-2"><span>MK</span>&nbsp;|&nbsp;<span>AL</span></div>
      <a href="./" class="search-icon-2">
              <img
                src="./images/Navigation bar/icon search.png"
                alt="Search icon"
              />
            </a>
    `;
  navSignIn.innerHTML = signInContent;

  overlay.append(navLinks, navSignIn);

  const links = navLinks.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      toggleOverlay(index);
    });
  });

  return overlay;
}

function toggleOverlay(index) {
  if (!overlays[index]) {
    overlays[index] = createOverlay();
    body.appendChild(overlays[index]);
  } else {
    overlays[index].remove();
    overlays[index] = null;
  }

  if (sessionStorage.getItem("loggedIn") !== "true") {
    document
      .querySelector(".sign-in-2")
      .addEventListener("click", focusOnFirstInput);
  }

  if (sessionStorage.getItem("loggedIn") === "true") {
    changeNavSignInButtonToProfilePic(
      document.querySelectorAll(".nav-sign-in-2")
    );

    document
      .querySelector(".sign-in-2")
      .removeEventListener("click", () => focusOnFirstInput);

    handleLogOut(".sign-in-2");
  }
}

function focusOnFirstInput() {
  let inputField = document.querySelector(".manual-log-in input");
  inputField.focus();
  inputField.setSelectionRange(
    inputField.value.length,
    inputField.value.length
  );
}

function changeNavSignInButtonToProfilePic(navSignIns) {
  navSignIns.forEach((navSignIn) => {
    let signIn = navSignIn.querySelector("div");
    signIn.innerHTML = "";
    signIn.classList.add("nav-profile-pic");

    let profilePageLink = document.createElement("a");
    profilePageLink.setAttribute("id", "profileLink");
    profilePageLink.href = "#profilePage";
    signIn.appendChild(profilePageLink);
  });
}

function handleLogOut(signInSelector) {
  let signIn = document.querySelectorAll(signInSelector);

  signIn.forEach((profilePic) => {
    profilePic.addEventListener("click", () => {
      let existingDropdown = document.querySelector(".nav-dropdown");

      if (existingDropdown) {
        existingDropdown.remove();
      } else {
        let dropdown = document.createElement("div");
        dropdown.innerText = "Одјави се";
        dropdown.classList.add("nav-dropdown");

        profilePic.appendChild(dropdown);

        dropdown.addEventListener("click", () => {
          dropdown.remove();
          sessionStorage.clear();
          window.location.hash = "";
          window.location.reload();
        });
      }
    });
  });
}

document
  .querySelector(".nav-sign-in")
  .addEventListener("click", focusOnFirstInput);

hamburgerMenus.forEach((menu, index) => {
  menu.addEventListener("click", function () {
    toggleOverlay(index);
  });

  body.addEventListener("click", function (event) {
    if (
      overlays[index] &&
      !overlays[index].contains(event.target) &&
      event.target !== menu
    ) {
      toggleOverlay(index);
    }
  });
});

//Landing page

document.getElementById("playButton").addEventListener("click", function () {
  let video = document.getElementById("landingVideo");
  let playButtonImg = document.querySelector("#playButton img");

  video.play();
  playButtonImg.style.display = "none";
  video.addEventListener("ended", () => {
    playButtonImg.style.display = "block";
  });
});

document.getElementById("contentLinkBtn").addEventListener("click", () => {
  window.location.hash = "contentPage";
});

document.getElementById("discussionLinkBtn").addEventListener("click", () => {
  window.location.hash = "discussionBoardPage";
});

document.getElementById("profileLinkBtn").addEventListener("click", () => {
  window.location.hash = "profilePage";
});

//Profile page
function editProfileInputFields() {
  const editButtons = document.querySelectorAll(".change-profile-info");
  const confirmButtons = document.querySelectorAll(".confirm-edit");
  const cancelButtons = document.querySelectorAll(".cancel-edit");
  const inputContainers = document.querySelectorAll(
    ".profile-info-input-container"
  );

  const inputFields = document.querySelectorAll(
    ".profile-info-input-container input"
  );

  const originalValues = [];
  inputFields.forEach((input) => {
    originalValues.push(input.value);
  });

  inputFields.forEach((input) => (input.disabled = true));

  inputContainers.forEach(function (container, index) {
    container.addEventListener("mouseenter", function () {
      if (!container.classList.contains("editing")) {
        editButtons[index].style.display = "inline-block";
      }
    });

    container.addEventListener("mouseleave", function () {
      editButtons[index].style.display = "none";
    });
  });

  editButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      const container = this.parentElement;
      const inputField = inputFields[index];
      container.classList.add("editing");
      button.style.display = "none";
      inputField.disabled = false;
      inputField.focus();
      inputField.setSelectionRange(
        inputField.value.length,
        inputField.value.length
      );

      confirmButtons[index].style.display = "inline-block";
      cancelButtons[index].style.display = "inline-block";
    });
  });

  confirmButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      const container = this.parentElement;
      container.classList.remove("editing");
      button.style.display = "none";
      cancelButtons[index].style.display = "none";
      const inputField = inputFields[index];
      inputField.disabled = true;

      if (!validateInputs()) {
        inputField.value = originalValues[index];
        return;
      }

      if (inputField.type === "password") {
        alert(
          "Од безбедносни причини, промена на лозинката е ограничена. Ве молиме контактирајте не преку е-пошта за помош."
        );
        return;
      }

      if (inputField.id === "profileEmail") {
        storeEmailAndBirthYear(inputField.value, null);
      }

      if (inputField.id === "profileBirthYear") {
        storeEmailAndBirthYear(null, inputField.value);
      }

      changeUserNameAndPassword();
      location.reload();
    });
  });

  cancelButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      const container = this.parentElement;
      container.classList.remove("editing");
      button.style.display = "none";
      confirmButtons[index].style.display = "none";
      const inputField = inputFields[index];
      inputField.disabled = true;
      inputField.value = originalValues[index];

      if (inputField.type === password) {
        inputField.value = sessionStorage.getItem("password");
      }
    });
  });
}

function storeEmailAndBirthYear(email, birthYear) {
  if (email !== null) {
    sessionStorage.setItem("email", email);
  }

  if (birthYear !== null) {
    sessionStorage.setItem("birthYear", birthYear);
  }
}

function validateInputs() {
  const emailRegex = /^\S+@\S+\.\S+$/;
  const currentYear = new Date().getFullYear();
  const yearRegex = new RegExp(`^(19\\d{2}|2000|20\\d{2}|${currentYear})$`);
  const genderValues = ["машки", "женски"];

  const inputs = document.querySelectorAll(
    ".profile-info-input-container input"
  );
  let isValid = true;
  let invalidFields = [];
  let alertShown = false;

  inputs.forEach((input) => {
    const inputName = input.getAttribute("name");
    const inputValue = input.value.trim();

    switch (inputName) {
      case "profileEmail":
        if (!emailRegex.test(inputValue)) {
          isValid = false;
          invalidFields.push("Внесете валидна е-пошта.");
          input.classList.add("invalid");
        }
        break;
      case "profileBirthYear":
        if (!yearRegex.test(inputValue)) {
          isValid = false;
          invalidFields.push(
            `Внесете валидна година на раѓање помеѓу 1900 и ${currentYear}.`
          );
          input.classList.add("invalid");
        }
        break;
      case "profileGender":
        if (!genderValues.includes(inputValue.toLowerCase())) {
          isValid = false;
          invalidFields.push("Внесете валиден пол (машки или женски).");
          input.classList.add("invalid");
        }
        break;
    }
  });

  if (!isValid && !alertShown) {
    const message =
      "Потребно е да ги исправите следните полиња:\n" +
      invalidFields.join("\n");
    alert(message);
    alertShown = true;
  }

  return isValid;
}

function changeUserNameAndPassword() {
  const newUsername = document.querySelector("#profileUsername").value;
  const newPassword = document.querySelector("#profilePassword").value;
  const newMaskedPassword = "*".repeat(newPassword.length);

  if (
    newUsername !== sessionStorage.getItem("username") &&
    /[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]/.test(newUsername) &&
    newUsername.length > 0
  ) {
    sessionStorage.setItem("username", newUsername);
  }
  if (
    newMaskedPassword !== sessionStorage.getItem("password") &&
    /[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]/.test(newMaskedPassword) &&
    newMaskedPassword.length > 0
  ) {
    sessionStorage.setItem("password", newMaskedPassword);
  }
}

//Content page

let currentIndex = 0;

function showSlide(index) {
  const slides = document.querySelectorAll(".carousel-content h2");
  const dots = document.querySelectorAll(".dot");
  if (index >= slides.length) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = slides.length - 1;
  } else {
    currentIndex = index;
  }

  slides.forEach((slide) => slide.classList.remove("active"));
  slides[currentIndex].classList.add("active");

  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentIndex].classList.add("active");
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

function currentSlide(index) {
  showSlide(index);
}

function filterContentCards() {
  const filters = document.querySelectorAll(".content-filter");
  const cards = document.querySelectorAll(".content-card");

  function filterCards() {
    const activeFilters = Array.from(filters)
      .filter((filter) => filter.classList.contains("filter-active"))
      .map((filter) => filter.dataset.filter);

    if (activeFilters.length === 0) {
      showAllCards();
      return;
    }

    const cardIds = new Set();
    let hasRelevantFilter = false;

    activeFilters.forEach((filter) => {
      switch (filter) {
        case "najgledani":
          addCardsToSet(cardIds, [1, 2, 3, 4]);
          hasRelevantFilter = true;
          break;
        case "aktuelno":
          addCardsToSet(cardIds, [3, 5, 16, 12]);
          hasRelevantFilter = true;
          break;
        case "najnovi":
          addCardsToSet(cardIds, [13, 9, 7, 4]);
          hasRelevantFilter = true;
          break;
        default:
          break;
      }
    });

    if (hasRelevantFilter) {
      cards.forEach((card) => {
        const cardId = parseInt(card.dataset.id, 10);
        if (cardIds.has(cardId)) {
          card.classList.add("active");
        } else {
          card.classList.remove("active");
        }
      });
    } else {
      showAllCards();
    }
  }

  function addCardsToSet(set, cardIds) {
    cardIds.forEach((id) => set.add(id));
  }

  function showAllCards() {
    cards.forEach((card) => card.classList.add("active"));
  }

  function handleFilterClick(event) {
    if (event.currentTarget.classList.contains("filter-active")) {
      event.currentTarget.classList.remove("filter-active");
      event.currentTarget.classList.add("filter-inactive");
    } else {
      event.currentTarget.classList.add("filter-active");
      event.currentTarget.classList.remove("filter-inactive");
    }

    const activeFilters = Array.from(filters)
      .filter((filter) => filter.classList.contains("filter-active"))
      .map((filter) => filter.dataset.filter);

    sessionStorage.setItem("selectedFilters", JSON.stringify(activeFilters));
    filterCards();
  }

  const savedFilters =
    JSON.parse(sessionStorage.getItem("selectedFilters")) || [];
  if (savedFilters.length > 0) {
    savedFilters.forEach((savedFilter) => {
      filters.forEach((filter) => {
        if (filter.dataset.filter === savedFilter) {
          filter.classList.add("filter-active");
          filter.classList.remove("filter-inactive");
        }
      });
    });
    filterCards();
  } else {
    showAllCards();
  }

  filters.forEach((filter) => {
    filter.addEventListener("click", handleFilterClick);
  });
}

function changeImage(img) {
  img.src = "./images/Content page/play-button-hover.png";
}

function restoreImage(img) {
  img.src = "./images/Content page/video-play-button.png";
}

function addContentCardOverlay() {
  const playButtons = document.querySelectorAll(".content-card-play-button");

  playButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const contentCard = button.closest(".content-card");
      const cardId = contentCard.getAttribute("data-id");
      const videoSrc = `./videos/Content page/content-video-${cardId}.mp4`;
      const overlay = document.createElement("div");
      overlay.classList.add("content-card-overlay");

      const overlayContent = document.createElement("div");
      overlayContent.classList.add("content-card-overlay-content");

      const overlayVideoContainer = document.createElement("div");
      overlayVideoContainer.classList.add(
        "content-card-overlay-video-container"
      );

      const savedProfileName = sessionStorage.getItem("username");

      overlayContent.innerHTML = `<h3 class='content-card-overlay-title'>Наслов на видео</h3>
      <p class='content-card-overlay-text'>Лорем ипсум е едноставен модел на текст 
      кој се користел во печатарската индустрија. Лорем ипсум бил индустриски стандард 
      кој се користел како модел уште пред 1500 години, кога непознат печатар зел кутија со 
      букви и ги сложил на таков начин за да направи примерок на книга. И не само што 
      овој модел опстанал пет векови туку почнал да се користи и во електронските 
      медиуми, кој се уште не е променет.</p>
      <span class='content-card-date'>Објавено на 05/28/23</span>

       

      <div class='content-card-overlay-comments'>
      <div class='comment'>
      <div class='comment-experience'>
      <p id='shareComment'>Остави коментар...</p>
      </div>
      <div class="comment-profile">
      <div class="discussion-img">
      <img src="./images/Discussion board page/person 1.png" alt="The person">
      </div>
      <p>${savedProfileName}</p>
      </div>
      </div>

      <div class='comment-2'>
      <div class='comment-experience'>
      <div class='the-comment'>Лорем ипсум е едноставен модел на текст кој се користел во печатарската индустрија. Лорем ипсум бил индустриски стандард кој се користел како модел уште пред 1500 години, кога непознат печатар зел кутија со букви и ги сложил на таков начин за да направи примерок на книга.</div>
      </div>
      <div class="discussion-profile">
      <div class="discussion-img">
      <img src="./images/Discussion board page/person 7.png" alt="The person">
      </div>
      <p>Име Презиме</p>
      <span>00/00/00, 00:00</span>
      </div>
      </div>

      <div class='comment-2'>
      <div class='comment-experience '>
      <div class='the-comment'>Лорем ипсум е едноставен модел на текст кој се користел во печатарската индустрија. Лорем ипсум бил индустриски стандард кој се користел како модел уште пред 1500 години, кога непознат печатар зел кутија со букви и ги сложил на таков начин за да направи примерок на книга.</div>
      </div>
      <div class="discussion-profile">
      <div class="discussion-img">
      <img src="./images/Discussion board page/person 12.png" alt="The person">
      </div>
      <p>Име Презиме</p>
      <span>00/00/00, 00:00</span>
      </div>
      </div>

      <div class='comment-2'>
      <div class='comment-experience'>
      <div class='the-comment'>Лорем ипсум е едноставен модел на текст кој се користел во печатарската индустрија. Лорем ипсум бил индустриски стандард кој се користел како модел уште пред 1500 години, кога непознат печатар зел кутија со букви и ги сложил на таков начин за да направи примерок на книга.</div>
      </div>
      <div class="discussion-profile">
      <div class="discussion-img">
      <img src="./images/Discussion board page/person 9.png" alt="The person">
      </div>
      <p>Име Презиме</p>
      <span>00/00/00, 00:00</span>
      </div>
      </div>

      <div class="scroll-buttons">
        <button id="scroll-up">▲</button>
        <button id="scroll-down">▼</button>
        <button id='close-overlay'>&#10006;</button>
      </div>
      </div>
      `;

      overlayVideoContainer.innerHTML = `
      <video id="contentVideo" src="${videoSrc}"></video>
        <img src='./images/Content page/play-button.png' class='play-button' alt='video play button'>`;

      let videoForPhone = document.createElement("div");
      videoForPhone.classList.add("content-card-video-2");
      videoForPhone.innerHTML = `
       <video id="contentVideo" src="${videoSrc}"></video>
        <img src='./images/Content page/play-button.png' class='play-button' alt='video play button'>;`;

      overlay.append(overlayContent, overlayVideoContainer);

      document.body.appendChild(overlay);

      function playVideo() {
        let contentVideo = overlay.querySelector("#contentVideo");

        contentVideo.play();

        overlay.querySelector(".play-button").style.display = "none";

        contentVideo.addEventListener("ended", () => {
          document.querySelector(".play-button").style.display = "block";
        });
      }

      overlay
        .querySelector(".content-card-overlay-video-container .play-button")
        .addEventListener("click", playVideo);

      if (window.innerWidth <= 768) {
        overlay
          .querySelector(".content-card-overlay-video-container .play-button")
          .removeEventListener("click", playVideo);
        overlayVideoContainer.remove();

        let comments = overlay.querySelector(".content-card-overlay-comments");
        overlayContent.prepend(videoForPhone, comments);
        videoForPhone.addEventListener("click", playVideo);
      }

      overlay
        .querySelector(".scroll-buttons #close-overlay")
        .addEventListener("click", closeOverlay);

      countNumberOfVideoClicks(overlay);
      scrollComments(overlay);
      shareComment(overlay, savedProfileName, cardId);
      renderComments(overlay, cardId);
    });
  });
}

function scrollComments(overlay) {
  overlay.addEventListener("click", (event) => {
    if (event.target.id === "scroll-up") {
      overlay.querySelector(".content-card-overlay-content").scrollBy({
        top: -100,
        behavior: "smooth",
      });
    }

    if (event.target.id === "scroll-down") {
      overlay.querySelector(".content-card-overlay-content").scrollBy({
        top: 100,
        behavior: "smooth",
      });
    }
  });
}

function closeOverlay() {
  let overlays = document.querySelectorAll(".content-card-overlay");
  overlays.forEach((overlay) => {
    overlay.innerHTML = "";
    overlay.remove();
    overlay.style.display = "none";
  });
}

function shareComment(overlay, savedProfileName, cardId) {
  const shareComment = overlay.querySelector("#shareComment");

  shareComment.addEventListener("click", function () {
    const commentText = prompt("Внеси го твојот коментар:");
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()}, ${currentDate.toLocaleTimeString(
      [],
      { hour: "2-digit", minute: "2-digit" }
    )}`;

    if (commentText) {
      const newCommentData = {
        text: commentText,
        username: savedProfileName,
        date: formattedDate,
      };

      const commentKey = `comments-${cardId}`;
      const storedComments =
        JSON.parse(sessionStorage.getItem(commentKey)) || [];
      storedComments.unshift(newCommentData);
      sessionStorage.setItem(commentKey, JSON.stringify(storedComments));

      addCommentToDOM(overlay, newCommentData, true);
    }
  });
}

function renderComments(overlay, cardId) {
  const commentKey = `comments-${cardId}`;
  const storedComments = JSON.parse(sessionStorage.getItem(commentKey)) || [];
  for (let i = storedComments.length - 1; i >= 0; i--) {
    addCommentToDOM(overlay, storedComments[i], false);
  }
}

function addCommentToDOM(overlay, comment, isNew) {
  const shareCommentElement =
    overlay.querySelector("#shareComment").parentElement.parentElement;
  const newComment = document.createElement("div");
  newComment.classList.add("comment-2");
  newComment.innerHTML = `
        <div class='comment-experience'>
          <div class='the-comment'>${comment.text}</div>
        </div>
        <div class="discussion-profile">
          <div class="discussion-img">
            <img src="./images/Discussion board page/person 1.png" alt="The person">
          </div>
          <p>${comment.username}</p>
          <span>${comment.date}</span>
        </div>
      `;

  if (isNew) {
    shareCommentElement.insertAdjacentElement("afterend", newComment);
  } else {
    shareCommentElement.parentElement.insertBefore(
      newComment,
      shareCommentElement.nextSibling
    );
  }
}

function countNumberOfVideoClicks(overlay) {
  let count = sessionStorage.getItem("videoClickCount");
  count = count ? parseInt(count) : 0;
  const playButton = overlay.querySelector(".play-button");
  playButton.addEventListener("click", function () {
    count++;
    sessionStorage.setItem("videoClickCount", count);
  });
  if (!sessionStorage.getItem("videoClickCount")) {
    sessionStorage.setItem("videoClickCount", 0);
  }
}

function showVideosBadges() {
  const videoClickCount = parseInt(sessionStorage.getItem("videoClickCount"));

  videoClickCount >= 5
    ? document.querySelector(".profile-badge-2").classList.add("visible")
    : null;
  videoClickCount >= 10
    ? document.querySelector(".profile-badge-3").classList.add("visible")
    : null;
  videoClickCount >= 20
    ? document.querySelector(".profile-badge-4").classList.add("visible")
    : null;
}

//Discussion Board page

let cardCount = 0;

document
  .querySelector(".discussion-self-share-experience")
  .addEventListener("click", function () {
    addCard();
  });

function addCard() {
  // Save 'Активност во дискусија' badge
  document.querySelector(".profile-badge-5").style.display = "block";
  sessionStorage.setItem("displayBadge", "true");

  const savedProfileName = sessionStorage.getItem("username");
  cardCount++;

  let discussionExperience = document.createElement("div");
  discussionExperience.classList.add("discussion-experience");
  discussionExperience.style.paddingTop = "0";

  let colorSelect = document.createElement("select");
  colorSelect.classList.add("color-select");
  let colors = [
    { value: "", text: "Избери боја" },
    { value: "discussion-purple", text: "Виолетова" },
    { value: "discussion-green", text: "Зелена" },
    { value: "discussion-blue", text: "Сина" },
    { value: "discussion-light-purple", text: "Светло виолетова" },
  ];
  colors.forEach((color) => {
    let option = document.createElement("option");
    option.value = color.value;
    option.text = color.text;
    colorSelect.appendChild(option);
  });

  discussionExperience.appendChild(colorSelect);

  let discussionShareExperience = document.createElement("div");
  discussionShareExperience.classList.add("discussion-share-experience");

  let inputField = document.createElement("textarea");
  inputField.placeholder = "Внеси го текстот...";
  inputField.classList.add("discussion-text-area");

  let shareExperience = document.createElement("button");
  shareExperience.textContent = "Сподели";
  shareExperience.classList.add("discussion-share-button");

  discussionShareExperience.append(inputField, shareExperience);
  discussionExperience.appendChild(discussionShareExperience);

  let discussionProfile = document.createElement("div");
  discussionProfile.classList.add("discussion-profile");

  let discussionImg = document.createElement("div");
  discussionImg.classList.add("discussion-img");
  let img = document.createElement("img");
  img.src = "./images/Discussion board page/person 1.png";
  img.alt = "The person";
  discussionImg.appendChild(img);

  let name = document.createElement("p");
  name.textContent = savedProfileName;

  let date = document.createElement("span");
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()}, ${currentDate.toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  )}`;
  date.textContent = formattedDate;

  discussionProfile.append(discussionImg, name, date);

  let discussionShare = document.createElement("div");
  discussionShare.classList.add("discussion-share-experience");
  let shareTheExperience = document.createElement("p");
  shareTheExperience.textContent = "Пиши коментар...";
  let shareTheImg = document.createElement("img");
  shareTheImg.src = "./images/Discussion board page/Self experience line.png";
  shareTheImg.alt = "A line";

  discussionShare.append(shareTheExperience, shareTheImg);

  let discussionInteractions = document.createElement("div");
  discussionInteractions.classList.add("discussion-interactions");
  let interactionsImg = document.createElement("img");
  interactionsImg.src = "./images/Discussion board page/+.png";
  interactionsImg.alt = "+ sign";
  let interactionsP = document.createElement("p");
  interactionsP.classList.add("discussion-comments");
  interactionsP.textContent = "0 коментари";
  let interactionsReactions = document.createElement("span");
  interactionsReactions.classList.add("discussion-reactions");
  interactionsReactions.textContent = "0 реакции";

  discussionInteractions.append(
    interactionsImg,
    interactionsP,
    interactionsReactions
  );

  discussionExperience.append(
    discussionProfile,
    discussionShare,
    discussionInteractions
  );

  let column;
  let referenceNode;
  if (window.innerWidth <= 1012) {
    column = document.querySelector(".discussion-board-column-1");
    referenceNode = document.querySelector(
      ".discussion-self-experience"
    ).nextElementSibling;
  } else {
    if (cardCount % 3 === 1) {
      column = document.querySelector(".discussion-board-column-2");
    } else if (cardCount % 3 === 2) {
      column = document.querySelector(".discussion-board-column-3");
    } else {
      column = document.querySelector(".discussion-board-column-1");
    }
    if (cardCount % 3 === 1 || cardCount % 3 === 2) {
      referenceNode = column.firstElementChild;
    } else {
      referenceNode = column.children[1];
    }
  }

  const existingExperience = column.querySelector(
    ".discussion-experience:last-of-type"
  );
  if (existingExperience) {
    existingExperience.remove();
  }

  column.insertBefore(discussionExperience, referenceNode);

  colorSelect.addEventListener("change", function () {
    discussionExperience.classList.remove(
      "discussion-purple",
      "discussion-green",
      "discussion-blue",
      "discussion-light-purple"
    );

    const selectedColor = colorSelect.value;
    if (selectedColor) {
      discussionExperience.classList.add(selectedColor);
    }
  });

  shareExperience.addEventListener("click", function () {
    let enteredText = inputField.value.trim();
    if (enteredText !== "") {
      let selectedColor = colorSelect.value;
      if (!selectedColor) {
        alert("Ве молам изберете боја.");
        return;
      }

      let discussionText = document.createElement("p");
      discussionText.classList.add("discussion-text");
      discussionText.textContent = enteredText;

      discussionExperience.insertBefore(discussionText, discussionProfile);

      inputField.value = "";
      shareExperience.style.display = "none";
      inputField.style.display = "none";
      colorSelect.style.display = "none";
      alert("Споделениот текст: " + enteredText);

      saveCardToStorage(discussionExperience.outerHTML);
    } else {
      alert("Ве молам внесете текст.");
    }
  });
}

function saveCardToStorage(cardHTML) {
  let savedCards = JSON.parse(sessionStorage.getItem("savedCards")) || [];
  savedCards.push(cardHTML);
  sessionStorage.setItem("savedCards", JSON.stringify(savedCards));
}

function loadSavedCards() {
  let savedCards = JSON.parse(sessionStorage.getItem("savedCards")) || [];
  let columnIndices = [1, 2, 3];
  let columnIndex = 1;
  savedCards.forEach((cardHTML) => {
    let column;
    let referenceNode;
    if (window.innerWidth <= 1012) {
      column = document.querySelector(".discussion-board-column-1");
      referenceNode = document.querySelector(
        ".discussion-self-experience"
      ).nextElementSibling;
    } else {
      column = document.querySelector(
        `.discussion-board-column-${columnIndices[columnIndex]}`
      );
      referenceNode =
        columnIndex === 0 ? column.children[1] : column.firstElementChild;
      columnIndex = (columnIndex + 1) % 3;
    }
    let tempElement = document.createElement("div");
    tempElement.innerHTML = cardHTML;
    let discussionExperience = tempElement.firstChild;
    column.insertBefore(discussionExperience, referenceNode);
  });

  //Show 'Активност во дискусија' badge
  if (sessionStorage.getItem("displayBadge") === "true") {
    document.querySelector(".profile-badge-5").style.display = "block";
  }
}

//Footer
function changeSocialIconsForPhone() {
  if (window.innerWidth <= 668) {
    let facebookIcons = document.querySelectorAll(
      ".safeblink-icons .icons a:first-of-type img"
    );

    facebookIcons.forEach((facebook) => {
      facebook.src = "./images/Footer/facebook-icon-phone.png";
    });

    let instagramIcons = document.querySelectorAll(
      ".safeblink-icons .icons a:nth-of-type(2) img"
    );
    instagramIcons.forEach((instagram) => {
      instagram.src = "./images/Footer/instagram-icon-phone.png";
    });

    let youtubeIcons = document.querySelectorAll(
      ".safeblink-icons .icons a:nth-of-type(3) img"
    );
    youtubeIcons.forEach((youtube) => {
      youtube.src = "./images/Footer/youtube-icon-phone.png";
    });

    let tiktokIcons = document.querySelectorAll(
      ".safeblink-icons .icons a:last-of-type img"
    );
    tiktokIcons.forEach((tiktok) => {
      tiktok.src = "./images/Footer/tiktok-icon-phone.png";
    });
  }
}
