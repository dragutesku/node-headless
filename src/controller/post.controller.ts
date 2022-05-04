import { 
  Router, 
  Response, 
  Request 
} from "express";
import { Post } from "../entity/Post";
import { PostServices } from "../services/post.services";

const auth = require("../middleware/jwtauth");

/**
 *
 *
 * @export
 * @class PostController
 */
export class PostController {
  public router: Router;
  private postService: PostServices;

  constructor() {
    this.router = Router();
    this.postService = new PostServices();
    this.routes();
  }

  public index = async (req: Request, res: Response) => {
    const posts = await this.postService.index();
    // Execute method of service
    res.send(posts).json();
  }

  public create = async (req: Request, res: Response) => {
    const post = req['body'] as Post;
    const newPost = await this.postService.create(post);
    // Execute method of service
    res.send(newPost);
  }

  public update = async (req: Request, res: Response) => {
    const post = req['body'] as Post;
    const id = req['params']['id'];
    // Execute method of service
    res.send(this.postService.update(post, Number(id))); 
  }

  public delete = async (req: Request, res: Response) => {
    const id = req['params']['id'];
    // Execute method of service
    res.send(this.postService.delete(Number(id))); 
  }

  /**
   * Configure the routes controlle
   */
  public routes() {
    this.router.get("/", this.index);
    this.router.post("/", auth, this.create);
    this.router.put("/:id", auth, this.update);
    this.router.delete("/:id", auth, this.delete);
  }
}
