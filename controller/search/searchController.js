import Audition from "../../models/community/auditionSchema.js";
import Community from "../../models/community/communitySchema.js"
import News from "../../models/community/newsSchema.js";
import Space from "../../models/reservation/spaceSchema.js";
import TicketEvent from "../../models/reservation/ticketEventSchema.js";
import Auction from "../../models/shop/auctionSchema.js";
import Md from "../../models/shop/mdSchema.js";
import TeamMatching from "../../models/showu/teamMatchingSchema.js";
import vodShowuVideo from "../../models/vod/vodShowuVideo.js";

const getSearchResult = async (req, res) => {
  try {
    const foundCommu = await Community.find({}).lean();
    const foundAudition = await Audition.find({}).lean();
    const foundNews = await News.find({}).lean();
    const foundTicket = await TicketEvent.find({}).lean();
    const foundSpace = await Space.find({}).lean();
    const foundMd = await Md.find({}).lean();
    const foundAuction = await Auction.find({}).lean();
    const foundTeam = await TeamMatching.find({}).lean();
    const foundVod = await vodShowuVideo.find({}).lean();

    const allFoundSearch = [foundCommu, foundAudition, foundNews, foundTicket, 
      foundSpace, foundMd, foundAuction, foundTeam, foundVod]
    // console.log("모든 검색 데이터", allFoundSearch)

    res.status(200).json({
      message : "모든 검색 결과를 성공적으로 가져왔습니다.",
      allFoundSearch : allFoundSearch
    })

  } catch (error) {
    res.status(500).json({
      message : "검색 결과를 가져오는 중 에러 발생"
    })
  }
}

export { getSearchResult }