#!/usr/bin/env python3
"""
Seed 15 new products across 2 new brands (Bulk, Solgar) and existing brands.
Adds pros, cons, and affiliate links for each product.
Run on the LXC with access to the production database.
"""
import os
import sys
import uuid
import psycopg2

DATABASE_URI = os.environ["DATABASE_URI"]

# ── Data ──────────────────────────────────────────────────────────────────────

NEW_BRANDS = [
    {
        "name": "Bulk",
        "slug": "bulk",
        "website": "https://www.bulk.com",
        "description": "UK-based sports nutrition and supplement brand known for high quality at competitive prices.",
        "manufacturing_location": "United Kingdom",
    },
    {
        "name": "Solgar",
        "slug": "solgar",
        "website": "https://www.solgar.com",
        "description": "Premium supplement brand founded in 1947, known for rigorous quality standards and science-backed formulations.",
        "manufacturing_location": "United States",
    },
]

# Retailer id map — populated at runtime
RETAILER_IDS = {}  # name -> id
BRAND_IDS = {}     # name -> id

PRODUCTS = [
    # ── Simply Supplements (existing brand) ──────────────────────────────────
    {
        "name": "Vitamin K2 MK-7 100mcg",
        "slug": "simply-supplements-vitamin-k2-mk7-100mcg",
        "brand": "Simply Supplements",
        "category": "vitamin",
        "format": "capsule",
        "dose_per_serving": "100mcg",
        "servings_per_container": 90,
        "price": 7.99,
        "vegan": "yes",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 8.8,
        "short_description": "Pure Vitamin K2 as MK-7 (menaquinone-7) — the most bioavailable form. 100mcg per capsule, 90 capsules. Directs calcium to bones, not arteries.",
        "pros": [
            "MK-7 form has the longest half-life — stays active for days",
            "Works synergistically with Vitamin D3",
            "90 capsules is excellent value",
            "Vegan-friendly",
        ],
        "cons": [
            "No D3 included — you need to take separately",
            "Higher doses (200mcg+) may be needed for therapeutic use",
        ],
        "affiliate_links": [
            {"retailer": "Simply Supplements", "url": "https://www.simplysupplements.co.uk/vitamin-k2-mk7-100mcg-90-capsules", "price": 7.99},
        ],
    },
    {
        "name": "Iron 14mg (Ferrous Bisglycinate)",
        "slug": "simply-supplements-iron-ferrous-bisglycinate-14mg",
        "brand": "Simply Supplements",
        "category": "mineral",
        "format": "capsule",
        "dose_per_serving": "14mg",
        "servings_per_container": 120,
        "price": 6.99,
        "vegan": "yes",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 8.3,
        "short_description": "Gentle, non-constipating iron as ferrous bisglycinate. 14mg elemental iron per capsule, 120 capsules. Ideal for women and those with low iron levels.",
        "pros": [
            "Bisglycinate form is gentle on the digestive system",
            "14mg matches the UK RDA — not a megadose",
            "120 capsules is excellent value for money",
            "Suitable for vegans",
        ],
        "cons": [
            "Should only be taken if you have confirmed low iron — excess iron is harmful",
            "Best absorbed on an empty stomach, which some find uncomfortable",
        ],
        "affiliate_links": [
            {"retailer": "Simply Supplements", "url": "https://www.simplysupplements.co.uk/iron-ferrous-bisglycinate-14mg-120-capsules", "price": 6.99},
        ],
    },
    # ── Myvitamins (existing brand) ──────────────────────────────────────────
    {
        "name": "Turmeric & Curcumin with BioPerine",
        "slug": "myvitamins-turmeric-curcumin-bioperine",
        "brand": "Myvitamins",
        "category": "herb",
        "format": "capsule",
        "dose_per_serving": "500mg (95% curcuminoids)",
        "servings_per_container": 60,
        "price": 12.99,
        "vegan": "yes",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 7.9,
        "short_description": "High-strength turmeric extract standardised to 95% curcuminoids, with BioPerine® black pepper for up to 20× better absorption. 60 capsules.",
        "pros": [
            "Standardised to 95% curcuminoids — far more potent than raw turmeric",
            "BioPerine® significantly improves bioavailability",
            "Vegan-friendly capsules",
        ],
        "cons": [
            "Evidence for curcumin is promising but not conclusive for most uses",
            "Not suitable during pregnancy in high doses",
        ],
        "affiliate_links": [
            {"retailer": "Myvitamins", "url": "https://www.myvitamins.com/p/myvitamins-turmeric-curcumin-capsules/12369827/", "price": 12.99},
        ],
    },
    {
        "name": "5-HTP 100mg",
        "slug": "myvitamins-5-htp-100mg",
        "brand": "Myvitamins",
        "category": "amino_acid",
        "format": "capsule",
        "dose_per_serving": "100mg",
        "servings_per_container": 90,
        "price": 14.99,
        "vegan": "yes",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 7.6,
        "short_description": "5-Hydroxytryptophan (5-HTP) from Griffonia simplicifolia. 100mg per capsule, 90 capsules. Supports serotonin production for mood and sleep.",
        "pros": [
            "Natural precursor to serotonin",
            "Good dosage at 100mg per capsule",
            "90-capsule count is great value",
        ],
        "cons": [
            "Should not be combined with SSRIs or antidepressants",
            "Evidence for mood support is moderate — not a replacement for treatment",
            "Some people experience nausea, especially on an empty stomach",
        ],
        "affiliate_links": [
            {"retailer": "Myvitamins", "url": "https://www.myvitamins.com/p/myvitamins-5-htp-100mg-capsules/12419661/", "price": 14.99},
        ],
    },
    {
        "name": "L-Theanine & Caffeine",
        "slug": "myvitamins-l-theanine-caffeine",
        "brand": "Myvitamins",
        "category": "amino_acid",
        "format": "capsule",
        "dose_per_serving": "200mg L-Theanine + 100mg Caffeine",
        "servings_per_container": 60,
        "price": 9.99,
        "vegan": "yes",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 8.2,
        "short_description": "The classic nootropic stack: 200mg L-Theanine paired with 100mg caffeine. Promotes calm, focused energy without the jitters. 60 capsules.",
        "pros": [
            "Well-researched combination with strong evidence for focus and calm energy",
            "Ideal 2:1 L-Theanine to caffeine ratio",
            "Convenient — no need to measure or mix",
        ],
        "cons": [
            "Contains caffeine — not suitable for evening use or those sensitive to stimulants",
            "Caffeine tolerance can build with regular use",
        ],
        "affiliate_links": [
            {"retailer": "Myvitamins", "url": "https://www.myvitamins.com/p/myvitamins-l-theanine-caffeine-capsules/12349791/", "price": 9.99},
        ],
    },
    # ── Holland & Barrett (existing brand) ───────────────────────────────────
    {
        "name": "CoQ10 100mg",
        "slug": "holland-barrett-coq10-100mg",
        "brand": "Holland & Barrett",
        "category": "other",
        "format": "softgel",
        "dose_per_serving": "100mg",
        "servings_per_container": 60,
        "price": 17.99,
        "vegan": "no",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 7.7,
        "short_description": "Coenzyme Q10 100mg per softgel in an oil base for maximum absorption. 60 softgels. Supports cellular energy and is particularly useful for those taking statins.",
        "pros": [
            "Oil-based softgel improves CoQ10 absorption significantly",
            "100mg is a clinically relevant dose",
            "Particularly important for statin users who may be depleted",
        ],
        "cons": [
            "Softgels are not vegan",
            "CoQ10 is expensive — cheaper brands are available",
            "Evidence mainly for specific conditions (heart failure, statin-associated myopathy)",
        ],
        "affiliate_links": [
            {"retailer": "Holland & Barrett", "url": "https://www.hollandandbarrett.com/shop/product/holland-barrett-coq10-100mg-60-capsules-60014219", "price": 17.99},
        ],
    },
    {
        "name": "Selenium 200mcg",
        "slug": "holland-barrett-selenium-200mcg",
        "brand": "Holland & Barrett",
        "category": "mineral",
        "format": "tablet",
        "dose_per_serving": "200mcg",
        "servings_per_container": 100,
        "price": 8.99,
        "vegan": "yes",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 8.0,
        "short_description": "Selenium 200mcg per tablet, 100 tablets. Supports thyroid function, immune health and antioxidant defence. The UK upper safe limit is 350mcg/day.",
        "pros": [
            "100-tablet count is excellent value",
            "Supports thyroid and immune function",
            "Important antioxidant role as a glutathione cofactor",
        ],
        "cons": [
            "200mcg is the upper recommended dose — do not exceed",
            "Selenium toxicity (selenosis) is a risk with higher doses",
        ],
        "affiliate_links": [
            {"retailer": "Holland & Barrett", "url": "https://www.hollandandbarrett.com/shop/product/holland-barrett-selenium-200mcg-100-tablets-00013413", "price": 8.99},
        ],
    },
    # ── Now Foods (existing brand) ────────────────────────────────────────────
    {
        "name": "NAC 600mg",
        "slug": "now-foods-nac-600mg",
        "brand": "Now Foods",
        "category": "amino_acid",
        "format": "capsule",
        "dose_per_serving": "600mg",
        "servings_per_container": 100,
        "price": 18.99,
        "vegan": "yes",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 8.7,
        "short_description": "N-Acetyl Cysteine (NAC) 600mg per capsule, 100 vcaps. Precursor to glutathione — the body's master antioxidant. Supports liver, lung and detoxification pathways.",
        "pros": [
            "High dose at 600mg — well-studied in clinical literature",
            "GMP certified manufacturing",
            "100 capsules is excellent value",
            "Wide safety profile at standard doses",
        ],
        "cons": [
            "Has a sulphurous smell — a turnoff for some",
            "May interact with nitroglycerin — consult a doctor if you have heart conditions",
        ],
        "affiliate_links": [
            {"retailer": "iHerb", "url": "https://www.iherb.com/pr/now-supplements-nac-n-acetyl-cysteine-600-mg-100-veg-capsules/659", "price": 18.99},
        ],
    },
    {
        "name": "5-HTP 100mg",
        "slug": "now-foods-5-htp-100mg",
        "brand": "Now Foods",
        "category": "amino_acid",
        "format": "capsule",
        "dose_per_serving": "100mg",
        "servings_per_container": 90,
        "price": 16.99,
        "vegan": "yes",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 8.3,
        "short_description": "5-HTP 100mg from Griffonia simplicifolia with added Vitamin B6 for serotonin conversion. 90 vcaps. Now Foods GMP certified and third-party verified.",
        "pros": [
            "Includes Vitamin B6 as a cofactor to support serotonin synthesis",
            "GMP certified — rigorous quality standards",
            "Third-party tested",
        ],
        "cons": [
            "Not suitable alongside antidepressants or SSRIs",
            "Evidence for long-term use beyond 12 weeks is limited",
        ],
        "affiliate_links": [
            {"retailer": "iHerb", "url": "https://www.iherb.com/pr/now-supplements-5-htp-100-mg-with-vitamin-b-6-90-veg-capsules/422", "price": 16.99},
        ],
    },
    # ── Bulk (new brand) ─────────────────────────────────────────────────────
    {
        "name": "Creatine Monohydrate Powder 1kg",
        "slug": "bulk-creatine-monohydrate-1kg",
        "brand": "Bulk",
        "category": "amino_acid",
        "format": "powder",
        "dose_per_serving": "5g",
        "servings_per_container": 200,
        "price": 24.99,
        "vegan": "yes",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 9.0,
        "short_description": "Pure unflavoured creatine monohydrate. 1kg — 200 servings at 5g per day. Informed Sport certified. Exceptional value for the most evidence-backed supplement available.",
        "pros": [
            "200 servings per bag — outstanding value",
            "Informed Sport certified — batch tested for banned substances",
            "Pure monohydrate — the gold standard, no gimmicks",
            "Mixes easily and virtually tasteless",
        ],
        "cons": [
            "Some initial water retention during loading phase",
            "Unflavoured only — if you want flavours you'll need to mix with something",
        ],
        "affiliate_links": [
            {"retailer": "Bulk", "url": "https://www.bulk.com/uk/products/creatine-monohydrate-powder/bble-crea", "price": 24.99},
        ],
    },
    {
        "name": "L-Theanine 200mg",
        "slug": "bulk-l-theanine-200mg",
        "brand": "Bulk",
        "category": "amino_acid",
        "format": "capsule",
        "dose_per_serving": "200mg",
        "servings_per_container": 90,
        "price": 11.99,
        "vegan": "yes",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 8.1,
        "short_description": "L-Theanine 200mg per capsule, 90 capsules. Promotes calm alertness without sedation. Naturally found in green tea. Works well alongside caffeine.",
        "pros": [
            "Effective standalone or as a caffeine stack partner",
            "90 capsules at a competitive price",
            "Good evidence for reducing anxiety and improving focus",
        ],
        "cons": [
            "Effects can be subtle — not a dramatic stimulant",
            "Limited long-term human trial data beyond 8 weeks",
        ],
        "affiliate_links": [
            {"retailer": "Bulk", "url": "https://www.bulk.com/uk/products/l-theanine-capsules/bble-lthe", "price": 11.99},
        ],
    },
    {
        "name": "Complete Multivitamin Complex",
        "slug": "bulk-complete-multivitamin-complex",
        "brand": "Bulk",
        "category": "multivitamin",
        "format": "tablet",
        "dose_per_serving": "1 tablet",
        "servings_per_container": 60,
        "price": 12.99,
        "vegan": "yes",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 7.8,
        "short_description": "Comprehensive multivitamin with 26 vitamins and minerals. 60 tablets — 2 months' supply. Uses methylfolate and methylcobalamin for better bioavailability.",
        "pros": [
            "Uses active forms (methylfolate, methylcobalamin) not the cheaper synthetic variants",
            "26 nutrients at meaningful doses",
            "Good value at 60 tablets",
        ],
        "cons": [
            "Iron-free — useful for men/post-menopausal women but not suitable if you need iron",
            "One tablet per day — some nutrients may be better split into two doses",
        ],
        "affiliate_links": [
            {"retailer": "Bulk", "url": "https://www.bulk.com/uk/products/complete-multivitamin-complex/bble-cmvc", "price": 12.99},
        ],
    },
    # ── Solgar (new brand) ───────────────────────────────────────────────────
    {
        "name": "Vitamin D3 2500 IU",
        "slug": "solgar-vitamin-d3-2500iu",
        "brand": "Solgar",
        "category": "vitamin",
        "format": "softgel",
        "dose_per_serving": "2500 IU (62.5mcg)",
        "servings_per_container": 90,
        "price": 15.99,
        "vegan": "no",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 9.1,
        "short_description": "High-strength Vitamin D3 as cholecalciferol, 2500 IU (62.5mcg) per softgel. 90 softgels. Solgar's premium oil-base for superior absorption. Free from gluten and dairy.",
        "pros": [
            "2500 IU is a therapeutic dose — useful for those who are deficient",
            "Oil-base improves absorption significantly vs tablets",
            "Solgar's rigorous quality and purity standards",
            "Free from gluten, dairy, and artificial additives",
        ],
        "cons": [
            "Not vegan — softgel capsule",
            "Higher dose than needed for maintenance — check your blood levels first",
        ],
        "affiliate_links": [
            {"retailer": "Holland & Barrett", "url": "https://www.hollandandbarrett.com/shop/product/solgar-vitamin-d3-2500-iu-90-softgels-60007393", "price": 15.99},
        ],
    },
    {
        "name": "Magnesium Citrate 200mg",
        "slug": "solgar-magnesium-citrate-200mg",
        "brand": "Solgar",
        "category": "mineral",
        "format": "tablet",
        "dose_per_serving": "200mg elemental magnesium (3 tablets)",
        "servings_per_container": 60,
        "price": 17.99,
        "vegan": "yes",
        "vegetarian": "yes",
        "gluten_free": "yes",
        "editorial_rating": 8.6,
        "short_description": "Magnesium citrate — one of the best-absorbed forms. 200mg elemental magnesium per 3-tablet serving. 60 tablets. Solgar's trusted quality.",
        "pros": [
            "Citrate is among the most bioavailable forms of magnesium",
            "Solgar's consistent quality standards",
            "Free from major allergens",
        ],
        "cons": [
            "3 tablets per serving — quite a lot to remember",
            "Pricier than budget alternatives, though quality justifies it",
        ],
        "affiliate_links": [
            {"retailer": "Holland & Barrett", "url": "https://www.hollandandbarrett.com/shop/product/solgar-magnesium-citrate-tablets-60-tablets-60003268", "price": 17.99},
        ],
    },
    {
        "name": "Omega-3 Triple Strength 950mg EPA+DHA",
        "slug": "solgar-omega-3-triple-strength-950mg",
        "brand": "Solgar",
        "category": "omega",
        "format": "softgel",
        "dose_per_serving": "950mg EPA+DHA",
        "servings_per_container": 50,
        "price": 26.99,
        "vegan": "no",
        "vegetarian": "no",
        "gluten_free": "yes",
        "editorial_rating": 9.0,
        "short_description": "Triple-strength omega-3 providing 950mg EPA+DHA per softgel. 50 softgels. Molecularly distilled for purity. Solgar's premium fish oil with no fishy aftertaste.",
        "pros": [
            "950mg EPA+DHA per softgel — you only need one per day",
            "Molecularly distilled — tested for mercury and PCBs",
            "No fishy aftertaste reported by most users",
            "The cleanest, most potent fish oil widely available in the UK",
        ],
        "cons": [
            "Not vegan or vegetarian",
            "One of the more expensive fish oil options",
            "50 softgels is only a 50-day supply",
        ],
        "affiliate_links": [
            {"retailer": "Holland & Barrett", "url": "https://www.hollandandbarrett.com/shop/product/solgar-omega-3-950mg-epa-dha-50-softgels-60019785", "price": 26.99},
        ],
    },
]


