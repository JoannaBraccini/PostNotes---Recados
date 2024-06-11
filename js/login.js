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
const passwordConfirm = qSelector("#password-confirm").value
const emailLogin = qSelector("#email").value
const passwordLogin = qSelector("#password").value

//LOGIN
async function login(email, password) {
  try {
    const bodyData = { email, password }
    const response = await api.post('/login', bodyData)
    const loginData = response.data.data

    formLogin.reset()
    localStorage.setItem("user", JSON.stringify(loginData))

    alert(response.data.message)
    window.location.href = 'index.html'

  } catch (error) {
    alert(error.response.data.message)
  }
}

formLogin.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = e.target.email.value
  const password = e.target.password.value
  login(email, password)
})

//SIGNUP
async function signup(name, email, password, passwordConfirm) {
  try {
    if (password !== passwordConfirm) {      
      alert('As senhas devem ser idênticas.')
      return
    }

    const bodyData = { name, email, password }
    const response = await api.post('/signup', bodyData)    

    alert(response.data.message)
    formSignup.reset()
    loginBtn.click()

  } catch (error) {
      loginBtn.click()
      alert(error.response.data.message)
  }
}

formSignup.addEventListener('submit', (e) => {
  e.preventDefault()
  const name = e.target.username.value
  const email = e.target['email-sign'].value
  const password = e.target['password-sign'].value
  const passwordConfirm = e.target['password-confirm'].value
  signup(name, email, password, passwordConfirm)
})

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