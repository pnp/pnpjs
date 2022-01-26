
export const mochaHooks = {
    beforeAll: [
        async function spSetup() {
            console.log("1");
        },
        async function graphSetup() {
            console.log("2");
        },
    ],
    afterAll: [
        async function spTeardown() {
            console.log("3");
        },
        async function graphTeardown() {
            console.log("4");
        },
    ],
};
