form.addEventListener("submit", () => {
    const adminLogin = {
        id: id.value,
        email: email.value,
        password: password.value
    }

    const success = document.getElementById("AdminSuccess");
    const error = document.getElementById("error");

fetch("/api/adminLogin", {
    method: "POST",
    body: JSON.stringify(adminLogin),
    headers: {
        "Content-Type": "application/json"
    }
}).then(res => res.json())
    .then(data => {
        if(data.status == "error"){
            console.log('Error:', error);
            success.style.display = "none";
            error.style.display = "block";
            error.innerText = data.error;
        }else{
            console.log('Success:', data);
            error.style.display = "none";
            success.style.display = "block";
            success.innerText = data.AdminSuccess;
        }
    })
})