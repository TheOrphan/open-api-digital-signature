import { EntityRepository, Repository } from 'typeorm';
import { LoginAttempts } from '../schemas/login-attempts.schema';


@EntityRepository(LoginAttempts)
export class LoginAttemptsRepository extends Repository<LoginAttempts> {}
