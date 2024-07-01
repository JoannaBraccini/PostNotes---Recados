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
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault()

  if(!formLogin.checkValidity()) {
    e.stopPropagation()
  }

  formLogin.classList.add("was-validated")

  const email = e.target.email.value
  const password = e.target.password.value
  
  showLoading(true,'.spinner-btn')
  const response = await login(email, password)
  showLoading(false, '.spinner-btn')

  if(!response.success) {
    return alertToast(response.message, 'danger')
  }
  alertToast(response.message, 'success')
  formLogin.reset()
  setTimeout(() => {
    window.location.href = 'index.html'
  }, 1500)
})

//SIGNUP
formSignup.addEventListener('submit', async (e) => {
  e.preventDefault()

  if(!formSignup.checkValidity()) {
    e.stopPropagation()
    return formSignup.classList.add('was-validated')
  }

  const name = e.target['username'].value
  const email = e.target['email-sign'].value
  const password = e.target['password-sign'].value
  const passwordConfirm = e.target['password-confirm'].value
  
  if( password !== passwordConfirm) {
    return alertSign(true, 'danger', 'As senhas não conferem!')
  }

  showLoading(true)
  const response = await signup(name, email, password)
  showLoading(false)

  if(!response.success) {
    return alertSign(true, 'danger', response.message)
  }
  alertSign(true, 'succes', response.message)

  formSignup.reset()
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