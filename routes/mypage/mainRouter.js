import express from 'express';
import passport from 'passport';
import { getMainTeam, getMainVod } from '../../controller/mypage/mainController.js';

const mainRouter = express.Router();

// mainRouter.get("/lesson", getMainLesson)
mainRouter.get("/team", getMainTeam)

mainRouter.get("/vod", getMainVod)

export default mainRouter;