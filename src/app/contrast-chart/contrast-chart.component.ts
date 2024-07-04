import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import Color from 'color';

import { contrast, textColor } from '../lib/colors';

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

  readonly colors = input.required<Color[]>();

  readonly rows = computed(() => [...this.colors()].reverse());

  readonly columns = computed(() => this.colors());

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
