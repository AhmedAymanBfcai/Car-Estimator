import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./users.entity";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () =>{
        // Create a fake copy of the users service
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
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
        fakeUsersService.find = () => Promise.resolve([ {id: 1, email: 'a', password: '1'} as User ]);
        try {
            await service.signup('ahmed@gmail.com', 'abcde'); // sign up with use the new implementation for the fakeUsersService above.
        } catch (err) {
            done();
        }
    });

    it('sign in a user with a correct email and password', async () => {
        const user = await service.signup('ahmed@gmail.com', 'abcde');

        expect(user.password).not.toEqual('abcde');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

});
