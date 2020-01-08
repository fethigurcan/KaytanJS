const Kaytan=require("../");

test('Empty Template With Undefined Data', () => {
    expect((new Kaytan('')).execute() ).toBe('');
});

test('Empty Template With Empty Data', () => {
    expect((new Kaytan('')).execute({}) ).toBe('');
});

test('Empty Template With Emtpy Array', () => {
    expect((new Kaytan('')).execute([]) ).toBe('');
});

test('Undefined Template With Undefined Data', () => {
    expect((new Kaytan()).execute() ).toBe('');
});

test('Undefined Template With Empty Data', () => {
    expect((new Kaytan()).execute({}) ).toBe('');
});

test('Undefined Template With Emtpy Array', () => {
    expect((new Kaytan()).execute([]) ).toBe('');
});