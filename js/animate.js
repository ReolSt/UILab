function addAnimation(htmlElement, animation) {
  let existingAnimation = getComputedStyle(htmlElement).animation;
  htmlElement.style.animation = existingAnimation + ", " + animation;
}

let welcomeNextButton = document.getElementById("welcome-next");
welcomeNextButton.addEventListener("click", event => {
  let welcomeContainer = document.getElementById("welcome");
  welcomeContainer.style.setProperty("transition", "1s ease");
  welcomeContainer.style.setProperty("transform", "translateX(-100vw)");
  addAnimation(welcomeNextButton, "fade-out 1s ease 0s both");
  setTimeout(() => {
    welcomeNextButton.parentElement.removeChild(welcomeNextButton);
    let letsGoButton = document.createElement("div");
    letsGoButton.className = "action-button letsgo transparent hidden";
    letsGoButton.innerText = "let's go";
    addAnimation(letsGoButton, "fade-in 1s ease 0s both");
    document.getElementById("main").appendChild(letsGoButton);
  }, 1000);
});