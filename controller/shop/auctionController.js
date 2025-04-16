import moment from 'moment';
import Auction from '../../models/shop/auctionSchema.js'
import { getCurrentTime } from '../../utils/utils.js';

const seedAuctionProducts = async (req, res) => {


// 경매 상품 삽입
try {
  const insertedAucitonProducts = await Auction.insertMany(auctionData);
  console.log("경매 상품 데이터가 삽입되었습니다:", insertedAucitonProducts);
  res.status(201).json({
    message: "경매 상품 데이터가 성공적으로 삽입되었습니다.",
    insertedAucitonProducts,
  });
} catch (error) {
  console.error("경매 상품 삽입 실패: ", error.message);
  res.status(500).json({
    message: "경매 상품 데이터 삽입 중 오류가 발생했습니다.",
    error: error.message,
  });
}
}


// 경매 상품 조회
const getAuctionProduct = async (req, res) => {
  try {
    const products = await Auction.find({}).lean()
    // console.log("경매 메인 상품들", products)

    // 경매 종료는 제외하고 내림차순
    const descendingProducts = products
      .filter(auction => !auction.isClosed)
      .sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
      
    res.status(200).json(descendingProducts);
  } catch (error) {
    console.error("상품 데이터를 가져오는 데 실패했습니다.", error.message);
    res.status(500).send("상품 데이터를 가져오는 데 실패했습니다.");
  }
}


// 경매 상품 상세 조회
const getAuctionProductById = async (req, res) => {
  try {
    const { id } = req.params; 
    const product = await Auction.findOne({ _id: id }); 

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    res.json(product); 
  } catch (error) {
    console.error("상품 상세 조회 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 입찰한 가격 해당 상품 db에 저장
const createBidCount = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  // console.log("req.body", req.body);
  const { price } = req.body;
  // console.log(price)

  try {
    const foundAuction = await Auction.findOne({ _id : id }).lean();
    // console.log("foundAuction", foundAuction)

    if (!foundAuction) {
      return res.status(404).json({ 
        message: "상품을 찾을 수 없습니다." 
      });

    } else {

      // 입찰가가 현재 높은 입찰가보다 높아야함
      if(price <= foundAuction.currentHighestBid){
        return res.status(400).json({
          message : "입찰가는 현재 최고 입찰가보다 높아야 합니다."
        })
      }

      
      const updateAuction = await Auction.updateOne(
        { _id : id },
        {
          $addToSet : {
            bidHistory: [
              {
                userId : userId,
                price : price,
                timestamp : new Date()
              } 
            ],
          },
          $inc : { count : 1 },
          $set : {
            currentHighestBid : price,
            currentHighestUser : userId
          }
        }
      )

      console.log("입찰 성공한 경매 정보", updateAuction)
    }


    res.status(200).json({
      message : "최종 입찰이 완료되었습니다."
    })

  } catch (error) {
    console.error("경매 입찰 중 오류 발생", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

// 오늘 마감 경매만 가져오기
const getTodayEnd = async (req, res) => {
  try {
    const foundBids = await Auction.find({}).lean();

    // 오늘 마감인 제품만 필터링
    const now = getCurrentTime();
    // console.log("오늘", now)
    const startOfDay = moment().startOf("day").add(9, "hours");
    // console.log("시작", startOfDay.toISOString())
    const endOfDay = moment().endOf("day").add(9, "hours");
    // console.log("끝", endOfDay.toISOString())
      

    const todayClosingAuctions = foundBids.filter(item => {
      const endTime = moment(item.endTime);
      // console.log("마감시간", endTime)
      // 범위 시작, 범위 끝, 단위 생략, 경계포함
      // isBetween : momoent 메서드
      return endTime.isBetween(startOfDay, endOfDay, null, '[]');
    });

    // console.log("오늘 마감", todayClosingAuctions)

    res.status(200).json(todayClosingAuctions)

  } catch (error) {
    console.error("오늘 마감 경매 가져오는 중 오류 발생", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

export { seedAuctionProducts, getAuctionProduct, getAuctionProductById, createBidCount, getTodayEnd };