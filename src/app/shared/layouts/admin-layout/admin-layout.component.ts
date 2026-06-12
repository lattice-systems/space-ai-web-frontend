import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    SidebarComponent,
    TopbarComponent,
  ],
  template: `
    <mat-sidenav-container class="h-screen w-full">

      <!-- ─── Sidebar ─── -->
      <mat-sidenav
        #sidenav
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()"
        fixedInViewport
        [fixedTopGap]="0"
        class="!border-r-0"
        style="width: var(--sidebar-width);"
      >
        <app-sidebar />
      </mat-sidenav>

      <!-- ─── Área principal ─── -->
      <mat-sidenav-content
        class="flex flex-col"
        style="background: var(--color-bg);"
      >
        <!-- Topbar fijo -->
        <app-topbar
          class="sticky top-0 z-10"
          (menuToggled)="sidenav.toggle()"
        />

        <!-- Contenido de la página -->
        <main
          id="main-content"
          class="flex-1 overflow-y-auto"
          style="padding: 24px 28px;"
          tabindex="-1"
          aria-label="Área de contenido principal"
        >
          <router-outlet />
        </main>

      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    mat-sidenav-container {
      --mat-sidenav-container-background-color: transparent;
    }
    /* No shadow on sidebar — matches Stitch clean border-only look */
    mat-sidenav {
      box-shadow: none;
    }
  `],
})
export class AdminLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private readonly breakpointObserver = inject(BreakpointObserver);

  /** true cuando viewport < lg → sidebar como drawer */
  readonly isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
      .pipe(map((result) => result.matches)),
    { initialValue: false }
  );
}
