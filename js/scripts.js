let index = -1; //for tracking clicked employee (for modal)
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
            let cardIndex = card.getAttribute("IndexAPI");
            //console.log(card.getAttribute("IndexAPI"));
            employeeModal(cardIndex);
            //console.log(employees); //testing
          }
        })
      )
      .catch((error) => console.log("Looks like there was a problem!", error))
  );
}

function employeeModal(index) {
  let empCard = document.querySelector(`[IndexAPI='${index}']`);
  let empIndex = empCard.getAttribute("IndexAPI");
  let individual = employees[empIndex]; //better var

  //clean these vars'. Create a helper function or var to take care of this long repetition.
  //probs dont need these...
  let firstName,lastName,picture,email,city,state,streetNum,streetName,postcode,cell,dob;

  function employeeAssigner() {
    firstName = individual.name.first;
    lastName = individual.name.last;
    picture = individual.picture.large;
    email = individual.email;
    city = individual.location.city;
    state = individual.location.state;
    streetNum = individual.location.street.number;
    streetName = individual.location.street.name;
    postcode = individual.location.postcode;
    cell = individual.cell; //note THIS FORMAT NEEDS TO CHANGE To eg: (555) 555-5555
    dob = individual.dob.date; //note THIS FORMAT NEEDS TO CHANGE To eg: 10/21/2015
  }
  function employeeUpdater() {
    document.getElementById("picture").src = picture;
    document.getElementById("name").innerHTML = `${firstName} ${lastName}`;
    document.getElementById("email").innerHTML = `${email}`;
    document.getElementById("city").innerHTML = `${city}`;
    document.getElementById("cell").innerHTML = `${cell}`;
    document.getElementById("address").innerHTML = `${streetNum} ${streetName}, ${city}, ${state} ${postcode}`;
    document.getElementById("dateofbirth").innerHTML = `${dob}`;
  }
  employeeAssigner();

  let html = `
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img id="picture" class="modal-img" src="${picture}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${firstName} ${lastName}</h3>
                        <p id ="email" class="modal-text">${email}</p>
                        <p id= "city" class="modal-text cap">${city}</p>
                        <hr>
                        <p id="cell" class="modal-text">${cell}</p>
                        <p id="address" class="modal-text">${streetNum} ${streetName}, ${city}, ${state} ${postcode}</p>
                        <p id="dateofbirth" class="modal-text">Birthday: ${dob}</p>
                    </div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
                `;
//see index comments - as far as i know, this(modal) needs to be APPENDED (and not innerhtml)
  modalContainer.innerHTML = html;
  modalContainer.hidden = false;

  //for exiting the modal
  const quitModal = document.querySelector(".modal-close-btn");
  quitModal.addEventListener("click", (e) => {
    modalContainer.hidden = true;
  });
  const modalBtnContainer = document.querySelector(".modal-btn-container");
  const modalPrevious = document.getElementById("modal-prev");
  const modalNext = document.getElementById("modal-next");
  let count = 0;

  modalBtnContainer.addEventListener("click", (e) => {
    if (empIndex > 0) { //only run the below code if there is a 'next' employee
      if (e.target === modalPrevious) {
        count--;
        empIndex = empCard.getAttribute("IndexAPI");
        empIndex = parseInt(empIndex) + count;
        individual = employees[empIndex];
        employeeAssigner();
        employeeUpdater();
      }
    }
      if(empIndex < (employees.length)-1){ //only run the below code if there is a 'next' employee
      if (e.target === modalNext) {
        count++;
        empIndex = empCard.getAttribute("IndexAPI");
        empIndex = parseInt(empIndex) + count;
        individual = employees[empIndex];
        employeeAssigner();
        employeeUpdater();
      }
    }
    
  });
}
//run the fetchData function 
fetchData(urlAPI);
