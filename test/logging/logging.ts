import { expect } from "chai";
import { Logger, LogLevel, FunctionListener } from "@pnp/logging";
import { pnpTest } from "../pnp-test.js";

describe("Logging", function () {

    describe("Logger", function () {

        const logger = Logger;

        beforeEach(function () {
            logger.clearSubscribers();
        });

        it("Subscribe an ILogListener", pnpTest("084623db-6728-43e9-964b-bbe3dcf9441c", function () {
            const message = "Test message";
            let message2 = "";
            logger.subscribe(FunctionListener((e) => {
                message2 = e.message;
            }));
            logger.write(message, LogLevel.Warning);
            expect(message2).to.eq(message);
        }));

        it("Log a simple object", pnpTest("c21ecee4-5e35-405f-8be6-25330d5d21ed", function () {
            let message2 = "";
            let level2 = LogLevel.Verbose;
            logger.subscribe(FunctionListener((e) => {
                level2 = e.level;
                message2 = e.message;
            }));
            logger.log({ level: LogLevel.Error, message: "Test message" });
            expect(message2).to.eq("Test message");
            expect(level2).to.eql(LogLevel.Error);
        }));

        it("Subscribers Count", pnpTest("b2a0f595-4328-479d-b216-8200330529cb", function () {
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
        }));

        it("Add multiple subscribes in one call", pnpTest("624f3e1e-76e2-40b7-ae56-e823637e03c1", function () {
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
        }));

        it("Log to multiple listeners", pnpTest("a77139fa-c6c9-4d78-8fe0-2e04020c8382", function () {
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
        }));
    });
});
