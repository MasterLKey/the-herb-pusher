#!/usr/bin/env python3
"""
Seed: Best Immunity Supplements UK (2026) — comparison / goal guide.
Idempotent: skips if slug already exists.
"""
import json
import subprocess
from datetime import datetime, timezone

import psycopg2


def load_env():
    env = {}
    with open("/etc/herb-pusher-secrets.env") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k] = v
    return env


def db_uri(env):
    db_ip = subprocess.check_output(
        [
            "docker",
            "inspect",
            "-f",
            "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}",
            "the_herb_pusher-db-1",
        ],
        text=True,
    ).strip()
    return (
        f"postgresql://{env['POSTGRES_USER']}:{env['POSTGRES_PASSWORD']}"
        f"@{db_ip}:5432/{env['POSTGRES_DB']}"
    )


def txt(text, format_=0):
    return {
        "detail": 0,
        "format": format_,
        "mode": "normal",
        "style": "",
        "text": text,
        "type": "text",
        "version": 1,
    }


def para(*children):
    return {
        "children": list(children),
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "paragraph",
        "version": 1,
        "textFormat": 0,
    }


def heading(tag, text):
    return {
        "children": [txt(text)],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "tag": tag,
        "type": "heading",
        "version": 1,
    }


def ul(items):
    return {
        "children": [
            {
                "children": [para(txt(item))],
                "direction": "ltr",
                "format": "",
                "indent": 0,
                "type": "listitem",
                "version": 1,
                "value": 1,
            }
            for item in items
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "listType": "bullet",
        "start": 1,
        "tag": "ul",
        "type": "list",
        "version": 1,
    }


def rich_text(nodes):
    return {
        "root": {
            "children": nodes,
            "direction": "ltr",
            "format": "",
            "indent": 0,
            "type": "root",
            "version": 1,
        }
    }


SLUG = "best-immunity-supplements-uk"

CONTENT = rich_text(
    [
        heading("h2", "What “immunity supplements” can and cannot do"),
        para(
            txt(
                "No capsule turns your immune system into a force field. What supplements can do "
                "is correct common nutrient gaps, support barrier function, and — in a few "
                "well-studied cases — modestly affect how often or how hard you get knocked "
                "sideways by everyday respiratory bugs. They do not replace sleep, vaccination, "
                "hand hygiene or medical care."
            )
        ),
        para(
            txt(
                "This guide ranks the options in our catalogue against human evidence, not "
                "winter-wellness marketing. Affiliate links never change the rating."
            )
        ),
        heading("h2", "The short answer"),
        ul(
            [
                "Highest priority if you’re low: Vitamin D — strong evidence for deficiency; immune effects are clearest when status is poor.",
                "Everyday support with solid evidence: Vitamin C and zinc — useful in specific contexts, not magic mega-doses.",
                "Gut–immune axis: a strain-labelled probiotic if you have a clear reason (antibiotics, traveller’s gut) — not a vague “immunity blend.”",
                "Secondary minerals: selenium if diet is low (UK soil is often selenium-poor) — don’t megadose.",
                "Interesting but early: turmeric/curcumin and NAC — plausible mechanisms, thinner outcome data for “not getting colds.”",
                "Skip: anything promising you will “never get sick” or stacking ten proprietary herbs with no milligram amounts.",
            ]
        ),
        heading("h2", "How we rated these"),
        para(
            txt(
                "We favour human trials and systematic reviews over Instagram anecdotes, clear "
                "elemental doses over “immune complex” mystery powders, and correcting "
                "deficiency over stacking stimulants. Sponsored placements are labelled "
                "separately; editorial ratings are not for sale."
            )
        ),
        heading("h2", "Vitamin D — fix the gap first"),
        para(
            txt(
                "Vitamin D status is often low in the UK, especially in winter and in people "
                "with limited sun exposure. Evidence that D supports bone health is strong; "
                "immune outcomes are more nuanced, but correcting deficiency is one of the "
                "highest-value moves on this list. Typical supplement doses for adults often "
                "sit around 1000–2000 IU daily unless a clinician advises otherwise — more is "
                "not automatically better."
            )
        ),
        para(
            txt(
                "If you already take a decent D3, don’t add three more “immune” products on "
                "top hoping for multiplicative magic. Get the basics right first."
            )
        ),
        heading("h2", "Vitamin C — useful, often overhyped"),
        para(
            txt(
                "Vitamin C has strong evidence as an essential nutrient. For colds, research "
                "suggests regular supplementation may slightly shorten duration in some "
                "people; megadoses at the first sniffle are less impressive than marketing "
                "implies. 200–1000 mg from a simple ascorbic acid or well-tolerated form is "
                "plenty for most adults who want coverage — your kidneys clear the excess."
            )
        ),
        heading("h2", "Zinc — don’t wait until day five of a cold"),
        para(
            txt(
                "Zinc is essential for immune cell function. Lozenges started early in a cold "
                "have some supportive evidence for duration; daily high-dose zinc for months "
                "is a different (and riskier) strategy — copper imbalance and nausea are real. "
                "For a daily multi-nutrient approach, modest elemental zinc (around 15 mg from "
                "a well-absorbed form like picolinate) is a sensible ceiling unless advised "
                "otherwise."
            )
        ),
        heading("h2", "Probiotics — strain matters more than “billions”"),
        para(
            txt(
                "The gut and immune system talk to each other constantly. Probiotic evidence is "
                "strain-specific and outcome-specific — “10 billion CFU” on the label means "
                "little without knowing which strains and why you’re taking them. Antibiotics, "
                "travel, or a clinician-guided plan are clearer use-cases than vague winter "
                "stacking. Look for named strains and storage instructions, not just a big number."
            )
        ),
        heading("h2", "Selenium — a UK-relevant mineral, easy to overdo"),
        para(
            txt(
                "Selenium supports antioxidant enzymes involved in immune defence. UK diets can "
                "run low because of soil levels. Supplementation around 50–200 mcg can make "
                "sense for some people; chronically high intakes are harmful. Treat selenium "
                "as a precise mineral, not a “more is safer” wellness sprinkle."
            )
        ),
        heading("h2", "Turmeric / curcumin — anti-inflammatory interest, early for “immunity”"),
        para(
            txt(
                "Curcumin has mechanistic and early clinical interest for inflammation. That is "
                "not the same as proven cold-and-flu prevention. Bioavailability is the usual "
                "bottleneck — products paired with piperine (BioPerine) or other enhanced forms "
                "are more honest about that problem. Buy it for joint or inflammatory goals if "
                "the evidence fits your case; don’t expect it to replace vitamin D."
            )
        ),
        heading("h2", "NAC — antioxidant precursor, not a winter charm"),
        para(
            txt(
                "N-acetylcysteine (NAC) is a precursor to glutathione and has clinical uses "
                "outside the supplement aisle. For general “boost my immunity” marketing, the "
                "evidence is thinner than the hype. If you use it, do it for a specific reason "
                "and check interactions with a clinician — especially if you take medication."
            )
        ),
        heading("h2", "Comparison at a glance"),
        ul(
            [
                "Vitamin D — best first fix if status is low; strong nutrient evidence.",
                "Vitamin C — solid essential nutrient; modest cold-duration effects for some.",
                "Zinc — useful early in colds (lozenge protocols) or modest daily intake; avoid chronic megadoses.",
                "Probiotics — conditional; strain-specific, not a generic shield.",
                "Selenium — sensible if diet is low; respect the upper limit.",
                "Turmeric / NAC — secondary / early for classic immune outcomes.",
            ]
        ),
        heading("h2", "Our picks from the catalogue"),
        ul(
            [
                "Foundation: Simply Supplements Vitamin D3 1000 IU, or Solgar Vitamin D3 2500 IU if you prefer a higher daily dose.",
                "Simple C: Myvitamins Vitamin C 1000 mg.",
                "Zinc: Holland & Barrett Zinc Picolinate 15 mg.",
                "Gut support: Holland & Barrett Probiotics 10 Billion — check strain list on the label.",
                "Selenium: Holland & Barrett Selenium 200 mcg — don’t stack multiple selenium sources blindly.",
                "Optional extras: Myvitamins Turmeric & Curcumin with BioPerine; NOW Foods NAC 600 mg.",
                "Coverage blanket: Bulk Complete Multivitamin Complex — useful if diet is inconsistent, not a substitute for fixing D status properly.",
            ]
        ),
        heading("h2", "What we would skip for “immunity”"),
        ul(
            [
                "Ten-herb “immune defence” blends with proprietary doses.",
                "Megadose vitamin C drips and social-media protocols with no lab context.",
                "Taking zinc, selenium, and a multi at full doses without adding up totals.",
                "Anything that tells you supplements replace medical advice when you’re properly ill.",
            ]
        ),
        heading("h2", "What is the best immune supplement in the UK?"),
        para(
            txt(
                "For most adults, the best “immune” move is correcting vitamin D if you’re low, "
                "then covering C and zinc without megadosing. Probiotics and selenium help in "
                "specific situations. There isn’t a single best bottle for everyone — deficiency "
                "status and diet beat brand loyalty."
            )
        ),
        heading("h2", "Can supplements stop you getting colds?"),
        para(
            txt(
                "Usually no. Some (notably vitamin C in certain settings, and zinc lozenges "
                "started early) may modestly affect duration or severity for some people. "
                "Sleep, stress, and exposure still dominate. Treat supplements as support, not "
                "armour."
            )
        ),
        heading("h2", "Should I take an immunity stack all winter?"),
        para(
            txt(
                "A small, boring stack beats a crowded one: vitamin D through darker months, "
                "maybe C and zinc at sensible doses, plus food-first habits. Add probiotics or "
                "selenium only with a reason. Review the stack in spring — winter isn’t a licence "
                "for permanent megadoses."
            )
        ),
        para(
            txt(
                "This article is general information, not medical advice. Always check with a "
                "qualified healthcare professional before starting supplements, especially if "
                "you are pregnant, immunocompromised, or on medication."
            )
        ),
    ]
)


def main():
    env = load_env()
    conn = psycopg2.connect(db_uri(env))
    cur = conn.cursor()

    cur.execute("SELECT id FROM articles WHERE slug = %s", (SLUG,))
    existing = cur.fetchone()
    if existing:
        print(f"Already exists id={existing[0]} slug={SLUG} — skipping insert")
        cur.close()
        conn.close()
        return

    now = datetime.now(timezone.utc)
    title = "Best Immunity Supplements UK (2026): What Actually Helps"
    excerpt = (
        "Vitamin D, C, zinc, probiotics, selenium and more — ranked by evidence for real immune "
        "support, not winter marketing."
    )
    seo_title = "Best Immunity Supplements UK (2026) | The Herb Pusher"
    seo_desc = (
        "Compare vitamin D, vitamin C, zinc, probiotics, selenium, turmeric and NAC for immune "
        "support. Evidence ratings and UK product picks."
    )

    cur.execute(
        """
        INSERT INTO articles (
          title, slug, type, excerpt, content, author, reviewed_by, sponsored,
          status, published_at, last_reviewed, seo_title, seo_description,
          updated_at, created_at, _status
        ) VALUES (
          %s, %s, %s, %s, %s::jsonb, %s, %s, false,
          'published', %s, %s, %s, %s,
          %s, %s, 'published'
        )
        RETURNING id
        """,
        (
            title,
            SLUG,
            "comparison",
            excerpt,
            json.dumps(CONTENT),
            "The Herb Pusher Editorial",
            None,
            now,
            now,
            seo_title,
            seo_desc,
            now,
            now,
        ),
    )
    article_id = cur.fetchone()[0]
    print(f"Created article id={article_id}")

    # vitamin-c 11, vitamin-d 2, zinc 6, probiotics 10, turmeric 9
    ingredient_ids = [11, 2, 6, 10, 9]
    # vit C 6, D3 1000 2, D3 2500 23, zinc 8, probiotics 7, selenium 17, turmeric 13, NAC 18
    product_ids = [6, 2, 23, 8, 7, 17, 13, 18]
    goal_ids = [4]  # immune

    order = 1
    for iid in ingredient_ids:
        cur.execute(
            """
            INSERT INTO articles_rels (parent_id, path, ingredients_id, "order")
            VALUES (%s, 'featuredIngredients', %s, %s)
            """,
            (article_id, iid, order),
        )
        order += 1
    for pid in product_ids:
        cur.execute(
            """
            INSERT INTO articles_rels (parent_id, path, products_id, "order")
            VALUES (%s, 'featuredProducts', %s, %s)
            """,
            (article_id, pid, order),
        )
        order += 1
    for gid in goal_ids:
        cur.execute(
            """
            INSERT INTO articles_rels (parent_id, path, wellness_goals_id, "order")
            VALUES (%s, 'relatedGoals', %s, %s)
            """,
            (article_id, gid, order),
        )
        order += 1

    conn.commit()
    cur.close()
    conn.close()
    print(
        f"Linked {len(ingredient_ids)} ingredients, {len(product_ids)} products, {len(goal_ids)} goals"
    )
    print(f"Live at: https://theherbpusher.com/guides/{SLUG}")


if __name__ == "__main__":
    main()
