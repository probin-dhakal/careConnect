import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { sendMail } from "../config/mailer.js";
import { appointmentCreatedTemplate, appointmentCancelledTemplate } from "../templates/emailTemplates.js";
import { v2 as cloudinary } from 'cloudinary'
import razorpay from 'razorpay';

// Gateway Initialize
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to register user
const registerUser = async (req, res) => {
    console.log(`[USER-REGISTRATION] Initiating registration request for email: ${req.body.email}`);
    const startTime = Date.now();
    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            console.log(`[USER-REGISTRATION] Failed: Missing required details.`);
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            console.log(`[USER-REGISTRATION] Failed: Invalid email format ${email}.`);
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            console.log(`[USER-REGISTRATION] Failed: Password length too short (< 8 chars).`);
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        console.log(`[USER-REGISTRATION] Hashing password...`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        console.log(`[USER-REGISTRATION] Checking if email is already taken in DB...`);
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            console.log(`[USER-REGISTRATION] Failed: User already exists.`);
            return res.json({ success: false, message: 'User already exists' })
        }

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        console.log(`[USER-REGISTRATION] Saving new user record in DB...`);
        const newUser = new userModel(userData)
        const user = await newUser.save()

        console.log(`[USER-REGISTRATION] Generating JWT token...`);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        console.log(`[USER-REGISTRATION] Completed successfully in ${Date.now() - startTime}ms`);
        res.json({ success: true, token })

    } catch (error) {
        console.error(`[USER-REGISTRATION] Error in registerUser after ${Date.now() - startTime}ms:`, error)
        if (error.code === 11000) {
            return res.json({ success: false, message: 'User already exists' })
        }
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`[USER-LOGIN] Initiating login request for email: ${email}`);
    const startTime = Date.now();
    try {
        console.log(`[USER-LOGIN] Querying user record by email...`);
        const user = await userModel.findOne({ email })

        if (!user) {
            console.log(`[USER-LOGIN] Login failed: User not found.`);
            return res.json({ success: false, message: "User does not exist" })
        }

        console.log(`[USER-LOGIN] User found. Verifying password hash...`);
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            console.log(`[USER-LOGIN] Password matches. Generating JWT token...`);
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            console.log(`[USER-LOGIN] Login completed successfully in ${Date.now() - startTime}ms`);
            res.json({ success: true, token })
        }
        else {
            console.log(`[USER-LOGIN] Login failed: Incorrect password.`);
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.error(`[USER-LOGIN] Error in loginUser after ${Date.now() - startTime}ms:`, error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {
    const { userId } = req.body
    console.log(`[USER-PROFILE] Fetching profile information for user: ${userId}`);
    const startTime = Date.now();
    try {
        const userData = await userModel.findById(userId).select('-password')
        console.log(`[USER-PROFILE] Profile retrieved in ${Date.now() - startTime}ms`);
        res.json({ success: true, userData })
    } catch (error) {
        console.error(`[USER-PROFILE] Error in getProfile after ${Date.now() - startTime}ms:`, error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {
    const { userId, name, phone, address, dob, gender } = req.body
    const imageFile = req.file
    console.log(`[USER-PROFILE-UPDATE] Initiating profile update for user: ${userId}`);
    const startTime = Date.now();

    try {
        if (!name || !phone || !dob || !gender) {
            console.warn(`[USER-PROFILE-UPDATE] Failed: Missing required user parameters.`);
            return res.json({ success: false, message: "Data Missing" })
        }

        console.log(`[USER-PROFILE-UPDATE] Saving profile text fields in DB...`);
        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            console.log(`[USER-PROFILE-UPDATE] Uploading profile picture to Cloudinary...`);
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url
            console.log(`[USER-PROFILE-UPDATE] Image upload successful. URL: ${imageURL}`);

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        console.log(`[USER-PROFILE-UPDATE] Profile successfully updated in ${Date.now() - startTime}ms`);
        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.error(`[USER-PROFILE-UPDATE] Error in updateProfile after ${Date.now() - startTime}ms:`, error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        // send confirmation email to user asynchronously (non-blocking)
        sendMail(userData.email, 'Appointment Confirmed - CareConnect', appointmentCreatedTemplate(appointmentData))
            .catch(e => console.error("Error sending appointment email:", e));

        res.json({ success: true, message: 'Appointment Booked' })
    } catch (error) {
        console.error("Error in bookAppointment:", error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        // notify user by email about cancellation asynchronously (non-blocking)
        sendMail(appointmentData.userData.email, 'Appointment Cancelled - CareConnect', appointmentCancelledTemplate(appointmentData, 'You'))
            .catch(e => console.error("Error sending cancellation email:", e));

        res.json({ success: true, message: 'Appointment Cancelled' })
    } catch (error) {
        console.error("Error in cancelAppointment:", error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })
        res.json({ success: true, appointments })
    } catch (error) {
        console.error("Error in listAppointment:", error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        const order = await razorpayInstance.orders.create(options)
        res.json({ success: true, order })
    } catch (error) {
        console.error("Error in paymentRazorpay:", error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.error("Error in verifyRazorpay:", error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay
}