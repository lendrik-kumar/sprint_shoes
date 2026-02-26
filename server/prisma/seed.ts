import { prisma } from '@config/database';

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

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

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'SHOE-001' },
      update: {},
      create: {
        name: 'Classic Running Shoe',
        slug: 'classic-running-shoe',
        description: 'Comfortable and durable running shoe for everyday use',
        basePrice: 4999,
        discountPrice: 3999,
        discountPercent: 20,
        sku: 'SHOE-001',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'SHOE-002' },
      update: {},
      create: {
        name: 'Elite Basketball Sneaker',
        slug: 'elite-basketball-sneaker',
        description: 'High-performance basketball shoe with ankle support',
        basePrice: 6999,
        discountPrice: 5499,
        discountPercent: 21,
        sku: 'SHOE-002',
        categoryId: categories[2].id,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  // Create product variants
  for (const product of products) {
    const variant = await prisma.productVariant.upsert({
      where: { productId_name_value: { productId: product.id, name: 'Color', value: 'Black' } },
      update: {},
      create: {
        productId: product.id,
        name: 'Color',
        value: 'Black',
      },
    });

    // Create sizes
    await Promise.all([
      ...['6', '7', '8', '9', '10', '11', '12'].map((size) =>
        prisma.size.upsert({
          where: { variantId_size: { variantId: variant.id, size } },
          update: {},
          create: {
            variantId: variant.id,
            size,
            quantity: 50,
          },
        })
      ),
    ]);
  }

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
