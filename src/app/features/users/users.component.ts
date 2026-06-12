import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

interface RoleFilter {
  label: string;
  count: number;
  active: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  template: `
    <div class="flex flex-col gap-6">

      <!-- Encabezado -->
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 m-0">Usuarios</h2>
          <p class="text-sm mt-1 m-0" style="color: var(--color-neutral);">
            Gestiona los usuarios del campus: estudiantes, docentes y administradores.
          </p>
        </div>
        <button
          mat-flat-button
          style="background: var(--color-primary); color: #fff; border-radius: 10px;"
        >
          <mat-icon>person_add</mat-icon>
          Agregar Usuario
        </button>
      </div>

      <!-- Filtros por rol -->
      <div class="flex flex-wrap gap-2">
        @for (role of roles; track role.label) {
          <mat-chip [highlighted]="role.active" class="!rounded-full">
            {{ role.label }}
            <span class="ml-1 text-xs font-semibold opacity-70">{{ role.count }}</span>
          </mat-chip>
        }
      </div>

      <!-- Lista de usuarios (placeholder) -->
      <mat-card class="!rounded-2xl !shadow-sm">
        <mat-card-header class="!px-6 !pt-5">
          <mat-card-title class="!text-base !font-semibold !text-slate-800">
            Lista de Usuarios
          </mat-card-title>
          <mat-card-subtitle style="color: var(--color-neutral);">
            1,248 usuarios registrados en total
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="!px-6 !pb-6 !pt-4">
          <div class="flex flex-col items-center justify-center py-16 gap-3">
            <mat-icon class="!text-5xl" style="color: var(--color-neutral-light);">group</mat-icon>
            <p class="text-sm m-0" style="color: var(--color-neutral);">
              La tabla de usuarios se mostrará aquí. Conecta el servicio de usuarios para cargar los datos.
            </p>
          </div>
        </mat-card-content>
      </mat-card>

    </div>
  `,
})
export class UsersComponent {
  readonly roles: RoleFilter[] = [
    { label: 'Todos',        count: 1248, active: true  },
    { label: 'Estudiantes',  count: 980,  active: false },
    { label: 'Docentes',     count: 215,  active: false },
    { label: 'Admins',       count: 53,   active: false },
  ];
}
