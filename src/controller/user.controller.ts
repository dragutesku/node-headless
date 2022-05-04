import { 
  Router, 
  Response, 
  Request 
} from "express";
import { User } from "../entity/User";
import { UserLogin } from "../entity/User";
import { UserServices } from "../services/user.services";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 *
 *
 * @export
 * @class UserController
 * login, register with JWT TOKEN
 */
export class UserController {
  public router: Router;
  private userService: UserServices;

  constructor() {
    this.router = Router();
    this.userService = new UserServices();
    this.routes();
  }

  // TODO: API FAILS ON EMPTY PASSWORD

  // GET: All users
  public index = async (req: Request, res: Response) => {
    const users = await this.userService.index();
    if (users) {
      res.status(200).send(users).json();
    } else {
      res.status(404)
      .json({ message: "No users in the database" });
    }
  }

  // POST: Login User
  public login = async (req: Request, res: Response) => {
    const session = req['session'];
    const user = req['body'] as UserLogin;
    const foundUser = await this.userService.findUserByEmail(user.email);

    if(user.password === null) {
      res.status(404).json({ error: "Password cannot be empty" });
      return;
    }

    if (foundUser) {
      const validatePassword = await bcrypt.compare(user.password, foundUser.password);

      if (validatePassword) {
        session.success = true;
        session.key = user.email;
        let currentdate = new Date().toISOString(); 

        // user
        res.status(200).json({
          sessionId: session.id,
          userid: foundUser.id,
          email: user.email,
          timeOfLogin: currentdate
        });
      } else {
        res.status(401).json({message: "Credentials wrong"});
      }
    } else {
      res.status(409).json({message: "User not found"});
    }
  }

  // UPDATE: Logout User
  public logout = async (req: Request, res: Response) => {
    const session = req['session'];

    session.destroy(err => {
      if (err) {
          return console.log(err);
      }
      res.status(200)
        .json({message: "User logged out !"});
    });

  }

  // POST: Register New User & Add JWT token
  public create = async (req: Request, res: Response) => {
    const user = req['body'] as User;
    let currentdate = new Date().toISOString(); 
    const fountUser = await this.userService.findUserByEmail(user.email);

    // Validate Email && Pass
    if (!(user.email && user.password))
      res.status(400)
        .json({error: "email & password are required"})
    // Check for duplicate user
    if (fountUser) 
      return res.status(409)
        .json({ message: "User already exists in the db" });

    // Register
    user.email = user.email.toLowerCase();
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.timeOfRegister = currentdate;
    user.role = "USER";

    // const token = jwt.sign(
    //   { id: user.id, email: user.email },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "2h" }
    // );

    // // save user token
    // user.token = token;

    const newUser = await this.userService.create(user);
    // Execute method of service
    res.send(newUser);
  }

  /**
   * Configure the routes controller
   */
  public routes() {
    this.router.get("/", this.index);
    this.router.post("/register", this.create);
    this.router.post("/login", this.login);
    this.router.post("/logout", this.logout);
  }
}
