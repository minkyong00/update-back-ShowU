import express from 'express';
import passport from 'passport';
import { createBidCount, getAuctionProduct, getAuctionProductById, seedAuctionProducts } from '../../controller/shop/auctionController.js';

const auctionRouter = express.Router();

auctionRouter.get("/", getAuctionProduct) // /shop/auction (AuctionMain)
auctionRouter.get("/detail/:id", getAuctionProductById) // /shop/auction/detail/1 (AuctionDetail)
auctionRouter.put("/bid/:id", passport.authenticate('jwt', { session : false }), createBidCount) // /shop/auction/bid/:id (AuctionBidContainer)

export default auctionRouter;