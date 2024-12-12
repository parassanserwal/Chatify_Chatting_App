import jwt from "jsonwebtoken"

export const verifyToken  = (request,response,next) => {
    let token = request.cookies.jwt;
    if (!token) {
        const authHeader = request.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1]; 
        }
      }
    if(!token) return response.status(401).send("You are not authorized!");

    jwt.verify(token,process.env.JWT_KEY,async(error,payload)=>{
        if(error) return response.status(403).send("Token is not valid");
        request.userId = payload.userId;
        next();
    })
}