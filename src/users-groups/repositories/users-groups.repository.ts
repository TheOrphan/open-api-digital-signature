import { EntityRepository, Repository } from 'typeorm';
import { UsersGroups } from '../schemas/users-groups.schema';

@EntityRepository(UsersGroups)
export class UsersGroupsRepository extends Repository<UsersGroups> {}
