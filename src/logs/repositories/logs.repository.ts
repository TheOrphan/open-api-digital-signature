import { EntityRepository, Repository } from 'typeorm';
import { Logs } from '../schemas/logs.entity';

@EntityRepository(Logs)
export class LogsRepository extends Repository<Logs> {}
