const qSelector = (element) => document.querySelector(element)

const loggedUser = JSON.parse(localStorage.getItem("user"))
const email = localStorage.getItem("user.email")
const noteId = localStorage.getItem("message.id")

const addBox = qSelector(".add-box")
const popupBox = qSelector(".popup-box")
const popupTitle = popupBox.querySelector("header p")
const closeIcon = popupBox.querySelector("header i")
const titleTag = popupBox.querySelector("input")
const descTag = popupBox.querySelector("textarea")
const addBtn = popupBox.querySelector("button")
const editBtn = qSelector("#edit-btn")

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]

// const notes = JSON.parse(localStorage.getItem("notes") || "[]")
let isUpdate = false
let updateId

function checkUser() {   

    if (!loggedUser) {
        window.location.href = 'login.html'
        return
    }
}

function toggleMode() {
    const html = document.documentElement
    html.classList.toggle("dark")
}

// function showNotes() {
//     document.querySelectorAll(".note").forEach(note => note.remove())
//     notes.forEach((note, index) => {
//         let liTag = `
//         <li class="note">
//             <div class="details">
//                 <p>${note.title}</p>
//                 <span>${note.description}</span>
//             </div>
//             <div class="bottom-content">
//                 <span>${note.date}</span>
//                 <div class="settings">
//                     <i class="fa-solid fa-ellipsis"></i>
//                     <ul class="menu">
//                         <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="fa-solid fa-pen"></i>Editar</li>
//                         <li onclick="deleteNote(${index})"><i class="fa-solid fa-trash-can"></i>Excluir</li>
//                     </ul>
//                 </div>
//             </div>
//         </li>
//         `
//         addBox.insertAdjacentHTML('afterend', liTag)
//     });
// }

async function listNotes() {
    try {        
        const response = await api.get(`/message/:email`, {params: email})
        const getNotes = response.data.data.messages

        for (let i = 0; i < getNotes.length; i++) {
            let newNote = `
            <li class="note">
                <div class="details">
                    <p>${response[i].title}</p>
                    <span>${response[i].description}</span>
                </div>
                <div class="bottom-content">
                    <span>${response[i].date}</span>
                    <div class="settings">
                        <i class="fa-solid fa-ellipsis"></i>
                        <ul class="menu">
                            <li onclick="updateNote(${response[i].id}, '${response[i].title}', '${response[i].description}')"><i class="fa-solid fa-pen"></i>Editar</li>
                            <li onclick="deleteNote(${response[i].id})"><i class="fa-solid fa-trash-can"></i>Excluir</li>
                        </ul>
                    </div>
                </div>
            </li>
            `
            addBox.insertAdjacentHTML('afterend', newNote)
        }
    } catch (error) {
        console.error(error.message)
    }
}

// addBtn.addEventListener("click", (e) => {
//     e.preventDefault()
//     let noteTitle = titleTag.value
//     let noteDesc = descTag.value

//     if (noteTitle || noteDesc) {
//         let dateObj = new Date()
//         let day = dateObj.getDate()
//         let month = months[dateObj.getMonth()]
//         let year = dateObj.getFullYear()

//         let noteInfo = {
//             title: noteTitle, description: noteDesc, date: `${day} de ${month}, ${year}`
//         }
        
//         if(!isUpdate) {
//             notes.push(noteInfo)
//         } else {
//             isUpdate = false
//             notes[updateId] = noteInfo
//         }

//         localStorage.setItem("notes", JSON.stringify(notes))      
//         closeIcon.click()
//         showNotes()
//     }    
// })

async function createNote(title, description){
    try {
        let noteTitle = titleTag.value
        let noteDesc = descTag.value

        const bodyData = {
            title: noteTitle,
            description: noteDesc
        }

        const response = await api.post('/message/:email', {
            title: noteTitle,
            description: noteDesc}, 
            {params: email})
    
        if (noteTitle || noteDesc) {
            let dateObj = new Date()
            let day = dateObj.getDate()
            let month = months[dateObj.getMonth()]
            let year = dateObj.getFullYear()
            let noteInfo = {
                            title: noteTitle, description: noteDesc, date: `${day} de ${month}, ${year},`, id: noteId
                        }
                        
    
            localStorage.setItem("note", JSON.stringify(noteInfo))      
            closeIcon.click()
            showNotes()
        }    
        alert(response.data.message)
        localStorage.setItem("note", JSON.stringify(bodyData))
        formNotes.reset()
        
        //validação redundante
        if(!response.data.success){
            alert(response.data.message)
        }

    } catch (error) {
        console.error(error)
        alert(error.response.data.message)
    }
}

// function updateNote(noteId, title, description) {
//     isUpdate = true
//     updateId = noteId
//     addBox.click()
//     titleTag.value = title
//     descTag.value = description
//     addBtn.innerText = "Atualizar"
//     popupTitle.innerText = "Atualizar Recado"
// }

async function editNote(title, description){
    try {
        const bodyData = {
            title,
            description
        }        
        isUpdate = true
        updateId = localStorage.getItem.parse("")
        addBox.click()
        titleTag.value = title
        descTag.value = description
        addBtn.innerText = "Atualizar"
        popupTitle.innerText = "Atualizar Recado"

        const response = await api.put('/message/:id', {params: updateId})
        localStorage.setItem("note", JSON.stringify(bodyData))       
        

    } catch (error) {
        console.error(error.message)
        alert(error.message)
    }
}

// function deleteNote(noteId) {
//     let confirmDel = confirm("Excluir recado?")
//     if(!confirmDel) return    
//     notes.splice(noteId, 1)
//     localStorage.setItem("notes", JSON.stringify(notes))
//     showNotes()
// }

async function deleteNote(id){
}

checkUser()
listNotes()

formNotes.addEventListener('submit', function(e){
    e.preventDefault()

    const title = e.target.title.value
    const description = e.target.description.value

    createNote(title, description)
})

qSelector("#logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user")
})

btnEdit.addEventListener('click', function(e){
    e.preventDefault()

    const title = e.target.title.value
    const description = e.target.description.value

    editNote(title,description)
})

btnDelete.addEventListener('click', function(e){
    e.preventDefault()
    deleteNote()
})

document.getElementById("#sair").addEventListener('click', ()=>{
    localStorage.removeItem("user")
})

addBox.addEventListener("click", () => {
    titleTag.focus()
    popupBox.classList.add("show")
    })
        
closeIcon.addEventListener("click", () => {
    isUpdate = false
    titleTag.value = ""
    descTag.value = ""
    addBtn.innerText = "Salvar"
    popupTitle.innerText = "Criar novo Recado"
    popupBox.classList.remove("show")
})

window.onload = listNotes()