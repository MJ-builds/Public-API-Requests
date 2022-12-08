//to hold our array (for modal, not card - inefficient, work on in future update)
let employees = [];
//url with 12 random employees, only taking the required data from the API for each
const url =
  "https://randomuser.me/api/?results=12&inc=picture,name,email,location,cell,dob";
//for assigning and tracking clicked employee (for modal)
let index = -1;

let gallery = document.getElementById("gallery");
let modalContainer = document.querySelector(".modal-container");
let searchContainer = document.querySelector(".search-container");
let employeeCards = document.getElementsByClassName("card");

//modal init as hidden
modalContainer.hidden = true;

//initialise
EmployeePackageInit();

function EmployeePackageInit() {
  //initialise the fetchData function
  fetchData(url);
  //initialise the search function
  search();
  // card listener for modal functionality
  gallery.addEventListener("click", cardClickHandler);
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
//move some of this code to existing functions in a future update - unneccessarily messy.
function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      data.results.forEach((data) => {
        //push each employee to the array
        employees.push(data);
        //to assign an index number for each employee generated
        index++;
        //run the function and generate cards with employees on each iteration
        generateEmployee(data);
      });
    })
    .catch((error) => console.log("Looks like there was a problem!", error));
}

//generate html & populate employee 'cards' function
function generateEmployee(data) {
  //added: searchFirstName & searchLastName - used by search function to pull the correctly searched card
  let html = `
  <div 
    class="card" IndexAPI=${index} searchFirstName= ${data.name.first.toLowerCase()} searchLastName=${data.name.last.toLowerCase()}> 
    <div class="card-img-container">
        <img class="card-img" src="${data.picture.large}" alt="profile picture">
      </div>
      <div class="card-info-container">
        <h3 id="name" class="card-name cap">${data.name.first} ${data.name.last}</h3>
      <p id='email' class="card-text">${data.email}</p>
      <p id ='citystate' class="card-text cap">${data.location.city}, ${data.location.state}</p>
    </div>
  </div>
  `;
  //add the above to the page
  gallery.insertAdjacentHTML("beforeend", html);
}

//modal function to display the modal, and move in the modal state.
function employeeModal(index) {
  let empCard = document.querySelector(`[IndexAPI='${index}']`);
  let empIndex = empCard.getAttribute("IndexAPI");
  let individual = employees[empIndex]; //better var

  let firstName,lastName,picture,email,city,state,streetNum,streetName,postcode,cell,dob;

  //helper function to assign employees specific data from the array to related variables.
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
    cell = individual.cell;
    dob = individual.dob.date;
  }
  /* helper function to update the employee data when needed (such as when the modal employee changes 
    via nagivation - ties into the navigation function lower down) */
  function employeeUpdater() {
    document.getElementById("picture").src = picture;
    document.getElementById("name").innerHTML = `${firstName} ${lastName}`;
    document.getElementById("email").innerHTML = `${email}`;
    document.getElementById("city").innerHTML = `${city}`;
    document.getElementById("cell").innerHTML = `${cell}`;
    document.getElementById("address").innerHTML = `${streetNum} ${streetName}, ${city}, ${state} ${postcode}`;
    document.getElementById("dateofbirth").innerHTML = `Birthday: ${dob.substr(5,2)}/${dob.substr(8, 2)}/${dob.substr(0, 4)}`;
  }

  //call function for the first card that is eventually clicked.
  employeeAssigner();

  //populate the modal HTML, with correct employee data
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
                        <p id="dateofbirth" class="modal-text">Birthday: ${dob.substr(5,2)}/${dob.substr(8, 2)}/${dob.substr(0, 4)}</p>
                    </div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
                `;

  modalContainer.innerHTML = html;
  //show modal
  modalContainer.hidden = false;

  //helper function to nagivate 'previous' or 'next' employee on the modal
  function modalDirectionUpdater(countDirection) {
    countDirection;
    empIndex = empCard.getAttribute("IndexAPI");
    empIndex = parseInt(empIndex) + count;
    individual = employees[empIndex];
    employeeAssigner();
    employeeUpdater();
  }
  //helper function to exit the modal by clicking the button (x) on page
  function exitModalClickHandler() {
    const quitModal = document.querySelector(".modal-close-btn");
    quitModal.addEventListener("click", (e) => {
      modalContainer.hidden = true;
    });
  }
  //instantiate count for below
  let count = 0;

  /* helper function to nagivate through the modal and call functions and update count 
  depending on the clicked button */
  function modalNavigator() {
    const modalBtnContainer = document.querySelector(".modal-btn-container");
    const modalPrevious = document.getElementById("modal-prev");
    const modalNext = document.getElementById("modal-next");

    modalBtnContainer.addEventListener("click", (e) => {
      if (empIndex > 0) {
        //only run the below code if there is a 'next' employee
        if (e.target === modalPrevious) {
          modalDirectionUpdater(count--);
        }
      }
      if (empIndex < employees.length - 1) {
        //only run the below code if there is a 'next' employee
        if (e.target === modalNext) {
          modalDirectionUpdater(count++);
        }
      }
    });
  }
  //finally call core functions above
  modalNavigator();
  exitModalClickHandler();
}
//search functionality enabling function
function search() {
  let html = `<form action="#" method="get">
  <input type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>`;
  searchContainer.insertAdjacentHTML("beforeend", html);

  const searchInput = document.getElementById("search-input");
  searchInput.focus(); //start page with searchbar as focus element

  searchInput.addEventListener("keyup", () => {
    const searchInputValue = document.getElementById("search-input").value;

    //iterate through all 'cards' named class elements
    //retrieve both first and last names (searchFirstName/searchLastName attributes) of each employee
    for (const employee of employeeCards) {
      const firstName = employee.getAttribute("searchFirstName");
      const lastName = employee.getAttribute("searchLastName");
      let fullName = "";
      fullName = firstName + " " + lastName;

      /*if the search input value includes letters of the first or last name,
      display the 'found' employees card, and hide the rest, else hide-all */
      if (
        firstName.includes(searchInputValue) ||
        lastName.includes(searchInputValue) ||
        fullName.includes(searchInputValue)
      ) {
        employee.style.display = "flex";
      } else {
        employee.style.display = "none";
      }
    }
  });
}
//helper function for when a specific employee card is clicked, to bring up the modal for that employee
function cardClickHandler(e) {
  if (e.target.closest(".card")) {
    const card = e.target.closest(".card");
    let cardIndex = card.getAttribute("IndexAPI");
    employeeModal(cardIndex);
  }
}
