import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const categories = [
  { id: "biriyani-kit", name: "Biriyani Kit", slug: "biriyani-kit", emoji: "🍛", color: "bg-amber-100" },
  { id: "ghee-rice-combo-kit", name: "Ghee Rice", slug: "ghee-rice-combo-kit", emoji: "🍚", color: "bg-yellow-100" },
  { id: "sambals", name: "Sambals", slug: "sambals", emoji: "🌶️", color: "bg-red-100" },
  { id: "pickles", name: "Pickles", slug: "pickles", emoji: "🥒", color: "bg-green-100" },
  { id: "seenima", name: "Seenima", slug: "seenima", emoji: "🫙", color: "bg-orange-100" },
  { id: "umbalakada", name: "Umbalakada", slug: "umbalakada", emoji: "🐠", color: "bg-blue-100" },
  { id: "beef-products", name: "Beef Products", slug: "beef-products", emoji: "🥩", color: "bg-rose-100" },
  { id: "gift-packs", name: "Gift Packs", slug: "gift-packs", emoji: "🎁", color: "bg-purple-100" },
  { id: "custom-orders", name: "Custom Orders", slug: "custom-orders", emoji: "✨", color: "bg-teal-100" },
];

const products = [
  {
    id: "biriyani-combo-kit",
    name: "Biriyani Combo Kit",
    slug: "biriyani-combo-kit",
    category: "biriyani-kit",
    price: 1400,
    weight: "500g",
    shelfLife: "3 months",
    ingredients: "Basmati rice spice blend, dried herbs, whole spices (cinnamon, cardamom, cloves), natural salt",
    description: "Our signature Biriyani Combo Kit brings the authentic flavour of Sri Lankan biriyani to your home. Packed with hand-selected whole spices and a carefully blended masala, this kit makes cooking perfect biriyani effortless. Simply follow our included recipe card for restaurant-quality results every time.",
    emoji: "🍛",
    badge: "Best Seller",
    rating: 4.9,
    reviews: 120,
    customizable: false
  },
  {
    id: "ghee-rice-combo-kit",
    name: "Ghee Rice Combo Kit",
    slug: "ghee-rice-combo-kit",
    category: "ghee-rice-combo-kit",
    price: 1350,
    weight: "500g",
    shelfLife: "3 months",
    ingredients: "Premium short-grain rice, pure ghee, cardamom, cloves, bay leaves, roasted cashews, raisins",
    description: "Indulge in the aromatic goodness of traditional Ghee Rice. This kit provides everything you need to prepare fluffy, flavorful ghee rice, loaded with the richest spices, pure cow ghee, and a crunchy topping of cashews and raisins.",
    emoji: "🍚",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 87,
    customizable: false
  },
  {
    id: "chicken-pickles-150g",
    name: "Chicken Pickles 150g",
    slug: "chicken-pickles-150g",
    category: "pickles",
    price: 700,
    weight: "150g",
    shelfLife: "6 months",
    ingredients: "Chicken, vinegar, chili, garlic, ginger, mustard, spices, natural oil",
    description: "Tangy, spicy, and packed with authentic Sri Lankan flavour — our homemade Chicken Pickle is the perfect accompaniment to rice, roti, or bread. Made with fresh chicken and a special blend of spices, then slow-cooked to perfection.",
    emoji: "🥒",
    badge: null,
    rating: 4.8,
    reviews: 85,
    customizable: true
  },
  {
    id: "beef-pickle-150g",
    name: "Beef Pickle 150g",
    slug: "beef-pickle-150g",
    category: "pickles",
    price: 750,
    weight: "150g",
    shelfLife: "6 months",
    ingredients: "Beef chunks, ginger, garlic, mustard seeds, vinegar, chili powder, spices, oil",
    description: "Our homemade Beef Pickle is slow-cured with authentic Sri Lankan spices and vinegar, yielding tender chunks of flavorful beef. Tangy, fiery, and deeply satisfying, it pairs perfectly with hot rice or bread.",
    emoji: "🥩",
    badge: null,
    rating: 4.7,
    reviews: 56,
    customizable: true
  },
  {
    id: "prawns-pickle-150g",
    name: "Prawns Pickle 150g",
    slug: "prawns-pickle-150g",
    category: "pickles",
    price: 900,
    weight: "150g",
    shelfLife: "6 months",
    ingredients: "Prawns, lime, chili paste, ginger, garlic, mustard powder, vinegar, coconut oil",
    description: "Tangy and spice-kissed prawns pickle, handmade with the freshest local catch and traditional spices. An exquisite delicacy that brings the coastal flavors of Sri Lanka to your dining table.",
    emoji: "🦐",
    badge: "New",
    rating: 4.6,
    reviews: 24,
    customizable: true
  },
  {
    id: "crab-pickle-150g",
    name: "Crab Pickle 150g",
    slug: "crab-pickle-150g",
    category: "pickles",
    price: 950,
    weight: "150g",
    shelfLife: "6 months",
    ingredients: "Crab meat, red chili flakes, tamarind paste, garlic, fenugreek, vinegar, oil",
    description: "A rare and luxurious pickle made from fresh crab meat, slow-cooked in a spicy tamarind and chili base. Packed with sweet crab flavor and fiery Sri Lankan spices.",
    emoji: "🦀",
    badge: null,
    rating: 4.5,
    reviews: 18,
    customizable: true
  },
  {
    id: "fish-pickle-150g",
    name: "Fish Pickle 150g",
    slug: "fish-pickle-150g",
    category: "pickles",
    price: 700,
    weight: "150g",
    shelfLife: "6 months",
    ingredients: "Tuna fish cubes, black pepper, goraka (garcinia), chili, ginger, garlic, vinegar, oil",
    description: "Traditional Sri Lankan fish pickle made from fresh tuna cubes, cured with goraka and black pepper for a distinct tangy-spicy flavor profile. Perfect side dish for milk rice or ghee rice.",
    emoji: "🐟",
    badge: null,
    rating: 4.6,
    reviews: 41,
    customizable: true
  },
  {
    id: "chicken-sambal-250g",
    name: "Chicken Sambal 250g",
    slug: "chicken-sambal-250g",
    category: "sambals",
    price: 1250,
    weight: "250g",
    shelfLife: "4 months",
    ingredients: "Chicken, dried chili, onion, Maldive fish, coconut oil, salt, lime",
    description: "A rich, flavour-packed sambal made with tender chicken and our special chili blend. This classic Sri Lankan condiment pairs beautifully with rice, hoppers, or string hoppers. Made fresh in small batches without any preservatives.",
    emoji: "🌶️",
    badge: "Best Seller",
    rating: 4.9,
    reviews: 94,
    customizable: true
  },
  {
    id: "beef-sambal-250g",
    name: "Beef Sambal 250g",
    slug: "beef-sambal-250g",
    category: "sambals",
    price: 1200,
    weight: "250g",
    shelfLife: "4 months",
    ingredients: "Shredded beef, roasted chili flakes, onions, garlic, lemongrass, ginger, coconut oil",
    description: "A dry, textured sambal featuring savory shredded beef pan-fried with caramelized onions, hot chili flakes, and local aromatics. Offers an intense kick of flavor.",
    emoji: "🥩",
    badge: null,
    rating: 4.6,
    reviews: 45,
    customizable: true
  },
  {
    id: "dry-fish-sambal-250g",
    name: "Dry Fish Sambal 250g",
    slug: "dry-fish-sambal-250g",
    category: "sambals",
    price: 1250,
    weight: "250g",
    shelfLife: "4 months",
    ingredients: "Salted dry fish (tuna), onions, green chilies, lime juice, chili powder, oil",
    description: "Made from premium dried tuna, this sambal is crispy, salty, spicy, and tangy. Perfectly balanced to accompany any standard dhal curry and rice meal.",
    emoji: "🐟",
    badge: null,
    rating: 4.7,
    reviews: 62,
    customizable: true
  },
  {
    id: "kooni-sambal-250g",
    name: "Kooni Sambal 250g",
    slug: "kooni-sambal-250g",
    category: "sambals",
    price: 1100,
    weight: "250g",
    shelfLife: "4 months",
    ingredients: "Tiny dried shrimp (kooni), onions, chili powder, lime, coconut oil, salt",
    description: "Classic Sri Lankan Kooni Sambal made with sun-dried small shrimp, toasted and ground with onions, red chili, and fresh lime. Adds a crunchy, savory seafood punch to your meal.",
    emoji: "🦐",
    badge: null,
    rating: 4.6,
    reviews: 33,
    customizable: true
  },
  {
    id: "maldive-fish-sambal-250g",
    name: "Maldive Fish Sambal 250g",
    slug: "maldive-fish-sambal-250g",
    category: "sambals",
    price: 1150,
    weight: "250g",
    shelfLife: "6 months",
    ingredients: "Premium Maldive fish chips, red onion, chili flakes, lime juice, salt, sugar",
    description: "Traditional Sri Lankan Umbalakada (Maldive Fish) Sambal. A thick, spicy onion-relish loaded with Maldive fish chips. A must-have side dish for milk rice (Kiribath) or string hoppers.",
    emoji: "🐠",
    badge: null,
    rating: 4.7,
    reviews: 28,
    customizable: true
  },
  {
    id: "banana-blossom-sambal-250g",
    name: "Banana Blossom Sambal 250g",
    slug: "banana-blossom-sambal-250g",
    category: "sambals",
    price: 900,
    weight: "250g",
    shelfLife: "3 months",
    ingredients: "Banana flower (blossom), red onions, green chili, black pepper, Maldive fish, lime, oil",
    description: "A rare vegetarian-friendly delicacy (contains minor Maldive fish for umami, can be custom ordered vegan) made from finely shredded banana blossoms, tempered with spices, curry leaves, and lime. Crunchy and unique.",
    emoji: "🌸",
    badge: "New",
    rating: 4.5,
    reviews: 15,
    customizable: true
  },
  {
    id: "seenima-250g",
    name: "Seenima 250g",
    slug: "seenima-250g",
    category: "seenima",
    price: 850,
    weight: "250g",
    shelfLife: "6 months",
    ingredients: "Seenima leaves, cardamom, cloves, onions, chili flakes, sugar, salt, oil",
    description: "A sweet and spicy onion relish caramelized to perfection with Sri Lankan spices. Rich, fragrant, and highly versatile.",
    emoji: "🫙",
    badge: null,
    rating: 4.6,
    reviews: 38,
    customizable: true
  },
  {
    id: "gift-pack-small",
    name: "Gift Pack — Small",
    slug: "gift-pack-small",
    category: "gift-packs",
    price: 2500,
    weight: "800g",
    shelfLife: "3 months",
    ingredients: "Assortment of selected pickles and sambals in a premium decorated gift box",
    description: "A beautiful mini-gift box containing an assortment of our best-selling pickles and sambals in smaller 100g jars. Ideal for gifting loved ones.",
    emoji: "🎁",
    badge: "Popular",
    rating: 4.9,
    reviews: 67,
    customizable: false
  },
  {
    id: "gift-pack-large",
    name: "Gift Pack — Large",
    slug: "gift-pack-large",
    category: "gift-packs",
    price: 4500,
    weight: "1.8kg",
    shelfLife: "3 months",
    ingredients: "Full size Biriyani Combo Kit, plus three full-size jars (Pickle, Sambal, Seenima) in a premium custom-decorated gift box",
    description: "Our ultimate signature gift box. Contains a full-size Biriyani Combo Kit, a jar of Chicken Pickle, a jar of Maldive Fish Sambal, and a jar of Seenima. Packed beautifully in a custom-designed Fathima's Foods gift chest.",
    emoji: "🎀",
    badge: "Popular",
    rating: 5.0,
    reviews: 42,
    customizable: false
  }
];

export async function GET() {
  try {
    const batch = adminDb.batch();

    // Seed Categories
    for (const cat of categories) {
      const docRef = adminDb.collection("categories").doc(cat.id);
      batch.set(docRef, cat);
    }

    // Seed Products
    for (const prod of products) {
      const docRef = adminDb.collection("products").doc(prod.id);
      batch.set(docRef, {
        ...prod,
        stock_count: 50,
        availability: "in_stock",
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
        deleted_at: null,
      });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      seededCategories: categories.length,
      seededProducts: products.length,
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
