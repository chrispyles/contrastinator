import { Injectable } from '@angular/core';
import Color from 'color';

@Injectable({ providedIn: 'root' })
export class ColorHistoryService {
  readonly history: Color[][] = [];

  add(c: Color[]) {
    this.history.splice(0, 0, c);
  }
}
