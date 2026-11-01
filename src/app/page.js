
import Link from "next/link";

const methods = [
  {
    title: "Newton Divided Difference",
    description:
      "Interpolation using divided differences to construct a polynomial.",
    href: "/interpolation/newton",
    number: "01",
  },
  {
    title: "Lagrange Interpolation",
    description:
      "Interpolation using Lagrange basis polynomials.",
    href: "/interpolation/lagrange",
    number: "02",
  },
  {
    title: "Linear Spline",
    description:
      "Piecewise linear interpolation between data points.",
    href: "/interpolation/spline",
    number: "03",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Numerical Methods
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Interpolation Methods
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-zinc-600">
            Choose an interpolation method to calculate and explore
            numerical results.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {methods.map((method) => (
            <Link
              key={method.number}
              href={method.href}
              className="group rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"
            >
              <span className="text-sm font-semibold text-blue-600">
                METHOD {method.number}
              </span>

              <h2 className="mt-6 text-xl font-bold text-zinc-900">
                {method.title}
              </h2>

              <p className="mt-3 min-h-16 text-sm leading-6 text-zinc-600">
                {method.description}
              </p>

              <div className="mt-7 flex items-center font-semibold text-blue-600">
                Open Calculator
                <span className="ml-2 transition group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
