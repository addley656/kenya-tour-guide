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
.then(() => {
    console.log("MongoDB Connected 🚀");
})
.catch((error) => {
    console.error("MongoDB Connection Error:");
    console.error(error);
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
app.get("/", (req, res) => {
    res.send("Kenya Tour Backend Running 🚀");
});

/* Get All Bookings */
app.get("/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching bookings",
            error: error.message
        });
    }
});

/* Create Booking */
app.post("/bookings", async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();

        res.json({
            message: "Booking Saved!",
            booking
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error saving booking",
            error: error.message
        });
    }
});

/* Update Booking */
app.put("/bookings/:id", async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error updating booking",
            error: error.message
        });
    }
});

/* Delete Booking */
app.delete("/bookings/:id", async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);

        res.json({
            message: "Booking Deleted"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error deleting booking",
            error: error.message
        });
    }
});

/* Start Server */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});