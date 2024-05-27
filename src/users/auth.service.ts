import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util"; // A fuction will take a func as an argument and will make it return a promise instead of callback

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor (private usersService: UsersService){}

    async signup(email: string, password: string) {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer; // To give typesciprt a little bit of help :)
        const result = salt + '.' + hash.toString('hex');

        const user = await this.usersService.create(email, result);

        return user;
    }

    async signin(email: string, password: string){
        const [user] = await this.usersService.find(email); // As find func returns a list
    
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');
        
        const hash = await scrypt(password, salt, 32) as Buffer;

        if(storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Please Enter valid credentials.');
        } 
        
        return user;
    }
}