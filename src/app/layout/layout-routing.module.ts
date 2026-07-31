import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ProductDetailsComponent } from '../features/products/pages/product-details/product-details.component';
import { authGuard } from '../core/guards/auth.guard';
import { sellerGuard } from '../core/guards/seller.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../features/home/home.module').then((m) => m.HomeModule),
      },

      {
        path: 'product/:slug',
        component: ProductDetailsComponent,
        data: { breadcrumb: 'Detalle del producto' },
      },
      {
        path: 'product',
        data: { breadcrumb: 'Productos' },
        loadChildren: () => import('../features/products/products.module').then((m) => m.ProductsModule),
      },
      {
        path: 'category/:slug',
        loadComponent: () => import('../features/categories/components/category-details/category-details.component').then((m) => m.CategoryDetailsComponent),
      },
      {
        path: 'search',
        loadChildren: () => import('../features/search-results/search-results.module').then((m) => m.SearchResultsModule),
      },
      {
        path: 'shopcart',
        loadChildren: () => import('../features/shopcart/shopcart.module').then((m) => m.ShopcartModule),
      },
      {
        path: 'profile',
        // canActivate: [authGuard],
        loadChildren: () => import('../features/profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadChildren: () => import('../features/dashboard/dashboard.module').then( (m) => m.DashboardModule ),
      },
      {
        path: 'favorites',
        loadChildren: () => import('../features/favorites/favorites.module').then( (m) => m.FavoritesModule ),
      },
      {
        path: 'checkout',
        loadChildren: () => import('../features/payments/payments.module').then((m) => m.PaymentsModule),
      },
      {
        path: 'my-stores',
        canActivate: [sellerGuard],
        loadChildren: () => import('../features/my-stores/my-stores.module').then((m) => m.MyStoresModule),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'user/login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
