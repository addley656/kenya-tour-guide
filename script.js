
function showMessage() {
    alert("Welcome to Kenya Tour Guide Booking!");
}

const form = document.getElementById("bookingForm");

const bookingList = document.getElementById("bookingList");

/* Load bookings from backend */

window.onload = async function () {

    const response = await fetch("http://localhost:3000/bookings");

    const bookings = await response.json();

    bookings.forEach(function (booking) {

        displayBooking(booking);

    });

};

/* Submit Booking */

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value;

    const destination = document.getElementById("destination").value;

    const date = document.getElementById("date").value;

    const bookingData = {
        name,
        destination,
        date
    };

    const response = await fetch("http://localhost:3000/bookings", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(bookingData)

    });

    const data = await response.json();

    displayBooking(data.booking);

    form.reset();

});

/* Display Booking */

function displayBooking(booking) {

    const div = document.createElement("div");

    div.classList.add("booking-card");

   div.innerHTML = `
    <h3>${booking.name}</h3>
    <p>Destination: ${booking.destination}</p>
    <p>Date: ${booking.date}</p>

    <button onclick="editBooking(
        '${booking._id}',
        '${booking.name}',
        '${booking.destination}',
        '${booking.date}'
    )">
        Edit
    </button>

    <button onclick="deleteBooking('${booking._id}', this)">
        Delete
    </button>
`;

    bookingList.appendChild(div);

}

/* Delete Booking */

async function deleteBooking(id, button) {

    await fetch(`http://localhost:3000/bookings/${id}`, {

        method: "DELETE"

    });

    button.parentElement.remove();

}/* Edit Booking */

async function editBooking(id, oldName, oldDestination, oldDate) {

    const newName = prompt("Enter new name:", oldName);

    const newDestination = prompt("Enter new destination:", oldDestination);

    const newDate = prompt("Enter new date:", oldDate);

    const updatedBooking = {
        name: newName,
        destination: newDestination,
        date: newDate
    };

    await fetch(`http://localhost:3000/bookings/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedBooking)

    });

    location.reload();

}