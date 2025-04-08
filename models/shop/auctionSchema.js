import { model, Schema } from "mongoose"

const auctionSchema = new Schema({
  auctionName: { type: String, required: true }, // 상품명
  auctionId: { type: String, required: true }, // 경매 Id
  category: { type: String, enum: ["전체", "뮤지컬", "영화", "연극"], required: true }, // 카테고리
  // time: { type: String, required: true }, // 남은 시간
  count: { type: Number, default: 0 }, // 입찰 기록
  // unit: { type: Number, required: true }, // 입찰 단위
  // bid: { type: Number, required: true }, // 입찰 희망가
  // finalPrice: { type: Number, required: true }, // 예상 구매가
  description: { type: String, required: true }, // 경매 설명
  isHearted: { type: Schema.Types.ObjectId, ref: 'User'}, // 찜
  image: { type: String, required: true },
  imageDetail: { type: String, required: true },
  bidHistory: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      price: Number,
      timestamp: { type: Date, default: Date.now }
    }
  ], //입찰한 가격들
  currentHighestBid: { type: Number, default: 0 }, //현재 가장 높은 가격
  currentHighestUser: { type: Schema.Types.ObjectId, ref: "User" }, // 현재 가장 높은 가격을 입찰한 사용자
  endTime: { type: Date, required: true }, // 경매 마감 시간
  isClosed: { type: Boolean, default: false }, // 경매 종료 여부
});

export default model("Auction", auctionSchema, "auction");