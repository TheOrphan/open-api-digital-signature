import { EntityRepository, Repository } from 'typeorm';
import { UsersGroups } from '../entities/users-groups.entity';

@EntityRepository(UsersGroups)
export class UsersGroupsRepository extends Repository<UsersGroups> {}
