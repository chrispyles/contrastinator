import { AfterViewInit, Component, ElementRef, inject, input } from '@angular/core';
import Color from 'color';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';

import { Router } from '@angular/router';
import { ColorHistoryService } from '../color-history.service';
import { ContrastChartComponent } from '../contrast-chart/contrast-chart.component';
import { encodeColors } from '../lib/colors';
import { GitHubLogoComponent } from '../svgs/github-logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, ContrastChartComponent, DialogModule, GitHubLogoComponent, OverlayPanelModule, TooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    // '[style.--_h1_background]': 'background()',
  }
})
export class HeaderComponent implements AfterViewInit {
  readonly colors = input.required<Color[]>();

  showContrastChart = false;

  showHistory = false;

  // readonly background = computed(() => {
  //   const colorPercentage = 100 / this.colors().length;
  //   const parts = this.colors().map((c, i) => `${c.hex()} ${colorPercentage * i}% ${colorPercentage * (i + 1)}%`).join(', ');
  //   return `linear-gradient(90deg, ${parts})`;
  // });

  readonly colorHistoryService = inject(ColorHistoryService);
  private readonly el = inject(ElementRef);
  private readonly pMessageService = inject(MessageService);
  private readonly router = inject(Router);

  ngAfterViewInit(): void {
    // Not sure why this can't be in the scss file but it has different results if it's applied
    // before or after the initial paint.
    this.el.nativeElement.style.position = 'relative';
  }

  async share() {
    await navigator.clipboard.writeText(location.toString());
    this.pMessageService.add({ summary: 'Link copied to clipboard' });
  }

  goTo(colors: Color[]) {
    this.router.navigate([`/${encodeColors(colors)}`]);
  }
}
