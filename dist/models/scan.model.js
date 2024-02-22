"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const scanSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    object: {
        type: String,
        required: true,
    },
    result: {
        type: Object,
        required: true,
    },
    is_completed: {
        type: Boolean,
        default: false,
    },
    how_desc: {
        type: String,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Scan", scanSchema);
