const dataBase = firebase.firestore()
const taskContainer = document.querySelector("#tasks-container")
const taskForm = document.querySelector("#task-form");
let editStatus = false;
let id = ""

const saveTask = async (title, description)=>{
  dataBase.collection('tasks').doc().set({
    title:title,
    description: description
  })
}
//se obtienen datos una sola vez cuando lo solicitemos
// const getTasks = async () =>  dataBase.collection('tasks').get();
//los datos se muestran cuando ve una modificación en la base de datos
const getTask = async (id)=> dataBase.collection("tasks").doc(id).get();

const onGetTasks = (callback) => dataBase.collection("tasks").onSnapshot(callback)

const deleteTask = id => dataBase.collection("tasks").doc(id).delete()
const updateTask = (id,updateTask) => dataBase.collection("tasks").doc(id).update(updateTask)


window.addEventListener("DOMContentLoaded",async (e)=>{
  
  onGetTasks((querySnapshot) => {
    taskContainer.innerHTML = "";

    querySnapshot.forEach(doc => {
      let task = doc.data()
      task.id = doc.id

      taskContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
        <h3 class="h5">${task.title}</h3>
        <p>${task.description}</p>
        <div>
          <button class="btn btn-primary btn-delete" data-id="${task.id}"> Delete </button>
          <button class="btn btn-secondary btn-edit" data-id="${task.id}"> Edit </button>
        </div>
      </div>`;
    });

    const btnsDelete = document.querySelectorAll(".btn-delete");
    btnsDelete.forEach(btn=>{
      btn.addEventListener("click",(e)=>{deleteTask(e.target.dataset.id);})
    })

    const btnsEdit = document.querySelectorAll(".btn-edit");
    btnsEdit.forEach(btn=>{
      btn.addEventListener("click",async (e)=>{
        editStatus = true;
        id = e.target.dataset.id
        let doc = await getTask(e.target.dataset.id)
        
        taskForm["task-title"].value = doc.data().title;
        taskForm["task-description"].value = doc.data().description;
        taskForm["btn-task-form"].innerText = "Update"
        
      })
    })
  })

})

taskForm.addEventListener("submit", async (e) =>{
  e.preventDefault()

  const taskTitle = taskForm['task-title'];
  const taskDescription = taskForm['task-description'];

  if(!editStatus){
    await saveTask(taskTitle.value,taskDescription.value);
  }else{
    await updateTask(id, {
      title: taskTitle.value,
      description: taskDescription.value
    });

    editStatus = false;
    taskForm["btn-task-form"].innerText = "Save"
    id = ""

  }

  taskForm.reset();
  taskTitle.focus();

  
})

