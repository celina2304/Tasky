//parent element to store cards
const taskContainer = document.querySelector(".task__container");
console.log(taskContainer);

//Global store
let globalStore = [];

const newCard = ({id, imageUrl, taskTitle, taskType, taskDescription}) => `<div class="col-md-6 col-lg-4">
<div class="card" id=${id}>
    <div class="card-header d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-success"><i class="fas fa-pencil-alt"></i></button>
        <button type="button" id=${id} class="btn btn-outline-danger" onclick="deleteCard.apply(this, arguments)"><i class="fas fa-trash-alt" id=${id} onclick="deleteCard.apply(this, arguments)"></i></button>
    </div>
    <img src=${imageUrl} class="card-img-top" alt="card_image" />
    <div class="card-body">
        <h5 class="card-title">${taskTitle}</h5>
        <p class="card-text">${taskDescription}</p>
        <span class="badge bg-primary">${taskType}</span>
    </div>
    <div class="card-footer text-muted">
        <button type="button" class="btn btn-outline-primary float-end">Open task</button>
    </div>
</div>
</div>`;

const loadInitialTaskCards = () => {
    //access localstorage
    const getInitialData = localStorage.getItem("tasky");
    if(!getInitialData) return;
    //convert stringified-object to object
    const { cards } = JSON.parse(getInitialData);
    //map around the array to generate HTML card and inject it to DOM
    cards.map((cardObject) => {
        const createNewCard = newCard(cardObject);
        taskContainer.insertAdjacentHTML("beforeend", createNewCard);
        globalStore.push(cardObject);
    });
};

const updatedLocalStorage = () => {
    localStorage.setItem("tasky", JSON.stringify({cards: globalStore}));
};

const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`, // provides unique number for card id = number (in miliseconds)
        imageUrl: document.getElementById("imageurl").value,//only need value not the element
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
    };
    const createNewCard = newCard(taskData);
    
    //inserting adjacent html in parent container before end
    taskContainer.insertAdjacentHTML("beforeend", createNewCard);

    globalStore.push(taskData);
    updatedLocalStorage();
};

//delete cards
const deleteCard = (event) => {
    //id 
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;
    // search globalStore array, then remove the object which matches with the id
    globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID);
    //access dom and remove elements and inject updated cards
    updatedLocalStorage();
    //access dom
    if(tagname === "BUTTON"){
        return event.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            event.target.parentNode.parentNode.parentNode// col-lg-4
        );
    }
    return event.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        event.target.parentNode.parentNode.parentNode.parentNode// col-lg-4
    );
};