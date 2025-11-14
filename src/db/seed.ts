import Parse from "@/lib/parse/server";
import type { CategorySlug } from "@/types/category";

interface CategoryData {
  slug: CategorySlug;
  name: string;
  description: string;
}

const CATEGORIES_TO_SEED: CategoryData[] = [
  {
    slug: "race",
    name: "Race / Regatta",
    description: "Competitive sailing events and club regattas.",
  },
  {
    slug: "cruise",
    name: "Cruise / Trip",
    description: "Casual group trips and weekend sails.",
  },
  {
    slug: "meetup",
    name: "Meetup / Social",
    description: "Dock gatherings and community meetups.",
  },
  {
    slug: "training",
    name: "Training / Workshop",
    description: "Sailing lessons or navigation courses.",
  },
  {
    slug: "maintenance",
    name: "Maintenance",
    description: "Workdays, boat prep, or dock repairs.",
  },
  {
    slug: "party",
    name: "Party",
    description: "After-sail parties and harbor celebrations.",
  },
  {
    slug: "meeting",
    name: "Club Meeting",
    description: "Official club meetings or AGMs.",
  },
  {
    slug: "open-day",
    name: "Open Day / Try Sailing",
    description: "Events for new sailors or public demos.",
  },
  {
    slug: "charity",
    name: "Charity Sail",
    description: "Fundraisers or awareness regattas.",
  },
  {
    slug: "other",
    name: "Other",
    description: "Custom or unclassified events.",
  },
];

export async function seedCategories() {
  console.log("🌱 Seeding categories...");

  for (const category of CATEGORIES_TO_SEED) {
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

