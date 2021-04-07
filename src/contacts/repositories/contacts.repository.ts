import { EntityRepository, Repository } from 'typeorm';
import { Contacts } from '../entities/contacts.entity';

@EntityRepository(Contacts)
export class ContactsRepository extends Repository<Contacts> {}
