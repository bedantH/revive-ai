"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    history: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Scan",
        },
    ],
}, {
    timestamps: true,
    methods: {
        encryptPassword: function (password) {
            return bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
        },
        comparePassword: function (password) {
            return bcrypt_1.default.compareSync(password, this.password);
        },
    },
});
exports.default = mongoose_1.default.model("User", userSchema);
