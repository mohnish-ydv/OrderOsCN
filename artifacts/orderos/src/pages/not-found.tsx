import { Link } from 'wouter';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-background px-5 py-8 text-foreground">
      <div className="mx-auto flex min-h-[80dvh] max-w-xl flex-col justify-center">
        <div className="mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">OrderOS / signal lost</div>
        <div className="mt-5 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-accent"><Compass size={25} /></div>
          <div><div className="display text-4xl font-800 tracking-tight">404</div><div className="mt-1 text-sm font-semibold">This route is not on the desk.</div></div>
        </div>
        <p className="mt-6 max-w-md text-[12px] leading-6 text-muted-foreground">The workspace is intact, but this particular address does not map to an OrderOS view.</p>
        <Link href="/" className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[11px] font-bold text-primary-foreground hover:bg-primary/90" data-testid="link-return-command-center"><ArrowLeft size={14} />Return to command center</Link>
      </div>
    </div>
  );
}
