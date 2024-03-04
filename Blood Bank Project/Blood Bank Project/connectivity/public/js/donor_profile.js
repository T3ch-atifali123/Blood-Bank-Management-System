// Wait for the DOM to fully load before adding the event listener
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const email = document.getElementById('email');
    const units = document.getElementById('units');
    const success = document.getElementById('success');
    const error = document.getElementById('error');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission

        const donor_profile = {
            email: email.value,
            units: units.value
        };

        fetch("/donor_profile", {  
            method: "POST",
            body: JSON.stringify(donor_profile),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            const success = document.getElementById('success');
            const error = document.getElementById('error');
            if (data.status === "error") {
                success.style.display = "none";
                error.style.display = "block";
                error.innerText = data.error;
            } else {
                error.style.display = "none";
                success.style.display = "block";
                success.innerText = data.success;
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
    });
});
