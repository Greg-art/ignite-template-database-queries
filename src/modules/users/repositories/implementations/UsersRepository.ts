import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    // Complete usando ORM
    const user = await this.repository.findOne(user_id, { relations: ["games"]});

    if(!user){
      throw new Error("User not found!")
    }

    return user;

  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("Select * from users order by first_name"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {

    const query = `
    Select users.email, users.first_name, users.last_name 
    from users 
    where users.first_name ILIKE '${first_name}' 
      and users.last_name ILIKE '${last_name}'`
    
    const users = await this.repository.query(query); // Complete usando raw query

    return users
  }
}
