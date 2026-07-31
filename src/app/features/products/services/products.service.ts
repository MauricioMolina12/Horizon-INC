import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

const API_URL = 'https://api.escuelajs.co/api/v1';
import { Router } from '@angular/router';
import { Product } from '../../../features/products/models/products.model';
import { Store } from '@ngrx/store';
import { loadProductBySlug } from '../store/actions/product.actions';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products$ = signal<Product[]>([]);
  productDetail$ = signal<Product | null>(null);
  users$ = signal<
    | {
        id: number;
        email: string;
        password: string;
        name: string;
        role: string;
        avatar: string;
        creationAt: string;
        updatedAt: string;
      }[]
    | null
  >(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {}

  /**
   * Fetches all products and updates the signal
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(API_URL + '/products').pipe(
      catchError((error) => {
        console.error('ProductsService.getAllProducts() error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetches a product by ID and updates the signal
   * @param slug Product slug
   */
  getProductBySlug(slug: string): Observable<Product> {
    return this.http
      .get<Product>(`${API_URL + '/products/slug/'}${slug}`)
      .pipe(
        catchError((error) => {
          console.error(`Error loading product ${slug}:`, error);
          return throwError(() => error);
        })
      );
  }

  getUsers() {
    this.http
      .get<
        {
          id: number;
          email: string;
          password: string;
          name: string;
          role: string;
          avatar: string;
          creationAt: string;
          updatedAt: string;
        }[]
      >('https://api.escuelajs.co/api/v1/users')
      .subscribe((users) => this.users$.set(users));
  }

  private apiUrl = 'http://www.omdbapi.com/';
  private apiKey = 'd1ba5b3a';
  searchMovies(query: string): Observable<any> {
    return this.http.get(this.apiUrl, {
      params: {
        s: query,
        apikey: this.apiKey,
      },
    });
  }

  /**
   * Allows you to navigate to the product detail path
   * @param product Product Object
   */
  async detailProduct(product: Product) {
    this.productDetail$.set(product);
    this.router.navigate([`/product/${product.slug}`]);
  }
}
