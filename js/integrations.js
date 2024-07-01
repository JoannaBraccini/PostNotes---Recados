const api = axios.create({
    baseURL: 'https://postnotes-api.onrender.com'
});

//as funções dependentes da api vêm aqui: signup, login, crud recados

//SIGNUP-post
async function signup(name, email, password) {
    try {  
      const bodyData = { name, email, password }
      const response = await api.post('/signup', bodyData)

      return response.data
  
    } catch (error) {
      return error.response.data
    }
  }

//LOGIN-post
async function login(email, password) {
    try {
      const bodyData = { email, password }
      const response = await api.post('/login', bodyData)

      localStorage.setItem("user", JSON.stringify(response.data.data))
  
      return response.data
  
    } catch (error) {
      return error.response.data
    }
}

//BUSCAR RECADOS-get
async function getNotes(userId, page, limit) {
    try {
        const config = {
            headers: {
                Authorization: userId
            }
        }
        const resposta = await api.get(`/message?page=${page}&limit=${limit}`, config)

        return resposta.data

        
    } catch (error) {
        return error.response.data
    }
}

//CRIAR RECADO - post
async function createNote(userId, title, description) {
    try {
        const bodyData = {
            title: title,
            description: description
        }

        const config = {
            Headers: {
                Authorization: userId
            }
        }

        const response = await api.post(`/message`, bodyData, config)
        return response.data

    } catch (error) {
        return error.response.data
    }
}

//ATUALIZAR RECADO
async function updateNote(updateId, title, description){
    try {  
        const bodyData = {
            title: title,
            description: description
        }

        const response = await api.put(`/message/${updateId}`, bodyData)
        return response.data

    } catch (error) {
        return error.response.data
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