const formNotes = qSelector("#form-notes")
const addBox = qSelector(".add-box")
const popupBox = qSelector(".popup-box")
const popupTitle = popupBox.querySelector("header p")
const closeIcon = popupBox.querySelector("header i")
const titleTag = popupBox.querySelector("input")
const descTag = popupBox.querySelector("textarea")
const addBtn = popupBox.querySelector("button")
const noteListed = qSelector(".note")
const updateBtn = qSelector(".update-note")
const deleteBtn = qSelector(".delete-note")
const logoutBtn = qSelector("#logout-btn")

window.onload = listNotes

addBox.addEventListener("click", () => {
    titleTag.focus()
    popupBox.classList.add("show")
})

closeIcon.addEventListener("click", () => {
    titleTag.value = ""
    descTag.value = ""
    addBtn.innerText = "Salvar"
    popupTitle.innerText = "Criar novo Recado"
    popupBox.classList.remove("show")
})

formNotes.addEventListener('submit', (e) => {
    e.preventDefault()
    createNote()
})

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    sessionStorage.removeItem("user")
    window.location.href = 'login.html'
})

if (noteListed) {
    updateBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const noteId = e.target.id.value
        const title = e.target.title.value
        const description = e.target.description.value
        updateNote(noteId, title, description)
    })
    
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault()
        console.log(noteId)
        const noteId = e.target.id.value
        deleteNote(noteId)
    })
}

async function listNotes() {
    try {
        document.querySelectorAll(".note").forEach(note => note.remove())//para apagar repetições

        const response = await api.get(`/message/${emailUser}`)
        const getNotes = response.data.data
        
        for (let i = 0; i < getNotes.length; i++) {
            let newNote = `
            <li class="note">
                <div class="details">
                    <p>${getNotes[i].title}</p>
                    <span>${getNotes[i].description}</span>
                </div>
                <div class="bottom-content">
                    <span>${getNotes[i].date}</span>                    
                    <div class="settings">
                        <i class="fa-solid fa-ellipsis"></i>
                        <ul class="menu">
                            <li class="update-note" onclick="updateNote('${getNotes[i].id}', 
                            '${getNotes[i].title}', 
                            '${getNotes[i].description}')">
                            <i class="fa-solid fa-pen"></i>Editar</li>
                            <li class="delete-note" onclick="deleteNote('${getNotes[i].id}')">
                            <i class="fa-solid fa-trash-can"></i>Excluir</li>                            
                        </ul>
                    </div>
                </div>
            </li>
            `            
            addBox.insertAdjacentHTML('afterend', newNote)
        }
    } catch (error) {
        alert(error.response.data.message)
    }
}


async function createNote(){
    try {

        let noteTitle = titleTag.value
        let noteDesc = descTag.value

        const bodyData = {
            title: noteTitle,
            description: noteDesc
        }

        const response = await api.post(`/message/${emailUser}`, bodyData)
        const message = response.data.data

        // let notes = JSON.parse(localStorage.getItem("notes")) || []
        // notes.push({
        //     title: message.title,
        //     description: message.description,
        //     date: message.date,
        //     id: message.id
        // })

        // localStorage.setItem("notes", JSON.stringify(response.data.data))
        alert(response.data.message)

        formNotes.reset()
        closeIcon.click()
        listNotes()                

    }catch (error) {
        alert(error.response.data.message)
    }    
}

async function updateNote(noteId, title, description){
    try {      
   
        addBox.click()
        titleTag.value = title
        descTag.value = description
        addBtn.innerText = "Atualizar"
        popupTitle.innerText = "Atualizar Recado"

        const bodyData = {
            title: title,
            description: description
        }

        const response = await api.put(`/message/${noteId}`, bodyData)
        alert(response.data.message)

        formNotes.reset()
        closeIcon.click()
        listNotes()

    } catch (error) {
        alert(error.response.data.message)
    }
}

async function deleteNote(noteId){
    try {
        let confirmDel = confirm("Excluir recado?")
        if (!confirmDel) return

        const response = await api.delete(`/message/${noteId}`)
        listNotes()

        alert(response.data.message)

    } catch (error) {
        alert(error.response.data.message)
    }
}