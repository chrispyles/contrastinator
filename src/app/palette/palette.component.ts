import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import Color from 'color';
import { ButtonModule } from 'primeng/button';

import { ColorHistoryService } from '../color-history.service';
import { ContrastChartComponent } from '../contrast-chart/contrast-chart.component';
import { ContrastService } from '../contrast.service';
import { HeaderComponent } from '../header/header.component';
import { decodeColors, encodeColors } from '../lib/colors';
import { PaletteItemComponent } from '../palette-item/palette-item.component';

@Component({
  selector: 'app-palette',
  standalone: true,
  imports: [ButtonModule, CommonModule, ContrastChartComponent, HeaderComponent, PaletteItemComponent],
  templateUrl: './palette.component.html',
  styleUrl: './palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--_num_palette_items]': 'colors().length',
  },
})
export class PaletteComponent {
  readonly encodedColors = input('');

  readonly updateColors = signal<Color[] | undefined>(undefined);

  readonly addColorIndex = signal<number | undefined>(undefined, { equal: () => false });

  readonly colors = computed(() => decodeColors(this.encodedColors()));

  readonly showActionsIndices = new Set<number>();

  private readonly colorHistoryService = inject(ColorHistoryService);
  private readonly contrastService = inject(ContrastService);
  private readonly router = inject(Router);

  constructor() {
    effect(
      () => this.contrastService.setColor(this.colors().at(1) ?? new Color()),
      { allowSignalWrites: true });

    effect(() => this.colorHistoryService.add(this.colors()));

    effect(() => {
      const colors = this.updateColors();
      if (!colors) return;
      this.router.navigate([`/${encodeColors(colors)}`]);
    });
  }

  addNewColor(index: number) {
    const colors = this.colors().slice();
    colors.splice(index, 0, randomColor());
    this.updateColors.set(colors);
  }

  colorChanged(c: Color, i: number) {
    const colors = this.colors().slice();
    colors.splice(i, 1, c);
    this.updateColors.set(colors);
  }

  remove(i: number) {
    const colors = this.colors().slice();
    colors.splice(i, 1);
    this.updateColors.set(colors);
  }
}

function randomColor(): Color {
  return new Color({ r: Math.random() * 256, g: Math.random() * 256, b: Math.random() * 256 });
}
