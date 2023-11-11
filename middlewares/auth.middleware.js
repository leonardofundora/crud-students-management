import pkg from "jsonwebtoken";
const {verify} = pkg
import { Usuarios } from "../models/Usuarios.js";

export const verifyToken = async (req, res) => {
    const token = req.header('token');
    const user = await Usuarios.findOne({where: {username: req.header('user')}})
    if(!token){
        res.json({error:'Not logged'})
    }
    try{
        const validToken = verify(token,'string');
        if(validToken){
            res.status(200).json({rol: user.rol})
        }
    }catch{
        res.json({error:'Token invalid'})
    }
  };