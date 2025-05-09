import { model, Schema } from "mongoose";
import { getCurrentTime } from "../../utils/utils.js";

// 예약개념
const auctionPaymentSchema = new Schema({
  productName: { type: Schema.Types.ObjectId, ref: "Auction", required: true },
  finalPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  message: { type: String },
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 3000 },
  discount: { type: Number, default: 0 },
  status: { type: String, default: "success", required: true },
  paymentAt: { type: String, default: getCurrentTime },
});

export default model("AuctionPayment", auctionPaymentSchema, "auctionPayment");