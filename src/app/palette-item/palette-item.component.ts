import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Color from 'color';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TooltipModule } from 'primeng/tooltip';

import { ContrastService } from '../contrast.service';
import { textColor } from '../lib/colors';

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

  readonly showActions = input(false);

  private readonly contrastService = inject(ContrastService);

  readonly contrast = this.contrastService.contrast(this.initialColor);

  readonly contrastTooltipText = computed(() => `This color's contrast against ${this.contrastService.color()?.hex()} is ${this.contrast()}.`);

  readonly changeColor = signal<string | undefined>(undefined);

  readonly currentColor = computed(() => this.changeColor() ? new Color(this.changeColor()) : this.initialColor());

  readonly colorChanged = output<Color>();

  readonly removed = output<undefined>();

  readonly textColor = computed(() => textColor(this.currentColor()));

  constructor() {
    effect(() => this.changeColor.set(this.initialColor().hex()), { allowSignalWrites: true });
  }

  emitColor() {
    const newColor = this.changeColor();
    if (newColor && this.initialColor().hex().toUpperCase() !== newColor.toUpperCase()) {
      this.colorChanged.emit(new Color(newColor));
    }
  }

  delete() {
    this.removed.emit(undefined);
  }
}
