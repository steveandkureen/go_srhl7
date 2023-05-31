import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendViewHeaderComponent } from './send-view-header.component';

describe('SendViewHeaderComponent', () => {
  let component: SendViewHeaderComponent;
  let fixture: ComponentFixture<SendViewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendViewHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
