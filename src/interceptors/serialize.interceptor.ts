import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

// Class Custom type
interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serlialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

// - extends vs implements
// extends -> We use it whenever we are subclassing an existing class.
// implements -> we use it when we want to create a new class that satisfies all the requirements of either an abstract class or an Interface.
export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any){}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // Run something before a request is handled by the request handler..


        return handler.handle().pipe(
            map((data: any) => {
                // Run something befroe response is sent out
                return plainToClass(this.dto, data, {
                    // Make sure everything work as expected by adding the setting, 
                    // It ensures that whenever we have an instance of user and try to run it into plain JSON
                    // It is only going to share or expose the different properties that are specifically marked with that exposed directive.
                    excludeExtraneousValues: true, 
                })
            })
        )
    }
}