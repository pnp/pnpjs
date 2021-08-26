import { Timeline, TimelinePipe } from "../timeline.js";

export function DebugLogger<T extends Timeline<any>>(handler?: (message: string) => void, filter = -1): TimelinePipe<T> {

    handler = handler || console.log;

    return (instance: T) => {

        instance.on.log((message, level) => {

            if (level > filter) {
                handler(message);
            }
        });

        return instance;
    };
}
