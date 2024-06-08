const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/db")
const app = express();
const PORT = process.env.PORT;
require("./middleware/authentication")
app.use(cors());
app.use(express.json());

const providerInfoRouter=require("./routes/serviceProviderInfo")
const roleRouter=require("./routes/role")
const usersRouter=require("./routes/users")
const categoryRouter=require("./routes/serviceCategory")

app.use("/providerInfo",providerInfoRouter)
app.use("/role",roleRouter)
app.use("/users",usersRouter)
app.use("/serviceCategory",categoryRouter)

app.use("*", (req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
