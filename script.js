function showMessage() {
    alert("Welcome to Kenya Tour Guide Booking!");
}

const form = document.getElementById("bookingForm");
const bookingList = document.getElementById("bookingList");

/* YOUR RENDER BACKEND URL */
const API_URL = "https://kenya-tour-guide.onrender.com";

/* LOAD BOOKINGS */
window.onload = async function () {
    try {
        const response = await fetch(`${API_URL}/bookings`);
        const bookings = await response.json();

        bookingList.innerHTML = "";

        bookings.forEach(function (booking) {
            displayBooking(booking);
        });

    } catch (error) {
        console.log("Error loading bookings:", error);
    }
};

/* CREATE BOOKING */
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("date").value;

    const booking = {
        name,
        destination,
        date
    };

    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        });

        const data = await response.json();

        displayBooking(data.booking);

        form.reset();

        alert("Booking Added Successfully!");

    } catch (error) {
        console.log("Error creating booking:", error);
    }
});

/* DISPLAY BOOKING */
function displayBooking(booking) {
    const div = document.createElement("div");

    div.classList.add("booking-card");

    div.innerHTML = `
        <h3>${booking.name}</h3>
        <p><strong>Destination:</strong> ${booking.destination}</p>
        <p><strong>Date:</strong> ${booking.date}</p>

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

/* DELETE BOOKING */
async function deleteBooking(id, button) {
    const confirmDelete = confirm("Are you sure you want to delete this booking?");

    if (!confirmDelete) {
        return;
    }

    try {
        await fetch(`${API_URL}/bookings/${id}`, {
            method: "DELETE"
        });

        button.parentElement.remove();

        alert("Booking Deleted!");

    } catch (error) {
        console.log("Error deleting booking:", error);
    }
}

/* EDIT BOOKING */
async function editBooking(id, oldName, oldDestination, oldDate) {

    const newName = prompt("Enter new name:", oldName);
    const newDestination = prompt("Enter new destination:", oldDestination);
    const newDate = prompt("Enter new date:", oldDate);

    if (!newName || !newDestination || !newDate) {
        return;
    }

    const updatedBooking = {
        name: newName,
        destination: newDestination,
        date: newDate
    };

    try {
        await fetch(`${API_URL}/bookings/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedBooking)
        });

        alert("Booking Updated!");

        location.reload();

    } catch (error) {
        console.log("Error updating booking:", error);
    }
}document.getElementById("searchBooking").addEventListener("keyup", function () {

    const search = this.value.toLowerCase();

    const cards = document.querySelectorAll(".booking-card");

    cards.forEach(card => {

        if (card.textContent.toLowerCase().includes(search)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});