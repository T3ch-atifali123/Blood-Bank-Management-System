form.addEventListener("submit", () => {
    const patientLogin = {
        email: email.value,
        password: password.value
    }

fetch("/api/patientLogin", {
    method: "POST",
    body: JSON.stringify(patientLogin),
    headers: {
        "Content-Type": "application/json"
    }
}).then(res => res.json())
    .then(data => {
        const success = document.getElementById('patientSuccess');
            const error = document.getElementById('error');
        if(data.status == "error"){
            success.style.display = "none";
            error.style.display = "block";
            error.innerText = data.error;
        }else{
            error.style.display = "none";
            success.style.display = "block";
            success.innerText = data.patientSuccess;
        }
    })
})