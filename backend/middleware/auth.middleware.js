import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-quizCraft"];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }
    
        const decode = jwt.verify(token, process.env.JWT_SECRET);
    
        const user = await User.findById(decode.userId).select("-password");
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectedRoute:", error.message);

        if (error.name === "JsonWebTokenError") {
          return res
            .status(401)
            .json({ message: "Unauthorized - Invalid Token" });
        }

        if (error.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Unauthorized - Token Expired" });
        }

        res.status(500).json({ message: "Server error in Protected Route", error: error.message });        
    }
};



export default authMiddleware;