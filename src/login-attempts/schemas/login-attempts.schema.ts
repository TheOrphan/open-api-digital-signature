import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseCustomSchema } from 'src/utils/base/schema/base-custom.schema';

// @Entity()
// export class LoginAttempts extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', length: 50 })
//   ip_address: string;

//   @Column({ type: 'varchar', length: 50 })
//   login: string;

//   @Column({ type: 'tinyint', width: 4 })
//   time: number;
// }

export type LoginAttemptsDocument = LoginAttempts & Document;

@Schema()
export class LoginAttempts extends BaseCustomSchema{
    @Prop([String])
    ip_address: string;

    @Prop([String])
    login: string;

    @Prop([String])
    time: string;
}

export const LoginAttemptsSchema = SchemaFactory.createForClass(LoginAttempts);
