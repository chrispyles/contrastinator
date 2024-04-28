import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewportErrorComponent } from './viewport-error.component';

describe('ViewportErrorComponent', () => {
  let component: ViewportErrorComponent;
  let fixture: ComponentFixture<ViewportErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewportErrorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewportErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
