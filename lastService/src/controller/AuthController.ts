import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { responseModel } from "../util/response.model";
import monitor from "../util/statusMonitor";

export class AuthController {
    private userRepository = AppDataSource.getRepository(User);

    async register(request: Request, response: Response , next : any) {
        const { phoneNumber, password } = request.body;

    //     scope: string,
    // status: number,
    // error: string | null,


        if (!phoneNumber || !password) {
            monitor.addStatus({
                scope : 'authController',
                status : 0,
                error : 'شماره همراه و پسوورد اشتباه وارد شده'
            })
            // return next(new responseModel(request, response, 'Phone number and password are required.' ,'admin service', 200, , null))
            return response.status(400).json({ message: "Phone number and password are required." });
        }

        try {
            const existingUser = await this.userRepository.findOne({ where: { phoneNumber } });
            if (existingUser) {
                monitor.addStatus({
                    scope : 'authController',
                    status : 0,
                    error : 'شماره تلفن قبلا ثبت نام کرده'
                })
                return response.status(400).json({ message: "Phone number already registered." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = this.userRepository.create({ phoneNumber, password: hashedPassword });
            await this.userRepository.save(user);
            monitor.addStatus({
                scope : 'authController',
                status : 1,
                error : null
            })
            return response.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            monitor.addStatus({
                scope : 'authController',
                status : 0,
                error : `${error}`
            })
            console.error("Registration error:", error);
            return response.status(500).json({ message: "Internal Server Error" });
        }
    }

    async login(request: Request, response: Response) {
        const { phoneNumber, password } = request.body;

        try {
            const user = await this.userRepository.findOne({ where: { phoneNumber } });
            if (!user) {
                monitor.addStatus({
                    scope : 'authController',
                    status : 0,
                    error : 'حساب کاربری یافت نشد'
                })
                return response.status(400).json({ message: "Invalid credentials." });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                monitor.addStatus({
                    scope : 'authController',
                    status : 0,
                    error : 'رمز عبور نادرست است'
                })
                return response.status(403).json({ message: "Invalid credentials." });
            }

            const token = jwt.sign({ userId: user.id}, "your_secret_key", { expiresIn: "7d" });
            monitor.addStatus({
                scope : 'authController',
                status : 1,
                error : null
            })
            return response.status(200).json({ token });
        } catch (error) {
            console.error("Login error:", error);
            monitor.addStatus({
                scope : 'authController',
                status : 0,
                error :`${error}`
            })
            return response.status(500).json({ message: "Internal Server Error" });
        }
    }
}
