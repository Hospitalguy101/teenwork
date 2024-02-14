let signInButton = document.querySelector("#sign-in-button");

signInButton.addEventListener("click", () => {
  let email = document.querySelector("#sign-in-email");
  let pass = document.querySelector("#sign-in-pass");
  let rememberMe = document.querySelector("#remember-me");

  if (email.value && pass.value) {
    let info = {
      email: email.value,
      pass: pass.value,
      rememberMe: rememberMe.checked
    }
    fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info)
    }).then((res) => res.text().then((resText) => {
      if (resText == "OK") {
        window.location.href = "http://localhost:3000/dashboard.html";//CHANGE LATER------------------------------------------------------------------------------------------------------------------------
      }
    }));
  } else {
    alert("Please fill in all fields before submitting.")
  }
});
