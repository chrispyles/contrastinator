import { Routes } from '@angular/router';

import { PaletteComponent } from './palette/palette.component';

export const routes: Routes = [
  {
    path: ':encodedColors',
    component: PaletteComponent,
  }
];
