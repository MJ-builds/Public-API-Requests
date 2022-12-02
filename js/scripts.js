let index = -1;
const urlAPI = "https://randomuser.me/api/?results=12";
let modalContainer = document.querySelector(".modal-container");
modalContainer.hidden = true;
let gallery = document.getElementById("gallery");
let cards = document.getElementsByClassName("card");
let employees = []; //to hold our array

function generateEmployee(data) {
  //let html = ``;
  //add + ${index}
  let html = `<div class="card" IndexAPI=${index}> 
  <div class="card-img-container">
      <img class="card-img" src="${data.picture.large}" alt="profile picture">
  </div>
  <div class="card-info-container">
      <h3 id="name" class="card-name cap">${data.name.first} ${data.name.last}</h3>
      <p id='email' class="card-text">${data.email}</p>
      <p id ='citystate' class="card-text cap">${data.location.city}, ${data.location.state}</p>
  </div>
  </div>`;
  //add the above to the page
  gallery.insertAdjacentHTML("beforeend", html);
}
//check the status of the response and provide error feedback if error occurs.
//add status code 200 if statements etc?
function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function fetchData(url) {
  return (
    fetch(url)
      .then(checkStatus)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.results.forEach((data) => {
          employees.push(data);
          index++;
          // console.log(data);
          // console.log(index);
          generateEmployee(data);
        });
      })
      //putting this in here for now so that i can get the data to link...commented out below
      .then(
        gallery.addEventListener("click", (e) => {
          if (e.target.closest(".card")) {
            const card = e.target.closest(".card");
            const cardIndex = card.getAttribute("IndexAPI");
            console.log(card.getAttribute("IndexAPI"));
            employeeModal(cardIndex); //testing
            console.log(employees);

            //for exiting the modal
            const quitModal = document.querySelector(".modal-close-btn");
            quitModal.addEventListener("click", (e) => {
              modalContainer.hidden = true;
            });
          }
        })
      )
      .catch((error) => console.log("Looks like there was a problem!", error))
  );
}

function employeeModal(index) {
  const empCard = document.querySelector(`[IndexAPI='${index}']`);
  const empIndex = empCard.getAttribute("IndexAPI");
  //clean these vars'. Create a helper function or var to take care of this long repetition.
  //probs dont need these...
  const firstName = employees[empIndex].name.first;
  const lastName = employees[empIndex].name.last;
  const picture = employees[empIndex].picture.large;
  const email = employees[empIndex].email;
  const city = employees[empIndex].location.city;
  const state = employees[empIndex].location.state;
  const streetNum = employees[empIndex].location.street.number;
  const streetName = employees[empIndex].location.street.name;
  const postcode = employees[empIndex].location.postcode;
  const cell = employees[empIndex].cell; //note THIS FORMAT NEEDS TO CHANGE To eg: (555) 555-5555
  const dob = employees[empIndex].dob.date; //note THIS FORMAT NEEDS TO CHANGE To eg: 10/21/2015

  let html = `
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${picture}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${firstName} ${lastName}</h3>
                        <p class="modal-text">${email}</p>
                        <p class="modal-text cap">${city}</p>
                        <hr>
                        <p class="modal-text">${cell}</p>
                        <p class="modal-text">${streetNum} ${streetName}, ${city}, ${state} ${postcode}</p>
                        <p class="modal-text">Birthday: ${dob}</p>
                    </div>
                </div>
                `;
  //clean this up.
  modalContainer.innerHTML = html;
  modalContainer.hidden = false;
}

//fetching 12 employees at a time - per screenshots (12 required)
fetchData(urlAPI);
