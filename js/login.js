const formLogin = document.querySelector("form.login")
const formSignup = document.querySelector("form.signup")
const loginBtn = document.querySelector("label.login")
const signupBtn = document.querySelector("label.signup")
const signupLink = document.querySelector(".signup-link a")
const loginText = document.querySelector(".title-text .login")
const signupText = document.querySelector(".title-text .signup")

const main = document.querySelector(".main")
let welcomePopup = document.querySelector(".welcome")

signupBtn.onclick = (()=>{
    formLogin.style.marginLeft = '-50%'
    loginText.style.marginLeft = '-50%'
})

loginBtn.onclick = (()=>{
    formLogin.style.marginLeft = '0%'
    loginText.style.marginLeft = '0%'
})

signupLink.onclick = (()=>{
    signupBtn.click()
    return false
})

function toggleMode() {
    const html = document.documentElement
    html.classList.toggle("dark")
}

function openPopup() {
  main.classList.add("close-on-popup")  
  welcomePopup.classList.add("open-popup")
}

function closePopup() {
  welcomePopup.classList.remove("open-popup")
  main.classList.remove("close-on-popup")
}

async function login(email, password) {
  try {
      const bodyData = {
          email,
          password
      }

      const response = await api.post('/login', bodyData)
      const loggedUser = response.data.data
      localStorage.setItem("user", JSON.stringify(loggedUser))

      formLogin.reset()
      window.location.href = 'index.html'

  } catch (error) {
      alert(error.response.message)
  }
}

formLogin.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = e.target.email.value
  const password = e.target.password.value

  login(email, password)
})