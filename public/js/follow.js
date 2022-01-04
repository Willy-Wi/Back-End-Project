let updateStat = {
    Follow: function (button) {
        button.dataset.followStatus = "Unfollow";
        button.classList.toggle("profile__follow--active");
        button.textContent = "Unfollow";
    },
    Unfollow: function (button) {
        button.dataset.followStatus = "Follow";
        button.classList.toggle("profile__follow--active");
        button.textContent = "Follow";
    },
};

function follow (event) {
    console.log("Pass");
    let action = event.target.dataset.followStatus;
    let userId = event.target.dataset.userId;

    updateStat[action](event.target);
    axios.post("/users/" + userId + "/act", { action: action });
}
