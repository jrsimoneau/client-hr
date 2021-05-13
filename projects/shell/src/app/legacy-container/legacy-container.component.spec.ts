import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegacyContainerComponent } from './legacy-container.component';

describe('LegacyContainerComponent', () => {
  let component: LegacyContainerComponent;
  let fixture: ComponentFixture<LegacyContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegacyContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegacyContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
