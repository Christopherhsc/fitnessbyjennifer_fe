import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { ScanningsComponent } from './scannings.component';

describe('ScanningsComponent', () => {
  let component: ScanningsComponent;
  let fixture: ComponentFixture<ScanningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanningsComponent],
      providers: [provideHttpClient(), provideRouter([])],
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
