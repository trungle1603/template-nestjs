import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MemoryUsageMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // sets the start time of the request in high-resolution time (nanoseconds).
        const start = process.hrtime();

        // listens for the finish event on the response object
        res.once('finish', function () {
            const diff = process.hrtime(start); // calculates the difference between the start time and the current time in high-resolution time (nanoseconds).

            const duration = diff[0] * 1000 + diff[1] / 1e6; // converts nanoseconds to milliseconds.
            const memUsage = process.memoryUsage().heapUsed / 1024 / 1024; // gets the heap memory usage and convert to MB

            console.log(
                `Duration: ${duration.toFixed(2)} ms | ${(
                    duration / 1000
                ).toFixed(2)} s`,
            );
            console.log(`Memory usage: ${memUsage.toFixed(2)} MB`);
        });

        next();
    }
}
