import { EntityRepository, Repository } from 'typeorm';
import { Contacts } from '../schemas/contacts.schema';

@EntityRepository(Contacts)
export class ContactsRepository extends Repository<Contacts> {}
