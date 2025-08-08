export default function SignInLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="h-2 w-2 animate-ping rounded-full bg-white/80" />
        <span className="h-2 w-2 animate-ping rounded-full bg-white/60 animation-delay-150" />
        <span className="h-2 w-2 animate-ping rounded-full bg-white/40 animation-delay-300" />
        <span className="sr-only">Loading sign-in…</span>
      </div>
    </div>
  )
}
