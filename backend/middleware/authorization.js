const authorization = (...requiredPermissions) => {
    return (req, res, next) => {
        const tokenPermissions = req.token.role.permissions;
        const hasPermission = requiredPermissions.some(permission => tokenPermissions.includes(permission));

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: `Unauthorized`,
            });
        }
        next();
    };
};

module.exports = authorization;