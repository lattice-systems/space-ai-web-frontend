import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface StatCard {
  label: string;
  value: string;
  icon: string;
  trend: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatIconModule],
  template: `
    <div class="flex flex-col gap-6">

      <!-- Encabezado -->
      <div>
        <h2 class="text-2xl font-bold text-slate-800 m-0">Panel Principal</h2>
        <p class="text-sm mt-1 m-0" style="color: var(--color-neutral);">
          Bienvenido, Administrador. Aquí está el resumen de actividad del campus.
        </p>
      </div>

      <!-- Tarjetas de estadísticas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        @for (card of stats; track card.label) {
          <mat-card class="!rounded-2xl !shadow-sm hover:!shadow-md transition-shadow">
            <mat-card-content class="!p-5">
              <div class="flex items-start justify-between">
                <div>
                  <p
                    class="text-xs font-semibold uppercase tracking-wider m-0"
                    style="color: var(--color-neutral);"
                  >{{ card.label }}</p>
                  <p class="text-3xl font-bold mt-2 mb-1 text-slate-800">{{ card.value }}</p>
                  <p class="text-xs m-0" style="color: var(--color-neutral);">{{ card.trend }}</p>
                </div>
                <div
                  class="w-11 h-11 rounded-xl flex items-center justify-center"
                  [style.background]="card.color + '1A'"
                >
                  <mat-icon [style.color]="card.color">{{ card.icon }}</mat-icon>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <!-- Área de actividad reciente -->
      <mat-card class="!rounded-2xl !shadow-sm">
        <mat-card-header class="!px-6 !pt-5">
          <mat-card-title class="!text-base !font-semibold !text-slate-800">
            Actividad Reciente
          </mat-card-title>
          <mat-card-subtitle style="color: var(--color-neutral);">
            Últimos eventos registrados en el sistema del campus
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="!px-6 !pb-6 !pt-4">
          <div class="flex flex-col items-center justify-center py-12 gap-3">
            <mat-icon class="!text-5xl" style="color: var(--color-neutral-light);">inbox</mat-icon>
            <p class="text-sm m-0" style="color: var(--color-neutral);">
              El historial de actividad aparecerá aquí cuando se conecten los datos.
            </p>
          </div>
        </mat-card-content>
      </mat-card>

    </div>
  `,
})
export class DashboardComponent {
  readonly stats: StatCard[] = [
    {
      label: 'Total de Usuarios',
      value: '1,248',
      icon: 'group',
      trend: '+12 esta semana',
      color: '#004A99',
    },
    {
      label: 'Dispositivos Activos',
      value: '84',
      icon: 'device_hub',
      trend: '3 desconectados',
      color: '#00D1FF',
    },
    {
      label: 'Zonas del Campus',
      value: '16',
      icon: 'map',
      trend: 'Todas las zonas mapeadas',
      color: '#10B981',
    },
    {
      label: 'Alertas Hoy',
      value: '5',
      icon: 'notification_important',
      trend: '2 críticas',
      color: '#F59E0B',
    },
  ];
}
