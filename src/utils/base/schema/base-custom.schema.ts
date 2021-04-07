import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BaseCustomSchema {
  @Prop({
    type: 'timestamp',
    nullable: true,
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  created_at: Date;

  @Prop({
    type: 'timestamp',
    nullable: true,
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
  })
  updated_at: Date;
}
