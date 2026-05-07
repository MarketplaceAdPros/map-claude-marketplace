---
description: Run a live FBA inventory health check for an Amazon Selling Partner account and render the results as an interactive dashboard artifact. Trigger this skill whenever the user asks about FBA inventory, days of supply, stockout risk, "what's running low", "what should I reorder", inventory dashboards, or anything related to checking how their Amazon stock is holding up — even if they don't explicitly say "dashboard". Also trigger when the user wants to refresh a previously-built inventory view, or asks Claude to "run the inventory check again". Uses the Marketplace Ad Pros MCP tools (Selling Partner integrations + ask_selling_partner_report_analyst) to query live data and produces a sortable, filterable React artifact.
---

# FBA Inventory Risk Dashboard

This skill takes the user from "how's my inventory?" to a live, interactive dashboard showing every SKU at risk of stockout, with sortable columns and urgency tiers.

## Workflow

Follow these steps in order. Don't skip the discovery steps — the analyst tool errors when account scoping is wrong.

### 1. Identify the account

Call `list_selling_partner_integrations` to get the user's SP integrations.

If exactly one integration is returned, proceed. If multiple, ask the user which one.

Then call `list_selling_partner_accounts` with the integration_id to get marketplace accounts. Each account is one marketplace (US, MX, BR, UK, DE, etc.).

**If multiple marketplaces exist, ask the user which one** — inventory is per-marketplace and you cannot meaningfully combine them. Use a tappable-options prompt with one option per marketplace plus "All" if relevant. Default suggestion: US (typically the largest).

Save the chosen `account_id` (the UUID, NOT the marketplace_id like `ATVPDKIKX0DER`).

### 2. Run the at-risk query

Call `ask_selling_partner_report_analyst` with the account_id and this exact question framing:

> FBA at-risk inventory: top 50 SKUs where current fulfillable quantity is greater than 0 AND days of supply is less than 14. Use trailing 30-day average daily units sold as the run rate. For each SKU return: seller SKU, ASIN, current fulfillable quantity, avg daily units sold (last 30 days), and days of supply (fulfillable / avg daily). Exclude SKUs with zero stock and SKUs with zero sales over the last 30 days. Sort ascending by days of supply (most urgent first).

**Why this exact framing matters:** the analyst has been observed to error on overly long or comma-heavy questions. Keep the structure: filter description → run rate definition → columns → exclusions → sort. The phrase "Inventory health check" or "FBA at-risk inventory" at the start helps it route correctly.

If the call errors (`Error occurred during tool execution`), retry once with even simpler phrasing:
> Top 50 FBA SKUs at risk of stockout in the next 14 days. For each, show seller SKU, ASIN, current fulfillable quantity, average daily units sold over the last 30 days, and days of supply. Sort by days of supply ascending. Exclude SKUs with zero sales and zero stock.

If it errors a second time, fall back to a sanity-check query first ("How many FBA SKUs do I have with inventory data?") before retrying — this confirms the analyst is responsive and helps surface the real problem.

### 3. Triage and headline finding

Before rendering the artifact, scan the data and prepare a brief headline. Look for:

- **All rows have fulfillable = 0?** Flag this — it means everything returned is already stocked out, not "approaching stockout". Recommend rerunning with `current fulfillable quantity > 0` filter (see variant query below).
- **Highest-velocity SKU with low DOS** — name it specifically. A SKU selling 30/day with 4 days of supply is usually the biggest fire and worth calling out by name.
- **Count of SKUs under 2 days of supply** ("critical" tier) — these will stockout within 48 hours.

Lead the response with this triage in 2–3 sentences before the artifact. The dashboard is interactive, but the headline is what the user actually needs to act on.

### 4. Render the dashboard artifact

Use the template at `assets/dashboard-template.jsx` as the starting point. Save the populated artifact to `/mnt/user-data/outputs/fba-inventory-risk.jsx` and present it with `present_files`.

To populate:

1. Read `assets/dashboard-template.jsx`.
2. Replace the `RAW` array with the actual data rows from the analyst response. Each row needs: `sku`, `asin`, `fulfillable`, `daily`, `dos`. Use the raw numbers from the `data` field of the analyst response (not the rounded display values from the answer text — those are formatted for humans and may have lost precision).
3. Replace the masthead values: brand name (from the account's `brand` field or `account_name`), marketplace (from `country_code`), snapshot timestamp (from `report_freshness.sp_fba_inventory.data_complete_through`), and date window (the trailing-30-day window — compute or extract from analyst response).
4. Do not modify the styling, palette, fonts, or layout — those are part of the skill's design language. The aesthetic is editorial-financial: warm cream background, Instrument Serif display, Geist Mono for data, oxblood/amber/olive urgency tiers. Generic-looking tables defeat the purpose of building this as a skill.

### 5. Offer next steps

After presenting the artifact, offer 1–2 follow-ups based on what the data shows. Don't list every option — pick what's actually useful given the result:

- **If many SKUs are critical:** offer to pull inbound pipeline (`afn-inbound-*` quantities) so the user can see what's already on the way before reordering.
- **If the data looks healthy (few/no rows):** offer the inverse — overstocked SKUs (>90 days of supply) for storage-fee analysis.
- **For reorder planning:** offer to compute reorder quantities, but note you'll need the user's lead time (PO to FBA check-in, in days) and optionally a service level / safety stock target.

Do not offer all of these at once. Pick the most useful one or two.

## Variant queries

If the user asks for a different cut, adapt the question while keeping the structure tight:

**Already-stocked-out (lost sales right now):** Drop the `fulfillable > 0` filter; sort by `daily` desc instead of `dos` asc since DOS will all be 0.

**Including inbound (more accurate "available" picture):**
> FBA inventory at risk including inbound: SKUs where (fulfillable + inbound shipped + inbound receiving) divided by 30-day average daily units is less than 14. Return seller SKU, ASIN, fulfillable, total inbound, avg daily units (30d), and effective days of supply. Exclude SKUs with zero 30-day sales. Sort ascending by effective DOS. Top 50.

**Different time window (e.g., seasonal):** Replace "trailing 30-day" with "trailing 7-day" for hot-velocity products or "trailing 90-day" for stable lines. Be explicit about the window so the analyst doesn't pick its own.

## Caveats to always surface

The data has known limitations the user should be reminded of:

- Snapshot is typically 3–4 hours stale (Amazon SP-API report cadence).
- Fulfillable quantity is FBA only. MFN inventory is not included — use `get_selling_partner_listings` if needed.
- Default query excludes inbound shipments and reserved units. Run the inbound variant if recovery timing matters.
- "Average daily units" is the 30-day mean. For SKUs with spiky demand (Prime Day items, gifting categories near holidays) this understates real near-term risk.

Mention these in the artifact footer (the template already has them) and in the response narrative when relevant.

## Common pitfalls

**Wrong account_id type.** The analyst expects the UUID from `list_selling_partner_accounts`, not the Amazon `marketplace_id` (like `ATVPDKIKX0DER`). If the analyst returns an empty or scope-mismatched result, double-check this.

**Skipping marketplace selection.** If the user has US + MX + BR and you don't ask, you'll silently run against whichever marketplace happens to be first in the list. Always confirm.

**Dumping raw analyst output as the artifact.** The analyst returns formatted-for-humans text. Use the `data` field (structured rows) to populate the template, not the answer-text table.

**Skipping the headline.** A 33-row interactive dashboard is great, but if you don't lead with "SS-SPF-50ML is the biggest fire — 30 units/day, 3.83 days of supply", the user has to do the triage themselves. The skill's value is doing both.
