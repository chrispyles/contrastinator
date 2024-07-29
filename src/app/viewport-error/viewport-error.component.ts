import { Component } from '@angular/core';

/**
 * A component that displays an error to the user if their viewport is too small to use this app.
 */
@Component({
  selector: 'app-viewport-error',
  standalone: true,
  imports: [],
  templateUrl: './viewport-error.component.html',
  styleUrl: './viewport-error.component.scss',
})
export class ViewportErrorComponent {}
