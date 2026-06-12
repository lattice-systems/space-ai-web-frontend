import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="flex flex-col gap-6">

      <!-- Encabezado -->
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 m-0">Mapa del Campus</h2>
          <p class="text-sm mt-1 m-0" style="color: var(--color-neutral);">
            Visualización interactiva de zonas, edificios y dispositivos del campus.
          </p>
        </div>
        <button
          mat-flat-button
          style="background: var(--color-primary); color: #fff; border-radius: 10px;"
        >
          <mat-icon>add_location_alt</mat-icon>
          Agregar Zona
        </button>
      </div>

      <!-- Área del mapa -->
      <mat-card class="!rounded-2xl !shadow-sm overflow-hidden">
        <mat-card-content class="!p-0">
          <div
            class="flex flex-col items-center justify-center gap-4"
            style="height: 520px; background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);"
          >
            <div
              class="w-20 h-20 rounded-full flex items-center justify-center"
              style="background: rgba(0, 74, 153, 0.10);"
            >
              <mat-icon
                style="font-size: 40px; width: 40px; height: 40px; color: var(--color-primary);"
              >map</mat-icon>
            </div>
            <div class="text-center">
              <p class="text-base font-semibold text-slate-700 m-0">Mapa Interactivo</p>
              <p class="text-sm mt-1 m-0" style="color: var(--color-neutral);">
                El componente del mapa se renderizará aquí.<br>
                Conecta un proveedor de mapas (Leaflet / Google Maps).
              </p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

    </div>
  `,
})
export class MapComponent {}
