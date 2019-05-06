export interface IInvokableTest {
    desc: string;
    test: (...args: any[]) => Promise<any>;
}
