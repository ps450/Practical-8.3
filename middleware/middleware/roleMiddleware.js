function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: ${req.user.role} role is not authorized for this route`
      });
    }
    next();
  };
}

module.exports = authorizeRoles;
