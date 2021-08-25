const express = require("express")
const dotenv = require("dotenv")
const app = express()
const cors = require('cors')

const db = require("./db/dbConnection")
const userRoutes = require("./routes/userRoute")
const propertyRoutes = require("./routes/propertyRoute")
const agentPropertyRoutes = require("./routes/agentPropertyRoute")
const utilities = require('./helpers/utilities')

dotenv.config({ path: "./.env" })

//Middlewares
app.use(express.json()) // to json
app.use(cors({ origin: "https://ict-yep.herokuapp.com" }))
app.use('/api/v1/uploads-directory', express.static('uploads'))

// Database connection
db()

//Mounting routes
app.use("/api/v1/users", userRoutes) // agent
app.use("/api/v1/agents/properties", agentPropertyRoutes) // agent
app.use("/api/v1/properties", propertyRoutes) // clients

app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message:"Welcome to House Rentals API. You can get the full API documentation at: https://documenter.getpostman.com/view/5420157/TzscqnpF"
    })
})

// Handling unhandled routes
app.all("*", (req, res) => {
    res.status(404).json({
        status: "error",
        message: "Sorry! The resource you are looking for could not be found."
    })
})

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`Server running at port ${process.env.PORT}`)
})



