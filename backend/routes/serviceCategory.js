const express=require("express")

const {createNewCategory,getAllCategories,getCategoryById,updateCategoryById,deleteCategoryById} =require("../controllers/serviceCategory")

const categoryRouter=express.Router();

categoryRouter.post("/",createNewCategory)
categoryRouter.get("/",getAllCategories)
categoryRouter.get("/:id",getCategoryById)
categoryRouter.put("/:id",updateCategoryById)
categoryRouter.delete("/:id",deleteCategoryById)
module.exports=categoryRouter   