import { Container } from "@/components/ui/container";

export default function EventPageSkeleton() {
  return (
    <Container className="container mx-auto max-w-6xl p-2">
      <article className="space-y-8">
        <header className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Image skeleton */}
          <div className="w-full md:w-3/5 aspect-square md:aspect-auto md:h-full bg-muted animate-pulse rounded-3xl" />

          <div className="w-full flex flex-col gap-5 items-center">
            {/* Title skeleton */}
            <div className="h-9 w-3/5 bg-muted animate-pulse rounded" />

            {/* Date skeleton */}
            <div className="h-5 w-2/3 bg-muted animate-pulse rounded" />

            <div className="h-px w-full bg-secondary" />

            <div className="w-full flex flex-col gap-6 py-4">
              {/* Host skeleton */}
              <div className="w-full flex flex-row gap-3 items-center">
                <div className="size-10 bg-muted animate-pulse rounded-full" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>

              {/* Location skeleton */}
              <div className="flex flex-row gap-3 items-center">
                <div className="size-10 bg-muted animate-pulse rounded-xl" />
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>

            {/* Participants section skeleton */}
            <section className="w-full border p-4 rounded-3xl border-border bg-card shadow-lg">
              <div className="w-full flex flex-row justify-between items-center mb-4">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded-full" />
              </div>

              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-muted animate-pulse rounded-full" />
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </header>

        {/* Description section skeleton */}
        <section>
          <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </section>
      </article>
    </Container>
  );
}
