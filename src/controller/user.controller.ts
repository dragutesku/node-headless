import { 
  Router, 
  Response, 
  Request 
} from "express";
import { User } from "../entity/User";
import { UserLogin } from "../entity/User";
import { UserServices } from "../services/user.services";
import moment from 'moment';
import { stopCoverage } from "v8";

const jwt = require("jsonwebtoken");
import { validatePassword, securePassword } from '../services/auth.services';

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
  public prevUser = null;

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
    let currentTime = moment().format();

    if(user.password === null) {
      res.status(404).json({ error: "Password cannot be empty" });
      return;
    }

    if (foundUser && validatePassword) {
        let currentUser = foundUser.email;

        session.email = foundUser.email;
        session.userId = foundUser.id;

        let userRes = {
          sessionId: session.id,
          userid: session.userId,
          email: session.email,
          timeOfLogin: currentTime,
          views: session.views
        }

        session.save();

        if(this.prevUser == currentUser) {
          session.regenerate(function(err) {
            console.log(session.id)
          }) 
        }


        this.prevUser = currentUser;
        res.status(200).json({userRes});
    } else {
      res.status(401).json({
        message: `User with email ${foundUser.email} not found or credentials wrong`
      });
    }
  }

  // UPDATE: Logout User
  public logout = async (req: Request, res: Response) => {
    const session = req['session'];

    delete session.email;
    delete session.userId;

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
    user.password = await securePassword(user.password);
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
