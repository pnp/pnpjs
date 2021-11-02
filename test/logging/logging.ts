import { expect } from "chai";
import { Logger, LogLevel, FunctionListener } from "@pnp/logging";

describe("Logging", function () {

    describe("Logger", function () {

        const logger = Logger;

        beforeEach(function () {
            logger.clearSubscribers();
        });

        it("Subscribe an ILogListener", function () {
            const message = "Test message";
            let message2 = "";
            logger.subscribe(FunctionListener((e) => {
                message2 = e.message;
            }));
            logger.write(message, LogLevel.Warning);
            expect(message2).to.eq(message);
        });

        it("Log a simple object", function () {
            let message2 = "";
            let level2 = LogLevel.Verbose;
            logger.subscribe(FunctionListener((e) => {
                level2 = e.level;
                message2 = e.message;
            }));
            logger.log({ level: LogLevel.Error, message: "Test message" });
            expect(message2).to.eq("Test message");
            expect(level2).to.eql(LogLevel.Error);
        });

        it("Subscribers Count", function () {
            logger.subscribe(FunctionListener(function () {
                return;
            }));
            logger.subscribe(FunctionListener(function () {
                return;
            }));
            logger.subscribe(FunctionListener(function () {
                return;
            }));
            expect(logger.count).to.eq(3);
        });

        it("Add multiple subscribes in one call", function () {
            logger.subscribe(
                FunctionListener(function () {
                    return;
                }),
                FunctionListener(function () {
                    return;
                }),
                FunctionListener(function () {
                    return;
                }),
            );
            expect(logger.count).to.eq(3);
        });

        it("Log to multiple listeners", function () {
            let message1 = "";
            let message2 = "";
            let message3 = "";
            logger.subscribe(
                FunctionListener((e) => {
                    message1 = e.message;
                }),
                FunctionListener((e) => {
                    message2 = e.message;
                }),
                FunctionListener((e) => {
                    message3 = e.message;
                }),
            );
            logger.activeLogLevel = LogLevel.Verbose;
            logger.write("Test message");
            expect(message1).to.eq("Test message");
            expect(message2).to.eq("Test message");
            expect(message3).to.eq("Test message");
        });
    });
});
