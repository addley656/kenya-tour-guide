function showMessage() {
    alert("Welcome to Kenya Tour Guide Booking!");
}

const form = document.getElementById("bookingForm");

const bookingList = document.getElementById("bookingList");

/* Load Bookings */

window.onload = async function () {

    const response = await fetch("https://kenya-tour-guide-backend.onrender.com/bookings")

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

    const booking = {
        name: name,
        destination: destination,
        date: date
    };

    const response = await fetch("https://kenya-tour-guide-backend.onrender.com/bookings", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(booking)

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

    const confirmDelete = confirm("Are you sure you want to delete this booking?");

    if (!confirmDelete) {
        return;
    }

    await fetch(`https://kenya-tour-guide-backend.onrender.com/bookings/${id}`, {

        method: "DELETE"

    });

    button.parentElement.remove();

}

/* Edit Booking */

async function editBooking(id, oldName, oldDestination, oldDate) {

    const newName = prompt("Enter new name:", oldName);

    const newDestination = prompt("Enter new destination:", oldDestination);

    const newDate = prompt("Enter new date:", oldDate);

    const updatedBooking = {
        name: newName,
        destination: newDestination,
        date: newDate
    };

    await fetch(`https://kenya-tour-guide-backend.onrender.com/bookings/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedBooking)

    });

    location.reload();

}
