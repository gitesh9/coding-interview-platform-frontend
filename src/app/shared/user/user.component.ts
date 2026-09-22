import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@core/services/auth-service/auth.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  userInitials = computed(() => {
    const name = this.currentUser()?.name?.trim();
    if (!name) return 'U';

    const nameParts = name.split(/\s+/);
    const firstInitial = nameParts[0]?.[0] ?? '';
    const lastInitial =
      nameParts.length > 1 ? (nameParts[nameParts.length - 1]?.[0] ?? '') : '';

    return `${firstInitial}${lastInitial}`.toUpperCase();
  });
}
