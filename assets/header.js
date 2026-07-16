document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('[data-header]');

  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenuCloseButtons = document.querySelectorAll(
    '[data-mobile-menu-close]'
  );

  const searchDrawer = document.querySelector('[data-search-drawer]');
  const searchToggle = document.querySelector('[data-search-toggle]');
  const searchCloseButtons = document.querySelectorAll('[data-search-close]');

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  function openMobileMenu() {
    if (!mobileMenu) return;

    mobileMenu.classList.add('is-open');
    document.body.classList.add('sleek-menu-open');

    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;

    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('sleek-menu-open');

    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  mobileMenuCloseButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      closeMobileMenu();
    });
  });

  /* =========================================================
     SEARCH DRAWER
  ========================================================= */

  function openSearchDrawer() {
    if (!searchDrawer) return;

    /*
      Mobile menu open hoy to pehla close kariye.
    */
    closeMobileMenu();

    searchDrawer.classList.add('is-open');
    document.body.classList.add('sleek-search-open');

    /*
      Animation complete thay pachhi input focus.
    */
    setTimeout(function () {
      const searchInput = searchDrawer.querySelector(
        'input[type="search"]'
      );

      if (searchInput) {
        searchInput.focus();
      }
    }, 400);
  }

  function closeSearchDrawer() {
    if (!searchDrawer) return;

    searchDrawer.classList.remove('is-open');
    document.body.classList.remove('sleek-search-open');
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', function () {
      openSearchDrawer();
    });
  }

  searchCloseButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      closeSearchDrawer();
    });
  });

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;

    closeMobileMenu();
    closeSearchDrawer();
  });

  /* =========================================================
     CLOSE MOBILE MENU ON RESIZE
  ========================================================= */

  window.addEventListener('resize', function () {
    if (window.innerWidth > 991) {
      closeMobileMenu();
    }
  });

  /* =========================================================
     STICKY HEADER
  ========================================================= */

  if (header) {
    const stickyEnabled = header.dataset.sticky === 'true';

    if (stickyEnabled) {
      let headerHeight = header.offsetHeight;

      /*
        Spacer create kariye jethi header fixed thay
        tyare page jump na thay.
      */
      const headerSpacer = document.createElement('div');

      headerSpacer.classList.add('sleek-header-spacer');
      headerSpacer.style.display = 'none';

      header.parentNode.insertBefore(
        headerSpacer,
        header.nextSibling
      );

      function updateHeaderHeight() {
        headerHeight = header.offsetHeight;
        headerSpacer.style.height = headerHeight + 'px';
      }

      function handleStickyHeader() {
        const scrollPosition =
          window.pageYOffset ||
          document.documentElement.scrollTop;

        if (scrollPosition > 10) {
          header.classList.add('is-sticky');

          headerSpacer.style.display = 'block';
          headerSpacer.style.height = headerHeight + 'px';
        } else {
          header.classList.remove('is-sticky');

          headerSpacer.style.display = 'none';
        }
      }

      updateHeaderHeight();
      handleStickyHeader();

      window.addEventListener(
        'scroll',
        handleStickyHeader,
        {
          passive: true
        }
      );

      window.addEventListener('resize', function () {
        updateHeaderHeight();
      });
    }
  }

  /* =========================================================
     MOBILE ACCORDION
     Only one top-level menu open at a time
  ========================================================= */

  const mobileMenuItems = document.querySelectorAll(
    '.sleek-mobile-menu__item'
  );

  mobileMenuItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;

      mobileMenuItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.removeAttribute('open');
        }
      });
    });
  });

  /* =========================================================
     MOBILE CHILD ACCORDION
  ========================================================= */

  const mobileChildItems = document.querySelectorAll(
    '.sleek-mobile-menu__child'
  );

  mobileChildItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;

      const parent = item.closest(
        '.sleek-mobile-menu__submenu'
      );

      if (!parent) return;

      const siblingItems = parent.querySelectorAll(
        '.sleek-mobile-menu__child'
      );

      siblingItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.removeAttribute('open');
        }
      });
    });
  });
});