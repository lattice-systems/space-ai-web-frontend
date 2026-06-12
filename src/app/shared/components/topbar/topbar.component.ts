import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface SearchItem {
  label: string;
  subtitle: string;
  icon: string;
  route: string;
  category: 'Módulo' | 'Usuario' | 'Dispositivo' | 'Zona';
}

// ─── Catálogo de búsqueda (datos mock) ────────────────────────────────────────

const SEARCH_CATALOG: SearchItem[] = [
  // Módulos
  { label: 'Panel Principal',    subtitle: 'Vista general del campus',                   icon: 'dashboard',  route: '/dashboard', category: 'Módulo' },
  { label: 'Mapa del Campus',    subtitle: 'Mapa interactivo de zonas',                  icon: 'map',        route: '/map',       category: 'Módulo' },
  { label: 'Usuarios',           subtitle: 'Gestión de usuarios del campus',             icon: 'group',      route: '/users',     category: 'Módulo' },
  { label: 'Dispositivos',       subtitle: 'Monitoreo de dispositivos IoT',              icon: 'device_hub', route: '/devices',   category: 'Módulo' },

  // Usuarios
  { label: 'Administrador',      subtitle: 'admin@campus.edu · Admin',                   icon: 'account_circle', route: '/users', category: 'Usuario' },
  { label: 'Juan García',        subtitle: 'juan.garcia@campus.edu · Docente',           icon: 'account_circle', route: '/users', category: 'Usuario' },
  { label: 'María López',        subtitle: 'maria.lopez@campus.edu · Estudiante',        icon: 'account_circle', route: '/users', category: 'Usuario' },
  { label: 'Carlos Méndez',      subtitle: 'carlos.mendez@campus.edu · Estudiante',      icon: 'account_circle', route: '/users', category: 'Usuario' },
  { label: 'Ana Torres',         subtitle: 'ana.torres@campus.edu · Docente',            icon: 'account_circle', route: '/users', category: 'Usuario' },
  { label: 'Luis Ramírez',       subtitle: 'luis.ramirez@campus.edu · Estudiante',       icon: 'account_circle', route: '/users', category: 'Usuario' },

  // Dispositivos
  { label: 'Sensor-01',          subtitle: 'Sensor de temperatura · Edificio A',         icon: 'sensors',    route: '/devices', category: 'Dispositivo' },
  { label: 'Sensor-07',          subtitle: 'Sensor de humedad · Biblioteca',             icon: 'sensors',    route: '/devices', category: 'Dispositivo' },
  { label: 'Cámara C-12',        subtitle: 'Cámara IP · Sección Biblioteca B',           icon: 'videocam',   route: '/devices', category: 'Dispositivo' },
  { label: 'Router MQTT-01',     subtitle: 'Gateway MQTT · Laboratorio A',               icon: 'router',     route: '/devices', category: 'Dispositivo' },
  { label: 'Robot Alpha',        subtitle: 'Patrol Bot · Patio Central',                 icon: 'smart_toy',  route: '/devices', category: 'Dispositivo' },
  { label: 'Acceso-Norte',       subtitle: 'Control de acceso · Puerta Norte',           icon: 'lock',       route: '/devices', category: 'Dispositivo' },
  { label: 'Kiosco-01',          subtitle: 'Kiosco digital · Recepción',                 icon: 'tablet_android', route: '/devices', category: 'Dispositivo' },

  // Zonas
  { label: 'Biblioteca',         subtitle: 'Zona de estudio · Edificio Central',         icon: 'local_library', route: '/map', category: 'Zona' },
  { label: 'Laboratorio A',      subtitle: 'Laboratorio de cómputo · Edificio B',        icon: 'science',    route: '/map', category: 'Zona' },
  { label: 'Cafetería',          subtitle: 'Área de alimentación · Planta Baja',         icon: 'restaurant', route: '/map', category: 'Zona' },
  { label: 'Aula Magna',         subtitle: 'Auditorio principal · Edificio A',           icon: 'event_seat', route: '/map', category: 'Zona' },
  { label: 'Patio Central',      subtitle: 'Zona exterior · Campus Centro',              icon: 'park',       route: '/map', category: 'Zona' },
  { label: 'Puerta Norte',       subtitle: 'Acceso principal Norte',                     icon: 'meeting_room', route: '/map', category: 'Zona' },
];

