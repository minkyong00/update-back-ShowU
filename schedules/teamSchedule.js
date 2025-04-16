import cron from 'node-cron';
import User from '../models/users/userSchema.js';
import nodemailer from 'nodemailer';
import { getCurrentTime } from '../utils/utils.js';
import TeamMatching from '../models/showu/teamMatchingSchema.js';
import moment from 'moment';

// 팀 매칭 공고가 마감되면 팀 리더에게 이메일 전송

cron.schedule('* * * * *', async () => {
  // const now = new Date();
  const now = moment().toDate();
  // console.log("지금", now)
  

  // 마감시간이 지났고 아직 종료되지 않은 팀 공고 찾기
  const teams = await TeamMatching.find({
    deadLine : { $lte: now },
    isClosed: false,
  });

  for (const team of teams) {
    team.isClosed = true;
    await team.save();

    // 낙찰자에게 이메일 전송
    if (team.teamLeader) {
      const user = await User.findById(team.teamLeader);
      console.log("유저 이메일", user.email)
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
          subject: '[showU 팀 매칭 안내]',
          text: `안녕하세요 showU입니다.
          '${team.teamName}' 팀 매칭 공고가 마감되었습니다. 
          마이페이지 MY TEAM 개설 팀 매칭 내역에서 확인 가능합니다.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`이메일 전송 완료 → ${user.email}`);
      }
    }
  }
});
