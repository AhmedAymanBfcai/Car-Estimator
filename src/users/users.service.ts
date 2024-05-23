import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; 
import { User } from './users.entity';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>){}
    // Repository<User: Means that repo is going to be an instance of a typeorm repository that deals with instances of users.
    // @InjectRepository(User): This will tell DI System that we need the user repository. DI is not good with generics so we need to use decorator.


    create (email: string, password: string) {
        // We use Create instead of passing body to save function as in case of save Hooks are not executed. Hooks are not executed in case of insert, update and delete, but save and remove.
        const user = this.repo.create({ email, password})

        return this.repo.save(user);
    }
}
