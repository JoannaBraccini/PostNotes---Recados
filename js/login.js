const qSelector = (element) => document.querySelector(element)

const formLogin = qSelector("form.login")
const formSignup = qSelector("form.signup")
const loginBtn = qSelector("label.login")
const signupBtn = qSelector("label.signup")
const signupLink = qSelector(".signup-link a")
const loginText = qSelector(".title-text .login")
const signupText = qSelector(".title-text .signup")

const main = qSelector(".main")
const usernameInput = qSelector("#username").value
const emailInput = qSelector("#email-sign").value
const passwordInput = qSelector("#password-sign").value
const passwordConfirm = qSelector("#confirm-password").value
const emailLogin = qSelector("#email").value
const passwordLogin = qSelector("#password").value

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

function openPopup(alert) {
  main.classList.add("close-on-popup")  
  welcomePopup.classList.add("open-popup")
}

function closePopup() {
  welcomePopup.classList.remove("open-popup")
  main.classList.remove("close-on-popup")
}

async function login(emailLogin, passwordLogin) {
  try {

      const bodyData = {
          email: emailLogin,
          password: passwordLogin
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

async function signup(usernameInput, emailInput, passwordInput) {
  try {

      if (passwordInput !== passwordConfirm) {
        openPopup()
        return
      }

      const bodyData = {
          name: usernameInput,
          email: emailInput,
          password: passwordInput
      }

      const response = await api.post('/signup', bodyData)
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