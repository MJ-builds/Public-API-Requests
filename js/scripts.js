const card = document.getElementsByClassName('card');

function generateEmployee(data,i) {
//let html = ``;
let html = `<div class="card">
<div class="card-img-container">
    <img class="card-img" src="${data.results[i].picture.large}" alt="profile picture">
</div>
<div class="card-info-container">
    <h3 id="name" class="card-name cap">${data.results[i].name.first} ${data.results[i].name.last}</h3>
    <p id='email' class="card-text">${data.results[i].email}</p>
    <p id ='citystate' class="card-text cap">${data.results[i].location.city}, ${data.results[i].location.state}</p>
</div>
</div>`;

gallery.insertAdjacentHTML('beforeend', html);   
}
// generateEmployee();

function checkStatus (response) {
    if(response.ok) {
     return Promise.resolve(response); 
    } else {
     return Promise.reject(new Error(response.statusText)); 
    }
  }
//convert to ASYNC? NB!
function fetchData (url) {
return fetch(url)
.then(checkStatus)
.then(res => res.json())
.then(data => {
    //explore using .map here rather (or in generateEmployee function)
    for(let i=0;i<12;i++){
    console.log(data.results[i]); //for testing
    generateEmployee(data,i);
    }
})
.catch(error => console.log('Looks like there was a problem!',error));
}

    //generateEmployee();
    //fetching 12 employees at a time - per screenshots (12 required)
    fetchData('https://randomuser.me/api/?results=12');