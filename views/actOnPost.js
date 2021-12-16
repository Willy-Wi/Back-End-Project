let updatePostStats = {
    Like: function (postId) {
        document.querySelector("#likes-count-" + postId).textContent++;
    },
    Dislike: function (postId) {
        document.querySelector("#likes-count-" + postId).textContent--;
    },
};

let toggleButtonText = {
    Like: function (button) {
        button.textContent = "Dislike";
    },
    Dislike: function (button) {
        button.textContent = "Like";
    },
};

let actOnPost = function (event) {
    let postId = event.target.dataset.postId;
    let action = event.target.textContent.trim();

    toggleButtonText[action](event.target);
    updatePostStats[action](postId);

    axios.post("/posts/" + postId + "/act", { action: action });
};
