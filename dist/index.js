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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_service_1 = require("./services/auth.service");
const ai_service_1 = require("./services/ai.service");
const scan_service_1 = require("./services/scan.service");
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_1 = require("./libs/jwt");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({
    limit: "200mb",
}));
app.use((0, cookie_parser_1.default)());
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.json({
        message: "The API is up running fine!",
        status: "success",
        code: 200,
    });
});
/*
  An endpoint to get the response from the AI model and return it as a JSON response
*/
app.post("/ai/response/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, ai_service_1.getAIResponseAll)(req, res);
}));
app.post("/ai/response/locations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, ai_service_1.getAllLocationsNearby)(req, res);
}));
app.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_service_1.login)(req, res, next);
}));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_service_1.register)(req, res);
}));
app.get("/me", jwt_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_service_1.getMe)(req, res);
}));
// refresh token
app.post("/refresh", jwt_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_service_1.refresh)(req, res);
}));
// scan routes
app.post("/scan", jwt_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, scan_service_1.createScanService)(req, res);
}));
app.get("/scan/:id", jwt_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, scan_service_1.getScanByIdService)(req, res);
}));
app.get("/scan/user/:userId", jwt_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, scan_service_1.getScansByUserIdService)(req, res);
}));
app.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiKey = "AIzaSyBwfsoIP2n5mYQAauWVrLkRQcul_odtGSs";
        const query = req.query.q; // Retrieve the query parameter from the request
        const response = yield axios_1.default.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                key: apiKey,
                q: query,
                part: "snippet",
                type: "video",
                maxResults: 10, // You can adjust this value as needed
            },
        });
        res.json(response.data);
    }
    catch (error) {
        console.error("Error fetching data from YouTube API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.post("/scan/:id/complete", jwt_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, scan_service_1.completeScan)(req, res);
}));
/* -------------------------------------------------------------------------- */
/*                                Error Handler                               */
/* -------------------------------------------------------------------------- */
app.use((req, res) => {
    res.status(404).json({
        message: "Not Found",
        status: "failed",
        code: 404,
    });
});
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is at http://localhost:${PORT}/`);
    });
})
    .catch((err) => {
    console.error("MongoDB Err: ", err);
});
