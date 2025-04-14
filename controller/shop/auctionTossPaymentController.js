import Auction from "../../models/shop/auctionSchema.js";
import AuctionTossPayment from "../../models/shop/auctionTossPaymentSchema.js"; 

const auctionTossPayment = async (req, res) => {
  const {
    paymentKey,
    orderId,
    amount,
    orderName,
    productId,
    quantity,
    userName,
    userEmail,
    userPhone,
    address,
    deliveryMessage,
    userId, 
  } = req.body;

  // 결제 요청 데이터 로그
  console.log("결제 요청 데이터:", req.body);

  // userId가 제대로 전달되었는지 확인하는 로그 추가
  console.log("userId:", userId);

  try {
    const payment = new AuctionTossPayment({
      productId,
      quantity,
      userId, 
      orderId,
      paymentKey,
      totalAmount: amount,
      orderName,
      userName,
      userEmail,
      userPhone,
      address,
      deliveryMessage,
      status: "success",
    });

    await payment.save(); 

    await Auction.updateOne(
      { _id : productId },
      {
        $set : { isPaid :  true }
      }
    );

    // 결제 정보 저장 완료 로그
    console.log("결제 정보 저장 완료:", payment);
    res
      .status(200)
      .json({ message: "결제 정보가 성공적으로 저장되었습니다.", payment });
  } catch (error) {
    console.error("MongoDB 저장 중 오류 발생:", error);
    res.status(500).json({ message: "결제 정보 저장 중 오류 발생" });
  }
};

export { auctionTossPayment };
