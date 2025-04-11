import express from 'express';
import passport from 'passport';
import { getPaymentList, getPaymentPadding } from '../../controller/mypage/myPaymentController.js';

const paymentRouter = express.Router();

// "my/payment/all"
paymentRouter.get("/all", passport.authenticate('jwt', { session : false }), getPaymentList)
// 'my/payment/padding'
paymentRouter.get("/padding", passport.authenticate('jwt', { session : false }), getPaymentPadding)

export default paymentRouter;