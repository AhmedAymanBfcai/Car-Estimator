import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./users.entity";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () =>{
        // Create a fake copy of the users service
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => { const filteredUsers = users.filter(user => user.email === email); return Promise.resolve(filteredUsers)},
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 999999), email, password} as User
                users.push(user);
                return Promise.resolve(user);
            }
        }
        
        // Create new DI Container
        const module = await Test.createTestingModule({
            // Providing array is a listing of all the different classes that we might want to inject into our container.
            providers: [AuthService, {provide: UsersService, useValue: fakeUsersService}]
        }).compile();
        
        service = module.get(AuthService); // IT will cause our DI Container to create a new instance of the auth service with all of its different dependecies already initialized. 
    });

    it('Can Create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('created a new user with a salted and hased password', async () => {
        const user = await service.signup('ahmed@gmail.com', 'abcde');

        expect(user.password).not.toEqual('abcde');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user sign up with email that in use', async (done) => {
        await service.signup('ahmed@gmail.com', 'abcde');
        try {
            await service.signup('ahmed@gmail.com', 'abcde'); // sign up with use the new implementation for the fakeUsersService above.
        } catch (err) {
            done();

        }
    });

    it('throws an error if sign in is called with an unused email', async (done) => {
        try {
            await service.signin('ahmed@gmail.com', 'abcde');
        } catch (err) {
            done();
        }
    });

    it('throws an error if invalid password is provided', async (done) => {
        await service.signup('ahmed@gmail.com', 'password1111');
        try {
            await service.signin('ahmed@gmail.com', 'password');
        } catch (err) {
            done();
        }
    });

    it('returns a user if correct password is provided', async () => {
        await service.signup('ahmed@gmail.com', 'password');
        const user = await service.signin('ahmed@gmail.com', 'password');
        expect(user).toBeDefined();
    });


});