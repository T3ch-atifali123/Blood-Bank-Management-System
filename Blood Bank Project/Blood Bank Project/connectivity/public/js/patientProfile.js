// Wait for the DOM to fully load before adding the event listener
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const email = document.getElementById('email');
    const units = document.getElementById('units');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const patientProfile = {
            email: email.value,
            units: units.value
        };

        fetch("/patientProfile", {  
            method: "POST",
            body: JSON.stringify(patientProfile),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            const success = document.getElementById('patientSuccess');
            const error = document.getElementById('error');
            if (data.status === "error") {
                success.style.display = "none";
                error.style.display = "block";
                error.innerText = data.error;
            } else {
                error.style.display = "none";
                success.style.display = "block";
                success.innerText = data.patientSuccess;
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
    });
});
