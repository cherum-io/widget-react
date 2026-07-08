// @cherum/widget-react — Cherum fan-out swap widget for React.
// Renders the secure hosted widget (app.cherum.io/embed) in an iframe with
// automatic height. Config shape matches the script loader (cdn.cherum.io/widget.js)
// and the raw iframe parameters — migrating between the three is mechanical.
import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

const ORIGIN = 'https://app.cherum.io';

export interface CherumSource {
    /** Chain key, e.g. 'arbitrum' | 'base' | 'ethereum'. */
    chain: string;
    /** Token symbol, e.g. 'USDC'. */
    token: string;
    /** Pre-filled amount (human units). */
    amount?: string | number;
}

export interface CherumRecipient {
    /** Destination chain key, e.g. 'base' | 'ton' | 'solana'. */
    chain: string;
    /** Destination token symbol, e.g. 'USDC' | 'USDT'. */
    token: string;
}

export interface CherumWidgetProps {
    /** Your wallet address (0x…). Attributes swaps to you and receives your fee. */
    integrator?: string;
    /** Your EVM markup in basis points (Model A), default 20 = 0.2%, cap 500. */
    integratorBps?: number;
    /** Fixes the card theme regardless of the host page. */
    theme?: 'dark' | 'light';
    /** Set false to hide the Cherum logo and "Powered by" footer. */
    branding?: boolean;
    /** Lock the pre-set source chain/token (checkout-style flows). */
    lockSource?: boolean;
    /** Pre-select the source chain/token/amount. */
    source?: CherumSource;
    /** Pre-set fan-out destinations. */
    recipients?: CherumRecipient[];
    /** Corner radius in px (0..40, default 18) — applied to the widget AND iframe. */
    radius?: number;
    /** Brand accent color — free HEX (#RRGGBB). Text/hover shades derive automatically. */
    accent?: string;
    /** Iframe max width in px (default 460). */
    maxWidth?: number;
    className?: string;
    style?: CSSProperties;
}

const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/** Pure URL builder (exported for tests). */
export function buildEmbedUrl(p: CherumWidgetProps): string {
    const q = new URLSearchParams();
    if (p.integrator) q.set('integrator', p.integrator);
    if (p.integratorBps != null) q.set('integratorBps', String(p.integratorBps));
    if (p.theme) q.set('theme', p.theme);
    if (p.branding === false) q.set('branding', '0');
    if (p.lockSource) q.set('lockSource', '1');
    // NB: embedConfig parses chain.token with a DOT (not colon).
    if (p.source) q.set('src', `${p.source.chain}.${p.source.token}`);
    if (p.source?.amount != null) q.set('amt', String(p.source.amount));
    if (p.recipients?.length) q.set('to', p.recipients.map((r) => `${r.chain}.${r.token}`).join(','));
    if (p.radius != null) q.set('radius', String(p.radius));
    if (p.accent && HEX_RE.test(p.accent)) q.set('accent', p.accent);
    const qs = q.toString();
    return `${ORIGIN}/en/embed${qs ? `?${qs}` : ''}`;
}

/**
 * Cherum fan-out swap widget. One signature — many recipients across chains.
 *
 * ```tsx
 * <CherumWidget integrator="0xYourWallet" integratorBps={20} theme="dark" />
 * ```
 */
export function CherumWidget(props: CherumWidgetProps) {
    const ref = useRef<HTMLIFrameElement>(null);
    const src = useMemo(() => buildEmbedUrl(props), [
        props.integrator, props.integratorBps, props.theme, props.branding,
        props.lockSource, props.source, props.recipients, props.radius, props.accent,
    ]);

    useEffect(() => {
        function onMessage(e: MessageEvent) {
            if (e.origin !== ORIGIN) return;
            const d = e.data as { type?: string; height?: number } | null;
            if (!d || d.type !== 'cherum-embed:height' || typeof d.height !== 'number') return;
            const el = ref.current;
            if (el && el.contentWindow === e.source) el.style.height = `${d.height}px`;
        }
        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, []);

    return (
        <iframe
            ref={ref}
            src={src}
            title="Cherum swap widget"
            allow="clipboard-write"
            loading="lazy"
            className={props.className}
            style={{
                width: '100%',
                maxWidth: props.maxWidth ?? 460,
                height: 600,
                border: 0,
                borderRadius: props.radius ?? 18,
                display: 'block',
                ...props.style,
            }}
        />
    );
}

export default CherumWidget;
