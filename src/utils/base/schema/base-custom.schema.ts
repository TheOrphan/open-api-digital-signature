import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BaseCustomSchema {
  @Prop({
    type: String,
    required: true,
  })
  created_at: string;

  @Prop({
    type: String,
  })
  updated_at: string;
}
