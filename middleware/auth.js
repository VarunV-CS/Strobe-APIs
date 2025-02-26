const jwt = require('jsonwebtoken');
const SECRET_KEY = "CESTA";

const authMiddleware = (req, res, next) => {
 
  try {
   let token =   req.headers.authorization || req.query.token;
   if(token){
    token = token.split(" ")[1];
    let user = jwt.verify(token,SECRET_KEY );
    req.userId = user.id;

   }
else{
    res.status(401).json({message:"unauthorized user"});
}

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
