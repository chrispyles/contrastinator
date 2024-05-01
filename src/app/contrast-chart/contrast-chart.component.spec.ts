import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Color from 'color';

import { By } from '@angular/platform-browser';
import { ContrastChartComponent } from './contrast-chart.component';

describe('ContrastChartComponent', () => {
  let fixture: ComponentFixture<ContrastChartComponent>;
  let de: DebugElement;
  let colors: Color[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContrastChartComponent]
    }).compileComponents();

    colors = [
      new Color('#000'),
      new Color('#223344'),
      new Color('#FFF'),
    ];

    fixture = TestBed.createComponent(ContrastChartComponent);
    fixture.componentRef.setInput('colors', colors);
    fixture.detectChanges();

    de = fixture.debugElement;
  });

  it('shows a table containing the contrasts', () => {
    expect(de.query(By.css('table'))).toBeDefined();

    const cells = de.queryAll(By.css('td, th'));
    expect(cells.map(c => c.nativeElement.innerText)).toEqual([
      // row 1
      '',
      '#000000',
      '#223344',
      '#FFFFFF',

      // row 2
      '#FFFFFF',
      '21',
      '12.923',
      '1',

      // row 3
      '#223344',
      '1.625',
      '1',
      '',

      // row 4
      '#000000',
      '1',
      '',
      '',
    ]);
  });

  it('sets the background color of each th element', () => {
    const ths = de.queryAll(By.css('th'));
    expect(ths.map(e => {
      const bgc = e.nativeElement.style.backgroundColor;
      return bgc && new Color(bgc).hex();
    })).toEqual([
      '',
      '#000000',
      '#223344',
      '#FFFFFF',
      '#FFFFFF',
      '#223344',
      '#000000',
    ]);
  });
});
