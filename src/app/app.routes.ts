import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        title: 'Dashboard — SpaceIA',
      },
      {
        path: 'map',
        loadComponent: () =>
          import('./features/map/map.component').then((m) => m.MapComponent),
        title: 'Campus Map — SpaceIA',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users.component').then(
            (m) => m.UsersComponent
          ),
        title: 'Users — SpaceIA',
      },
      {
        path: 'devices',
        loadComponent: () =>
          import('./features/devices/devices.component').then(
            (m) => m.DevicesComponent
          ),
        title: 'Devices — SpaceIA',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
