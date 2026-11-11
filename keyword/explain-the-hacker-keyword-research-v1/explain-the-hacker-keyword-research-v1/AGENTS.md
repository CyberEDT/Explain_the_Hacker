# AGENTS.md: SEO implementation rules for Explain The Hacker (ETH)

Dataset date: 2026-10-24. This folder is a qualitative keyword research dataset. It has **no search volume, difficulty, CPC or ranking data**. Treat it as evidence-backed planning input, not a guarantee of results.

## Read in this order

1. `manifest.json` (scope, limitations, scoring method)
2. `seo_implementation_map.json` (one brief per page)
3. `keywords.jsonl` (use `keyword_id` references from the map)
4. `keyword_clusters.json`, `content_opportunities.json`, `keyword_gaps.json`, `competitors.json`
5. `sources.json` (cite these; every claim needs one)

## Hard rules

- Never invent search volume, keyword difficulty, CPC, rankings, traffic or revenue numbers. All metrics in keywords.jsonl are null; keep them null until a named source and date exist.
- Never build or optimise a page around a keyword with priority research_required. Those are seed terms with no evidence.
- Priorities (P0/P1/P2) are a provisional internal score, not predictions. Do not claim a page will rank.
- Slugs, titles and meta descriptions in seo_implementation_map.json are proposals. Check the live site first; edit existing pages instead of creating duplicates.
- One page per intent. Near-duplicate wordings (for example checker vs analyzer) go on the same page.
- Do not copy competitor or MITRE text. Paraphrase and cite.
- Every factual claim in page copy needs a source from sources.json or a fact the owner confirmed. Mark anything unconfirmed with a TODO for the owner.
- Run schema validation (schemas/) and the checks in the implementation_checklist before reporting done.
- Fix crawlability first: the home page fetch returned only head meta tags. Confirm server-rendered text before adding pages.
- Do not target SOC-training head terms (letsdefend alternative, soc training simulator) until the owner confirms ETH offers that.
- Distinguish simulation from emulation; do not claim emulation capability.

## Workflow per page

1. Find the live URL for the brief's topic. If one exists, edit it. If not, create the proposed slug.
2. Confirm the page's text is present in the server-rendered HTML (view-source or fetch), not only injected by JavaScript.
3. Write the title, meta description, H1 and H2 outline from the brief. Adjust wording to match the real product.
4. Resolve every item in `owner_confirmations_needed` with the owner. Do not guess.
5. Add schema markup of the stated type with only true, visible information.
6. Add the internal links listed, with descriptive anchor text.
7. Add the page to the sitemap and check canonical, robots and status code 200.
8. Record what you did and what is still unverified.

## Definition of done

- Page text is crawlable without running JavaScript.
- Title is 60 characters or fewer; meta description is 160 or fewer.
- Exactly one H1; primary keyword appears naturally, not stuffed.
- No claim without a source or owner confirmation.
- No excluded or research_required keyword targeted.
- Search Console is connected so real impressions can replace the provisional priorities.

## When to stop and ask

- The brief conflicts with what the product really does.
- A claim cannot be sourced.
- You want to target a keyword not in keywords.jsonl or marked research_required.
- You are about to publish any number about volume, rank or traffic.
