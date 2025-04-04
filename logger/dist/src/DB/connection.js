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
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connect('mongodb+srv://kianlucifer0098:Lucifer25255225@cluster0.egc60ev.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
        console.log('database connected successfully . . .');
    }).catch((err) => {
        console.log('error occured while connecting to database', `${err}`);
    });
});
