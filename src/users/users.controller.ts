import { Body, Controller, Post, Get, Patch, Param, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersService } from './users.service';

@Controller('auth') //auth is used as a prefix for all our handlers in the class
export class UsersController {
    constructor(private userService: UsersService){}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        this.userService.create(body.email, body.password)
    }

    @Get('/:id')
    findUser(@Param('id') id: string) {
        return this.userService.findOne(parseInt(id)); // As nest deal with the number in the url as a string.
    }

    // @Post('/signup')
    // createUser(@Body() body: CreateUserDto) {
    //     this.userService.create(body.email, body.password)
    // }

    // @Post('/signup')
    // createUser(@Body() body: CreateUserDto) {
    //     this.userService.create(body.email, body.password)
    // }

    // @Post('/signup')
    // createUser(@Body() body: CreateUserDto) {
    //     this.userService.create(body.email, body.password)
    // }
}
