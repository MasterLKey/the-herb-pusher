#!/usr/bin/env python3
"""
Seed: Best Focus Supplements UK (2026) — comparison / goal guide.
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


SLUG = "best-focus-supplements-uk"

CONTENT = rich_text(
    [
        heading("h2", "What does “focus” actually mean?"),
        para(
            txt(
                "Focus is sustained attention under distraction — not a mystical brain upgrade. "
                "Most people who say they want better focus actually want one of three things: sharper "
                "alertness for a few hours, better resistance to stress-related mental fog, or "
                "long-term cognitive support. Those are different problems. Different supplements "
                "help (or don’t) depending on which one you mean."
            )
        ),
        para(
            txt(
                "This guide ranks the options we stock against published evidence — not TikTok "
                "trends — and points to products that match the claim on the label."
            )
        ),
        heading("h2", "The short answer"),
        ul(
            [
                "Best for acute focus today: L-theanine with caffeine (or theanine alone if you already drink coffee).",
                "Best budget evidence play: creatine monohydrate — strong for muscle, early but real signals for cognition.",
                "Best long-game brain fats: a high-EPA+DHA omega-3, if your diet is low in oily fish.",
                "Worth watching, not worshipping: lion’s mane — early human evidence, lots of marketing.",
                "Skip for “focus” unless deficient: random nootropics stacks with proprietary blends and mystery doses.",
            ]
        ),
        heading("h2", "How we rated these"),
        para(
            txt(
                "We weight human clinical evidence over animal studies, dose transparency over "
                "brand storytelling, and form quality (e.g. elemental amounts, EPA+DHA totals) "
                "over “clinically studied” badges with no citation. Affiliate links never change "
                "the rating."
            )
        ),
        heading("h2", "L-theanine and caffeine — the most practical focus stack"),
        para(
            txt(
                "L-theanine is an amino acid from tea. Combined with caffeine, trials suggest it "
                "can smooth the jittery edge of caffeine while supporting attention and alertness. "
                "If you already drink coffee or tea, standalone L-theanine (around 100–200 mg) is "
                "often enough. If you want a measured stack without another espresso, a combined "
                "capsule keeps the ratio consistent."
            )
        ),
        para(
            txt(
                "This is the clearest “I need to concentrate for the next few hours” option on our "
                "list — not a disease treatment, not a miracle, just a well-studied pairing."
            )
        ),
        heading("h2", "Creatine — not just for the gym"),
        para(
            txt(
                "Creatine monohydrate has strong evidence for strength and power. Cognitive "
                "research is thinner but promising, especially in situations of mental fatigue, "
                "sleep loss, or vegetarian diets where dietary creatine is low. Doses used in "
                "research are typically 3–5 g daily of monohydrate — not fancy “buffered” forms."
            )
        ),
        para(
            txt(
                "If you already take creatine for training, you may already be covering this base. "
                "If you don’t train, it’s still one of the cheapest, best-studied compounds with "
                "a plausible cognitive upside."
            )
        ),
        heading("h2", "Omega-3 (EPA + DHA) — brain fats, not a stimulant"),
        para(
            txt(
                "DHA is a structural fat in the brain. Evidence for omega-3 and cognition is "
                "moderate overall and strongest when intake is low. This won’t feel like coffee. "
                "It matters more as a dietary gap-filler than as a same-day focus pill. Look for "
                "products that list EPA and DHA in milligrams — not just “1000 mg fish oil,” which "
                "can hide a weak active dose."
            )
        ),
        heading("h2", "Lion’s mane — interesting, early evidence"),
        para(
            txt(
                "Lion’s mane mushroom is marketed hard for nerve growth and memory. Human trials "
                "exist but are small, short, or mixed. We rate the ingredient as early evidence: "
                "worth knowing about, not worth building your whole stack around. If you try it, "
                "pick a product that states the extract amount clearly and give it weeks — not one "
                "afternoon — before judging."
            )
        ),
        heading("h2", "Ashwagandha — focus via stress, not stimulation"),
        para(
            txt(
                "Ashwagandha’s better evidence is for stress and sleep quality, not laser "
                "attention. If your “focus problem” is anxiety or wired exhaustion, a standardised "
                "extract like KSM-66 may help indirectly. If you just need a Tuesday afternoon "
                "boost, theanine + caffeine is the more direct tool."
            )
        ),
        heading("h2", "Vitamin B12 — only a focus fix if you’re low"),
        para(
            txt(
                "B12 deficiency can cause fatigue, brain fog and neurological symptoms. Vegans, "
                "older adults and people on certain medications are higher risk. If your levels "
                "are fine, mega-dosing B12 won’t unlock genius mode. If you’re at risk, get "
                "tested or supplement preventively — our B12 guide covers the vegan case in depth."
            )
        ),
        heading("h2", "Comparison at a glance"),
        ul(
            [
                "L-theanine ± caffeine — best for same-day attention; evidence moderate–good for the combo.",
                "Creatine monohydrate — best value; strong athletic evidence, early cognitive signals.",
                "Omega-3 (high EPA+DHA) — best dietary gap-filler; moderate cognitive evidence.",
                "Lion’s mane — speculative; early evidence only.",
                "Ashwagandha — best when stress is the bottleneck; moderate evidence for stress.",
                "Vitamin B12 — corrective if deficient; strong evidence for deficiency states.",
            ]
        ),
        heading("h2", "Our picks from the catalogue"),
        ul(
            [
                "Acute focus: Myvitamins L-Theanine & Caffeine, or Bulk L-Theanine 200 mg if you already have caffeine.",
                "Daily foundation: Bulk Creatine Monohydrate 1 kg (plain monohydrate, no fluff).",
                "Diet gap: Solgar Omega-3 Triple Strength 950 mg EPA+DHA — check the active EPA+DHA total.",
                "Curious but cautious: NOW Foods Lion’s Mane capsules — labelled extract, early evidence.",
                "Stress-linked fog: Myvitamins Ashwagandha KSM-66.",
                "Vegan / at-risk: Simply Supplements Vitamin B12 1000 mcg.",
            ]
        ),
        heading("h2", "What we would skip for “focus”"),
        ul(
            [
                "Proprietary “nootropic blends” that hide milligram amounts.",
                "Huge stacks of ten ingredients when you haven’t tried theanine + caffeine or sleep hygiene.",
                "Anything promising exam miracles or IQ gains — that’s marketing, not medicine.",
            ]
        ),
        heading("h2", "What is the best supplement for focus in the UK?"),
        para(
            txt(
                "For most people who want better concentration in the next few hours, L-theanine "
                "with caffeine is the most practical, evidence-aligned option. Creatine and "
                "omega-3 support different goals (training/diet) and shouldn’t be confused with "
                "stimulant-like focus. Fix sleep and caffeine timing before buying a drawer full "
                "of capsules."
            )
        ),
        heading("h2", "Do focus supplements work without caffeine?"),
        para(
            txt(
                "Some do, differently. Creatine and omega-3 are not stimulants. L-theanine alone "
                "is subtler than the caffeine combo. Lion’s mane is unproven for acute focus. If "
                "you avoid caffeine entirely, start with sleep, then consider creatine or omega-3 "
                "based on diet — not a mystery blend."
            )
        ),
        heading("h2", "How long before you notice anything?"),
        para(
            txt(
                "Theanine with caffeine: same day. Creatine: days to weeks of daily use. Omega-3: "
                "weeks to months as a dietary correction. Lion’s mane: if anything, weeks — and "
                "many people notice nothing. Stop anything that causes side effects and speak to "
                "a clinician if you have a medical condition or take medication."
            )
        ),
        para(
            txt(
                "This article is general information, not medical advice. Always check with a "
                "qualified healthcare professional before starting supplements."
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
    title = "Best Focus Supplements UK (2026): What Actually Helps Concentration"
    excerpt = (
        "Honest comparison of L-theanine, caffeine stacks, creatine, omega-3, lion’s mane and more — "
        "ranked by evidence, not hype."
    )
    seo_title = "Best Focus Supplements UK (2026) | The Herb Pusher"
    seo_desc = (
        "Compare L-theanine with caffeine, creatine, omega-3, lion’s mane and ashwagandha for focus. "
        "Evidence ratings and UK product picks."
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

    # featured ingredients: lions-mane 8, omega-3 5, creatine 4, ashwagandha 3, vitamin-b12 7
    ingredient_ids = [8, 5, 4, 3, 7]
    # featured products: L-theanine+caffeine 15, L-theanine 21, creatine 1kg 20,
    # omega triple 25, lions mane 10, ashwagandha 4, b12 3
    product_ids = [15, 21, 20, 25, 10, 4, 3]
    goal_ids = [3]  # focus

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
    print(f"Linked {len(ingredient_ids)} ingredients, {len(product_ids)} products, {len(goal_ids)} goals")
    print(f"Live at: https://theherbpusher.com/guides/{SLUG}")


if __name__ == "__main__":
    main()
