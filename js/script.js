const qSelector = (element) => document.querySelector(element)

function checkUser() {
    const email = JSON.parse(localStorage.getItem("user")).email
    if (!email) {
        alert('Faça login!')
        return window.location.href = 'login.html'
    }
    return email
}

function toggleMode() {
    console.log("Toggle Mode function called");
    const html = document.documentElement
    html.classList.toggle("dark")
}