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

// Create New Post

let create_post = document.getElementById("create-post");

create_post.onclick = () => {
    let card_list = document.getElementById("card-list");
    let textarea_post = document.getElementById("textarea-post");
    let invalid_input = document.getElementById("invalid-input");

    let error_message = "Character Limit Cannot Exceed 256";

    if (textarea_post.length > 256) return invalid_input.innerHTML = error_message;

    let new_post = `
    <article class="card">
        <div class="card-author">
            <img src="" alt="" />
            <h4>Willy Wijaya</h4>
        </div>
        <div class="card-comment">
            <p>
                ${textarea_post.value}
            </p>
            <img src="" alt="" />
        </div>
        <hr />
        <div class="toolbar">
            <button id="like">Like</button>
            <button id="dislike">Disike</button>
            <button id="comments">Comments</button>
            <button id="reports">Reports</button>
        </div>
    </article>
    `;
    textarea_post.value = "";
    card_list.insertAdjacentHTML("beforeend", new_post);
};
