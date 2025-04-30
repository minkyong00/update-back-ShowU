import express from 'express';
import passport from 'passport';
import { getSearchResult } from '../../controller/search/searchController.js';

const searchRouter = express.Router();

// '/search'
searchRouter.get("/", getSearchResult)

export default searchRouter;