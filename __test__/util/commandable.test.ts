import { commandable } from '../../src/ts/util/commandable';

test('commandable', () => {
    expect(commandable()).toBeTruthy()

    Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (X11; Linux i686; rv:64.0) Gecko/20100101 Firefox/64.0'
    })

    expect(commandable()).toBeFalsy()
});