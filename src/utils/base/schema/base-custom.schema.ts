import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BaseCustomSchema {
  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  created_at: Date;
}
