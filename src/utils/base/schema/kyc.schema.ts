import { Prop, Schema } from '@nestjs/mongoose';
import { Users } from 'src/users/schemas/users.schema';
import * as mongoose from 'mongoose';

@Schema()
export class KYC {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user_id: Users;

  @Prop({ type: String })
  link_video: string;

  @Prop({ type: String })
  link_ttd: string;

  @Prop({ type: String })
  ds_user: string;

  @Prop({ type: String })
  ds_pass: string;

  @Prop({ type: Boolean, default: false })
  video_status: boolean;

  @Prop({ type: Boolean, default: false })
  sign_status: boolean;

  @Prop({ type: Number })
  otp_code: number;

  @Prop({ type: Boolean, default: false })
  otp_status: boolean;

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
