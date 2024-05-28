import { Injectable, NotFoundException } from '@nestjs/common';
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

    findOne(id: number) {
       if(!id) {
        return null;
       }
        return this.repo.findOneBy({id})
    }

    find(email: string){
       return this.repo.findBy({email})
    }

    async update(id: number, attributes: Partial<User>){
        // Partial is a type helper tells us that attrs can be any object that has at least or none some of the properities of the user class. 
        const user = await this.findOne(id);
        if (!user){
            throw new NotFoundException('User not found');
        }

        Object.assign(user, attributes);

        return this.repo.save(user);
    }

    async remove(id: number){
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException("User not found");
        }

        return this.repo.remove(user);
    }
}
