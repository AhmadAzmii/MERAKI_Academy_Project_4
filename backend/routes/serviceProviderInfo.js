const express=require("express")

const {createNewProviderInfo,getAllProvidersInfo,getProviderInfoById,updateProviderInfoById,deleteProviderInfoById}=require("../controllers/serviceProviderInfo")

const providerInfoRouter=express.Router()



providerInfoRouter.post("/",createNewProviderInfo)
providerInfoRouter.get("/",getAllProvidersInfo)
providerInfoRouter.get("/:id",getProviderInfoById)
providerInfoRouter.put("/:id",updateProviderInfoById)
providerInfoRouter.delete("/:id",deleteProviderInfoById)
module.exports=providerInfoRouter