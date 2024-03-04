form.addEventListener("submit", () => {
    const patientRegister = {
        email: email.value,
        password: password.value,
        first_name: first_name.value,
        last_name: last_name.value,
        phoneNum: phoneNum.value,
        blood_type: blood_type.value
    }

    fetch("/api/patientRegister", {
        method: "POST",
        body: JSON.stringify(patientRegister),
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
            success.innerText = data.success;
        }
    })
})