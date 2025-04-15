import AuctionPayment from "../../models/shop/auctionPaymentSchema.js";

const confirmAuctionPayment = async (req, res) => {
  console.log("Confirm Payment Request Body:", req.body); // 요청 본문 로그 추가
  console.log("Request Headers:", req.headers); // 요청 헤더 로그 추가

  try {
    const {
      productName,
      finalPrice,
      quantity,
      image,
      name,
      address,
      totalAmount,
      deliveryFee,
      // discount,
    } = req.body;
    

    const newPayment = new AuctionPayment({
      //프론트에서 배열로 오는 값을 string으로 변환
      productName: Array.isArray(productName) ? productName[0] : productName,
      finalPrice: Array.isArray(finalPrice) ? finalPrice[0] : finalPrice,
      image: Array.isArray(image) ? image[0] : image,
      quantity,
      name,
      address,
      totalAmount,
      deliveryFee,
      // discount,
      status: "success", // 결제 상태 설정
    });

    await newPayment.save();

    res.status(200).json({ message: "결제 성공", paymentId: newPayment._id });
  } catch (error) {
    console.error("에러 발생", error)
    res.status(500).json({ message: "결제 실패", error: error.message });
  }
};

export { confirmAuctionPayment };
