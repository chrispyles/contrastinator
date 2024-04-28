import { Routes } from '@angular/router';

import { PaletteComponent } from './palette/palette.component';
import { ViewportErrorComponent } from './viewport-error/viewport-error.component';

export const routes: Routes = [
  {
    path: 'viewport-error',
    component: ViewportErrorComponent,
  },
  {
    path: ':encodedColors',
    component: PaletteComponent,
  },
  {
    path: '',
    component: PaletteComponent,
  },
];
