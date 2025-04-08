import { model, Schema } from "mongoose";

const auctionPaymentSchema = new Schema({
  auctionId: { type: Schema.Types.ObjectId, ref: "Auction", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true }, //결제 금액
  isPaid: { type: Boolean, default: false }, //결제 여부
  createdAt: { type: Date, default: Date.now }, 
  paidAt: { type: Date }, // 결제 시간
});


export default model("AuctionPayment", auctionPaymentSchema, "auctionPayment");
