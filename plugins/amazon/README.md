# Marketplace Ad Pros for Amazon

Marketplace Ad Pros is an Amazon advertising analytics and optimization platform. This plugin connects Claude to your Amazon Advertising, Seller Central and Vendor Central data through the Marketplace Ad Pros MCP server. You can ask about performance in plain English and act on the answers.

Ask "what's my ACoS this month?", "which search terms are wasting spend?" or "what's about to stock out?" and get answers computed from your own campaign, keyword, search-term, sales and inventory data. The plugin also includes playbooks for optimization, product launches, sales events like Prime Day, listing audits and reorder planning.

## What you need

- A [Marketplace Ad Pros](https://marketplaceadpros.com/?ref=claude-plugin-directory) account with an Amazon Advertising and/or Amazon Selling Partner (Seller Central or Vendor Central) account connected. Connecting your accounts is free; using the tools needs a paid plan. A $20 two-week trial gives full access. See [plans](https://marketplaceadpros.com/plans/?ref=claude-plugin-directory).
- The first time Claude uses a Marketplace Ad Pros tool, you sign in to Marketplace Ad Pros and approve access. The connection uses OAuth, so you never paste API keys or passwords into Claude.

Some skills use features that depend on your plan or on optional integrations, such as Selling Partner data, Amazon DSP, AMC, experiments or Jungle Scout. When a tool isn't available on your account, the skill says so and works with what you have.

## Install

In Claude, add **Marketplace Ad Pros for Amazon** from the plugin directory. In Claude Code you can also install it from our marketplace:

```
/plugin install marketplace-ad-pros --marketplace MarketplaceAdPros/map-claude-marketplace
```

## Skills

| Skill | What it does |
|-------|--------------|
| `amazon-ads` | Browse campaigns, ad groups, keywords and targets; ask the report analyst about spend, sales, ACoS and ROAS; get bid, budget and keyword recommendations |
| `amazon-ads-optimization` | Optimization playbook: five-pillar campaign framework, bid-to-value, negative keywords, seasonal prep |
| `amazon-dsp` | Analyze and manage Amazon DSP display, video and audio campaigns |
| `amazon-holiday-events` | Plan and run Prime Day, Prime Big Deal Days, Black Friday / Cyber Monday and holiday campaigns |
| `amazon-listing-audit` | Audit Seller Central and Vendor Central listings for quality, compliance and security issues |
| `amazon-product-launch` | Research-first launch playbook: product neighborhood, listing, campaigns and day-one negatives |
| `amazon-reorder-planning` | Reorder plans, replenishment recommendations and PO drafts for FBA, AWD and Vendor Central |
| `amazon-seller-central` | Seller and Vendor Central insights: sales, traffic, inventory, fees, search query performance |
| `amazon-title-optimizer` | Rewrite product titles to fit Amazon's 75-character limit without losing the words that sell |
| `experiments` | Run Marketplace Ad Pros optimization experiments: review proposals, apply changes and log results |
| `fba-inventory-risk-dashboard` | Live FBA stockout-risk check, rendered as an interactive dashboard |
| `search-term-harvest-dashboard` | Find converting search terms to promote to exact match, rendered as an interactive dashboard |
| `wasted-ad-spend-dashboard` | Find search terms spending without sales, rendered as an interactive dashboard |

Claude picks the right skill from your question. In Claude Code you can also call one directly, e.g. `/marketplace-ad-pros:amazon-ads`. Where artifacts aren't available, the dashboard skills return the same analysis as a table.

## Try asking

- "List my brands and Amazon Ads profiles."
- "What was my ACoS by campaign over the last 14 days?"
- "Which search terms spent the most with no sales in the last 30 days?"
- "Which FBA SKUs are at risk of stocking out in the next two weeks?"
- "Audit my listings for quality and compliance issues."
- "Help me plan budgets for Prime Big Deal Days."

## Data and privacy

- **One network destination.** The plugin connects to a single MCP server, `https://app.marketplaceadpros.com/mcp`, operated by Marketplace Ad Pros. It installs no hooks, scripts or local servers. The three dashboard skills have Claude build an interactive artifact from a bundled template. The template loads no external resources and sends no data anywhere.
- **What the server accesses.** With your authorization, Marketplace Ad Pros reads your Amazon Advertising data (campaigns, keywords, targets, reports) and, if connected, Selling Partner data (sales, traffic, orders, inventory, listings) from Amazon's APIs. Tool results you ask for are returned to Claude in your conversation.
- **Changes to your account.** Some tools make live changes on Amazon, such as creating or updating campaigns, bids, budgets, negative keywords and listings. These tools are marked as write actions, and the skills tell Claude to show you each change and get your confirmation first.
- **How Marketplace Ad Pros handles your data.** See the [privacy policy](https://marketplaceadpros.com/privacy-policy/) and [terms](https://marketplaceadpros.com/terms-and-conditions/). You can disconnect integrations or revoke this plugin's access from your Marketplace Ad Pros account at any time.

## Support

Email support@marketplaceadpros.com or visit [marketplaceadpros.com/support](https://marketplaceadpros.com/support/).

## License

MIT. See [LICENSE](LICENSE).
