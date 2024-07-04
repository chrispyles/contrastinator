import { ComponentFixture, TestBed } from '@angular/core/testing';

import Color from 'color';
import { PaletteItemComponent } from './palette-item.component';

describe('PaletteItemComponent', () => {
  let component: PaletteItemComponent;
  let fixture: ComponentFixture<PaletteItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaletteItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaletteItemComponent);
    component = fixture.componentInstance;
    const componentRef = fixture.componentRef;
    componentRef.setInput('color', new Color('#000'));
    componentRef.setInput('locked', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
