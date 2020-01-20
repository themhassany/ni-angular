import { NiDatetimePipe } from './ni-datetime.pipe';

describe('NiDatetimePipePipe', () => {
  it('create an instance', () => {
    const pipe = new NiDatetimePipe(null, null);
    expect(pipe).toBeTruthy();
  });
});
