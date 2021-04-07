import { EntityRepository, Repository } from 'typeorm';
import { Groups } from '../entities/groups.entity';

@EntityRepository(Groups)
export class GroupsRepository extends Repository<Groups> {}
