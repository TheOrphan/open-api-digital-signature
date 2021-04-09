import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contacts, ContactsDocument } from '../schemas/contacts.schema';

@Injectable()
export class ContactsRepository {
  constructor(
    @InjectModel(Contacts.name) private contactsModel: Model<ContactsDocument>,
  ) {}

  async findAll(): Promise<Contacts[]> {
    return this.contactsModel.find().exec();
  }
}
