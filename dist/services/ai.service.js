"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLocationsNearby = exports.getAIResponseAll = void 0;
const gen_ai_1 = require("../libs/gen-ai");
function getAIResponseAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const location = req.body.location;
        const image = req.body.image;
        const mimeType = req.body.mimeType;
        (0, gen_ai_1.getTextResponse)(location, image, mimeType)
            .then((data) => {
            res.status(200).json({
                message: "Response fetched successfully",
                status: "success",
                code: 200,
                data,
            });
        })
            .catch((err) => {
            console.log(err);
            res.status(503).json({
                message: err,
                status: "failed",
                code: 503,
            });
        });
    });
}
exports.getAIResponseAll = getAIResponseAll;
function getAllLocationsNearby(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const location = req.body.location;
        (0, gen_ai_1.getNearestStations)(location)
            .then((stationsData) => {
            res.status(200).json({
                message: "Response fetched successfully",
                status: "success",
                code: 200,
                data: stationsData,
            });
        })
            .catch((err) => {
            res.status(503).json({
                message: `Couldn't find any locations near ${location}`,
                status: "failed",
                code: 503,
                data: err,
            });
        });
    });
}
exports.getAllLocationsNearby = getAllLocationsNearby;
