const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();
require("./models/db");

const app = express();
const PORT = process.env.PORT || 3000;
const messageHandler = require("./controllers/messageHandler");
const auth = require("./middleware/authMiddleware"); // Use your provided auth middleware
const exampleMiddleware = require("./middleware/exampleMiddleware");

app.use(cors());
app.use(express.json());

const clients = {};

const serviceRouter = require("./routes/service");
const providerInfoRouter = require("./routes/serviceProviderInfo");
const roleRouter = require("./routes/role");
const usersRouter = require("./routes/users");
const categoryRouter = require("./routes/serviceCategory");

app.use("/service", serviceRouter);
app.use("/providerInfo", providerInfoRouter);
app.use("/role", roleRouter);
app.use("/users", usersRouter);
app.use("/serviceCategory", categoryRouter);

app.use("*", (req, res) => res.status(404).json("NO content at this path"));

const io = new Server(8080, { cors: { origin: "*" } });

io.use(auth);

io.on("connection", (socket) => {
    console.log("Client connected");

    socket.use(exampleMiddleware);
    console.log("Socket user:", socket.user);

    const user_id = socket.user.user_id; 
    clients[user_id] = { socket_id: socket.id, user_id };

    console.log("Connected clients:", clients);

    messageHandler(socket, io);

    socket.on("error", (error) => {
        socket.emit("error", { error: error.message });
    });

    socket.on("disconnect", () => {
        for (const key in clients) {
            if (clients[key].socket_id === socket.id) {
                delete clients[key];
            }
        }
        console.log("Updated clients after disconnect:", clients);
    });
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