def nano_id():
    """Simple nanoid-style id for child rows."""
    return uuid.uuid4().hex[:20]


def main():
    conn = psycopg2.connect(DATABASE_URI)
    cur = conn.cursor()

    # ── Load existing brands & retailers ──────────────────────────────────────
    cur.execute("SELECT id, name FROM brands")
    for row in cur.fetchall():
        BRAND_IDS[row[1]] = row[0]

    cur.execute("SELECT id, name FROM retailers")
    for row in cur.fetchall():
        RETAILER_IDS[row[1]] = row[0]

    print(f"Existing brands: {list(BRAND_IDS.keys())}")
    print(f"Existing retailers: {list(RETAILER_IDS.keys())}")

    # ── Insert new brands ─────────────────────────────────────────────────────
    for b in NEW_BRANDS:
        if b["name"] in BRAND_IDS:
            print(f"Brand already exists: {b['name']}")
            continue
        cur.execute(
            """
            INSERT INTO brands (name, slug, website, description, manufacturing_location, updated_at, created_at)
            VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
            RETURNING id
            """,
            (b["name"], b["slug"], b["website"], b["description"], b["manufacturing_location"]),
        )
        bid = cur.fetchone()[0]
        BRAND_IDS[b["name"]] = bid
        print(f"Created brand: {b['name']} (id={bid})")

    # ── Insert Bulk as a retailer if not present ──────────────────────────────
    if "Bulk" not in RETAILER_IDS:
        cur.execute(
            "INSERT INTO retailers (name, base_url, updated_at, created_at) VALUES (%s, %s, NOW(), NOW()) RETURNING id",
            ("Bulk", "https://www.bulk.com"),
        )
        rid = cur.fetchone()[0]
        RETAILER_IDS["Bulk"] = rid
        print(f"Created retailer: Bulk (id={rid})")

    conn.commit()

    # ── Insert products ───────────────────────────────────────────────────────
    for p in PRODUCTS:
        # Skip if slug already exists
        cur.execute("SELECT id FROM products WHERE slug = %s", (p["slug"],))
        existing = cur.fetchone()
        if existing:
            print(f"Product already exists: {p['name']} — skipping")
            continue

        brand_id = BRAND_IDS.get(p["brand"])
        if not brand_id:
            print(f"ERROR: Brand not found: {p['brand']}")
            continue

        cur.execute(
            """
            INSERT INTO products (
                name, slug, brand_id, category, format,
                dose_per_serving, servings_per_container,
                price, vegan, vegetarian, gluten_free,
                editorial_rating, short_description,
                status, updated_at, created_at
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'live',NOW(),NOW())
            RETURNING id
            """,
            (
                p["name"], p["slug"], brand_id, p["category"], p["format"],
                p.get("dose_per_serving"), p.get("servings_per_container"),
                p["price"], p.get("vegan"), p.get("vegetarian"), p.get("gluten_free"),
                p.get("editorial_rating"), p.get("short_description"),
            ),
        )
        product_id = cur.fetchone()[0]
        print(f"Created product: {p['name']} (id={product_id})")

        # Insert pros
        for i, pro_text in enumerate(p.get("pros", []), start=1):
            cur.execute(
                "INSERT INTO products_pros (_order, _parent_id, id, pro) VALUES (%s,%s,%s,%s)",
                (i, product_id, nano_id(), pro_text),
            )

        # Insert cons
        for i, con_text in enumerate(p.get("cons", []), start=1):
            cur.execute(
                "INSERT INTO products_cons (_order, _parent_id, id, con) VALUES (%s,%s,%s,%s)",
                (i, product_id, nano_id(), con_text),
            )

        # Insert affiliate links
        for link in p.get("affiliate_links", []):
            retailer_id = RETAILER_IDS.get(link["retailer"])
            if not retailer_id:
                print(f"  WARNING: Retailer not found: {link['retailer']}")
                continue
            cur.execute(
                """
                INSERT INTO affiliate_links (product_id, retailer_id, url, price, active, updated_at, created_at)
                VALUES (%s,%s,%s,%s,true,NOW(),NOW())
                """,
                (product_id, retailer_id, link["url"], link.get("price")),
            )
            print(f"  → Affiliate link via {link['retailer']}: {link['url']}")

        conn.commit()

    cur.close()
    conn.close()
    print("\nDone.")


if __name__ == "__main__":
    main()
