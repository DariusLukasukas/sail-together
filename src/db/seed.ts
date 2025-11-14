import Parse from "@/lib/parse/server";

/**
 * Category seeding is no longer needed.
 * Categories are now static data defined in src/data/categories.ts
 * and stored as slugs (strings) directly on events.
 */
export async function seedCategories() {
  console.log("ℹ️  Categories are now static - no seeding needed.");
  console.log("✅ Category seeding skipped (using static categories from src/data/categories.ts)");
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

