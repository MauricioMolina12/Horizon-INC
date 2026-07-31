import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchInputComponent } from '../shared/components/search-input/search-input.component';
import { NavBarComponent } from '../layout/components/nav-bar/nav-bar.component';
import { FooterComponent } from '../layout/components/footer/footer.component';
import { NotificationsModule } from '../features/notifications/notifications.module';
import { ClickOutsideDirective } from '../shared/directives/click-outside.directive';
import { TruncateUsername } from '../shared/pipes/shared.pipe';



@NgModule({
  declarations: [
    NavBarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SearchInputComponent,
    NotificationsModule,
    ClickOutsideDirective,
    TruncateUsername
  ],
  exports: [
    NavBarComponent,
    FooterComponent
  ]
})
export class CoreModule { }
