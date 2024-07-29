import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import Color from 'color';

import { contrast, textColor } from '../lib/colors';

/**
 * A component that renders a table displaying the color contrast for each pair in a set of colors.
 */
@Component({
  selector: 'app-contrast-chart',
  standalone: true,
  imports: [],
  templateUrl: './contrast-chart.component.html',
  styleUrl: './contrast-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContrastChartComponent {
  readonly Math = Math;
  readonly textColor = textColor;

  /** The colors to show in the chart. */
  readonly colors = input.required<Color[]>();

  /** The colors for each row. (This is just the list of colors in reverse order.) */
  readonly rows = computed(() => [...this.colors()].reverse());

  /** The colors for each column. */
  readonly columns = computed(() => this.colors());

  /**
   * A 2D array of color contrast values, organized according to {@link rows} and {@link columns}.
   */
  readonly contrasts = computed(() => {
    const rows = this.rows();
    const cols = this.columns();
    const contrasts: Array<Array<number | undefined>> = [];
    for (let i = 0; i < rows.length; i++) {
      contrasts.push([]);
      const row = contrasts.at(-1);
      const r = rows[i];
      for (let j = 0; j < cols.length; j++) {
        const c = cols[j];
        row?.push(j < this.columns().length - i ? contrast(r, c) : undefined);
      }
    }
    return contrasts;
  });
}
