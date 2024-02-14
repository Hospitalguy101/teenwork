let mainPage = document.querySelector("#main-page");
let studentDiv = document.querySelector("#student-page");
let businessDiv = document.querySelector("#business-page");
let profileDiv = document.querySelector("#profile-page");
let currentAccount;
let searchBar = document.querySelector("#search-bar");
let searchButton = document.querySelector("#search-button");
let searchResults = document.querySelector("#search-results");
let postInput = document.querySelector("#create-post");
let postButton = document.querySelector("#submit-post");

fetch("/loggedIn").then((res) => res.json().then((acc) => {
  if (acc.res == "false") window.location.href = "http://localhost:3000/signin.html"; // TODO: FIX LATER----------------------------------------------------------
  else {
    currentAccount = acc;
    console.log(currentAccount);
    if (acc.type == "student") {
      studentDiv.style.display = "block"; // TODO: Change to block/none and none/block
      businessDiv.style.display = "block";
    }
    else {
      let posts = [];
      fetch("/getUserPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({author: currentAccount})
      }).then(res => res.json().then(p => {
        posts = p;
        console.log(posts);
        for (let i = 0; i < posts.length; i++) {
          console.log(posts[i])
          createPost(posts[i].text, posts[i].author, posts[i].time, businessDiv);
        }
      }));
      studentDiv.style.display = "block";
      businessDiv.style.display = "block";
    }
    mainPage.style.display = "block";
  }
}));

searchButton.addEventListener("click", () => {
  fetch("/getPosts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({input: searchBar.value})
  }).then(res => res.json().then(posts => {
    searchResults.textContent = "";
    posts.forEach(p => {
      createPost(p.text, p.author, p.time, searchResults);
    });
  }));
});

postButton.addEventListener("click", () => {
  uploadPost(postInput.value);
});

function createPost(postText, author, uploadDate, parentDiv) {
  let div = document.createElement("div");
  div.classList.add("post-div");
  div.style.border = "1px solid black";
  div.style.padding = "0px 10px 10px"

  let name = document.createElement("a");
  name.innerHTML = author.name;
  name.href = "#";
  name.onclick = function() {createProfilePage(author)};
  name.classList.add("post-name");
  div.appendChild(name);

  let address = document.createElement("p");
  address.innerHTML = author.address;
  address.classList.add("post-address");
  div.appendChild(address);

  let date = document.createElement("p");
  let unixDate = new Date(uploadDate);
  let day = unixDate.getDate();
  let month = unixDate.getMonth();
  let year = unixDate.getFullYear();
  let timeOfDay = "AM";
  let hour = unixDate.getHours();
  if (hour > 12) {
    hour -= 12;
    timeOfDay = "PM";
  }
  let minute = unixDate.getMinutes();
  if (minute.toString().length == 1) {
    minute = "0" + minute;
  }
  date.innerHTML = `Posted on ${month}/${day}/${year} ${hour}:${minute} ${timeOfDay}`;
  div.appendChild(date);

  let text = document.createElement("p");
  text.innerHTML = postText;
  text.classList.add("post-text");
  div.appendChild(text);

  parentDiv.appendChild(div);
}

function uploadPost(text) {
  let time = Date.now();
  let post = {
    type: "post",
    text: text,
    author: currentAccount,
    time: time
  };

  fetch("/uploadPost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post)
  });
}

function createProfilePage(profile) {
  profileDiv.textContent = "";
  let div = document.createElement("div");
  let posts = [];
  let backButton = document.createElement("button");
  backButton.innerHTML = "Back";
  backButton.onclick = () => {
    profileDiv.style.display = "none";
    if (currentAccount == "student") studentDiv.style.display = "block";
    else businessDiv.style.display = "block";
  }
  div.appendChild(backButton);
  let name = document.createElement("p");
  name.innerHTML = profile.name;
  div.appendChild(name);
  let email = document.createElement("p");
  email.innerHTML = profile.email;
  div.appendChild(email);
  let address = document.createElement("p");
  address.innerHTML = profile.address;
  if (profile.type == "student") {
    let bio = document.createElement("p");
    bio.innerHTML = profile.bio;
    div.appendChild(bio);
  }
  else if (profile.type == "business") {
    fetch("/getUserPosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({author: profile})
    }).then(res => res.json().then(p => {
      posts = p;
      console.log(posts);
      for (let i = 0; i < posts.length; i++) {
        console.log(posts[i])
        createPost(posts[i].text, posts[i].author, posts[i].time, div);
      }
    }));
    div.appendChild(address);
  }
  studentDiv.style.display = "none";
  businessDiv.style.display = "none";
  profileDiv.style.display = "block";
  profileDiv.appendChild(div);
}
