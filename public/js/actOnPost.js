 let updatePostStats = {
    Like: function (postId) {
        document.querySelector("#likes-count-" + postId).textContent++;
    },
    Unlike: function (postId) {
        document.querySelector("#likes-count-" + postId).textContent--;
    },
};

let toggleButtonText = {
    Like: function (button) {
        button.dataset.postStatus = "Unlike";
        button.classList.toggle("active");
        button.classList.remove("far");
        button.classList.add("fas");
    },
    Unlike: function (button) {
        button.dataset.postStatus = "Like";
        button.classList.toggle("active");
        button.classList.remove("fas");
        button.classList.add("far");
    },
};

function actOnPost (event) {
    let postId = event.target.dataset.postId;
    let action = event.target.dataset.postStatus;

    toggleButtonText[action](event.target);
    updatePostStats[action](postId);

    axios.post("/posts/" + postId + "/act", { action: action });
};
