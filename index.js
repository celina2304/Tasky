//parent element to store cards
const taskContainer = document.querySelector(".task__container");
console.log(taskContainer);

//Global store
let globalStore = []; // save cards in a list

const newCard = ({id, imageUrl, taskTitle, taskType, taskDescription}) => `<div class="col-md-6 col-lg-4">
<div class="card" id=${id}>
    <div class="card-header d-flex justify-content-end gap-2">
    <button type="button" id=${id} class="btn btn-outline-success" onclick="editCard.apply(this, arguments)"><i class="fas fa-pencil-alt" id=${id} onclick="editCard.apply(this, arguments)"></i></button>
    <button type="button" id=${id} class="btn btn-outline-danger" onclick="deleteCard.apply(this, arguments)"><i class="fas fa-trash-alt" id=${id} onclick="deleteCard.apply(this, arguments)"></i></button>
    </div>
    <img src=${imageUrl} class="card-img-top" alt="card_image" />
    <div class="card-body">
        <h5 class="card-title">${taskTitle}</h5>
        <p class="card-text">${taskDescription}</p>
        <span class="badge bg-primary">${taskType}</span>
    </div>
    <div class="card-footer text-muted">
        <button type="button" id=${id} class="btn btn-outline-primary float-end">Open task</button>
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

//update localstorage
const updatedLocalStorage = () => {
    // key value pair -> cards: [list of cards];
    localStorage.setItem("tasky", JSON.stringify({cards: globalStore}));
};

const saveChanges = () => {
    //creating object containing data of modal
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

    globalStore.push(taskData);//push new card data to local storage
    updatedLocalStorage();
};

//delete cards
const deleteCard = (event) => {
    //id 
    event = window.event;
    const targetID = event.target.id;//id of card
    const tagname = event.target.tagName;
    // search globalStore array, then remove the object which matches with the id
    globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID);
    //update localstorage with new cards(excluding deleted card)
    updatedLocalStorage();
    //access dom
    if(tagname === "BUTTON"){
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode// col-lg-4
        );
    }
    return taskContainer.removeChild(
        event.target.parentNode.parentNode.parentNode.parentNode// col-lg-4
    );
};

//edit card
const editCard = (event) => {
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;
    //parentelement points to card
    if(tagname === "BUTTON"){
        parentElement = event.target.parentNode.parentNode;
    }else{
        parentElement = event.target.parentNode.parentNode.parentNode;
    }
    //access card body which is index 5 of the parent card node
    //(parent card contains nodes (text, header, footer etc))
    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];

    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    submitButton.innerHTML = "Save Changes";//changes text (open task) -> (save changes)
    submitButton.setAttribute("onclick","saveEditChanges.apply(this, arguments)");
};

const saveEditChanges = (event) => {
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;

    if(tagname === "BUTTON"){
        parentElement = event.target.parentNode.parentNode;
    }else{
        parentElement = event.target.parentNode.parentNode.parentNode;
    }
    let taskTitle = parentElement.childNodes[5].childNodes[1];
    let taskDescription = parentElement.childNodes[5].childNodes[3];
    let taskType = parentElement.childNodes[5].childNodes[5];
    let submitButton = parentElement.childNodes[7].childNodes[1];
    
    const updatedData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };
    globalStore = globalStore.map((task) => {
        if(task.id === targetID){
            return {
                id: task.id,
                imageUrl: task.imageUrl,
                taskTitle: updatedData.taskTitle,
                taskType: updatedData.taskType,
                taskDescription: updatedData.taskDescription,
            };
        }
        return task;
    });
    updatedLocalStorage();
    
    //content no longer editable
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    submitButton.innerHTML = "Open Task";
    submitButton.removeAttribute("onclick");
};
