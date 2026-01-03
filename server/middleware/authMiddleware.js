const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
      // Fallback or just rely on the above. 
      // Actually the previous code used replacing 'Bearer ', which is safer for some clients.
      // Let's stick to the standard clean approach.
      token = req.header('Authorization')?.replace('Bearer ', '');
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Auth Success, secret starts with:', process.env.JWT_SECRET?.substring(0,3));
    req.user = decoded;
    
    // Fix for Role Check: Fetch latest user from DB
    const User = require('../models/User');
    const user = await User.findById(decoded.id).select('-password');
    if (user) req.user = user;
    
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// New: Role authorization middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(`[Auth] Checking role for user ${req.user?._id}. User Role: "${req.user?.role}". Required: ${JSON.stringify(roles)}`);
    if (!req.user || !roles.includes(req.user.role)) {
      console.warn(`[Auth] Access Denied. User role '${req.user?.role}' is not in [${roles}]`);
      // Debug: Dump user object
      console.log('User Object Dump:', JSON.stringify(req.user, null, 2));
      return res.status(403).json({ 
        message: `User role ${req.user?.role} is not authorized to access this route` 
      });
    }
    next();
  };
};
