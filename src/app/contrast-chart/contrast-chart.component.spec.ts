import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContrastChartComponent } from './contrast-chart.component';

describe('ContrastChartComponent', () => {
  let component: ContrastChartComponent;
  let fixture: ComponentFixture<ContrastChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContrastChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContrastChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
