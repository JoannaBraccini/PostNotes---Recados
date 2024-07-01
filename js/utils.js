const qSelector = (element) => document.querySelector(element)

function checkUser() {
    const userId = JSON.parse(localStorage.getItem("user")).id
    if (!userId) {
        alert('Faça login!')
        return window.location.href = 'login.html'
    }
}

function toggleMode() {
    console.log("Toggle Mode function called");
    const html = document.documentElement
    html.classList.toggle("dark")
}

function showLoading(show, tag) {
    const btn = qSelector(tag)
    const prevText = qSelector(tag).innerHTML

    if(show) {
        btn.setAttribute('disabled', true)
        btn.innerHTML = `
        <span class="loading"></span>
        <span role="status">Aguarde</span>
        `
    } else {
        btn.removeAttribute('disabled')
        btn.innerText = prevText
    }
}

function showLoadingNotes(show) {
    const listNotes = qSelector('.popup-box')

    if (show) {
        listNotes.innerHTML = `
        <div class="d-flex align-items-center text-center justify-content-center gap-1">
            <h5>Buscando seus recados</h5>
            <span class="loading"></span>
            </div>
        </div>
        `
    } else {
        listNotes.innerHTML = ''
    }
}

function alertToast(){
    
}