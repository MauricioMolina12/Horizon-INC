import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  signal,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  selectAllProducts,
  selectError,
  selectLoading,
  selectProductDetail,
} from '../../store/selectors/product.selectors';
import { loadProductBySlug } from '../../store/actions/product.actions';
import { SeoService } from '../../../../core/services/seo.service';
import { skeletonType } from '../../../../core/components/skeleton/skeleton.type.enum';
import { Product } from '../../models/products.model';
import { ModalService } from '../../../../shared/components/modal/modal.service';
import { ShareComponent } from '../../../../shared/components/share/share.component';
import { FavoritesFacade } from '../../../favorites/facades/favorites.facade';
import { setOrder } from '../../../payments/store/payment.actions';
import { CheckoutOrder } from '../../../payments/models/payment.model';

interface shipping {
  label: string;
  value: string;
  icon: string;
}

interface ProductFeature {
  label: string;
  value: string;
}

interface ProductFeatureGroup {
  title: string;
  icon: string;
  features: ProductFeature[];
}


@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  // Inputs
  product!: any;

  /*** DOM REFERENCES ***/
  @ViewChildren('imagesProducts') imagesProducts!: QueryList<ElementRef>;
  @ViewChildren('tabBtn') tabs!: QueryList<ElementRef<HTMLButtonElement>>;

  /*** STATES & VARIABLES ***/
  loading!: boolean;

  skeletonType = skeletonType;
  segmentIndicator = 1;
  indicatorWidth = 0;
  indicatorLeft = 0;
  
  showFullText: boolean = false;
  slug: string = '';
  
  quantityProduct: number = 1;
  
  mainImage: string = '';
  
  comments: { name: string; image: string; time: string; comment: string }[] = [
    {
      name: 'Juan Rodríguez',
      image: 'https://randomuser.me/api/portraits/men/10.jpg',
      time: '3 horas',
      comment: `Compré esta camiseta gráfica de montaña y estoy encantada con la calidad del material y la impresión. 
              La talla es perfecta y el diseño es justo lo que esperaba. Se ha convertido en una de mis favoritas para salir a caminar o para usar casualmente. 
              Además, llegó rápido y en buen estado. ¡Muy recomendable!`,
    },
    {
      name: 'María López',
      image: 'https://randomuser.me/api/portraits/women/12.jpg',
      time: '1 día',
      comment: `El diseño es muy atractivo y el tejido se siente cómodo, pero noté que después de unos lavados el color empezó a desvanecerse un poco. 
              Aún así, la camiseta sigue siendo funcional y la recomiendo para quienes buscan un estilo casual con un toque aventurero.`,
    },
    {
      name: 'Pedro Sánchez',
      image: 'https://randomuser.me/api/portraits/men/15.jpg',
      time: '2 días',
      comment: `La camiseta es increíblemente cómoda y el diseño gráfico es impresionante, mucho mejor de lo que esperaba en las fotos. 
              Sin embargo, me hubiera gustado que viniera con una guía más clara de tallas, ya que tuve que cambiarla por una talla más grande. 
              Aparte de eso, el envío fue rápido y el servicio al cliente muy atento.`,
    },
    {
      name: 'Ana Morales',
      image: 'https://randomuser.me/api/portraits/women/18.jpg',
      time: '5 días',
      comment:
        'El producto es tal como se muestra en la descripción, la atención al cliente también fue excelente.',
    },
  ];

  shipping: shipping[] = [
    { label: 'Descuento', value: '50%', icon: 'ti ti-discount' },
    { label: 'Paquete', value: 'Paquete regular', icon: 'ti ti-box' },
    { label: 'Tiempo de entrega', value: '3-4 días hábiles', icon: 'ti ti-calendar' },
    { label: 'Tiempo estimado', value: '10 - 12 Octubre 2026', icon: 'ti ti-truck' },
  ];

  featureGroups: ProductFeatureGroup[] = [
    {
      title: 'Detalles generales',
      icon: 'ti ti-info-circle',
      features: [
        { label: 'Marca', value: 'Holnex' },
        { label: 'Modelo', value: 'HX-2026 Pro' },
        { label: 'SKU', value: 'HNX-00452' },
        { label: 'Condición', value: 'Nuevo' },
        { label: 'Garantía', value: '12 meses' },
      ],
    },
    {
      title: 'Dimensiones y peso',
      icon: 'ti ti-weight',
      features: [
        { label: 'Peso', value: '350 g' },
        { label: 'Alto', value: '25 cm' },
        { label: 'Ancho', value: '18 cm' },
        { label: 'Profundidad', value: '8 cm' },
      ],
    },
    {
      title: 'Material y composición',
      icon: 'ti ti-layers',
      features: [
        { label: 'Material principal', value: 'Algodón orgánico 100%' },
        { label: 'Forro', value: 'Poliéster reciclado' },
        { label: 'Color', value: 'Negro / Gris oscuro' },
        { label: 'Origen', value: 'Colombia' },
      ],
    },
  ];
  
  showFixedHeader = signal(false);
  addedToCart = signal(false);

  /*** STORE & SIGNALS ***/
  productsRelated = toSignal(this.store.select(selectAllProducts), {
    initialValue: [],
  });
  loadingProductsRelated = toSignal(this.store.select(selectLoading), {
    initialValue: false,
  });
  errorProductsRelated = toSignal(this.store.select(selectError), {
    initialValue: null,
  });

  productDetail = toSignal(this.store.select(selectProductDetail), {
    initialValue: null,
  });

  private route = inject(ActivatedRoute);
  private favoritesFacade = inject(FavoritesFacade);

  isFavorite = computed(() => {
    const id = this.product?.id?.toString();
    return id ? this.favoritesFacade.isFavorite(id) : false;
  });

  constructor(
    public productService: ProductsService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private store: Store,
    private router: Router,
    private modalService: ModalService
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const vh = window.innerHeight;

    if (scrollY > vh) {
      this.showFixedHeader.set(true);
    } else {
      this.showFixedHeader.set(false);
    }
  }

  /*** HOOKS ***/

  ngOnInit() {
    this.loading = true;
    this.route.paramMap.subscribe((params) => {
      this.slug = params.get('slug') || '';

      if (!this.slug) {
        this.router.navigate(['/']);
        return;
      }

      const existing = this.productService.productDetail$();
      if (existing) {
        this.setProduct(existing);
        return;
      }

      this.store.dispatch(loadProductBySlug({ slug: this.slug }));
      if (this.productDetail()) {
        this.setProduct(this.productDetail());
        console.log(this.productDetail());
      }
    });
  }

  ngOnDestroy(): void {
    this.slug = '';
    this.seoService.default();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateIndicator();
    });
  }

  /*** PRODUCT ***/
  private setProduct(product: any) {
    if (!product) return;

    this.product = product;
    if (product.images?.length) {
      this.mainImage = product.images[0];
    }
    this.seoService.setMetaData(
      { key: 'name', value: product.title },
      { key: 'description', value: product.description }
    );
    this.loading = false;
  }

  /*** HELPERS ***/

  toggleText() {
    this.showFullText = !this.showFullText;
  }

  uploadQuantity(typeButton: 'upload' | 'down') {
    switch (typeButton) {
      case 'upload':
        this.quantityProduct++;
        break;
      case 'down':
        if (this.quantityProduct > 0) {
          this.quantityProduct--;
        }
        break;
    }
  }

  changeMainImage(index: number, images: any[], event: Event) {
    if (images.length) {
      this.mainImage = images[index];

      this.imagesProducts.forEach((item) => {
        this.renderer.removeClass(item.nativeElement, 'selected');
      });

      let htmlElement = event.target as HTMLElement;
      this.renderer.addClass(htmlElement, 'selected');
    }
  }

  get indicatorTranslate(): number {
    return (this.segmentIndicator - 1) * 100;
  }

  segment(value: number) {
    this.segmentIndicator = value;
    this.updateIndicator();
  }

  private updateIndicator() {
    const tab = this.tabs.toArray()[this.segmentIndicator - 1];
    if (!tab) return;

    const el = tab.nativeElement;
    this.indicatorWidth = el.offsetWidth;
    this.indicatorLeft = el.offsetLeft;
  }

  openModal() {
    this.modalService.open(ShareComponent, {
      size: 'md',
      data: {
        productUrl: window.location.href,
        productTitle: this.product?.title || '',
      },
    });
  }

  addToCart(): void {
    if (this.addedToCart()) return;
    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 2000);
  }

  buyNow(): void {
    if (!this.product?.id) return;

    const order: CheckoutOrder = {
      items: [{
        productId: this.product.id,
        title: this.product.title,
        image: this.product.images?.[0] || '',
        price: this.product.price,
        quantity: this.quantityProduct,
      }],
    };

    this.store.dispatch(setOrder({ order }));
    this.router.navigate(['/checkout']);
  }

  favoriteProduct(): void {
    const productId = this.product?.id?.toString();
    if (!productId) return;
    this.favoritesFacade.toggle(productId, this.product);
  }
}
