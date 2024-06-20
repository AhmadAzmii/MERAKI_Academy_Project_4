const express = require("express")

const { createNewProviderInfo, getAllProvidersInfo, getProviderInfoById, updateProviderInfoById, deleteProviderInfoById ,getProviderInfoByAuthorId} = require("../controllers/serviceProviderInfo")

const { createNewReview ,deleteReviewById,updateReviewById,getAllReviews} = require("../controllers/review")

const authentication = require("../middleware/authentication")
const authorization = require("../middleware/authorization")
const providerInfoRouter = express.Router()
providerInfoRouter.get("/reviews",getAllReviews)

providerInfoRouter.get("/author/:authorId", getProviderInfoByAuthorId);

providerInfoRouter.post("/", authentication, authorization("CREATE_POSTS","everything"), createNewProviderInfo)
providerInfoRouter.get("/", getAllProvidersInfo)
providerInfoRouter.get("/:id", getProviderInfoById)
providerInfoRouter.put("/:id", updateProviderInfoById)
providerInfoRouter.delete("/:id", deleteProviderInfoById)

//reviews

providerInfoRouter.post("/:id/reviews", authentication, authorization("CREATE_REVIEWS","everything"), createNewReview)
providerInfoRouter.delete("/:id/reviews",authentication, authorization("CREATE_REVIEWS","everything"),deleteReviewById)
providerInfoRouter.put("/:id/reviews",authentication, authorization("CREATE_REVIEWS","everything"),updateReviewById)
module.exports = providerInfoRouter