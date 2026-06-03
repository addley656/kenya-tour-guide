const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "KenyaTourSecret2026";

/* Middleware */
app.use(cors());
app.use(express.json());

/* MongoDB Connection */
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected 🚀");
})
.catch((error) => {
    console.error("MongoDB Connection Error:", error);
});

/* Booking Schema */
const bookingSchema = new mongoose.Schema({
    name: String,
    destination: String,
    date: String
});

const Booking = mongoose.model("Booking", bookingSchema);

/* Admin Schema */
const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Admin = mongoose.model("Admin", adminSchema);

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
        res.status(500).json({
            message: error.message
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
        res.status(500).json({
            message: error.message
        });
    }
});

/* Update Booking */
app.put("/bookings/:id", async (req, res) => {
    try {

        const updatedBooking =
            await Booking.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

        res.json(updatedBooking);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

/* Delete Booking */
app.delete("/bookings/:id", async (req, res) => {
    try {

        await Booking.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Booking Deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

/* Create Admin (TEMPORARY ROUTE) */
app.get("/create-admin", async (req, res) => {

    try {

        const existingAdmin =
            await Admin.findOne({
                username: "baraka"
            });

        if (existingAdmin) {
            return res.send("Admin Already Exists");
        }

        const hashedPassword =
            await bcrypt.hash(
                "baraka123",
                10
            );

        const admin = new Admin({
            username: "baraka",
            password: hashedPassword
        });

        await admin.save();

        res.send("Admin Created Successfully");

    } catch (error) {

        res.status(500).send(error.message);

    }

});

/* Login */
app.post("/login", async (req, res) => {

    try {

        const admin =
            await Admin.findOne({
                username: req.body.username
            });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid Username"
            });
        }

        const validPassword =
            await bcrypt.compare(
                req.body.password,
                admin.password
            );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                username: admin.username
            },
            JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login Successful",
            token
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

/* Verify Token */
function verifyToken(req, res, next) {

    const authHeader =
        req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access Denied"
        });
    }

    const token =
        authHeader.split(" ")[1];

    try {

        const verified =
            jwt.verify(
                token,
                JWT_SECRET
            );

        req.admin = verified;

        next();

    } catch (error) {

        res.status(401).json({
            message: "Invalid Token"
        });

    }

}

/* Protected Dashboard */
app.get(
    "/admin/dashboard",
    verifyToken,
    async (req, res) => {

        try {

            const bookings =
                await Booking.find();

            res.json(bookings);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);

/* Start Server */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});