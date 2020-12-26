function addAnimation(htmlElement, animation) {
  let existingAnimation = getComputedStyle(htmlElement).animation;
  if(existingAnimation.length === 0) {
    htmlElement.style.animation = animation;
  }
  else {
    htmlElement.style.animation = existingAnimation + ", " + animation;
  }
}

let welcomeNextButton = document.getElementById("welcome-next");
welcomeNextButton.addEventListener("click", event => {
  let welcomeContainer = document.getElementById("welcome");
  let welcomeTitle = document.getElementById("welcome-title");
  welcomeTitle.style.transition = "transform 1s ease";
  welcomeTitle.style.transform = "translateX(-100vw)";
  addAnimation(welcomeNextButton, "fade-out 1s ease 0s both");
  let interval = setInterval(() => {
    document.getElementById("contents-container").removeChild(welcomeContainer);

    let introduceContainer = document.getElementById("introduce");
    introduceContainer.classList.remove("hidden");
    introduceContainer.style.opacity = "1";
    
    clearInterval(interval);
  }, 1000);
});