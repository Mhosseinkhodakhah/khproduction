"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieSchemaValidate = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
exports.MovieSchemaValidate = joi_1.default.object({
    title: joi_1.default.string().required(),
    genre: joi_1.default.string().required(),
    synopsis: joi_1.default.string().required()
});
const logSchema = new mongoose_1.Schema({
    user: {
        userName: { type: String },
        fullName: { type: String },
        profile: { type: String },
    },
    title: { type: String },
    description: { type: String }
}, { timestamps: true });
const logsModel = (0, mongoose_1.model)('logs', logSchema);
exports.default = logsModel;
