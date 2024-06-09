const serviceModel=require("../models/service")

const createNewService=(req,res)=>{
    const {serviceProvider,customer,serviceInfo,status,scheduledDate,completedDate,rating}=req.body

    const serviceDb= new serviceModel({
        serviceProvider,customer,serviceInfo,status,scheduledDate,completedDate,rating
    })
    serviceDb
    .save()
    .then((result)=>{
        res.status(201).json({
            success: true,
            message: `service created`,
        })
        })
        .catch((err)=>{
            res.status(500).json({
                success: false,
            message: `Server Error`,
            err: err.message,
            })
        })
}

const getALLServices=(req,res)=>{
    serviceModel
    .find()
    .populate("serviceProvider")
    .populate("customer")
    .populate("serviceInfo")
    .then((result)=>{
        if (result.length){
            res.status(200).json({
                success: true,
                message: `All the services`,
                services:result
            })
        }else{
            res.status(200).json({
                success: false,
                message: `No services Yet`,
            });
        }
        })
        .catch((err)=>{
            res.status(500).json({
                success: false,
                message: `Server Error`,
                
            })
        })
}

const getServiceById=(req,res)=>{
    const id=req.params.id
    serviceModel
    .findById(id)

.then((result)=>{
    if(!result){
        res.status(404).json({
            success: false,
            message: `The service with id => ${id} not found`,
        });
    }else{
        res.status(200).json({
            success: true,
            message: `The service ${id} `,
            category: result,
        });
    }
    })
    .catch((err)=>{
        res.status(500).json({
            success: false,
            message: `Server Error`,
            err: err.message,
        }); 
    })
}

const updateServiceById=(req,res)=>{
    const {id}=req.params
    const updatedService=req.body
    serviceModel
    .findOneAndUpdate({_id:id},updatedService)
    .then((result)=>{
        if(result){
            res.status(200).json({
                success: true,
                message: "service updated",
                service: updatedService
            })
        }
        else{
            res.status(404).json({
            success: false,
            message: `The service with id => ${id} not found`,
            });
        }
        })
        .catch((err)=>{
            res.status(500).json({
                success: false,
                message: "Server Error",
                err: err.message
            })
        })
}

const deleteServiceById=(req,res)=>{
    const id=req.params.id
    serviceModel
    .findOneAndDelete(id)
    .then((result)=>{
        if (!result) {
            return res.status(404).json({
            success: false,
            message: `The service with id => ${id} not found`,
            });
        }else{
            res.status(200).json({
                success: true,
                message: `service deleted`,
            });
        }
    })
    .catch((err)=>{
        res.status(500).json({
            success: false,
            message: "Server Error",
            err: err.message
        })
    })
}


module.exports={
    createNewService,
    getALLServices,
    getServiceById,
    updateServiceById,
    deleteServiceById
}