import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  type:
    | 'vue'
    | 'script'
    | 'promise'
    | 'resource'
    | 'manual'
    | 'console_error'
    | 'warning'
    | 'sdk_popup'
    | 'timeout'
    | 'init_exception'
    | 'api_error';
  message: string;
  stack?: string;
  component?: string;
  url: string;
  time: number;
  ua: string;
  device_id?: string;
  wallet?: string;
  network?: {
    online: boolean;
    rtt?: number;
    type?: string;
    downlink?: number;
  };
  env?: {
    screen: string;
    timezone: string;
    visibility: string;
    language: string;
  };
  connectParams?: {
    clientId: string;
    deviceId: string;
    mode: number;
    password: {
      wallet: string;
      nonce: string;
      signature: string;
      wallet_type: string;
      wallet_role: number;
      nft_enabled: boolean;
      rent_start_time: number;
      rent_time: number;
      display: {
        width: number;
        height: number;
        fps: number;
      };
    };
  };
  location?: {
    ip: string;
    city?: string;
    country?: string;
  };
  createdAt: Date;
}

const LogSchema = new Schema<ILog>(
  {
    type: { type: String, required: true, index: true },
    message: { type: String, required: true },
    stack: String,
    component: String,
    url: { type: String, required: true },
    time: { type: Number, required: true, index: true },
    ua: { type: String, required: true },
    device_id: { type: String, index: true },
    wallet: { type: String, index: true },
    network: Schema.Types.Mixed,
    env: Schema.Types.Mixed,
    connectParams: Schema.Types.Mixed,
    location: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Log = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);
