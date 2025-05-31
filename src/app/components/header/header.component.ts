import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_ROUTES } from '@constants/app.routes';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  public readonly allTodos = APP_ROUTES.HOME_ALL;
  public readonly activeTodos = APP_ROUTES.HOME_ACTIVE;
  public readonly completeTodos = APP_ROUTES.HOME_COMPLETED;
}
