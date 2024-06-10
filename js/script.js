const qSelector = (element) => document.querySelector(element)
const switchContainer = document.querySelector("#switch")

let loggedUser
let emailUser

async function checkUser() {
    const response = await api.get(`/users`)
    const users = response.data.data
    
    users.forEach(data => {
        console.log(data)
    })

    if(users.find(user => user.email === emailUser)) {
        return true
    } else {
        window.location.href = 'login.html'
        return
    }
    
}

function toggleMode() {
    const html = document.documentElement
    html.classList.toggle("dark")
}

switchContainer.addEventListener("click", toggleMode)