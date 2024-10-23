document.addEventListener("DOMContentLoaded", function () {
  let router = {
    routes: {
      "": function () {
        if (!isLoggedIn()) {
          document.getElementById("signInPage").classList.add("visible");
          document.getElementById("landingPage").classList.remove("visible");
        } else {
          window.location.hash = "#landingPage";
        }
      },
      landingPage: function () {
        if (isLoggedIn()) {
          document.getElementById("signInPage").classList.remove("visible");
          document.getElementById("landingPage").classList.add("visible");
          hideOtherSections("landingPage");
        } else {
          window.location.hash = "";
        }
      },
      homePage: function () {
        document.getElementById("landingPage").classList.add("visible");
        hideOtherSections("landingPage");
      },
      contentPage: function () {
        document.getElementById("contentPage").classList.add("visible");
        hideOtherSections("contentPage");
      },
      discussionBoardPage: function () {
        document.getElementById("discussionBoardPage").classList.add("visible");
        hideOtherSections("discussionBoardPage");
      },
      contactPage: function () {
        document.getElementById("contactPage").classList.add("visible");
        hideOtherSections("contactPage");
      },
      profilePage: function () {
        document.getElementById("profilePage").classList.add("visible");
        hideOtherSections("profilePage");
      },
    },
    navigate: function () {
      if (!isLoggedIn()) {
        window.location.hash = "";
        return;
      }
      let hash = window.location.hash.slice(1);
      if (this.routes[hash]) {
        this.routes[hash]();
      } else {
        window.location.hash = "";
      }

      hideAllOverlays();
    },
  };

  router.navigate();

  window.addEventListener("hashchange", function () {
    router.navigate();
  });

  function isLoggedIn() {
    return sessionStorage.getItem("loggedIn") === "true";
  }

  function hideOtherSections(currentSectionId) {
    let sections = document.querySelectorAll("section");
    sections.forEach(function (section) {
      if (section.id !== currentSectionId) {
        section.classList.remove("visible");
      }
    });
  }
});

function hideAllOverlays() {
  overlays.forEach((overlay, index) => {
    if (overlay) {
      overlay.remove();
      overlays[index] = null;
    }
  });
}

function enableRepeatedNavigation(id, hash) {
  let link = document.getElementById(id);
  link.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = hash;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  enableRepeatedNavigation("homeLink", "homePage");
  enableRepeatedNavigation("contentLink", "contentPage");
  enableRepeatedNavigation("discussionLink", "discussionBoardPage");
  enableRepeatedNavigation("contactLink", "contactPage");
  enableRepeatedNavigation("profileLink", "profilePage");
});
