import { expect } from "chai";
import { Logger, LogLevel, FunctionListener } from "@pnp/logging";

describe("Logging", () => {

    describe("Logger", () => {

        const logger = Logger;

        beforeEach(() => {
            logger.clearSubscribers();
        });

        it("Can create an Logger instance and subscribe an ILogListener", () => {
            const message = "Test message";
            let message2 = "";
            logger.subscribe(new FunctionListener((e) => {
                message2 = e.message;
            }));
            logger.write(message, LogLevel.Warning);
            expect(message2).to.eq(message);
        });

        it("Can create an Logger instance and log a simple object", () => {
            let message2 = "";
            let level2 = LogLevel.Verbose;
            logger.subscribe(new FunctionListener((e) => {
                level2 = e.level;
                message2 = e.message;
            }));
            logger.log({ level: LogLevel.Error, message: "Test message" });
            expect(message2).to.eq("Test message");
            expect(level2).to.eql(LogLevel.Error);
        });

        it("Should return an accurate count of subscribers", () => {
            logger.subscribe(new FunctionListener(() => { return; }));
            logger.subscribe(new FunctionListener(() => { return; }));
            logger.subscribe(new FunctionListener(() => { return; }));
            expect(logger.count).to.eq(3);
        });

        it("Should allow multiple subscribes to be added in one call", () => {
            logger.subscribe(
                new FunctionListener(() => { return; }),
                new FunctionListener(() => { return; }),
                new FunctionListener(() => { return; }),
            );
            expect(logger.count).to.eq(3);
        });

        it("Should correctly log to multiple listeners", () => {
            let message1 = "";
            let message2 = "";
            let message3 = "";
            logger.subscribe(
                new FunctionListener((e) => { message1 = e.message; }),
                new FunctionListener((e) => { message2 = e.message; }),
                new FunctionListener((e) => { message3 = e.message; }),
            );
            logger.activeLogLevel = LogLevel.Verbose;
            logger.write("Test message");
            expect(message1).to.eq("Test message");
            expect(message2).to.eq("Test message");
            expect(message3).to.eq("Test message");
        });
    });
});
