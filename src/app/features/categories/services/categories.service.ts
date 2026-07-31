import { Injectable, signal } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

const API_URL = 'https://api.escuelajs.co/api/v1';

import { Category, productsPerCategory } from '../models/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  categories$ = signal<any[]>([]);
  categoryDetail$ = signal<any | null>([]);
  categoryDetailId$ = signal<number>(0);
  categoryProducts$ = signal<any[]>([]);

  constructor(private http: HttpClient) {
  }

  getAllCategories(): void {
    this.http
      .get<any[]>(API_URL + '/categories')
      .pipe(
        map((response) =>
          response.map((category, index) => ({
            id: category?.id,
            name: category?.name,
            slug: category?.slug,
            image: category?.image,
            creationAt: category?.creationAt,
            updateAt: category?.updateAt,
          }))
        ),
        catchError((error) => {
          console.error('Error getAllCategories(): ', error);
          return of([]);
        })
      )
      .subscribe((categories) => this.categories$.set(categories));
  }

  getCategoryBySlug(slug: string): void {
    const foundCategory = this.categories$().find(
      (category) => category?.slug === slug
    );
    if (foundCategory) {
      this.categoryDetail$.set(foundCategory);
      return;
    }

    this.http
      .get<any>(API_URL + `/categories/slug/${slug}`)
      .pipe(
        map((category: Category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          image: category.image,
        })),
        catchError((error) => {
          console.error('Error getCategoryById(): ', error);
          return of(null);
        })
      )
      .subscribe((category: any) => {
        this.categoryDetail$.set(category);
        this.categoryDetailId$.set(category.id);
      });
  }

  getProductsPerCategory(id: number) {
    this.http
      .get<productsPerCategory[]>(`${API_URL}/categories/${id}/products`)
      .pipe(
        map((response) =>
          response.map((product: productsPerCategory) => ({
            id: product?.id,
            title: product?.title,
            slug: product?.slug,
            price: product?.price,
            description: product?.description,
            category: product?.category,
            images: product?.images,
          }))
        ),
        catchError((error) => {
          console.error('Error getProductsPerCategory():', error);
          return of([]);
        })
      )
      .subscribe((products: any) => {
        this.categoryProducts$.set(products);
      });
  }
}