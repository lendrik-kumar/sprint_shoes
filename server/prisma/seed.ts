import { prisma } from '@config/database';
import bcrypt from 'bcryptjs';

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Create demo admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Created demo admin user (admin@example.com / admin123)');


  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'mens-shoes' },
      update: {},
      create: {
        name: "Men's Shoes",
        slug: 'mens-shoes',
        description: "Premium men's footwear collection",
      },
    }),
    prisma.category.upsert({
      where: { slug: 'womens-shoes' },
      update: {},
      create: {
        name: "Women's Shoes",
        slug: 'womens-shoes',
        description: "Stylish women's shoe collection",
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports-shoes' },
      update: {},
      create: {
        name: 'Sports Shoes',
        slug: 'sports-shoes',
        description: 'Athletic and performance footwear',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Product seed data
  const productData = [
    {
      name: 'Classic Running Shoe',
      slug: 'classic-running-shoe',
      description: 'Comfortable and durable running shoe for everyday use. Features cushioned insole, breathable mesh upper, and lightweight EVA midsole for all-day comfort.',
      basePrice: 4999,
      discountPrice: 3999,
      discountPercent: 20,
      sku: 'SHOE-001',
      categoryIdx: 0,
      images: ['/assets/shoes/shoe-1.jpg', '/assets/shoes/shoe-2.webp'],
      colors: [{ name: 'Color', value: 'Black' }, { name: 'Color', value: 'White' }],
    },
    {
      name: 'Elite Basketball Sneaker',
      slug: 'elite-basketball-sneaker',
      description: 'High-performance basketball shoe with ankle support. Built with premium leather and responsive cushioning for explosive court performance.',
      basePrice: 6999,
      discountPrice: 5499,
      discountPercent: 21,
      sku: 'SHOE-002',
      categoryIdx: 2,
      images: ['/assets/shoes/shoe-3.webp', '/assets/shoes/shoe-4.webp'],
      colors: [{ name: 'Color', value: 'Red' }, { name: 'Color', value: 'Black' }],
    },
    {
      name: 'Urban Street Walker',
      slug: 'urban-street-walker',
      description: 'Sleek street-style sneaker with a modern silhouette. Perfect for everyday wear with premium suede overlays and plush collar lining.',
      basePrice: 3499,
      discountPrice: 2999,
      discountPercent: 14,
      sku: 'SHOE-003',
      categoryIdx: 0,
      images: ['/assets/shoes/shoe-5.avif', '/assets/shoes/shoe-6.avif'],
      colors: [{ name: 'Color', value: 'Grey' }, { name: 'Color', value: 'Navy' }],
    },
    {
      name: 'Trail Blazer Pro',
      slug: 'trail-blazer-pro',
      description: 'Rugged trail running shoe with aggressive grip. Designed for off-road adventures with waterproof membrane and rock plate protection.',
      basePrice: 5999,
      discountPrice: 4499,
      discountPercent: 25,
      sku: 'SHOE-004',
      categoryIdx: 2,
      images: ['/assets/shoes/shoe-7.avif', '/assets/shoes/shoe-8.avif'],
      colors: [{ name: 'Color', value: 'Green' }, { name: 'Color', value: 'Brown' }],
    },
    {
      name: 'Velocity Sprint X',
      slug: 'velocity-sprint-x',
      description: 'Lightweight racing flat built for speed. Carbon-fiber plate technology and nitrogen-infused foam deliver unmatched energy return.',
      basePrice: 8999,
      discountPrice: 7499,
      discountPercent: 17,
      sku: 'SHOE-005',
      categoryIdx: 2,
      images: ['/assets/shoes/shoe-9.avif', '/assets/shoes/shoe-10.png'],
      colors: [{ name: 'Color', value: 'Neon Yellow' }, { name: 'Color', value: 'White' }],
    },
    {
      name: 'Comfort Cloud Slip-On',
      slug: 'comfort-cloud-slip-on',
      description: 'Ultra-comfortable slip-on with memory foam insole. Hands-free heel design and soft knit upper make it perfect for travel and casual outings.',
      basePrice: 2999,
      discountPrice: 2499,
      discountPercent: 17,
      sku: 'SHOE-006',
      categoryIdx: 1,
      images: ['/assets/shoes/shoe-11.avif', '/assets/shoes/shoe-12.avif'],
      colors: [{ name: 'Color', value: 'Pink' }, { name: 'Color', value: 'Black' }],
    },
    {
      name: 'Heritage Leather Boot',
      slug: 'heritage-leather-boot',
      description: 'Premium full-grain leather boot with Goodyear welt construction. Timeless style meets modern comfort with cushioned footbed and durable rubber outsole.',
      basePrice: 9999,
      discountPrice: 7999,
      discountPercent: 20,
      sku: 'SHOE-007',
      categoryIdx: 0,
      images: ['/assets/shoes/shoe-13.avif', '/assets/shoes/shoe-14.avif'],
      colors: [{ name: 'Color', value: 'Tan' }, { name: 'Color', value: 'Dark Brown' }],
    },
    {
      name: 'AeroFlex Training Shoe',
      slug: 'aeroflex-training-shoe',
      description: 'Versatile cross-training shoe for gym and HIIT workouts. Wide flat base for stability, flexible forefoot, and breathable engineered mesh.',
      basePrice: 4499,
      discountPrice: 3799,
      discountPercent: 16,
      sku: 'SHOE-008',
      categoryIdx: 2,
      images: ['/assets/shoes/shoe-15.avif', '/assets/shoes/shoe-1.jpg'],
      colors: [{ name: 'Color', value: 'Black' }, { name: 'Color', value: 'Blue' }],
    },
    {
      name: 'Summer Breeze Sandal',
      slug: 'summer-breeze-sandal',
      description: 'Sporty yet elegant sandal with adjustable straps. Contoured cork footbed and soft leather upper provide all-day walking comfort.',
      basePrice: 1999,
      discountPrice: 1499,
      discountPercent: 25,
      sku: 'SHOE-009',
      categoryIdx: 1,
      images: ['/assets/shoes/shoe-3.webp', '/assets/shoes/shoe-5.avif'],
      colors: [{ name: 'Color', value: 'Beige' }, { name: 'Color', value: 'White' }],
    },
    {
      name: 'Midnight Runner GTX',
      slug: 'midnight-runner-gtx',
      description: 'All-weather running shoe with Gore-Tex waterproof lining. Reflective details for night visibility and aggressive outsole for wet conditions.',
      basePrice: 7499,
      discountPrice: 5999,
      discountPercent: 20,
      sku: 'SHOE-010',
      categoryIdx: 2,
      images: ['/assets/shoes/shoe-8.avif', '/assets/shoes/shoe-9.avif'],
      colors: [{ name: 'Color', value: 'All Black' }, { name: 'Color', value: 'Charcoal' }],
    },
    {
      name: 'Canvas Classic Low',
      slug: 'canvas-classic-low',
      description: 'Timeless canvas sneaker with vulcanized rubber sole. Lightweight, easy to style, and available in a variety of fresh colorways.',
      basePrice: 1999,
      discountPrice: null,
      discountPercent: 0,
      sku: 'SHOE-011',
      categoryIdx: 0,
      images: ['/assets/shoes/shoe-11.avif', '/assets/shoes/shoe-12.avif'],
      colors: [{ name: 'Color', value: 'White' }, { name: 'Color', value: 'Red' }],
    },
    {
      name: 'Power Lift Max',
      slug: 'power-lift-max',
      description: 'Professional weightlifting shoe with elevated heel. TPU heel wedge and metatarsal strap provide locked-in stability for heavy lifts.',
      basePrice: 6499,
      discountPrice: 5499,
      discountPercent: 15,
      sku: 'SHOE-012',
      categoryIdx: 2,
      images: ['/assets/shoes/shoe-14.avif', '/assets/shoes/shoe-15.avif'],
      colors: [{ name: 'Color', value: 'White' }, { name: 'Color', value: 'Black' }],
    },
  ];

  const products = [];
  for (const pd of productData) {
    const product = await prisma.product.upsert({
      where: { sku: pd.sku },
      update: {},
      create: {
        name: pd.name,
        slug: pd.slug,
        description: pd.description,
        basePrice: pd.basePrice,
        discountPrice: pd.discountPrice,
        discountPercent: pd.discountPercent,
        sku: pd.sku,
        categoryId: categories[pd.categoryIdx].id,
      },
    });
    products.push(product);

    // Create images (delete old ones first, then recreate)
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    for (let i = 0; i < pd.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: pd.images[i],
          altText: `${pd.name} image ${i + 1}`,
          displayOrder: i,
        },
      });
    }

    // Create variants with sizes
    for (const color of pd.colors) {
      const variant = await prisma.productVariant.upsert({
        where: { productId_name_value: { productId: product.id, name: color.name, value: color.value } },
        update: {},
        create: {
          productId: product.id,
          name: color.name,
          value: color.value,
        },
      });

      await Promise.all(
        ['6', '7', '8', '9', '10', '11', '12'].map((size) =>
          prisma.size.upsert({
            where: { variantId_size: { variantId: variant.id, size } },
            update: {},
            create: {
              variantId: variant.id,
              size,
              quantity: Math.floor(Math.random() * 80) + 10,
            },
          })
        )
      );
    }
  }

  console.log(`✅ Created ${products.length} products with images and variants`);

  // Create a demo customer user
  const customerPasswordHash = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerPasswordHash,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CUSTOMER',
      emailVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Created demo customer user (customer@example.com / customer123)');

  // Create some sample reviews
  const reviewTexts = [
    { rating: 5, title: 'Amazing!', content: 'Absolutely love these shoes! Super comfortable and look great.' },
    { rating: 4, title: 'Good quality', content: 'Good quality and fast shipping. Fit is slightly narrow.' },
    { rating: 5, title: 'Best ever', content: 'Best running shoes I have ever owned. Highly recommend!' },
    { rating: 3, title: 'Decent', content: 'Decent shoes for the price. Could use more cushioning.' },
    { rating: 4, title: 'Stylish', content: 'Stylish and comfortable. Gets a lot of compliments.' },
  ];

  for (let i = 0; i < Math.min(products.length, 5); i++) {
    await prisma.review.create({
      data: {
        productId: products[i].id,
        userEmail: customer.email,
        rating: reviewTexts[i].rating,
        title: reviewTexts[i].title,
        content: reviewTexts[i].content,
      },
    });
  }
  console.log('✅ Created sample reviews');

  console.log('✅ Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
