import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import Color from 'color';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { ColorHistoryService } from '../color-history.service';
import { ContrastChartComponent } from '../contrast-chart/contrast-chart.component';
import { ContrastService } from '../contrast.service';
import { HeaderComponent } from '../header/header.component';
import { decodeColors, encodeColors } from '../lib/colors';
import {
  ColorMove,
  PaletteItemComponent,
} from '../palette-item/palette-item.component';

/** A component that renders a color palette. */
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
  /** The string containing the encoded colors from the app URL. */
  readonly encodedColors = input('');

  /** A signal that can be written to to update the app route to reflect a new set of colors. */
  readonly updateColors = signal<Color[] | undefined>(undefined);

  /**
   * A signal that adds a new random color to the current list of colors at the specified index.
   */
  readonly addColorIndex = signal<number | undefined>(undefined, {
    equal: () => false,
  });

  /** The current list of colors. */
  readonly colors = computed(() => {
    const enc = this.encodedColors();
    if (!enc) return [];
    try {
      return decodeColors(enc);
    } catch (e) {
      console.error(e);
      this.parserError = (e as Error).toString();
      this.showParserErrorDialog = true;
      return randomColorSet();
    }
  });

  /** An error thrown why parsing {@link encodedColors}. */
  parserError: string | undefined = undefined;

  /** Whether the parser error dialog is open. */
  showParserErrorDialog = false;

  /** A list indicating which colors are currently locked, in the same order as {@link colors}. */
  colorLocks: boolean[] = [];

  /**
   * A set of indices into {@link colors} that indicates which palette items should have their
   * action buttons showing.
   */
  readonly showActionsIndices = new Set<number>();

  private readonly colorHistoryService = inject(ColorHistoryService);
  private readonly contrastService = inject(ContrastService);
  private readonly router = inject(Router);

  constructor() {
    // Every time the list of colors changes, add a new entry to the color history.
    effect(() => this.colorHistoryService.add(this.colors()));

    // Every time a new value is written to updateColors, update the route.
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

    // If there were no colors specified in the URL, create a random color palette.
    if (!this.encodedColors()) {
      this.updateColors.set(randomColorSet());
      return;
    }

    // Initialize the list of color locks.
    this.colorLocks = this.colors().map(() => false);

    // Add an event listener that randomizes the unlocked colors whenever the user presses the
    // space bar.
    document.body.addEventListener('keyup', (evt) => {
      if (evt.key !== ' ') return;
      this.randomizeColors();
    });
  }

  /** Whether the color with the specified index is locked. */
  isLocked(i: number) {
    return this.colorLocks[i];
  }

  /** Set whether the color with the specified index is locked. */
  setLock(locked: boolean, i: number) {
    this.colorLocks[i] = locked;
  }

  /** Add a new random color at the specified index. */
  addNewColor(index: number) {
    const colors = this.colors().slice();
    colors.splice(index, 0, randomColor());
    this.updateColors.set(colors);
    this.colorLocks.splice(index, 0, false);
  }

  /** Update the color at the specified index. */
  colorChanged(c: Color, i: number) {
    const colors = this.colors().slice();
    colors.splice(i, 1, c);
    this.updateColors.set(colors);
  }

  /** Remove the color at the specified index. */
  remove(i: number) {
    const colors = this.colors().slice();
    colors.splice(i, 1);
    this.updateColors.set(colors);
    this.colorLocks.splice(i, 1);
  }

  /** Move the color at the specified index in the provided direction. */
  move(i: number, dir: ColorMove) {
    const colors = this.colors().slice();
    if (dir === 'right') i += 1;
    const [c] = colors.splice(i, 1);
    colors.splice(i - 1, 0, c);
    this.updateColors.set(colors);
    const [l] = this.colorLocks.splice(i, 1);
    this.colorLocks.splice(i - 1, 0, l);
  }

  /** Replace all unlocked colors with new random colors. */
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

/** Generate a random color. */
function randomColor(): Color {
  return new Color({
    r: Math.random() * 256,
    g: Math.random() * 256,
    b: Math.random() * 256,
  });
}

/** Generate a set of 6 random colors. */
function randomColorSet(): Color[] {
  return new Array(6).fill(undefined).map(randomColor);
}
