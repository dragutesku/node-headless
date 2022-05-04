import { 
  Router, 
  Response, 
  Request 
} from "express";

const session = require('express-session');
const cookieParser = require('cookie-parser');
const MemcachedStore = require('connect-memcached')(session);
const random = require("random");

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

module.exports = verifySession;
