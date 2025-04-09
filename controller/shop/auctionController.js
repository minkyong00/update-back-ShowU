import Auction from '../../models/shop/auctionSchema.js'

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
    const products = await Auction.find(); 
    res.status(200).json(products);
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
  console.log("req.body", req.body);
  const { price } = req.body;
  console.log(price)

  try {
    const foundAuction = await Auction.findOne({ _id : id }).lean();
    console.log("foundAuction", foundAuction)

    if (!foundAuction) {
      return res.status(404).json({ 
        message: "상품을 찾을 수 없습니다." 
      });

    } else {

      const updateAuction = await Auction.updateOne(
        { _id : id },
        {
          $addToSet : {
            bidHistory: [
              {
                userId : userId,
                price : price
              }
            ],
          },
          $inc : { count : 1 }
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

export { seedAuctionProducts, getAuctionProduct, getAuctionProductById, createBidCount };