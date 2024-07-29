import { Injectable } from '@angular/core';
import Color from 'color';

/** A service that maintains the history of the color palette for the current session. */
@Injectable({ providedIn: 'root' })
export class ColorHistoryService {
  /** The palette history. */
  readonly history: Color[][] = [];

  /** Add a new palette to the history. */
  add(c: Color[]) {
    this.history.splice(0, 0, c);
  }
}
