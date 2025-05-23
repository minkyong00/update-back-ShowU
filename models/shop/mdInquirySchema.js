import { model, Schema } from "mongoose"
import { getCurrentTime } from "../../utils/utils.js";

const mdInquirySchema = new Schema(
  {
    type: { type: String, required: true }, // 문의 유형
    form: { type: String, required: true }, // 문의 형식
    title: { type: String, required: true }, // 제목
    content: { type: String, required: true }, // 내용
    selectedAlarm: { type: String }, // 알림 방식
    isAgreed: { type: Boolean, required: true }, // 개인정보 동의 여부
    mdName: { type: String }, // 상품명
    category: { type: String, default: "md" }, // 카테고리
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);


export default model("MdInquiry", mdInquirySchema, "mdInquiry");