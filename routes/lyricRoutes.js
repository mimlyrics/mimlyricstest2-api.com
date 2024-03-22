const router = require('express').Router();
const multer = require('multer');
const DIR = "./public/mimlyrics/lyrics";
const path = require('path');
const fs = require('fs');

async function createLyricsFolder(DIR) {
    try {
        if(!fs.existsSync(DIR)) {
            fs.mkdirSync(DIR);    
        }
    }catch(err) {
        console.log(err);
    }
}
createLyricsFolder(DIR);

const Lyric = require("../models/Lyric");
const asyncHandler = require("express-async-handler");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR);
    },
    filename: function(req, file, cb) {
        console.log(file);
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "_" + uniqueSuffix + path.extname(file.originalname) );
    }
})

function fileFilter(req, file, cb) {
    if(file.mimetype.split("/")[0] === "image") {
        cb(null, true);
    }else {
        cb(new Error('Not an audio file type'), false);
    }
} 

const ROOM_URL = "/api/v1/room";
const LYRIC_URL = "/api/v1/lyric";
const GET_LYRIC_URL = "/api/v1/lyric/get";
const EDIT_LYRIC_URL = "/api/v1/lyric/edit";
const DELETE_LYRIC_URL = "/api/v1/lyric";
const VIEWS_LYRIC_URL = "/api/v1/lyric/views";
const LIKES_LYRIC_URL = "/api/v1/lyric/likes";
const RECOMMENDED_LYRIC_URL = "/api/v1/lyric/recommendation";
const SEARCH_LYRIC_URL = "/api/v1/lyric/search";

const upload = multer({storage,limits: {fileSize: 2000_000_000}});
const { searchLyrics, EditLyric, deleteLyric, postLyric, getLyric, 
    getLyricById, lyricViews, likeLyric, lyricRecommendation} = require("../controllers/lyricController");
router.route("/lyric").post(upload.array("files", 2),postLyric);
router.route("/lyric/:category").get(getLyric);
router.route("/lyric/get/:id").get(getLyricById);
router.route("/lyric/edit/:id").put(upload.array("files", 2),EditLyric);
router.route("/lyric/:id").delete(deleteLyric);
router.route("/lyric/search/:searchId").get(searchLyrics);
router.route("/lyric/views/:mediaId").put(lyricViews);
router.route("/lyric/likes/:mediaId").put(likeLyric);
router.route("/lyric/:category/recommendation").put(lyricRecommendation);
module.exports = router;
