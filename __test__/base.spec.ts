import { commandable } from '../src/ts/util/commandable';

test('basic', () => {
    expect(commandable()).toBe(true);
});