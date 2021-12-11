// Get Current DateTime

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

// let create_post = document.getElementById("create-post");

// create_post.onclick = () => {
//     let card_list = document.getElementById("card-list");
//     let message = document.getElementById("textarea-create-post");
//     let invalid = document.getElementById("invalid-input");
//     let attach_file = document.getElementById("attach_file-post");

//     let ch_limit_msg = "Character Limit Cannot Exceed 128...";
//     let empty_msg = "Write something...";

//     if (message.value.length > 128) return (invalid.innerHTML = ch_limit_msg);
//     if (message.value.length < 1) return (invalid.innerHTML = empty_msg);

//     let new_post = `
//     <article class="card">
//         <div class="card-author">
//             <img src="" alt="" />
//             <h4>Willy Wijaya</h4>
//         </div>
//         <div class="card-comment">
//             <p>
//                 ${message.value}
//             </p>
//             <img src="" alt="" />
//         </div>
//         <hr />
//         <div class="toolbar">
//             <button id="like">Like</button>
//             <button id="dislike">Disike</button>
//             <button id="comments">Comments</button>
//             <button id="reports">Reports</button>
//         </div>
//     </article>
//     `;
//     message.value = "";
//     invalid.innerHTML = "";
//     card_list.insertAdjacentHTML("beforeend", new_post);
// };

// ? Aku gak tau kekmana buat nya wkwkwk

// const form = document.getElementById("reg-form");
// form.addEventListener("submit", registerUser);

// async function registerUser(event) {
//     event.preventDefault();
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;

//     const result = await fetch("/api/register", {
//         method: "post",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             username, password
//         })
//     }).then(res => res.json());

//     console.log(result);
// }
