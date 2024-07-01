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
let page = 1
let limit = 8

window.addEventListener("DOMContentLoaded", () => {
    try {
        const userId = JSON.parse(localStorage.getItem("user")).id
        return userId
            
    } catch (error) {
        alert('Faça login!')
        return window.location.href = 'login.html'
    }
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

formNotes.addEventListener('submit', async (e) => {
    e.preventDefault()

    const title = titleTag.value
    const description = descTag.value

    if (updateId) {
        showLoading(true,'.spinner-btn')
        const response = await updateNote(title, description)
        showLoading(false, '.spinner-btn')
        
        if(!response.success) {
            return alertToast(response.message, 'danger')
          }
          alertToast(response.message, 'success')       
          updateId = null             
        
    } else {
        const userId = checkUser()
        showLoading(true,'.spinner-btn')
        const response = await createNote(title, description, userId)
        showLoading(false, '.spinner-btn')
        if(!response.success) {
            return alertToast(response.message, 'danger')
          }
          alertToast(response.message, 'success')         
    }

    formNotes.reset()        
    closeIcon.click()
    listNotes()
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

    const userId = checkUser()
    showLoadingNotes(true)
    const response = await getNotes(userId, page, limit)
    showLoadingNotes(false)

    if(!response.success) {
        alertToast(response.message, 'danger')
        return logoutBtn.click()
    }

    showNotes(response.data.totalNotes)
    createPagination(response.data.totalPages)    
}

//MOSTRAR RECADOS NO HTML
function showNotes(notes) {
    const user = qSelector("#user-name")
    user.innerHTML = `<i class="fa-regular fa-circle-user"></i> ${JSON.parse(localStorage.getItem("user")).name}`

    if(notes.length === 0) {
        alertToast('Nenhum recado encontrado!', 'danger')
    }
    document.querySelectorAll(".note").forEach(note => note.remove())//para apagar repetições      

    notes.forEach(note => {
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

function createPagination(totalNotes) {
    const totalPages = Math.ceil(totalNotes / limit)
    const containerPagination = qSelector('#pagination')
  
    containerPagination.innerHTML = `
      <li class="page-item">
        <a class="page-link" id="prev-link">Voltar</a>
      </li>
    `
  
    for(let i = 1; i <= totalPages; i++){
      if(page === i) {
        containerPagination.innerHTML += `
          <li class="page-item active">
            <a class="page-link">${i}</a>
          </li>
        `
      } else {
        containerPagination.innerHTML += `
        <li class="page-item">
          <a class="page-link">${i}</a>
        </li>
      `
      }    
    }
  
    containerPagination.innerHTML = `
      <li class="page-item">
        <a class="page-link" id="next-link">Próxima</a>
      </li>
    `
  
    const links = document.querySelectorAll('.page-link')
  
    links.forEach((link) => {
      link.addEventListener('click', async () => {
  
        switch (link.id) {
          case 'prev-link':
            page--          
            break;
          case 'next-link':
            page++
            break;      
          default:
            page = Number(link.innerText)
            break;
        }
  
        await listNotes()
      })
    })
  
    const prevLink = document.getElementById('prev-link')
    const nextLink = document.getElementById('next-link')
  
    if(page === 1) {
      prevLink.classList.add('disabled')
    } else {
      prevLink.classList.remove('disabled')
    }
  
    if(page === totalPages) {
      nextLink.classList.add('disabled')
    } else {
      nextLink.classList.remove('disabled')
    }
  
}