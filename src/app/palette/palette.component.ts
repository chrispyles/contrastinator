import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import Color from 'color';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { ColorHistoryService } from '../color-history.service';
import { ContrastChartComponent } from '../contrast-chart/contrast-chart.component';
import { ContrastService } from '../contrast.service';
import { HeaderComponent } from '../header/header.component';
import { decodeColors, encodeColors } from '../lib/colors';
import { PaletteItemComponent } from '../palette-item/palette-item.component';

@Component({
  selector: 'app-palette',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    ContrastChartComponent,
    DialogModule,
    HeaderComponent,
    PaletteItemComponent,
  ],
  templateUrl: './palette.component.html',
  styleUrl: './palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--_num_palette_items]': 'colors().length',
  },
})
export class PaletteComponent implements OnInit {
  readonly encodedColors = input('');

  readonly updateColors = signal<Color[] | undefined>(undefined);

  readonly addColorIndex = signal<number | undefined>(undefined, { equal: () => false });

  readonly colors = computed(() => {
    const enc = this.encodedColors();
    if (!enc) return [];
    // TODO: handle decode errors
    try {
      return decodeColors(enc);
    } catch (e) {
      console.error(e);
      this.parserError = (e as Error).toString();
      this.showParserErrorDialog = true;
      return randomColorSet();
    }
  });

  parserError: string | undefined = undefined;
  showParserErrorDialog = false;

  colorLocks: boolean[] = [];

  readonly showActionsIndices = new Set<number>();

  private readonly colorHistoryService = inject(ColorHistoryService);
  private readonly contrastService = inject(ContrastService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => this.colorHistoryService.add(this.colors()));

    effect(() => {
      const colors = this.updateColors();
      if (!colors) return;
      this.router.navigate([`/${encodeColors(colors)}`]);
    });
  }

  ngOnInit(): void {
    // Redirect user to the viewport error page if the device is too small.
    if (window.innerWidth < 1000) {
      this.router.navigateByUrl('/viewport-error');
      return;
    }

    if (!this.encodedColors()) {
      this.updateColors.set(randomColorSet());
      return;
    }

    this.colorLocks = this.colors().map(() => false);

    document.body.addEventListener('keyup', (evt) => {
      if (evt.key !== ' ') return;
      this.randomizeColors();
    });
  }

  isLocked(i: number) {
    return this.colorLocks[i];
  }

  setLock(locked: boolean, i: number) {
    this.colorLocks[i] = locked;
  }

  addNewColor(index: number) {
    const colors = this.colors().slice();
    colors.splice(index, 0, randomColor());
    this.updateColors.set(colors);
    this.colorLocks.splice(index, 0, false);
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
    this.colorLocks.splice(i, 1);
  }

  randomizeColors() {
    const cs = this.colors().slice();
    for (let i = 0; i < cs.length; i++) {
      if (this.colorLocks[i]) continue;
      const nc = randomColor();
      this.contrastService.markChanged(cs[i], nc);
      cs[i] = nc;
    }
    this.updateColors.set(cs);
  }
}

function randomColor(): Color {
  return new Color({ r: Math.random() * 256, g: Math.random() * 256, b: Math.random() * 256 });
}

function randomColorSet(): Color[] {
  return new Array(6).fill(undefined).map(randomColor);
}
