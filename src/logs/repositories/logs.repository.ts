import { EntityRepository, Repository } from 'typeorm';
import { Logs } from '../entities/logs.entity';

@EntityRepository(Logs)
export class LogsRepository extends Repository<Logs> {}
