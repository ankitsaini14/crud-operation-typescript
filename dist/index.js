"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose = __importStar(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("./docs/swagger.json"));
const models_1 = __importDefault(require("./models"));
mongoose.connect('mongodb://localhost:27017/node_ts', () => {
    console.log("connect db");
});
const port = 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.post("/add-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        let user = new models_1.default({
            name,
            email,
            password
        });
        const data = yield user.save();
        return res.status(200).send({
            success: true,
            data,
            message: 'User added successfully'
        });
    }
    catch (err) {
        console.log(err);
    }
}));
app.get("/view-user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield models_1.default.findOne({ _id: req.params.id });
        if (!user) {
            res.status(200).send({
                success: false,
                data: "",
                message: 'User not found'
            });
        }
        else {
            res.status(200).send({
                success: true,
                user,
                message: 'User readed successfully'
            });
        }
    }
    catch (err) {
        console.log(err);
    }
}));
app.post("/update-user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.name;
        let user = yield models_1.default.findOne({ _id: req.params.id });
        if (!user) {
            res.status(200).send({
                success: false,
                data: "",
                message: 'User not found'
            });
        }
        else {
            let data = yield models_1.default.findByIdAndUpdate({ _id: req.params.id }, { name: name }, { new: true });
            res.status(200).send({
                success: true,
                data,
                message: 'User updated successfully'
            });
        }
    }
    catch (err) {
        console.log(err);
    }
}));
app.post("/delete-user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.default.findByIdAndDelete({ _id: req.params.id });
        if (!user) {
            return res.status(200).send({
                success: false,
                data: "",
                message: 'User not exist'
            });
        }
        else {
            res.status(200).send({
                success: true,
                user,
                message: 'User deleted successfully'
            });
        }
        ;
    }
    catch (err) {
        console.log(err);
    }
}));
app.listen(port, () => {
    console.log(`now listening on port ${port}`);
});
