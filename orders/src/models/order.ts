import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@boitickets/common";
import { TicketDoc } from "./ticket";

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expireAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expireAt: Date;
  ticket: TicketDoc;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expireAt: {
    type: mongoose.Schema.Types.Date
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket' // tipo chave estrangeira
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };