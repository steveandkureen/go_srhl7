import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveViewComponent } from './receive-view.component';

describe('ReceiveViewComponent', () => {
  let component: ReceiveViewComponent;
  let fixture: ComponentFixture<ReceiveViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
