import { HomeComponent } from './pages/home/home.component';
import { TodoViewComponent } from './pages/todo-view/todo-view.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/all',
    pathMatch: 'full',
  },
  {
    path: 'home',
    redirectTo: 'home/all',
    pathMatch: 'full',
  },
  {
    path: 'home',
    children: [
      {
        path: 'all',
        component: HomeComponent,
      },
      {
        path: 'active',
        component: HomeComponent,
      },
      {
        path: 'completed',
        component: HomeComponent,
      },
    ],
  },
  {
    path: 'todo/:id',
    component: TodoViewComponent,
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];
