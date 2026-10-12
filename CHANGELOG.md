# Changelog

## 2.0.0

**Breaking: the plugin is renamed from `amazon` to `marketplace-ad-pros`.** Skills are now invoked as
`/marketplace-ad-pros:<skill>` instead of `/amazon:<skill>`. Reinstall with
`/plugin install marketplace-ad-pros@map-claude-marketplace` and uninstall `amazon`.

- Prepared for Anthropic's plugin directory: `displayName`, icon, and support/privacy/terms links in
  `plugin.json`; MCP server type `http`; README rewritten as the listing page with a data and privacy
  section; LICENSE inside the plugin folder
- Nine new skills: `amazon-dsp`, `amazon-holiday-events`, `amazon-listing-audit`,
  `amazon-product-launch`, `amazon-reorder-planning`, `amazon-title-optimizer`, `experiments`,
  `search-term-harvest-dashboard`, `wasted-ad-spend-dashboard`
- `amazon-ads-optimization`: Prime Day budget guidance updated with 2026 results (budget headroom, not spend targets)
- `fba-inventory-risk-dashboard`: unshipped FBA shipment plans no longer count as supply
- Dashboard skills: no external font loading; fall back to a table where artifacts aren't available

## 1.1.1

### Amazon Plugin
- **fba-inventory-risk-dashboard**: Add the missing `assets/dashboard-template.jsx` referenced by the skill (editorial-financial React template with sortable table, urgency tiers, and run-rate sparkbars)

## 1.1.0

### Amazon Plugin
- **fba-inventory-risk-dashboard**: New skill that runs a live FBA inventory health check via the Selling Partner MCP tools and renders results as an interactive, sortable dashboard artifact with urgency tiers, headline triage, and follow-up suggestions (inbound pipeline, overstock, reorder planning)

## 1.0.0

### Amazon Plugin
- **amazon-ads**: Browse campaigns, analyze performance, get bid/budget/keyword recommendations via MCP
- **amazon-ads-optimization**: Five-pillar campaign framework, bid-to-value strategy, negative keyword management, seasonal playbook, native optimization rules
- **amazon-seller-central**: Seller Central insights (inventory, fees, sales, search) and Vendor Central insights (vendor sales, inventory, traffic, forecasting, net PPM)
- Auto-configures MCP server connection via `.mcp.json`
