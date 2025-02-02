import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanningsComponent } from './scannings.component';

describe('ScanningsComponent', () => {
  let component: ScanningsComponent;
  let fixture: ComponentFixture<ScanningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanningsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
