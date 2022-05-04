import { Database } from "../data-source";
import { Post } from "../entity/Post";

export class PostServices {
  private postRepository;

  constructor() {
    this.postRepository = Database.getRepository(Post);
  }


  public index = async () => {
    const posts = await this.postRepository.find();
    return posts;
  }

  public create = async (post: Post) => {
    const newPost = await this.postRepository.save(post);
    return newPost;
  }

  public update = async (post: Post, id: number) => {
    const updatePost = await this.postRepository.update(id, post);
    return updatePost;
  }

  public delete = async (id: number) => {
    const deletePost = await this.postRepository.delete(id);
    return deletePost;
  }
}
