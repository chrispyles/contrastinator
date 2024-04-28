import { computed, Injectable, Signal, signal } from '@angular/core';
import Color from 'color';
import { contrast } from './lib/colors';

@Injectable({ providedIn: 'root' })
export class ContrastService {
  private colorInternal = signal<Color | undefined>(undefined);

  get color(): Signal<Color | undefined> {
    return this.colorInternal;
  }

  setColor(c: Color) {
    this.colorInternal.set(c);
  }

  clear() {
    this.colorInternal.set(undefined);
  }

  contrast(c: Signal<Color>): Signal<number | undefined> {
    return computed(() => this.colorInternal() === undefined ? undefined : contrast(this.colorInternal()!, c()));
  }
}
