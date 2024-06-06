const authorization= (string)=>{
    return (req,res,next)=>{
        tokenPermissions=req.token.role.permissions.includes(string)
        if (!tokenPermissions) {
            return res.status(403).json({
                success: false,
        message: `Unauthorized`,
            })
            
        }
        next();
    }
}
module.exports = authorization;