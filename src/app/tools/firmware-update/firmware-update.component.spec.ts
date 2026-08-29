import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmwareUpdateComponent } from './firmware-update.component';

describe('FirmwareUpdateComponent', () => {
  let component: FirmwareUpdateComponent;
  let fixture: ComponentFixture<FirmwareUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmwareUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirmwareUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
