import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest(); // will return the underline request that is coming to our app.
    return request.currentUser;
})
