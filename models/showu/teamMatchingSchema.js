import { Schema, model } from "mongoose";
import { getCurrentTime } from "../../utils/utils.js";

const teamMatchingSchema = new Schema({
    teamLeader : { type : Schema.Types.ObjectId, ref : 'User' }, // 팀 개설 유저
    members : [{ type : Schema.Types.ObjectId, ref : 'User' }], // 팀원
    currentMemberCount : { type : Number, default : 0 },
    teamName: { type: String, required: true },
    category : { type : String }, // 분야
    teamTitle : { type : String },
    teamIntro : { type : String, required : true },
    file : { type : String }, //팀 포트폴리오,
    teamProfile : { type: String }, // 팀 프로필 이미지
    activityPeriodStart : { type : String }, //팀 시작일
    deadLine : { type : String }, // 팀 공고 마감일
    careerHistory : { type : String }, //경력
    area : { type : String }, //팀 활동하는 지역
    status: { type: String, enum: ['개설 완료', '개설 대기', '개설 거절'], default: '개설 대기' }, //팀 매칭 공고 개설 승인 상태
    recruit : { type : Number }, // 모집 인원
    likeCount: { type: Number, default: 0 },
    likedUsers: [{type: Schema.Types.ObjectId, ref : 'User'}],
    createdAt: { type: String, default: getCurrentTime },
    updatedAt: { type: String, default: getCurrentTime },
    isClosed : { type: Boolean, default: false },
});

export default model("TeamMatching", teamMatchingSchema, "teamMatching")
