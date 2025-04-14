import cron from 'node-cron';
import Auction from '../models/shop/auctionSchema.js';
import User from '../models/users/userSchema.js';
import nodemailer from 'nodemailer';
import { getCurrentTime } from '../utils/utils.js';

cron.schedule('* * * * *', async () => {
  // const now = new Date();
  const now = getCurrentTime();
  

  // 마감시간이 지났고 아직 종료되지 않은 경매 찾기
  const auctions = await Auction.find({
    endTime: { $lte: now },
    isClosed: false,
  });

  for (const auction of auctions) {
    auction.isClosed = true;
    await auction.save();

    // 낙찰자에게 이메일 전송
    if (auction.currentHighestUser) {
      const user = await User.findById(auction.currentHighestUser);
      if (user && user.email) {
        // 이메일 전송 설정
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: '[showU 경매 낙찰 안내]',
          text: `축하합니다! 
          '${auction.auctionName}' 경매에 낙찰되셨습니다. 
          가격 : ₩${auction.currentHighestBid.toLocaleString()}
          마이페이지 결제 정보 미결제 내역에서 확인 가능합니다.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`이메일 전송 완료 → ${user.email}`);
      }
    }
  }
});
