import { 
  Router, 
  Response, 
  Request 
} from "express";

const session = require('express-session');
const random = require("random");

import { v4 as uuidv4 } from 'uuid';

export class Session {
  public router: Router;

  constructor () {

  }


  public setSession() {

  }

  public getSession() {

  }

  public verifySession() {

  }

  
}

export const setUUID = (req, res, next) => {
  return uuidv4();
}



const verifySession = (req, res, next) => {
  const session = req.headers["x-access-session"];

  if (!session) {
    return res.status(403)
      .json({ error: "A token is required for authentication" });
  }
  try {
    // Decode session
  } catch (err) {
    return res.status(401)
      .json({ error: "Invalid Session" });
  }
  return next();
};

module.exports = {
  setUUID,
  verifySession
};
