import { EntityRepository, Repository } from 'typeorm';
import { LoginAttempts } from '../entities/login-attempts.entity';

@EntityRepository(LoginAttempts)
export class LoginAttemptsRepository extends Repository<LoginAttempts> {}
