import { MaintainModule } from './maintain.module';

describe('MaintainModule', () => {
  let maintainModule: MaintainModule;

  beforeEach(() => {
    maintainModule = new MaintainModule();
  });

  it('should create an instance', () => {
    expect(maintainModule).toBeTruthy();
  });
});
