import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsgApplication } from './tsg-application';

describe('TsgApplication', () => {
  let component: TsgApplication;
  let fixture: ComponentFixture<TsgApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsgApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsgApplication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
