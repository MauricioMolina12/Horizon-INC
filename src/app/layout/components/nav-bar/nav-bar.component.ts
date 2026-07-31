import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  effect,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  Signal,
  DOCUMENT,
} from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthFacade } from '../../../core/auth/auth.facade';
import { User } from '../../../shared/models/auth-user.model';
import { NotificationsFacade } from '../../../features/notifications/facades/notifications.facade';
import { FavoritesFacade } from '../../../features/favorites/facades/favorites.facade';
import { NotificationsPanelComponent } from '../../../features/notifications/components/notifications-panel/notifications-panel.component';
import { ModalService } from '../../../shared/components/modal/modal.service';
import { environment } from '../../../../environments/environment';

interface NavBarItem {
  icon?: string;
  title?: string;
  subtitle?: string;
  path?: string;
  unread?: boolean;
  group: 'user' | 'config';
  code: string;
  action?: () => void;
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  standalone: false,
})
export class NavBarComponent implements OnInit {
  viewSideBar = false;
  userMenuOpen = false;
  isScrolled = false;
  isMobile = false;

  authDomain = environment.authDomain;

  isDark!: Signal<boolean>;

  userItems: NavBarItem[] = [];
  configItems: NavBarItem[] = [];

  unreadCount: Signal<number>;
  favoritesCount: Signal<number>;
  user: Signal<User | null>;
  isAuthenticated: Signal<boolean>;
  userName: Signal<string>;
  userInitial: Signal<string>;
  isSeller: Signal<boolean>;
  isLoaded: Signal<boolean>;

  constructor(
    private router: Router,
    public authFacade: AuthFacade,
    public themeService: ThemeService,
    private notificationsFacade: NotificationsFacade,
    private favoritesFacade: FavoritesFacade,
    private modalService: ModalService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.user = this.authFacade.currentUser;
    this.isAuthenticated = this.authFacade.isAuthenticated;
    this.unreadCount = this.notificationsFacade.unreadCount;
    this.favoritesCount = this.favoritesFacade.count;

    this.userName = computed(() => this.user()?.name ?? '');
    this.userInitial = computed(() => {
      const name = this.userName();
      return name ? name.charAt(0).toUpperCase() : 'A';
    });
    this.isSeller = this.authFacade.isSeller;
    this.isLoaded = this.authFacade.isLoaded;

    effect(() => {
      this.user();
      this.isAuthenticated();
      this.isSeller();
      this.buildNavItems();
    });
  }

  ngOnInit(): void {
    this.isDark = this.themeService.darkModeSignal;
    this.checkScreen();
    this.buildNavItems();
    this.notificationsFacade.load();
    this.favoritesFacade.load();
  }

  @HostListener('window:resize')
  checkScreen() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 767;
    }
  }

  openSearch(): void {
    this.close();
    this.router.navigate(['/search'], { queryParams: { query: '' } });
  }

  openNotifications(): void {
    this.modalService.open(NotificationsPanelComponent, { size: 'md' });
  }

  private buildNavItems(): void {
    this.userItems = [
      { icon: 'ti ti-home', title: 'Inicio', group: 'user', path: '/', code: 'home' },
      { icon: 'ti ti-search', title: 'Buscar', group: 'user', code: 'search', action: () => this.openSearch() },
      { icon: 'ti ti-heart', title: 'Favoritos', group: 'user', path: '/favorites', action: () => this.navigateRoute('/favorites'), code: 'favorites' },
      { icon: 'ti ti-shopping-cart', title: 'Carrito', group: 'user', path: '/shopcart', action: () => this.navigateRoute('/shopcart'), code: 'shopcart' },
      { icon: 'ti ti-package', title: 'Mis compras', group: 'user', path: '/profile/orders', code: 'purchases' },
      { icon: 'ti ti-history', title: 'Mi historial', group: 'user', code: 'history' },
      ...(this.isSeller() ? [{ icon: 'ti ti-building-store', title: 'Mis tiendas', path: '/my-stores', group: 'user' as const, action: () => this.navigateRoute('/my-stores'), code: 'my-stores' }] : []),
    ];
    this.configItems = [
      { icon: 'ti ti-settings', title: 'Configuración', group: 'config', path: '/profile/settings', code: 'settings' },
      { icon: 'ti ti-help', title: 'Ayuda', group: 'config', code: 'help' },
      { icon: 'ti ti-logout', title: 'Cerrar sesión', group: 'config', action: () => this.logOut(), code: 'logout' },
    ];
  }

  toggleSidebar(): void {
    this.viewSideBar = !this.viewSideBar;
    this.document.body.style.overflow = this.viewSideBar ? 'hidden' : '';
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isScrolled = (event.target as Document).documentElement.scrollTop > 0;
  }

  navigateRoute(item: string) {
    if (item) {
      this.router.navigate([item]);
    }
    this.close();
  }

  close() {
    this.viewSideBar = false;
    this.userMenuOpen = false;
    this.document.body.style.overflow = '';
  }

  onItemClick(item: NavBarItem): void {
    if (item.action) item.action();
    this.close();
  }

  toggleMoodDark(e: Event) {
    this.themeService.toggleTheme();
    e.stopPropagation();
  }

  logOut() {
    this.authFacade.logout();
    this.close();
  }
}