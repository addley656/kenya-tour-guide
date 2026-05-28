const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

const app = express();

const PORT = 3000;

/* Middleware */

app.use(cors());

app.use(express.json());

/* MongoDB Connection */

mongoose.connect("mongodb://kenyauser:Kenya12345@ac-ae8vyaf-shard-00-00.hvop6k1.mongodb.net:27017,ac-ae8vyaf-shard-00-01.hvop6k1.mongodb.net:27017,ac-ae8vyaf-shard-00-02.hvop6k1.mongodb.net:27017/?ssl=true&replicaSet=atlas-111goq-shard-0&authSource=admin&appName=Cluster0")
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
/* Start Server */

app.listen(PORT, function() {

    console.log(`Server running on port ${PORT}`);

})