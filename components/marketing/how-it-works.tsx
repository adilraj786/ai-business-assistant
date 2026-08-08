const STEPS = [
  {
    number: "01",
    title: "Set up your business profile",
    description: "Tell us your business name, category, and brand colors — takes 2 minutes.",
  },
  {
    number: "02",
    title: "Ask for what you need",
    description: "Type a request like 'create a weekend sale offer' in plain language.",
  },
  {
    number: "03",
    title: "Get a complete package",
    description: "Poster, caption, hashtags, and promotional message — ready to post.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/40 px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Three steps. That's it.
          </h2>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number}>
              <div className="text-sm font-semibold text-indigo-600">
                {step.number}
              </div>
              <h3 className="mt-2 font-medium">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}