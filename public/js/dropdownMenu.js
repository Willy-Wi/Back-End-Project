document.addEventListener("click", (element) => {
    let header__dropdown = document.getElementsByClassName("header__dropdown");
    let menu = header__dropdown[0].classList;
    let status = element.target.matches("[data-dropdown-toggle]");

    if (!status) {
        menu.remove("active");
    } else if (status) {
        if (!menu.contains("active")) {
            menu.toggle("active");
        } else if (menu.contains("active")) {
            menu.toggle("active");
        }
    }
});
