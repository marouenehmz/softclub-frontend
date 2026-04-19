import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard.component';
import { AdminEventsComponent } from './features/admin-events/admin-events.component';
import { VipDashboardComponent } from './features/vip-dashboard/vip-dashboard.component';
import { StaffDashboardComponent } from './features/staff-dashboard/staff-dashboard.component';
export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'menu',
        loadComponent: () => import('./features/menu/menu.component').then((m) => m.MenuComponent),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./features/events/events-list.component').then((m) => m.EventsListComponent),
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./features/events/event-detail.component').then((m) => m.EventDetailComponent),
      },
      {
        path: 'vip',
        loadComponent: () =>
          import('./features/vip-reservation/vip-reservation.component').then(
            (m) => m.VipReservationComponent,
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login.component').then((m) => m.LoginComponent),
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'vip',
        canActivate: [roleGuard(['VIP', 'WORKER', 'ADMIN'])],
        loadComponent: () =>
          import('./features/vip-dashboard/vip-dashboard.component').then(
            (m) => m.VipDashboardComponent,
          ),
      },
      {
        path: 'staff',
        canActivate: [roleGuard(['WORKER', 'ADMIN'])],
        loadComponent: () =>
          import('./features/staff-dashboard/staff-dashboard.component').then(
            (m) => m.StaffDashboardComponent,
          ),
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'events', component: AdminEventsComponent },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'vip',
        component: VipDashboardComponent,
        canActivate: [roleGuard(['VIP'])],
      },
      {
        path: 'staff',
        component: StaffDashboardComponent,
        canActivate: [roleGuard(['WORKER'])],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
