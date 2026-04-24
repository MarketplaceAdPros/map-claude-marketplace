# Marketplace Ad Pros — Claude Plugins

Official Claude plugins from [Marketplace Ad Pros](https://marketplaceadpros.com) for managing advertising and selling on Amazon.

## Plugins

| Plugin | Path | Description |
|--------|------|-------------|
| **Amazon** | `plugins/amazon/` | Amazon Ads management, optimization playbook, and Seller/Vendor Central insights |

## Install

### Claude Desktop

1. Open Claude Desktop and go to **Customize** (bottom-left).
2. Next to **Personal plugins**, click the **+** button.
3. Select **Create plugin** > **Add marketplace**.

![Add marketplace menu](img/add-marketplace-menu.png)

4. Enter `MarketplaceAdPros/map-claude-marketplace` as the URL and click **Sync**.

![Add marketplace modal](img/add-marketplace-modal.png)

5. The Amazon plugin and its skills will be available in your plugins list.

### Claude Code

```bash
claude plugin install amazon --url https://github.com/MarketplaceAdPros/map-claude-marketplace --path plugins/amazon
```

### Development / Testing

Load a plugin locally:

```bash
claude --plugin-dir ./plugins/amazon
```

## What's Included

Each plugin bundles:
- **Skills** — contextual guides Claude loads when relevant (campaign analysis, optimization strategy, inventory insights)
- **MCP server config** — auto-connects to the Marketplace Ad Pros API so tools are available immediately
- **No code to run** — plugins are documentation and configuration only; all logic runs server-side via MCP

## Prerequisites

A [Marketplace Ad Pros](https://marketplaceadpros.com) account with your Amazon Advertising and/or Selling Partner accounts connected. See the [integration guide](https://marketplaceadpros.com/integrations/) to get started.

## License

MIT
