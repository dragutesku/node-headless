import { 
  Router, 
  Response, 
  Request 
} from "express";

const session = require('express-session');
const random = require("random");
const bcrypt = require("bcrypt");

import { v4 as uuidv4 } from 'uuid';


export const setUUID = () => {
  return uuidv4();
}

export const validatePassword = async (reqPassword, foundPass) => {
  const validatePassword = await bcrypt.compare(reqPassword, foundPass);

  return validatePassword;
}

export const securePassword = async (password) => {
  let salt = await bcrypt.genSalt(10);
  let securePassword = await bcrypt.hash(password, salt);

  return securePassword;
}

export const setSession = () => {

}

export const getSession = () => {

}

export const checkSession = () => {

}


module.exports = {
  setUUID,
  validatePassword,
  securePassword
};
