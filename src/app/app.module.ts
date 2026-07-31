import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { LayoutComponent } from './layout/layout.component';
import { PromoBannerComponent } from './layout/components/promo-banner/promo-banner.component';
import { FiltersComponent } from './shared/components/ui/filters/filters.component';
import { CategoryDetailsComponent } from './features/categories/components/category-details/category-details.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { userReducer } from './store/user/user.reducer';
import { UserEffects } from './store/user/user.effects';
import { CoreModule } from './core/core.module';
import { StatusUiMessageComponent } from "./core/components/status-ui-message/status-ui-message.component";
import { GlobalLoaderComponent } from './core/components/global-loader/global-loader.component';
import { NotificationsAlertComponent } from "./shared/components/notifications-alert/notifications-alert.component";
import { SearchBarComponent } from './shared/components/search-bar/search-bar.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { ShareComponent } from './shared/components/share/share.component';
import { TooltipDirective } from './shared/directives/tooltip.directive';
import { NotificationsModule } from './features/notifications/notifications.module';
import { favoritesReducer } from './features/favorites/store/favorites.reducer';
import { FavoritesEffects } from './features/favorites/store/favorites.effects';

// Auth provider
import { AUTH_PROVIDER, SessionAuthProvider } from './core/auth';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { AccordionComponent } from './shared/components/accordion/accordion.component';

@NgModule({
  declarations: [AppComponent, LayoutComponent, GlobalLoaderComponent, SearchBarComponent, ModalComponent, ShareComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PromoBannerComponent,
    FiltersComponent,
    CategoryDetailsComponent,
    NgxSkeletonLoaderModule,
    CoreModule,
    StoreModule.forRoot({ user: userReducer }),
    EffectsModule.forRoot([UserEffects]),
    StatusUiMessageComponent,
    NotificationsAlertComponent,
    NotificationsModule,
    StoreModule.forFeature('favorites', favoritesReducer),
    EffectsModule.forFeature([FavoritesEffects]),
    TooltipDirective
  ],
  exports: [TooltipDirective],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: AUTH_PROVIDER, useClass: SessionAuthProvider },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
