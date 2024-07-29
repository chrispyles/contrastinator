import { computed, Injectable, Signal, signal } from '@angular/core';
import Color from 'color';
import { contrast } from './lib/colors';

/**
 * A service that organizes displaying color contrast information for colors across the palette
 * against a single color.
 */
@Injectable({ providedIn: 'root' })
export class ContrastService {
  /** The current color to display contrasts against. */
  private colorInternal = signal<Color | undefined>(undefined);

  /** The current color to display contrasts against. */
  get color(): Signal<Color | undefined> {
    return this.colorInternal;
  }

  /** Mark a palette item's color as changed to the specified new color. */
  markChanged(oldColor: Color, newColor: Color) {
    if (oldColor.hex() !== this.color()?.hex()) return;
    this.setColor(newColor);
  }

  /** Set the contrast color. */
  setColor(c: Color) {
    this.colorInternal.set(c);
  }

  /** Clear the contrast color. */
  clear() {
    this.colorInternal.set(undefined);
  }

  /**
   * Given a signal of colors, returns a new signal that emits the contrast of that signal's colors
   * against the contrast color as it changes, or undefined if there is no contrast color.
   */
  contrast(c: Signal<Color>): Signal<number | undefined> {
    return computed(() =>
      this.colorInternal() === undefined
        ? undefined
        : contrast(this.colorInternal()!, c())
    );
  }
}
