const menu_data = [
  {
    id: 1,
    single_link: true,
    title: 'Home',
    link: '/home-2',
  },
  {
    id: 2,
    // products: true,
    single_link: true,
    title: 'Products',
    link: '/shop',
    // product_pages: [
    //   {
    //     title: 'Shop Page',
    //     link: '/shop',
    //     mega_menus: [
    //       { title: 'Only Categories', link: '/shop-category' },
    //       { title: 'Shop Grid with Sideber', link: '/shop' },
    //       { title: 'Product Details', link: '/product-details' },
    //     ]
    //   },
    //   {
    //     title: 'Products',
    //     link: '/product-details',
    //     mega_menus: [
    //       { title: 'Product Simple', link: '/product-details' },
    //       { title: 'With Video', link: '/product-details-video' },
    //       { title: 'With Countdown Timer', link: '/product-details-countdown' },
    //       { title: 'Variations Swatches', link: '/product-details-swatches' },
    //     ]
    //   },
    //   {
    //     title: 'eCommerce',
    //     link: '/shop',
    //     mega_menus: [
    //       { title: 'Shopping Cart', link: '/cart' },
    //       { title: 'Compare', link: '/compare' },
    //       { title: 'Wishlist', link: '/wishlist' },
    //       { title: 'Checkout', link: '/checkout' },
    //       { title: 'My account', link: '/profile' },
    //     ]
    //   },
    //   {
    //     title: 'More Pages',
    //     link: '/shop',
    //     mega_menus: [
    //       { title: 'Login', link: '/login' },
    //       { title: 'Register', link: '/register' },
    //       { title: 'Forgot Password', link: '/forgot' },
    //       { title: '404 Error', link: '/404' },
    //     ]
    //   },
    // ]
  },
  // {
  //   id: 3,
  //   sub_menu: true,
  //   title: 'Shop',
  //   link: '/shop',
  //   sub_menus: [
  //     { title: 'Shop', link: '/shop' },
  //     { title: 'Right Sidebar', link: '/shop-right-sidebar' },
  //     { title: 'Hidden Sidebar', link: '/shop-hidden-sidebar' },
  //   ],
  // },
  {
    id: 3,
    sub_menu: true,
    title: 'E-Commerce',
    link: '/cart',
    sub_menus: [
      { title: 'Shopping Cart', link: '/cart' },
      { title: 'Wishlist', link: '/wishlist' },
      { title: 'Checkout', link: '/checkout' },
      { title: 'My account', link: '/profile' },
    ],
  },
  {
    id: 5,
    sub_menu: true,
    title: 'Blog',
    link: '/blog',
    sub_menus: [
      { title: 'Blog Standard', link: '/blog' },
      { title: 'Blog Grid', link: '/blog-grid' },
      { title: 'Blog List', link: '/blog-list' },
      { title: 'Blog Details', link: '/blog-details' },
      { title: 'Blog Details Full Width', link: '/blog-details-2' },
    ]
  },
  {
    id: 6,
    single_link: true,
    title: 'Contact',
    link: '/contact',
  },
]

export default menu_data;

// mobile_menu
export const mobile_menu = [
  {
    id: 1,
    single_link: true,
    title: 'Home',
    link: '/home-2',
  },
  {
    id: 2,
    single_link: true,
    title: 'Products',
    link: '/shop',
  },
  {
    id: 3,
    sub_menu: true,
    title: 'E-Commerce',
    link: '/cart',
    sub_menus: [
      { title: 'Shopping Cart', link: '/cart' },
      { title: 'Wishlist', link: '/wishlist' },
      { title: 'Checkout', link: '/checkout' },
      { title: 'My account', link: '/profile' },
    ],
  },
  {
    id: 5,
    sub_menu: true,
    title: 'Blog',
    link: '/blog',
    sub_menus: [
      { title: 'Blog Standard', link: '/blog' },
      { title: 'Blog Grid', link: '/blog-grid' },
      { title: 'Blog List', link: '/blog-list' },
      { title: 'Blog Details', link: '/blog-details' },
      { title: 'Blog Details Full Width', link: '/blog-details-2' },
    ]
  },
  {
    id: 6,
    single_link: true,
    title: 'Contact',
    link: '/contact',
  },
]