const currenDate = new Date();

const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const nth = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

let dateTime = nth(currenDate.getDate());

let time = `${
    month[currenDate.getMonth()]
} ${currenDate.getDate()}${dateTime} ${currenDate.getFullYear()}`;

let date = document.getElementById("date");

date.insertAdjacentHTML("beforeend", time);

// Add More Comments in HTML

let card = document.getElementsByClassName("card");
let button_new_post = document.getElementById("new-post");

button_new_post.addEventListener("click", () => {
    
})