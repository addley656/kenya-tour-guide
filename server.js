const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 3000;

/* Middleware */

app.use(cors());

app.use(express.json());

/* MongoDB Connection */

mongoose.connect(process.env.MONGO_URI)

.then(function() {

    console.log("MongoDB Connected 🚀");

})

.catch(function(error) {

    console.log(error);

});

/* Booking Schema */

const bookingSchema = new mongoose.Schema({

    name: String,

    destination: String,

    date: String

});

/* Booking Model */

const Booking = mongoose.model("Booking", bookingSchema);

/* Home Route */

app.get("/", function(req, res) {

    res.send("Kenya Tour Backend Running 🚀");

});

/* Get Bookings */

app.get("/bookings", async function(req, res) {

    const bookings = await Booking.find();

    res.json(bookings);

});

/* Create Booking */

app.post("/bookings", async function(req, res) {

    const booking = new Booking(req.body);

    await booking.save();

    res.json({
        message: "Booking Saved!",
        booking: booking
    });

});

/* Delete Booking */

app.delete("/bookings/:id", async function(req, res) {

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
        message: "Booking Deleted"
    });

});

/* Update Booking */

app.put("/bookings/:id", async function(req, res) {

    const updatedBooking = await Booking.findByIdAndUpdate(

        req.params.id,

        req.body,

        { new: true }

    );

    res.json(updatedBooking);

});

/* Start Server */

app.listen(PORT, function() {

    console.log(`Server running on port ${PORT}`);

});