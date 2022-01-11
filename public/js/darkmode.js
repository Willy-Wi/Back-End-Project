let darkmode = localStorage.getItem("darkmode");
const darkModeToggle = document.querySelector("#dark-mode-toggle");

const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "enabled");
}

const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", null);
}

if (darkmode === "enabled") {
    enableDarkMode();
}

darkModeToggle.addEventListener("click", () => {
    darkmode = localStorage.getItem("darkmode");
    if (darkmode !== "enabled") {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
})