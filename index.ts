import express, { 
  Request, 
  Response 
} from 'express';
import cors from 'cors';
import "reflect-metadata";
import { 
  Database, 
  RedisClient 
} from "./src/data-source";
import { v4 as uuidv4 } from 'uuid';

const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const bodyParser = require('body-parser');
// DOENV CONFIG
require('dotenv').config();

import { PostController } from './src/controller/post.controller';
import { UserController } from './src/controller/user.controller';

/**
 * TODO: Session Management
 * TODO: Recconect services on failed connection
 * TODO: Add CORS Support
 * TODO: Implement OpenAPI documentation
 * TODO: API versioning
 * TODO: Enviroment prod | stage
 */
/**
 *
 *
 * @class Server
 */
class Server {
  private app: express.Application;
  private postController: PostController;
  private userController: UserController;

  constructor() {
    this.app = express(); // init app

    // MIDDLEWARE INIT
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(helmet());

    this.databaseInit(); // init dbs

    // Generate Session
    this.app.use(session({
      genid:function () {
        return uuidv4();
      },
      store: new RedisStore({ 
        client: RedisClient,
        ttl: 60 * 60, //1 hour,
        prefix: `session:` 
      }),
      cookie: {
        expires: new Date(Date.now() + (60 * 60 * 1000)),
        maxAge: 60 * 60 * 1000,
        secure: false
      },
      secret: 'secret$%^134',
      resave: false,
      saveUninitialized: true,
    }));

    // Instance of the post controller
    this.postController = new PostController(); 
    this.userController = new UserController();

    // Route Management
    this.routes();
  }

  /**
   * Method to to init DBs
   * @session redis with connect-redis
   * @db posgress with pg
   * @orm TypeOrm
   */
  private async databaseInit() {
    // Initialize Redis Connection
    RedisClient
    .connect()
    .catch(err => console.log(err));

    console.log('Redis Connection Open: ', RedisClient.isOpen);

    RedisClient.on('error', function (err) {
      console.log('Could not establish a connection with redis. ' + err);
    });

    RedisClient.on('connect', function (err) {
      console.log('Connected to redis successfully');
    });

    // Initialize Posgress Connection
    Database
      .initialize()
      .then(async () => console.log('Database connected ...'))
      .catch(error => console.log(error));
  }

  /**
   * Method to configure routes
   */
  public routes() {
    // Post controller
    this.app.use(`/v1/api/posts/`, this.postController.router);
    this.app.use(`/v1/api/users/`, this.userController.router);

    this.app.get("/", (req: Request, res: Response) => {
      res.send("Hello World");
    });
  }

  /**
   * Used to start the server
   */
  public start() {
    // Configure port
    let port = process.env.API_PORT || process.env.PORT;

    this.app.listen(port, () => {
      console.log(`Server is listening ${port} port.`);
    })
  }
}

// Start server
const server = new Server();
server.start();
