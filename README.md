# @cherum/widget-react

One signature, many payouts. Your user signs once; Cherum routes the swap and
fans it out to any mix of the **26 supported chains** and their tokens — EVM,
TON, Solana, Bitcoin, Tron, XRP and more. Non-custodial: funds never sit in a
Cherum account, and the widget itself is a sandboxed iframe, so your page never
touches user keys.

You earn on every swap. Pass your wallet as `integrator` and your fee is
collected on-chain in the same transaction. No API key, no approval queue — the
wallet address is the whole registration.

## When to reach for it

- **Multisend / disperse** — pay a list of wallets in one signed transaction
  instead of N transfers, even when every recipient wants a different chain
  or token.
- **Batch payments & payouts** — contractor payouts, affiliate or revenue
  splits, refunds; import a CSV list in the full app flow.
- **Cross-chain swap + bridge in one step** — each leg routes through the
  best of 15+ bridges and DEX aggregators (Across, CCTP, deBridge, Mayan,
  Relay, 1inch, KyberSwap and more) with one quote and one signature.
- **Checkout** — lock the destination so customers pay in whatever they hold
  and you receive what you priced.

Failed legs refund automatically on-chain; no leg is ever held by Cherum.

## Install

```bash
npm install @cherum/widget-react
```

## Use

```tsx
import { CherumWidget } from '@cherum/widget-react';

export default function Pay() {
  return (
    <CherumWidget
      integrator="0xYourWalletAddress"
      integratorBps={20}
      theme="dark"
      accent="#8B6FE6"
      source={{ chain: 'arbitrum', token: 'USDC', amount: '1000' }}
      recipients={[
        { chain: 'base', token: 'USDC' },
        { chain: 'ton', token: 'USDT' },
      ]}
    />
  );
}
```

One recipient renders a plain swap; two or more switch to fan-out
automatically — no mode flag to manage. Leave `source`/`recipients` off and the
user picks everything themselves.

The component renders the hosted card (`app.cherum.io/embed`) in an iframe and
resizes it to fit via `postMessage`, so there is no fixed height to guess. The
same config maps 1:1 onto the script loader (`Cherum.mount({...})`) and the raw
iframe query string — moving between the three is mechanical.

## Props

| prop | type | meaning |
| --- | --- | --- |
| `integrator` | `string` | Your wallet (`0x…`). Attributes swaps to you and receives your fee. |
| `integratorBps` | `number` | Your EVM markup in bps (default `20` = 0.2%, cap `500`), paid on-chain in the same transaction. |
| `theme` | `'dark' \| 'light'` | Pin the card theme instead of following the host page. |
| `accent` | `string` | Brand accent as free HEX (`#RRGGBB` / `#RGB` / `#RRGGBBAA`). Hover and text shades are derived automatically. |
| `radius` | `number` | Corner radius in px (`0`–`40`, default `18`); applied to the card and the iframe. |
| `branding` | `boolean` | `false` hides the Cherum logo and footer. |
| `lockSource` | `boolean` | Lock the pre-set source chain/token (checkout-style flows). |
| `source` | `{ chain, token, amount? }` | Pre-select the source. |
| `recipients` | `{ chain, token }[]` | Pre-set fan-out destinations. |
| `maxWidth` | `number` | Iframe max width in px (default `460`). |

`chain` values are keys like `arbitrum`, `base`, `optimism`, `polygon`, `ton`,
`solana`; `token` values are symbols like `USDC`, `USDT`.

## Supported chains

EVM: Ethereum, Base, Arbitrum, Optimism, Polygon, BNB Chain, HyperEVM and
more. Non-EVM: Bitcoin, Solana, TON, Tron, XRP, Cardano, Aptos, Zcash,
Bitcoin Cash and others — 26 networks total, mixed freely inside one fan-out.

## Earnings & cabinet

Sign in at [partners.cherum.io](https://partners.cherum.io) with the same wallet
to see earnings, swaps and payouts. Full docs:
[docs.cherum.io](https://docs.cherum.io).

## License

MIT
