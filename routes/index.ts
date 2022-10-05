import express from "express";
const router = express.Router();

import * as userResouce from '../app/resource/user.resource';

router.post("/api/public/user/login", userResouce.login);
router.post("/api/public/user/signup", userResouce.signup)

router.post("/api/resource/user/vote", userResouce.vote)
router.post("/api/resource/user/getAllVote", userResouce.getAllVote)

module.exports = router;
