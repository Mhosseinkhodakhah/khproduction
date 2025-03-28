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
const responseService_1 = require("../service/responseService");
const models_1 = __importDefault(require("../DB/models"));
class interServiceController {
    putNewLog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const newLog = yield models_1.default.create(data);
            return next(new responseService_1.response(req, res, 'put new log ', 200, null, newLog));
        });
    }
}
exports.default = interServiceController;
