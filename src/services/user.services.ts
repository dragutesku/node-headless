import { Database } from "../data-source";
import { User } from "../entity/User";
import { UserLogin } from "../entity/User";

export class UserServices {
  private userRepository;

  constructor() {
    this.userRepository = Database.getRepository(User);
  }

  public findUserByEmail = async (email) => {
    const foundUser = await this.userRepository.findOneBy({email: email});
    return foundUser;
  }

  public index = async () => {
    const users = await this.userRepository.find();
    return users;
  }

  public create = async (user: User) => {
    const newUser = await this.userRepository.save(user);
    return newUser;
  }

  public update = async (user: User, id: number) => {
    const updateUser = await this.userRepository.update(id, user);
    return updateUser;
  }

  public delete = async (id: number) => {
    const deleteUser = await this.userRepository.delete(id);
    return deleteUser;
  }
}
