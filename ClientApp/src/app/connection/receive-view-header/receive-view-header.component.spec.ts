import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveViewHeaderComponent } from './receive-view-header.component';

describe('ReceiveViewHeaderComponent', () => {
  let component: ReceiveViewHeaderComponent;
  let fixture: ComponentFixture<ReceiveViewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveViewHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
