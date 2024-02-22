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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.refresh = exports.logout = exports.login = exports.register = void 0;
const user_controller_1 = require("../controllers/user.controller");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Invalid input",
                status: "failed",
                code: 400,
            });
        }
        let existingUser;
        try {
            existingUser = yield (0, user_controller_1.getUserByEmail)(email);
        }
        catch (error) {
            return res.status(500).json({
                message: "Signup failed, please try again later.",
                status: "failed",
                code: 500,
            });
        }
        if (existingUser) {
            return res.status(422).json({
                message: "User exists already, please login instead.",
                status: "failed",
                code: 422,
            });
        }
        const newUser = yield (0, user_controller_1.createUser)(name, email, password);
        const token = jsonwebtoken_1.default.sign({
            user: newUser,
        }, process.env.JWT_KEY, {
            expiresIn: "1h",
        });
        const refreshToken = jsonwebtoken_1.default.sign({
            user: newUser,
        }, process.env.JWT_KEY, {
            expiresIn: "1h",
        });
        res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
        })
            .cookie("token", token, {
            httpOnly: true,
        })
            .header("Authorization", `Bearer ${token}`)
            .status(201)
            .json({
            userId: newUser.id,
            email: newUser.email,
            token,
        });
    });
}
exports.register = register;
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Invalid email or password",
                status: "failed",
                code: 400,
            });
        }
        let existingUser;
        try {
            existingUser = yield (0, user_controller_1.getUserByEmail)(email);
        }
        catch (err) {
            return res.status(500).json({
                message: "Logging in failed, please try again later.",
                status: "failed",
                code: 500,
            });
        }
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failed",
                code: 401,
            });
        }
        const isValidPassword = yield (0, user_controller_1.comparePassword)(existingUser.id, password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failed",
                code: 401,
            });
        }
        const token = jsonwebtoken_1.default.sign({
            user: existingUser,
        }, process.env.JWT_KEY, { expiresIn: "1h" });
        const refreshToken = jsonwebtoken_1.default.sign({
            user: existingUser,
        }, process.env.JWT_KEY, { expiresIn: "1h" });
        res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
        })
            .cookie("token", token, {
            httpOnly: true,
        })
            .header("Authorization", `Bearer ${token}`)
            .status(200)
            .json({
            userId: existingUser.id,
            email: existingUser.email,
            token,
        });
    });
}
exports.login = login;
function logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        res.clearCookie("refreshToken").status(200).json({
            message: "Logged out",
            status: "success",
            code: 200,
        });
    });
}
exports.logout = logout;
function refresh(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a["refreshToken"];
        if (!refreshToken) {
            return res.status(401).send("Access Denied. No refresh token provided.");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_KEY);
            const accessToken = jsonwebtoken_1.default.sign({
                userId: decoded.userId,
                email: decoded.email,
            }, process.env.JWT_KEY, { expiresIn: "1h" });
            res.header("Authorization", accessToken).json({
                message: "Token refreshed successfully",
                status: "success",
                code: 200,
                data: {
                    userId: decoded === null || decoded === void 0 ? void 0 : decoded.userId,
                    email: decoded === null || decoded === void 0 ? void 0 : decoded.email,
                    token: accessToken,
                },
            });
        }
        catch (error) {
            return res.status(400).send("Invalid refresh token.");
        }
    });
}
exports.refresh = refresh;
function getMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.token;
        jsonwebtoken_1.default.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: "Forbidden",
                    status: "failed",
                    code: 403,
                });
            }
            res.status(200).json({
                message: "User fetched successfully",
                status: "success",
                code: 200,
                data: user,
            });
        });
    });
}
exports.getMe = getMe;
