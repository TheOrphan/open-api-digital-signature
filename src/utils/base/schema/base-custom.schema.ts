import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BaseCustomSchema {
  @Prop({
    type: Date,
    required: true,
  })
  created_at: Date;

  @Prop({
    type: Date,
    required: true,
  })
  updated_at: Date;
}
