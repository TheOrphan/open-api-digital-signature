import { Repository, EntityRepository } from 'typeorm';
import { Users } from '../entities/users.entity';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {}
