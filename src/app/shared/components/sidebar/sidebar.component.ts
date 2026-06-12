import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

interface FutureItem {
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatRippleModule],
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    /* Nav item base */
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 2px;
      cursor: pointer;
      text-decoration: none;
      color: #475569;
      transition: background 0.12s ease, color 0.12s ease;
      font-size: 13.5px;
      font-weight: 500;
      line-height: 1;
      min-height: 36px;
    }

    .nav-item:hover {
      background: #F1F5F9;
      color: #1E293B;
    }

    .nav-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #94A3B8;
      flex-shrink: 0;
      transition: color 0.12s ease;
    }

    .nav-item:hover mat-icon {
      color: #475569;
    }

    /* Active — matches Stitch light blue */
    .nav-item-active {
      background-color: #EBF3FF !important;
      color: #004A99 !important;
    }

    .nav-item-active mat-icon {
      color: #004A99 !important;
    }

    .nav-item-active .nav-label {
      font-weight: 600 !important;
      color: #004A99 !important;
    }

    /* Future items */
    .nav-item-disabled {
      opacity: 0.38;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Section label */
    .section-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #94A3B8;
      padding: 0 12px;
      margin: 12px 0 4px;
    }
  `],
  template: `
    <aside
      class="flex flex-col h-full bg-white"
      style="width: var(--sidebar-width); border-right: 1px solid #E2E8F0;"
      aria-label="Menú de navegación principal"
    >

      <!-- ── Marca ── -->
      <div class="flex items-center gap-2.5 px-4 py-4 border-b border-slate-100">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
          style="background: var(--color-primary);"
        >S</div>
        <div class="flex flex-col leading-tight overflow-hidden">
          <span class="text-sm font-bold text-slate-800 truncate">SpaceIA</span>
          <span class="text-[11px] text-slate-400 truncate">Smart Campus</span>
        </div>
      </div>

      <!-- ── Navegación ── -->
      <nav class="flex-1 overflow-y-auto px-2 py-3" aria-label="Módulos del sistema">

        @for (item of navItems; track item.route) {
          <a
            class="nav-item"
            [routerLink]="item.route"
            routerLinkActive="nav-item-active"
            [routerLinkActiveOptions]="{ exact: false }"
            [attr.aria-label]="item.label"
          >
            <mat-icon>{{ item.icon }}</mat-icon>
            <span class="nav-label truncate">{{ item.label }}</span>
          </a>
        }

        <!-- Próximamente -->
        <p class="section-label">Próximamente</p>

        @for (item of futureItems; track item.label) {
          <div
            class="nav-item nav-item-disabled"
            [attr.title]="item.label + ' — Próximamente'"
          >
            <mat-icon>{{ item.icon }}</mat-icon>
            <span class="nav-label truncate">{{ item.label }}</span>
          </div>
        }

      </nav>

      <!-- ── Pie de usuario ── -->
      <div class="px-2 py-3 border-t border-slate-100">
        <div
          class="nav-item"
          role="button"
          tabindex="0"
          aria-label="Perfil de usuario"
        >
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
            style="background: var(--color-primary);"
          >A</div>
          <div class="flex flex-col leading-tight overflow-hidden">
            <span class="text-[12px] font-semibold text-slate-700 truncate">Admin</span>
            <span class="text-[10px] text-slate-400 truncate">admin&#64;campus.edu</span>
          </div>
        </div>
      </div>

    </aside>
  `,
})
export class SidebarComponent {
  readonly navItems: NavItem[] = [
    { label: 'Panel Principal', icon: 'dashboard', route: '/dashboard' },
    { label: 'Usuarios', icon: 'group', route: '/users' },
    { label: 'Mapa del Campus', icon: 'map', route: '/map' },
    { label: 'Dispositivos', icon: 'device_hub', route: '/devices' },
  ];

  readonly futureItems: FutureItem[] = [
    { label: 'Identidad Digital', icon: 'badge' },
    { label: 'Control de Acceso', icon: 'lock' },
    { label: 'Asistente IA', icon: 'smart_toy' },
    { label: 'Robot Monitor', icon: 'precision_manufacturing' },
    { label: 'Analíticas', icon: 'bar_chart' },
    { label: 'Configuración', icon: 'settings' },
  ];
}
