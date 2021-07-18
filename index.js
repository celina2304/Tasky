//parent element to store cards
const taskContainer = document.querySelector(".task__container");
console.log(taskContainer);

const newCard = ({id, imageUrl, taskTitle, taskType, taskDescription}) => `<div class="col-md-6 col-lg-4">
<div class="card" id=${id}>
    <div class="card-header d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-success"><i class="fas fa-pencil-alt"></i></button>
        <button type="button" class="btn btn-outline-danger"><i class="fas fa-trash-alt"></i></button>
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
};