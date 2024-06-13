const formNotes = qSelector("#form-notes")
const addBox = qSelector(".add-box")
const popupBox = qSelector(".popup-box")
const popupTitle = popupBox.querySelector("header p")
const closeIcon = popupBox.querySelector("header i")
const titleTag = popupBox.querySelector("input")
const descTag = popupBox.querySelector("textarea")
const addBtn = popupBox.querySelector("button")
const logoutBtn = qSelector("#logout-btn")

let updateId = null

window.addEventListener("DOMContentLoaded", () => {
    listNotes()
})

addBox.addEventListener("click", () => {
    titleTag.focus()
    popupBox.classList.add("show")
    resetPopup()
})

closeIcon.addEventListener("click", () => {
    resetPopup()
    popupBox.classList.remove("show")
})

formNotes.addEventListener('submit', (e) => {
    e.preventDefault()
    if (updateId) {
        updateNote()
    } else {
        createNote()
    }
})

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.removeItem("user")
    window.location.href = 'login.html'
})

function checkStorageData() {
    if (!localStorage.getItem("user")) {
        window.location.href = "login.html"
    }
}

//LISTAR RECADOS
async function listNotes() {
    try {        

        checkUser()
        const email = checkUser()//buscar a resposta retornada da função
        const user = qSelector("#user-name")
        user.innerHTML = `<i class="fa-regular fa-circle-user"></i> ${JSON.parse(localStorage.getItem("user")).name}`
        document.querySelectorAll(".note").forEach(note => note.remove())//para apagar repetições

        const response = await api.get(`/message/${email}`)
        const getNotes = response.data.data        

        getNotes.forEach(note => {
            const date = note.date.replace('2024', '2024 &nbsp; &nbsp; &nbsp; &nbsp;')//adiciona os espaços no html
            const newNote = `
                <li class="note" data-id="${note.id}">
                    <div class="details">
                        <p class="note-title">${note.title}</p>
                        <span class="note-description">${note.description}</span>
                    </div>
                    <div class="bottom-content">
                        <span>${date}</span>
                        <div class="settings">
                            <i class="fa-solid fa-ellipsis"></i>
                            <ul class="menu">
                                <li class="update-note">
                                    <i class="fa-solid fa-pen"></i>Editar
                                </li>
                                <li class="delete-note">
                                    <i class="fa-solid fa-trash-can"></i>Excluir
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            `     
            addBox.insertAdjacentHTML('afterend', newNote) //adiciona onde quiser ao invés de apenas dentro como innerHTML
        })

        addEventListeners()
    } catch (error) {
        alert(error.response.data.message)        
    }
}

//listeners para preparar todos os botões adicionados no html e enviar para o endpoint
function addEventListeners() {
    document.querySelectorAll(".update-note").forEach(button => {
        button.addEventListener("click", (e) => {
            const noteData = e.target.closest(".note")//closest busca o elemento pai mais próximo com a classe 'note' e retorna todo conteúdo
            const noteId = noteData.dataset.id //busca o data-id
            const title = noteData.querySelector(".note-title").textContent //só se usa .value para inputs
            const description = noteData.querySelector(".note-description").textContent
            openUpdatePopup(noteId, title, description)
        })
    })

    document.querySelectorAll(".delete-note").forEach(button => {
        button.addEventListener("click", (e) => {
            const noteData = e.target.closest(".note")
            const noteId = noteData.dataset.id
            deleteNote(noteId)
        })
    })
}

function openUpdatePopup(noteId, title, description) {
    addBox.click()
    titleTag.value = title
    descTag.value = description
    addBtn.innerText = "Atualizar"
    popupTitle.innerText = "Atualizar Recado"
    updateId = noteId
}

function resetPopup() {
    titleTag.value = ""
    descTag.value = ""
    addBtn.innerText = "Salvar"
    popupTitle.innerText = "Criar novo Recado"
    updateId = null
}

//CRIAR RECADO
async function createNote(){
    try {

        checkUser()
        const email = checkUser()
        
        let noteTitle = titleTag.value
        let noteDesc = descTag.value
        
        if(!noteTitle || noteTitle.length < 1){
            return alert('Por favor, insira um título válido.')
            }        
    
        if (!noteDesc || noteDesc.length < 1) {
            return alert('Por favor, insira uma descrição válida.')
        }

        const bodyData = {
            title: noteTitle,
            description: noteDesc
        }

        const response = await api.post(`/message/${email}`, bodyData)
        
        formNotes.reset()
        alert(response.data.message)
        closeIcon.click()
        listNotes()

    }catch (error) {
        alert(error)
    }    
}

//ATUALIZAR RECADO
async function updateNote(){
    try {   
        const noteTitle = titleTag.value
        const noteDesc = descTag.value

        const bodyData = {
            title: noteTitle,
            description: noteDesc
        }

        const response = await api.put(`/message/${updateId}`, bodyData)
        alert(response.data.message)

        formNotes.reset()
        closeIcon.click()
        listNotes()
        updateId = null

    } catch (error) {
        alert(error.response.data.message)
    }
}

//EXCLUIR RECADO
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