document.addEventListener("DOMContentLoaded", () => {
    fetchAndRenderAdminData();
    fetchDonorCount();
    fetchRequestCount();
    fetchApprovedRequestCount();
    fetchPatientCount();
    const bloodRequestsButton = document.getElementById("bloodRequestButton");
    const donationRequestButton = document.getElementById("donationRequestButton");
    const donationRequestsTable = document.getElementById("donationRequestsTable");
    const bloodRequestsTable = document.getElementById("bloodRequestsTable");

    // Event listener for Donation Request button
    donationRequestButton.addEventListener("click", () => {
        donationRequestsTable.style.display = "table"; // Show the donation requests table
        console.log("Donation Request button clicked");
    });

    bloodRequestsButton.addEventListener("click", () => {
        // Fetch blood requests from the server

        bloodRequestsTable.style.display = "table";
        fetch("/admin/blood_requests")
            .then(response => response.json())
            .then(data => {
                console.log("Data received from server:", data);
                renderBloodRequests(data.bloodRequests);
            })
            .catch(error => console.error("Error fetching blood requests:", error));
    });

    // Fetch donation requests from the server
    fetch("/admin/donation_requests")
        .then(response => response.json())
        .then(data => {

            renderDonationRequests(data.donationRequests);
        })
        .catch(error => console.error("Error fetching donation requests:", error));
});

function renderDonationRequests(donationRequests) {
    const tableBody = document.getElementById("donationRequestsTableBody");
    console.log(tableBody);


    donationRequests.forEach(request => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = request.DrequestID; 
        row.appendChild(idCell);

        const donorIdCell = document.createElement("td");
        donorIdCell.textContent = request.DonorID;
        row.appendChild(donorIdCell);


        const statusCell = document.createElement("td");
        statusCell.textContent = request.Status;
        row.appendChild(statusCell);

        const diseaseCell = document.createElement("td");
        diseaseCell.textContent = request.disease;
        row.appendChild(diseaseCell);

        const actionCell = document.createElement("td");

        // Add buttons for approve and reject
        const approveButton = createButton("Approve", "btn btn-success", () => handleAction(request.DrequestID, "approve", "donation"));
        const rejectButton = createButton("Reject", "btn btn-danger", () => handleAction(request.DrequestID, "reject", "donation"));

        actionCell.appendChild(approveButton);
        actionCell.appendChild(rejectButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

function renderBloodRequests(bloodRequests) {
    const tableBody = document.getElementById("bloodRequestsTableBody"); 

    bloodRequests.forEach(request => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = request.BrequestID; 
        row.appendChild(idCell);

        const patientIdCell = document.createElement("td");
        patientIdCell.textContent = request.PatientID; 
        row.appendChild(patientIdCell);

        const bloodGrpCell = document.createElement("td");
        bloodGrpCell.textContent = request.BloodGroup; 
        row.appendChild(bloodGrpCell);

        const unitsCell = document.createElement("td");
        unitsCell.textContent = request.Unit; 
        row.appendChild(unitsCell);



        const statusCell = document.createElement("td");
        statusCell.textContent = request.Status;
        row.appendChild(statusCell);

        const actionCell = document.createElement("td");

        // Add buttons for approve and reject
        const approveButton = createButton("Approve", "btn btn-success", () => handleAction(request.BrequestID, "approve", "blood"));
        const rejectButton = createButton("Reject", "btn btn-danger", () => handleAction(request.BrequestID, "reject", "blood"));

        actionCell.appendChild(approveButton);
        actionCell.appendChild(rejectButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

function fetchAndRenderAdminData() {
    fetch("/admin/admin_data")
        .then(response => response.json())
        .then(data => {
            renderAdminData(data.adminData);
        })
        .catch(error => console.error("Error fetching admin data:", error));
}

function renderAdminData(adminData) {

    const bloodStock = {};

    // Iterate through the array and populate the bloodStock object
    adminData.forEach(item => {
        const bloodGroup = item.BloodGroup;
        const unit = item.Unit;

        // Store the unit for the corresponding blood group
        bloodStock[bloodGroup] = (bloodStock[bloodGroup] || 0) + unit;
    });
    const B1 = {

        unitBplus: bloodStock['B+'] || 0,
        unitBminus: bloodStock['B-'] || 0,
        unitAplus: bloodStock['A+'] || 0,
        unitAminus: bloodStock['A-'] || 0,
        unitABplus: bloodStock['AB+'] || 0,
        unitABminus: bloodStock['AB-'] || 0,
        unitOplus: bloodStock['O+'] || 0,
        unitOminus: bloodStock['O-'] || 0,
    };

    const totalUnits = Object.values(B1).reduce((acc, value) => acc + value, 0);
    // Update the content of the element with the value from B1
    
    document.getElementById("B1unitBplusDisplay").textContent = B1.unitBplus;
    
    document.getElementById("B1unitOminusDisplay").textContent = B1.unitOminus;
    
    document.getElementById("B1unitBminusDisplay").textContent = B1.unitBminus;
    
    document.getElementById("B1unitAminusDisplay").textContent = B1.unitAminus;

    document.getElementById("B1unitOplusDisplay").textContent = B1.unitOplus;
    
    document.getElementById("B1unitABminusDisplay").textContent = B1.unitABminus;

    document.getElementById("B1unitABplusDisplay").textContent = B1.unitABplus;

    document.getElementById("B1unitAplusDisplay").textContent = B1.unitAplus;

    document.getElementById("totalUnitsDisplay").textContent = totalUnits;
}

function fetchPatientCount() {
    fetch("/admin/patient_count")
        .then(response => response.json())
        .then(data => {
            renderPatientCount(data.adminData);
        })
        .catch(error => console.error("Error fetching admin data:", error));
}

function renderPatientCount(adminData) {

    const patientCount = adminData[0]['count(*)'];

    document.getElementById("patientCountDisplay").textContent = patientCount;
}

function fetchDonorCount() {
    fetch("/admin/donor_count")
        .then(response => response.json())
        .then(data => {
            renderDonorCount(data.adminData);
        })
        .catch(error => console.error("Error fetching admin data:", error));
}

function renderDonorCount(adminData) {

    const donorCount = adminData[0]['count(*)'];

    document.getElementById("donorCountDisplay").textContent = donorCount;
}

function fetchRequestCount() {
    fetch("/admin/request_count")
        .then(response => response.json())
        .then(data => {
            renderRequestCount(data.adminData);
        })
        .catch(error => console.error("Error fetching admin data:", error));
}

function renderRequestCount(adminData) {

    const requestCount = adminData[0]['count(*)'];

    document.getElementById("requestCountDisplay").textContent = requestCount;
}

function fetchApprovedRequestCount() {
    fetch("/admin/approved_request_count")
        .then(response => response.json())
        .then(data => {
            renderApprovedRequestCount(data.adminData);
        })
        .catch(error => console.error("Error fetching admin data:", error));
}

function renderApprovedRequestCount(adminData) {

    const approvedRequestCount = adminData[0]['count(*)'];

    document.getElementById("approvedRequestCountDisplay").textContent = approvedRequestCount;
}

function createButton(label, className, onClick) {
    const button = document.createElement("button");
    button.textContent = label;
    button.className = className;
    button.addEventListener("click", onClick);
    return button;
}

function handleAction(requestId, action, requestType) {
    
    fetch(`/admin/${action}_${requestType}_request/${requestId}`, {
        method: "POST",
    })
        .then(response => {
            console.log("Server response status:", response.status);
            return response.text();
        })
        .then(message => {
            console.log("Server response message:", message);
            
        })
        .catch(error => console.error(`Error ${action}ing request:`, error));
}
