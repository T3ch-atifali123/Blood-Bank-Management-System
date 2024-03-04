form.addEventListener("submit", () => {
    const register = {
        email: email.value,
        password: password.value,
        first_name: first_name.value,
        last_name: last_name.value,
        phoneNum: phoneNum.value,
        disease:disease.value,
        blood_type: blood_type.value
    }

    fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(register),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
    .then(data => {
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