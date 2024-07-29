import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import Color from 'color';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TooltipModule } from 'primeng/tooltip';

import { ContrastService } from '../contrast.service';
import { textColor } from '../lib/colors';

export type ColorMove = 'left' | 'right';

/** A component that renders a single color in a color palette. */
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
export class PaletteItemComponent implements OnInit {
  /** The initial color of this palette item. */
  readonly initialColor = input.required<Color>({ alias: 'color' });

  /** Whether this color is locked. */
  readonly locked = input.required<boolean>();

  /** Whether to show the action buttons on this palette item. */
  readonly showActions = input(false);

  /** Text for the tooltip on the color contrast button. */
  readonly contrastTooltipText = computed(
    () =>
      `This color's contrast against ${this.contrastService
        .color()
        ?.hex()} is ${this.contrast()}.`
  );

  /** A signal that updates this palette item's color when written to. */
  readonly changeColor = signal<string | undefined>(undefined);

  /** The current color of this palette item. */
  readonly currentColor = computed(() =>
    this.changeColor() ? new Color(this.changeColor()) : this.initialColor()
  );

  /** Emits the new color of this palette item when it changes. */
  readonly colorChanged = output<Color>();

  /** Emits when the user removes this palette item. */
  readonly removed = output<undefined>();

  /** Emits a direction when the user moves this palette item. */
  readonly moved = output<ColorMove>();

  /** Emits whether this color is locked when the user toggles the lock. */
  readonly lockChanged = output<boolean>();

  /** The color to use for text against a background of the current color. */
  readonly textColor = computed(() => textColor(this.currentColor()));

  readonly contrastService = inject(ContrastService);

  /** The contrast of this palette item's color against the current contrast color, if any. */
  readonly contrast = this.contrastService.contrast(this.initialColor);

  /** Whether the hex code input element is showing. */
  readonly hexInput = signal(false);

  /** The hex code input element. */
  @ViewChild('hexInput') readonly hexInputEl?: ElementRef<HTMLInputElement>;

  constructor() {
    // When the hex input is opened, add an event listener to the body that closes it when the user
    // clicks outside the input element.
    effect(() => {
      if (!this.hexInput()) return;
      const closeInput = (evt: MouseEvent) => {
        if (evt.target === this.hexInputEl?.nativeElement) return;
        this.hexInput.set(false);
        document.body.removeEventListener('click', closeInput);
      };
      setTimeout(() => document.body.addEventListener('click', closeInput), 0);
    });
  }

  ngOnInit(): void {
    this.changeColor.set(this.initialColor().hex());
  }

  /** Whether the current color is the contrast color. */
  get isContrastColor() {
    return this.contrastService.color()?.hex() === this.currentColor().hex();
  }

  /** Text for the color contrast tooltip. */
  get contrastTextTooltipText() {
    return `This text demonstrates the contrast of ${this.contrastService
      .color()
      ?.hex()} against this color.`;
  }

  /** Delete this palette item. */
  delete() {
    this.removed.emit(undefined);
  }

  /** Emit the new color of this palette item. */
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

  /** Text for the color contrast button tooltip. */
  get contrastButtonTooltipText() {
    return this.isContrastColor
      ? 'Unset contrast color'
      : 'Set as contrast color';
  }

  /** Toggle whether the current color is the contrast color. */
  toggleAsContrastColor() {
    if (this.isContrastColor) {
      this.contrastService.clear();
      return;
    }
    this.contrastService.setColor(this.currentColor());
  }

  /** Move this palette item in the specified direction. */
  moveColor(dir: ColorMove) {
    this.moved.emit(dir);
  }

  /** Text for the lock button tooltip. */
  get lockButtonTooltipText() {
    return `${this.locked() ? 'Unlock' : 'Lock'} this color`;
  }

  /** Toggle whether this palette item is locked. */
  toggleLock() {
    this.lockChanged.emit(!this.locked());
  }

  /**
   * An event listener for {@link hexInputEl} that emits the new color when the user presses Enter.
   */
  onHexInputKeydown(evt: KeyboardEvent) {
    if (evt.key !== 'Enter') return;
    this.hexInput.set(false);
    this.colorChanged.emit(new Color(this.hexInputEl!.nativeElement.value));
  }
}
