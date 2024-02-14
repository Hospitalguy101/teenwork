let studentButton = document.querySelector("#student-form-button");
let studentDiv = document.querySelector("#student-form");
let studentSignUpButton = document.querySelector("#student-sign-up");


let businessButton = document.querySelector("#business-form-button");
let businessDiv = document.querySelector("#business-form");
let businessSignUpButton = document.querySelector("#business-sign-up");

studentButton.addEventListener("click", () => {
  if (studentDiv.style.display == "none") studentDiv.style.display = "block";
  else studentDiv.style.display = "none";
  businessDiv.style.display = "none";
});

businessButton.addEventListener("click", () => {
  if (businessDiv.style.display == "none") businessDiv.style.display = "block";
  else businessDiv.style.display = "none";
  studentDiv.style.display = "none";
});

studentSignUpButton.addEventListener("click", () => {
  let studentName = document.querySelector("#student-name");
  let studentEmail = document.querySelector("#student-email");
  let studentPass = document.querySelector("#student-password");
  let studentConfirm = document.querySelector("#student-confirm");
  let studentAddress = document.querySelector("#student-address");
  let studentTranscript = document.querySelector("#student-transcript");
  let studentBio = document.querySelector("#student-bio");
  let studentRecs = document.querySelector("#student-recs");

  let studentPrefs = [];
  for (let i = 1; i < 10; i++) {
    let option = document.querySelector("#option" + i);
    if (option.checked) studentPrefs.push(option.value);
  }

  let timeTable = document.querySelector("#student-times");
  let availbileTimes = [];
  for (let i = 0; i < timeTable.rows.length; i++) {
    for (let j = 0; j < timeTable.rows[i].cells.length; j++) {
      let item = timeTable.rows[i].cells[j].firstElementChild;
      if(item != null && item.checked) availbileTimes.push(item.id);
    }
  }

  if (studentName.value && studentEmail.value && studentPass.value && studentConfirm.value && studentAddress.value && studentTranscript.value && studentBio.value && studentRecs.value && studentPrefs.length > 0 && availbileTimes.length > 0) {
    if (studentPass.value != studentConfirm.value) {
      alert("Your passwords do not match.");
      return;
    }
    let student = {
      name: studentName.value,
      type: "student",
      email: studentEmail.value,
      pass: studentPass.value,
      address: studentAddress.value,
      transcript: studentTranscript.value,
      bio: studentBio.value,
      recs: studentRecs.value,
      prefs: studentPrefs,
      times: availbileTimes,
    }

    fetch("/signup", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student)
    }).then((res) => res.text().then((resText) => {
      console.log(resText);
      if (resText == "OK") {
        window.location.href = "http://localhost:3000/dashboard.html";// TODO: CHANGE LATER------------------------------------------------------------------------------------------------------------------------
      }
    }));
  }
  else {
    alert("Please fill in all fields before submitting.");
  }
});

businessSignUpButton.addEventListener("click", () => {
  let businessName = document.querySelector("#business-name");
  let businessEmail = document.querySelector("#business-email");
  let businessPass = document.querySelector("#business-password");
  let businessConfirm = document.querySelector("#business-confirm");
  let businessAddress = document.querySelector("#business-location");
  let businessBio = document.querySelector("#business-bio");
  let businessTimes = document.querySelector("#business-times");
  let howTheyHeard = document.querySelector("#business-how-they-heard");

  let businessTypes = [];
  for (let i = 1; i < 10; i++) {
    let option = document.querySelector("#b-option" + i);
    if (option.checked) businessTypes.push(option.value);
  }

  if (businessName.value && businessEmail.value && businessPass.value && businessConfirm.value && businessAddress.value && businessBio.value && businessTimes.value && businessTypes.length > 0) {
    if (businessPass.value != businessConfirm.value) {
      alert("Your passwords do not match.");
      return;
    }
    let business = {
        name: businessName.value,
        type: "business",
        email: businessEmail.value,
        pass: businessPass.value,
        address: businessAddress.value,
        bio: businessBio.value,
        times: businessTimes.value,
        employeeType: businessTypes,
        howTheyHeard: howTheyHeard.value,
    }

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(business)
    }).then((res) => res.text().then((resText) => {
      if (resText == "OK") {
        window.location.href = "http://localhost:3000/dashboard.html";// TODO: CHANGE LATER------------------------------------------------------------------------------------------------------------------------
      }
    }));
  }
});
