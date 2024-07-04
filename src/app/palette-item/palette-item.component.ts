import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import Color from 'color';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TooltipModule } from 'primeng/tooltip';

import { ContrastService } from '../contrast.service';
import { textColor } from '../lib/colors';

export type ColorMove = 'left' | 'right';

@Component({
  selector: 'app-palette-item',
  standalone: true,
  imports: [ButtonModule, ColorPickerModule, FormsModule, TooltipModule],
  templateUrl: './palette-item.component.html',
  styleUrl: './palette-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.show-actions]': 'showActions()',
    '[style.backgroundColor]': 'currentColor().hex()',
    '[style.--_text_color]': 'textColor()',
  },
})
export class PaletteItemComponent {
  readonly initialColor = input.required<Color>({ alias: 'color' });

  readonly locked = input.required<boolean>();

  readonly showActions = input(false);

  readonly contrastTooltipText = computed(
    () =>
      `This color's contrast against ${this.contrastService
        .color()
        ?.hex()} is ${this.contrast()}.`
  );

  readonly changeColor = signal<string | undefined>(undefined);

  readonly currentColor = computed(() =>
    this.changeColor() ? new Color(this.changeColor()) : this.initialColor()
  );

  readonly colorChanged = output<Color>();

  readonly removed = output<undefined>();

  readonly moved = output<ColorMove>();

  readonly lockChanged = output<boolean>();

  readonly textColor = computed(() => textColor(this.currentColor()));

  readonly contrastService = inject(ContrastService);
  readonly contrast = this.contrastService.contrast(this.initialColor);

  constructor() {
    effect(() => this.changeColor.set(this.initialColor().hex()), {
      allowSignalWrites: true,
    });
  }

  get isContrastColor() {
    return this.contrastService.color()?.hex() === this.currentColor().hex();
  }

  get contrastTextTooltipText() {
    return `This text demonstrates the contrast of ${this.contrastService
      .color()
      ?.hex()} against this color.`;
  }

  delete() {
    this.removed.emit(undefined);
  }

  emitColor() {
    const newColor = this.changeColor();
    if (
      newColor &&
      this.initialColor().hex().toUpperCase() !== newColor.toUpperCase()
    ) {
      const c = new Color(newColor);
      this.contrastService.markChanged(this.initialColor(), c);
      this.colorChanged.emit(c);
    }
  }

  get contrastButtonTooltipText() {
    return this.isContrastColor
      ? 'Unset contrast color'
      : 'Set as contrast color';
  }

  toggleAsContrastColor() {
    if (this.isContrastColor) {
      this.contrastService.clear();
      return;
    }
    this.contrastService.setColor(this.currentColor());
  }

  moveColor(dir: ColorMove) {
    this.moved.emit(dir);
  }

  get lockButtonTooltipText() {
    return `${this.locked() ? 'Unlock' : 'Lock'} this color`;
  }

  toggleLock() {
    this.lockChanged.emit(!this.locked());
  }
}
