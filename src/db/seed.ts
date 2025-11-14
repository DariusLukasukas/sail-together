import Parse from "@/lib/parse/server";
import { CATEGORIES } from "@/data/categories";

export async function seedCategories() {
  console.log("🌱 Seeding categories...");

  for (const category of CATEGORIES) {
    const Category = Parse.Object.extend("Category");
    const query = new Parse.Query(Category);
    query.equalTo("slug", category.slug);

    try {
      const existing = await query.first();
      if (existing) {
        console.log(`⚠️ Category "${category.slug}" already exists, skipping.`);
        continue;
      }

      const categoryObj = new Category();
      categoryObj.set("slug", category.slug);
      categoryObj.set("name", category.name);
      categoryObj.set("description", category.description);

      await categoryObj.save();
      console.log(`✅ Created category: ${category.name} (${category.slug})`);
    } catch (err: any) {
      console.error(`❌ Failed to create category "${category.slug}":`, err.message);
      throw err;
    }
  }

  console.log("✅ All categories seeded successfully!");
}

seedCategories()
  .then(() => {
    console.log("✅ Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

