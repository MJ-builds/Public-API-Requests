const urlAPI = "https://randomuser.me/api/?results=12";
let modalContainer = document.querySelector('.modal-container');
modalContainer.hidden = true;
let cards = document.getElementById("gallery");

  function generateEmployee(data, i) {
    const picture = data.results[i].picture.large;
    const firstName = data.results[i].name.first;
    const lastName = data.results[i].name.last;
    const email = data.results[i].email;
    const city = data.results[i].location.city;
    const state = data.results[i].location.state;

    //let html = ``;
    let html = `<div class="card">
<div class="card-img-container">
    <img class="card-img" src="${picture}" alt="profile picture">
</div>
<div class="card-info-container">
    <h3 id="name" class="card-name cap">${firstName} ${lastName}</h3>
    <p id='email' class="card-text">${email}</p>
    <p id ='citystate' class="card-text cap">${city}, ${state}</p>
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
  //convert to ASYNC? NB!
  function fetchData(url) {
    return fetch(url)
      .then(checkStatus)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.results); //for resting
        //think this should be foreach - explore
        for (let i = 0; i < 12; i++) {

          generateEmployee(data, i);
          
        }
      })
      .catch((error) => console.log("Looks like there was a problem!", error));
  }

  function employeeModal() {
    let html = `
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
                        <h3 id="name" class="modal-name cap">name</h3>
                        <p class="modal-text">email</p>
                        <p class="modal-text cap">city</p>
                        <hr>
                        <p class="modal-text">(555) 555-5555</p>
                        <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
                        <p class="modal-text">Birthday: 10/21/2015</p>
                    </div>
                </div>
                `;
                //clean this up.
                modalContainer.innerHTML = html;
                modalContainer.hidden = false;
               
  }

  //fetching 12 employees at a time - per screenshots (12 required)
  fetchData(urlAPI);

 
  
//   cards.addEventListener("click", (e) => {
//     if ((e.target = cards.children)) {
//         employeeModal();
//         let modal = document.querySelector(".modal");
        
//       console.log(e.target);

//     }
//   });

