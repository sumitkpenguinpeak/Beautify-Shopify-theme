/**
 * Using for recomendation products and recent view products
 */
if (!customElements.get('product-slider')) {
  customElements.define(
    'product-slider',
    class ProductSlider extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.selectors = {
          productsWrap: '.products-grid-wrap',
          products: '.products-grid',
          swiperControls: '.swiper-controls',
        };
        this.classes = {
          grid: 'f-grid',
          swiper: 'swiper',
          swiperWrapper: 'swiper-wrapper',
        };

        this.sectionId = this.dataset.sectionId;
        this.elements = PenguinTheme.utils.queryDomNodes(this.selectors, this);
        this.elements.section = this.closest(`.section-${this.sectionId}`);

        this.enableSlider = this.dataset.enableSlider === 'true';
        this.items = parseInt(this.dataset.items);
        this.tabletItems = parseInt(this.dataset.tabletItems);

        this.sliderInstance = false;

        if (!this.enableSlider) return;

        if (!this.elements.productsWrap || !this.elements.products) return;

        const mql = window.matchMedia(PenguinTheme.config.mediaQueryMobile);
        mql.onchange = this.init.bind(this);
        this.init();
      }

      init() {
        if (PenguinTheme.config.mqlMobile || this.shouldDestroySlider()) {
          this.destroySlider();
        } else {
          this.initSlider();
        }
      }

      initSlider() {
        if (typeof this.sliderInstance === 'object') return;

        const columnGap = PenguinTheme.utils.getGridColumnGap(this.elements.products);

        this.sliderOptions = {
          slidesPerView: this.tabletItems > 3 ? 3 : parseInt(this.tabletItems),
          spaceBetween: columnGap.tablet,
          navigation: {
            nextEl: this.elements.section.querySelector('.swiper-button-next'),
            prevEl: this.elements.section.querySelector('.swiper-button-prev'),
          },
          breakpoints: {
            1024: {
              slidesPerView: this.items > 4 ? 4 : parseInt(this.items),
              spaceBetween: columnGap.tabletLarge,
            },
            1280: {
              slidesPerView: parseInt(this.items),
              spaceBetween: columnGap.desktop,
            },
          },
          loop: true,
          threshold: 2,
        };

        this.elements.productsWrap.classList.add(this.classes.swiper);
        this.elements.products.classList.remove(this.classes.grid);
        this.elements.products.classList.add(this.classes.swiperWrapper);
        this.elements.swiperControls.classList.add('md:block');

        this.sliderInstance = new window.PenguinTheme.Carousel(this.elements.productsWrap, this.sliderOptions);
        this.sliderInstance.init();
        this.handleAccessibility();
        this.fixQuickviewDuplicate();

        this.calcNavButtonsPosition();

        window.addEventListener(
          'resize',
          PenguinTheme.utils.debounce(() => {
            this.calcNavButtonsPosition();
          }, 100),
        );
      }

      handleAccessibility() {
        const focusableElements = PenguinTheme.a11y.getFocusableElements(this);

        focusableElements.forEach((element) => {
          element.addEventListener('focusin', (event) => {
            if (event.relatedTarget !== null) {
              if (element.closest('.swiper-slide')) {
                const slide = element.closest('.swiper-slide');
                this.sliderInstance.slider.slideTo(this.sliderInstance.slider.slides.indexOf(slide));
              }
            } else {
              element.blur();
            }
          });
        });
      }

      destroySlider() {
        this.elements.productsWrap.classList.remove(this.classes.swiper);
        this.elements.products.classList.remove(this.classes.swiperWrapper);
        this.elements.products.classList.add(this.classes.grid);
        this.elements.swiperControls.classList.remove('md:block');
        if (typeof this.sliderInstance !== 'object') return;
        this.sliderInstance.slider.destroy();
        this.sliderInstance = false;
      }

      calcNavButtonsPosition() {
        if (!this.dataset.calcButtonPosition === 'true') return;

        const firstMedia = this.querySelector('.product-card__image-wrapper');
        if (firstMedia && firstMedia.clientHeight > 0) {
          this.elements.section.style.setProperty(
            '--swiper-navigation-top-offset',
            parseInt(firstMedia.clientHeight) / 2 + 'px',
          );
        }
      }

      fixQuickviewDuplicate() {
        let modalIds = [];
        Array.from(this.querySelectorAll('quick-view-modal')).forEach((modal) => {
          const modalID = modal.getAttribute('id');
          if (modalIds.includes(modalID)) {
            modal.remove();
          } else {
            modalIds.push(modalID);
          }
        });
      }

      shouldDestroySlider() {
        const recentlyViewedSection = this.closest('recently-viewed-products');

        if (recentlyViewedSection) {
          const items = JSON.parse(window.localStorage.getItem('luviatheme:recently-viewed') || '[]');
          const productId = parseInt(recentlyViewedSection.dataset.productId);

          if (items.includes(productId)) {
            items.splice(items.indexOf(productId), 1);
          }

          if (items.length < this.items) {
            return true;
          }
        }

        return false;
      }
    },
  );
}
