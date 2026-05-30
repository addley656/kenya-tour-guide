const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected 🚀");
})
.catch((error) => {
    console.log(error);
});

const bookingSchema = new mongoose.Schema({
    name: String,
    destination: String,
    date: String
});

const Booking = mongoose.model("Booking", bookingSchema);

app.get("/", (req, res) => {
    res.send("Kenya Tour Backend Running 🚀");
});

app.get("/bookings", async (req, res) => {
    const bookings = await Booking.find();
    res.json(bookings);
});

app.post("/bookings", async (req, res) => {
    const booking = new Booking(req.body);
    await booking.save();

    res.json({
        message: "Booking Saved!",
        booking
    });
});

app.put("/bookings/:id", async (req, res) => {
    const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updatedBooking);
});

app.delete("/bookings/:id", async (req, res) => {
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
        message: "Booking Deleted"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});