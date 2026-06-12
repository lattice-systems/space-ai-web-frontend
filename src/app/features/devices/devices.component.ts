import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface DeviceCategory {
  label: string;
  icon: string;
  count: number;
  status: 'en línea' | 'mixto' | 'desconectado';
}

@Component({
  selector: 'app-devices',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="flex flex-col gap-6">

      <!-- Encabezado -->
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 m-0">Dispositivos</h2>
          <p class="text-sm mt-1 m-0" style="color: var(--color-neutral);">
            Monitorea y gestiona todos los dispositivos IoT conectados a la red del campus.
          </p>
        </div>
        <button
          mat-flat-button
          style="background: var(--color-primary); color: #fff; border-radius: 10px;"
        >
          <mat-icon>add</mat-icon>
          Registrar Dispositivo
        </button>
      </div>

      <!-- Tarjetas de categorías -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (cat of categories; track cat.label) {
          <mat-card
            class="!rounded-2xl !shadow-sm hover:!shadow-md transition-shadow cursor-pointer"
          >
            <mat-card-content class="!p-5">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center"
                  style="background: rgba(0, 74, 153, 0.08);"
                >
                  <mat-icon style="color: var(--color-primary);">{{ cat.icon }}</mat-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-800 m-0 truncate">{{ cat.label }}</p>
                  <p
                    class="text-xl font-bold m-0"
                    style="color: var(--color-primary);"
                  >{{ cat.count }}</p>
                </div>
                <span
                  [class]="'text-xs font-semibold px-2 py-1 rounded-full shrink-0 ' + statusClass(cat.status)"
                >{{ cat.status }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <!-- Lista de dispositivos (placeholder) -->
      <mat-card class="!rounded-2xl !shadow-sm">
        <mat-card-header class="!px-6 !pt-5">
          <mat-card-title class="!text-base !font-semibold !text-slate-800">
            Lista de Dispositivos
          </mat-card-title>
          <mat-card-subtitle style="color: var(--color-neutral);">
            84 dispositivos registrados en 16 zonas del campus
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="!px-6 !pb-6 !pt-4">
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <mat-icon class="!text-5xl" style="color: var(--color-neutral-light);">device_hub</mat-icon>
            <p class="text-sm m-0" style="color: var(--color-neutral);">
              La lista de dispositivos se mostrará aquí. Conecta el servicio de dispositivos para cargar los datos.
            </p>
          </div>
        </mat-card-content>
      </mat-card>

    </div>
  `,
})
export class DevicesComponent {
  readonly categories: DeviceCategory[] = [
    { label: 'Sensores Inteligentes', icon: 'sensors', count: 38, status: 'en línea' },
    { label: 'Control de Acceso', icon: 'lock', count: 24, status: 'mixto' },
    { label: 'Robot Inteligente', icon: 'precision_manufacturing', count: 2, status: 'en línea' },
    { label: 'Cámaras IP', icon: 'videocam', count: 12, status: 'en línea' },
    { label: 'Gateways MQTT', icon: 'router', count: 6, status: 'mixto' },
    { label: 'Kioscos', icon: 'tablet_android', count: 2, status: 'desconectado' },
  ];

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'en línea': 'bg-emerald-100 text-emerald-700',
      'mixto': 'bg-amber-100 text-amber-700',
      'desconectado': 'bg-red-100 text-red-700',
    };
    return map[status] ?? '';
  }
}
