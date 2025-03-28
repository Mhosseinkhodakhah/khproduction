import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthController {
    private userRepository = AppDataSource.getRepository(User);

    async register(request: Request, response: Response) {
        const { phoneNumber, password } = request.body;

        if (!phoneNumber || !password) {
            return response.status(400).json({ message: "Phone number and password are required." });
        }

        try {
            const existingUser = await this.userRepository.findOne({ where: { phoneNumber } });
            if (existingUser) {
                return response.status(400).json({ message: "Phone number already registered." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = this.userRepository.create({ phoneNumber, password: hashedPassword });
            await this.userRepository.save(user);

            return response.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            console.error("Registration error:", error);
            return response.status(500).json({ message: "Internal Server Error" });
        }
    }

    async login(request: Request, response: Response) {
        const { phoneNumber, password } = request.body;

        try {
            const user = await this.userRepository.findOne({ where: { phoneNumber } });
            if (!user) {
                return response.status(401).json({ message: "Invalid credentials." });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return response.status(401).json({ message: "Invalid credentials." });
            }

            const token = jwt.sign({ userId: user.id}, "your_secret_key", { expiresIn: "7d" });
            return response.status(200).json({ token });
        } catch (error) {
            console.error("Login error:", error);
            return response.status(500).json({ message: "Internal Server Error" });
        }
    }
}
