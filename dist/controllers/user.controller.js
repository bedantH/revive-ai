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
exports.updateUserDetails = exports.comparePassword = exports.removeScanFromUserHistory = exports.addScanToUserHistory = exports.getUserById = exports.getUserByEmail = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function createUser(name, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = new user_model_1.default({
            name,
            email,
            password: bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10)),
        });
        return user.save();
    });
}
exports.createUser = createUser;
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_model_1.default.findOne({ email }).populate("history").exec();
    });
}
exports.getUserByEmail = getUserByEmail;
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_model_1.default.findById(id).populate("history").exec();
    });
}
exports.getUserById = getUserById;
function addScanToUserHistory(userId, scanId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(userId).populate("history").exec();
        user === null || user === void 0 ? void 0 : user.updateOne({ history: [...user.history, scanId] });
    });
}
exports.addScanToUserHistory = addScanToUserHistory;
function removeScanFromUserHistory(userId, scanId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(userId).populate("history").exec();
        user === null || user === void 0 ? void 0 : user.updateOne({
            history: user.history.filter((id) => id.toString() !== scanId),
        });
    });
}
exports.removeScanFromUserHistory = removeScanFromUserHistory;
function comparePassword(id, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(id).exec();
        return user === null || user === void 0 ? void 0 : user.comparePassword(password);
    });
}
exports.comparePassword = comparePassword;
function updateUserDetails(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return user_model_1.default.findByIdAndUpdate(id, data).exec();
    });
}
exports.updateUserDetails = updateUserDetails;
