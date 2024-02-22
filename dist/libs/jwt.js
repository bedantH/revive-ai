"use strict";
// authentication middleware
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const user_model_1 = __importDefault(require("../models/user.model"));
function authenticate(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
                status: "failed",
                code: 401,
            });
        }
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_KEY);
            const user = yield user_model_1.default.findById(decoded === null || decoded === void 0 ? void 0 : decoded.user._id).exec();
            if (!user) {
                return res.status(401).json({
                    message: "Unauthorized",
                    status: "failed",
                    code: 401,
                });
            }
            req.body.user = user;
            next();
        }
        catch (err) {
            return res.status(401).json({
                message: "Unauthorized",
                status: "failed",
                code: 401,
            });
        }
    });
}
exports.authenticate = authenticate;