// ─── Rutas → título ──────────────────────────────────────────────────────────

const ROUTE_TITLES: Record<string, string> = {
  dashboard: 'Panel Principal',
  map:       'Mapa del Campus',
  users:     'Usuarios',
  devices:   'Dispositivos',
};

// ─── Colores por categoría ────────────────────────────────────────────────────

const CATEGORY_COLOR: Record<string, string> = {
  'Módulo':      '#004A99',
  'Usuario':     '#7C3AED',
  'Dispositivo': '#0891B2',
  'Zona':        '#059669',
};

@Component({
  selector: 'app-topbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  styles: [`
    :host { display: block; }

    .topbar {
      height: var(--topbar-height);
      background: #fff;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 8px;
      box-sizing: border-box;
    }

    /* ── Buscador ── */
    .search-wrap { flex: 0 1 300px; min-width: 140px; }
    .search-field { width: 100%; }
    .search-field ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    .search-field ::ng-deep .mat-mdc-text-field-wrapper {
      border-radius: 20px !important;
      background: #F8FAFC !important;
      border: 1px solid #E2E8F0 !important;
      padding: 0 12px !important;
      transition: border-color .15s, box-shadow .15s;
    }
    .search-field ::ng-deep .mdc-line-ripple { display: none !important; }
    .search-field ::ng-deep .mat-mdc-form-field-infix {
      padding-top: 6px !important;
      padding-bottom: 6px !important;
      min-height: unset !important;
    }
    .search-field ::ng-deep .mat-mdc-text-field-wrapper:focus-within {
      background: #fff !important;
      border-color: #004A99 !important;
      box-shadow: 0 0 0 3px rgba(0,74,153,.12) !important;
    }
    .search-field ::ng-deep input::placeholder { font-size: 13px; color: #94A3B8; }
    .search-field ::ng-deep input { font-size: 13px; }
    .search-field ::ng-deep .mat-icon {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
      color: #94A3B8;
    }

    /* ── Spacer ── */
    .spacer { flex: 1; }

    /* ── Acciones ── */
    .actions { display: flex; align-items: center; gap: 4px; }
    .actions button[mat-icon-button] { color: #64748B; }
    .actions button[mat-icon-button]:hover { color: #1E293B; background: #F1F5F9; }

    /* Badge notificaciones */
    .notif-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; }
    .notif-badge {
      position: absolute; top: 4px; right: 4px;
      width: 16px; height: 16px; border-radius: 50%;
      background: #EF4444; color: #fff;
      font-size: 10px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      pointer-events: none; line-height: 1; border: 1.5px solid #fff;
    }

    /* Avatar */
    .avatar-circle {
      width: 30px; height: 30px; border-radius: 50%;
      background: var(--color-primary); color: #fff;
      font-size: 13px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
  `],
  template: `
    <header class="topbar" role="banner">

      <!-- Hamburger — mobile only -->
      <button mat-icon-button class="lg:hidden" (click)="menuToggled.emit()"
        aria-label="Abrir o cerrar menú" style="color:#64748B;">
        <mat-icon>menu</mat-icon>
      </button>

      <!-- ── Buscador global con autocomplete ── -->
      <div class="search-wrap">
        <mat-form-field class="search-field" appearance="fill" subscriptSizing="dynamic">
          <mat-icon matPrefix>search</mat-icon>
          <input
            matInput
            type="search"
            placeholder="Buscar en el ecosistema…"
            aria-label="Búsqueda global"
            [formControl]="searchCtrl"
            [matAutocomplete]="searchAuto"
            autocomplete="off"
          />
          <mat-autocomplete
            #searchAuto="matAutocomplete"
            [displayWith]="displayFn"
            (optionSelected)="onResultSelected($event)"
            panelWidth="380px"
          >
            @if (results().length > 0) {
              <!-- Categorías agrupadas -->
              @for (group of groupedResults(); track group.category) {
                <!-- Encabezado de categoría -->
                <mat-option disabled class="!cursor-default !bg-slate-50 !py-1 !h-auto !min-h-0">
                  <span style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94A3B8;">
                    {{ group.category }}
                  </span>
                </mat-option>

                @for (item of group.items; track item.label) {
                  <mat-option [value]="item" class="!h-auto !py-2">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <span
                        style="width:28px;height:28px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;"
                        [style.background]="categoryColor(group.category) + '18'"
                      >
                        <span
                          class="material-icons"
                          style="font-size:15px;line-height:1;display:block;"
                          [style.color]="categoryColor(group.category)"
                        >{{ item.icon }}</span>
                      </span>
                      <span style="display:flex;flex-direction:column;gap:1px;">
                        <span style="font-size:13px;font-weight:500;color:#1E293B;">{{ item.label }}</span>
                        <span style="font-size:11px;color:#94A3B8;">{{ item.subtitle }}</span>
                      </span>
                    </div>
                  </mat-option>
                }
              }
            } @else if (hasMinQuery()) {
              <mat-option disabled class="!h-auto !py-4">
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
                  <span class="material-icons" style="font-size:24px;color:#CBD5E1;">search_off</span>
                  <span style="font-size:13px;color:#94A3B8;">Sin resultados para "{{ searchCtrl.value }}"</span>
                </div>
              </mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>
      </div>

      <!-- Spacer -->
      <div class="spacer"></div>

      <!-- ── Acciones derechas ── -->
      <div class="actions">

        <div class="notif-wrap">
          <button mat-icon-button [matMenuTriggerFor]="notificationsMenu" aria-label="Ver notificaciones">
            <mat-icon fontSet="material-icons-outlined">notifications</mat-icon>
          </button>
          <span class="notif-badge" aria-label="3 notificaciones">3</span>
        </div>

        <button mat-icon-button aria-label="Ayuda">
          <mat-icon>help_outline</mat-icon>
        </button>

        <button mat-icon-button [matMenuTriggerFor]="userMenu" aria-label="Menú de usuario">
          <div class="avatar-circle">A</div>
        </button>

      </div>

      <!-- ── Menú notificaciones ── -->
      <mat-menu #notificationsMenu="matMenu" xPosition="before" [panelClass]="'!min-w-80'">
        <div class="px-4 py-3 border-b border-slate-100 pointer-events-none">
          <p class="text-sm font-semibold text-slate-800 m-0">Notificaciones</p>
          <p class="text-xs m-0 text-slate-400">3 sin leer</p>
        </div>
        @for (n of notifications; track n.id) {
          <button mat-menu-item class="!py-3 !h-auto">
            <div style="display:flex;flex-direction:row;align-items:center;gap:12px;width:100%;">
              <span
                style="width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;"
                [style.background]="n.color + '18'"
              >
                <span class="material-icons" style="font-size:16px;line-height:1;display:block;"
                  [style.color]="n.color">{{ n.icon }}</span>
              </span>
              <span style="display:flex;flex-direction:column;gap:2px;min-width:0;">
                <span style="font-size:13px;font-weight:500;color:#1E293B;white-space:normal;">{{ n.title }}</span>
                <span style="font-size:11px;color:#94A3B8;">{{ n.time }}</span>
              </span>
            </div>
          </button>
        }
        <mat-divider />
        <button mat-menu-item>
          <span style="font-size:13px;font-weight:500;color:var(--color-primary);">Ver todas las notificaciones</span>
        </button>
      </mat-menu>

      <!-- ── Menú de usuario ── -->
      <mat-menu #userMenu="matMenu" xPosition="before">
        <div class="px-4 py-3 border-b border-slate-100 pointer-events-none">
          <p class="text-sm font-semibold text-slate-800 m-0">Administrador</p>
          <p class="text-xs m-0 text-slate-400">admin&#64;campus.edu</p>
        </div>
        <button mat-menu-item><mat-icon>account_circle</mat-icon><span>Mi perfil</span></button>
        <button mat-menu-item><mat-icon>settings</mat-icon><span>Configuración</span></button>
        <mat-divider />
        <button mat-menu-item><mat-icon>logout</mat-icon><span>Cerrar sesión</span></button>
      </mat-menu>

    </header>
  `,
})
export class TopbarComponent {
  @Output() menuToggled = new EventEmitter<void>();

  private readonly router = inject(Router);

  // ── Título dinámico por ruta ──────────────────────────────────────────────
  readonly currentTitle = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => {
        const segment = (e as NavigationEnd).urlAfterRedirects.split('/')[1];
        return ROUTE_TITLES[segment] ?? 'SpaceIA';
      }),
      startWith(ROUTE_TITLES[this.router.url.split('/')[1]] ?? 'SpaceIA')
    ),
    { initialValue: 'Panel Principal' }
  );

  // ── Buscador ──────────────────────────────────────────────────────────────
  readonly searchCtrl = new FormControl<string | SearchItem>('');

  /** True cuando el input tiene 2+ caracteres (evita errores de tipo en el template) */
  readonly hasMinQuery = toSignal(
    this.searchCtrl.valueChanges.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      map((value) => {
        const str = typeof value === 'string' ? value : (value?.label ?? '');
        return str.trim().length >= 2;
      })
    ),
    { initialValue: false }
  );

  /** Resultados filtrados del catálogo */
  readonly results = toSignal(
    this.searchCtrl.valueChanges.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      map((value) => {
        const query = (typeof value === 'string' ? value : value?.label ?? '').trim().toLowerCase();
        if (query.length < 2) return [];
        return SEARCH_CATALOG.filter(
          (item) =>
            item.label.toLowerCase().includes(query) ||
            item.subtitle.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        ).slice(0, 10); // máx 10 resultados
      })
    ),
    { initialValue: [] as SearchItem[] }
  );

  /** Resultados agrupados por categoría */
  readonly groupedResults = toSignal(
    this.searchCtrl.valueChanges.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      map((value) => {
        const query = (typeof value === 'string' ? value : value?.label ?? '').trim().toLowerCase();
        if (query.length < 2) return [];

        const filtered = SEARCH_CATALOG.filter(
          (item) =>
            item.label.toLowerCase().includes(query) ||
            item.subtitle.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );

        // Agrupar por categoría manteniendo el orden: Módulo, Usuario, Dispositivo, Zona
        const order = ['Módulo', 'Usuario', 'Dispositivo', 'Zona'];
        const groups = order
          .map((cat) => ({ category: cat, items: filtered.filter((i) => i.category === cat) }))
          .filter((g) => g.items.length > 0);

        return groups;
      })
    ),
    { initialValue: [] as { category: string; items: SearchItem[] }[] }
  );

  /** Mostrar el label del ítem seleccionado en el input */
  displayFn(item: SearchItem | string): string {
    return typeof item === 'string' ? item : (item?.label ?? '');
  }

  /** Navegar al resultado seleccionado y limpiar el input */
  onResultSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as SearchItem;
    this.router.navigate([item.route]);
    // Limpiar input después de navegar
    setTimeout(() => this.searchCtrl.setValue(''), 0);
  }

  /** Color por categoría */
  categoryColor(category: string): string {
    return CATEGORY_COLOR[category] ?? '#004A99';
  }

  // ── Notificaciones ────────────────────────────────────────────────────────
  readonly notifications = [
    { id: 1, title: 'Nuevo dispositivo registrado: Sensor-07', time: 'Hace 2 minutos',  icon: 'device_hub', color: '#004A99' },
    { id: 2, title: '3 usuarios pendientes de aprobación',     time: 'Hace 15 minutos', icon: 'group',      color: '#F59E0B' },
    { id: 3, title: 'Mapa del campus actualizado',             time: 'Hace 1 hora',     icon: 'map',        color: '#10B981' },
  ];
}
