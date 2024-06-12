const express = require("express")

const { createNewProviderInfo, getAllProvidersInfo, getProviderInfoById, updateProviderInfoById, deleteProviderInfoById ,getProviderInfoByAuthorId} = require("../controllers/serviceProviderInfo")

const { createNewReview } = require("../controllers/review")

const authentication = require("../middleware/authentication")
const authorization = require("../middleware/authorization")
const providerInfoRouter = express.Router()


providerInfoRouter.get("/author/:authorId", getProviderInfoByAuthorId);

providerInfoRouter.post("/", authentication, authorization("CREATE_POSTS"), createNewProviderInfo)
providerInfoRouter.get("/", getAllProvidersInfo)
providerInfoRouter.get("/:id", getProviderInfoById)
providerInfoRouter.put("/:id", updateProviderInfoById)
providerInfoRouter.delete("/:id", deleteProviderInfoById)
providerInfoRouter.post("/:id/reviews", authentication, authorization("CREATE_REVIEWS"), createNewReview)
module.exports = providerInfoRouter