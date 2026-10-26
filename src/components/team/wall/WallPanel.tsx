import Image from 'next/image';
import Link from 'next/link';
import type { PlacedTile } from '../../../types';
import { cn } from '../../../utils/cn';
import { stainStyle } from '../../../utils/stain';
import { Leader } from '../../common/ActionLink';

/** One panel on the wall: a portrait or photograph with its readout, or an achievement set as type. */
export function WallPanel({ tile, hidden }: { tile: PlacedTile; hidden?: boolean }) {
  const pictured = Boolean(tile.image);
  return (
    <Link
      href={tile.href}
      draggable={false}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(
        'group relative flex h-full w-full flex-col justify-end overflow-hidden outline-offset-[-3px] transition-[box-shadow,background-color] duration-500',
        pictured ? 'bg-ink text-frost' : tile.kind === 'page' ? 'bg-ink/90 text-frost hover:bg-ink' : 'bg-mist-hi/85 text-ink hover:bg-frost',
        'shadow-[0_0_0_1px_oklch(0.975_0.004_240/0.35)] hover:shadow-[0_0_0_1px_oklch(0.975_0.004_240/0.9),0_0_40px_-6px_oklch(0.975_0.004_240/0.6)]',
      )}
    >
      {tile.image && (
        <>
          <Image
            src={tile.image}
            alt=""
            fill
            draggable={false}
            sizes={tile.w === 2 ? '(min-width: 768px) 34vw, 70vw' : '(min-width: 768px) 17vw, 40vw'}
            style={{ objectPosition: tile.imagePosition }}
            className="object-cover saturate-[0.8] transition duration-700 ease-out-quart group-hover:scale-[1.04] group-hover:saturate-100"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
        </>
      )}
      <span className="relative flex flex-col gap-1.5 p-3 md:p-4">
        <span className={cn('hud flex items-center gap-2', pictured || tile.kind === 'page' ? 'text-frost/75' : 'text-mute')} style={tile.stain ? stainStyle(tile.stain) : undefined}>
          {tile.stain && <span aria-hidden="true" className="swatch" />}
          {tile.kind === 'person' ? tile.sub : tile.meta}
          {tile.kind === 'page' && <span className="ml-auto"><Leader /></span>}
        </span>
        <span
          className={cn(
            'font-display font-light leading-[1.08]',
            tile.kind === 'count' ? 'key text-[clamp(2.25rem,1.5rem+2.5vw,3.75rem)]' : tile.kind === 'page' || (tile.w === 2 && tile.h > 1) ? 'text-[clamp(1.25rem,0.9rem+1.2vw,2rem)]' : 'text-[clamp(0.875rem,0.8rem+0.3vw,1.0625rem)]',
          )}
        >
          {tile.title}
        </span>
        {tile.kind !== 'count' && (
          <span className={cn('line-clamp-2 text-[0.75rem] leading-snug', pictured || tile.kind === 'page' ? 'text-frost/70' : 'text-ink-2')}>
            {tile.kind === 'person' ? tile.meta : tile.sub}
          </span>
        )}
        {tile.kind === 'count' && <span className="hud text-mute">{tile.sub}</span>}
      </span>
    </Link>
  );
}
