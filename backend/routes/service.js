const express=require("express")

const {createNewService,getALLServices,getServiceById,updateServiceById,deleteServiceById}=require("../controllers/service")
const serviceRouter=express.Router()

serviceRouter.post("/",createNewService)
serviceRouter.get("/",getALLServices)
serviceRouter.get("/:id",getServiceById)
serviceRouter.put("/:id",updateServiceById)
serviceRouter.delete("/:id",deleteServiceById)


module.exports=serviceRouter