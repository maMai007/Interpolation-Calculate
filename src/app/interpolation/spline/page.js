
"use client";

import { useState } from "react";
import Link from "next/link";
import { spline } from "@/lib/spline";

const EXAMPLE = [
  { x: "0", y: "9.81" },
  { x: "2", y: "9.7487" },
  { x: "4", y: "9.6879" },
  { x: "6", y: "9.6879" },
  { x: "8", y: "9.5682" },
];

export default function SplinePage() {
  const [rows, setRows] = useState(EXAMPLE);
  const [X, setX] = useState("4.2");
  const [out, setOut] = useState(null);
  const [error, setError] = useState("");

  const setCount = (value) => {
    const n = Math.max(2, Math.min(15, Number(value) || 2));

    setRows((r) =>
      Array.from(
        { length: n },
        (_, i) => r[i] ?? { x: "", y: "" }
      )
    );

    setOut(null);
    setError("");
  };

  const edit = (i, key, val) => {
    setRows((r) =>
      r.map((row, j) =>
        j === i ? { ...row, [key]: val } : row
      )
    );

    setOut(null);
    setError("");
  };

  const calculate = () => {
    setError("");
    setOut(null);

    try {
      if (
        rows.some((r) => r.x.trim() === "" || r.y.trim() === "") ||
        X.trim() === ""
      ) {
        throw new Error(
          "กรอกค่า x, y ให้ครบทุกช่อง และใส่ค่า X ที่ต้องการหา"
        );
      }

      const points = rows.map((r) => ({
        x: Number(r.x),
        y: Number(r.y),
      }));

      const Xn = Number(X);

      if (
        points.some(
          (p) => !Number.isFinite(p.x) || !Number.isFinite(p.y)
        ) ||
        !Number.isFinite(Xn)
      ) {
        throw new Error("กรุณากรอกข้อมูลเป็นตัวเลขที่ถูกต้อง");
      }

      const res = spline(points, Xn);

      setOut({
        ...res,
        points,
        Xn,
      });
    } catch (e) {
      setError(e.message);
    }
  };

  const format = (value) =>
    Number(value.toFixed(8)).toString();

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">

        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-blue-700 hover:underline"
        >
          ← Back to Home
        </Link>

        <header>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Numerical Methods
          </p>

          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            Linear Spline Interpolation
          </h1>

          <p className="mt-2 text-zinc-600">
            Calculate interpolation using piecewise linear functions.
          </p>
        </header>

        {/* Input Section */}
        <section className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-zinc-900">
            Input Data
          </h2>

          <div>
            <label className="text-sm font-medium text-zinc-700">
              Number of Data Points
            </label>

            <input
              type="number"
              min={2}
              max={15}
              value={rows.length}
              onChange={(e) => setCount(e.target.value)}
              className="mt-2 block w-32 rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-zinc-800">
              Data Points (X, Y)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-zinc-100">
                    <th className="border px-3 py-2">i</th>
                    <th className="border px-3 py-2">X</th>
                    <th className="border px-3 py-2">Y</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td className="border px-3 py-2 text-center">
                        {i}
                      </td>

                      <td className="border p-2">
                        <input
                          type="number"
                          step="any"
                          value={r.x}
                          onChange={(e) =>
                            edit(i, "x", e.target.value)
                          }
                          className="w-full rounded border px-2 py-1"
                        />
                      </td>

                      <td className="border p-2">
                        <input
                          type="number"
                          step="any"
                          value={r.y}
                          onChange={(e) =>
                            edit(i, "y", e.target.value)
                          }
                          className="w-full rounded border px-2 py-1"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">
              Target X
            </label>

            <input
              type="number"
              step="any"
              value={X}
              onChange={(e) => {
                setX(e.target.value);
                setOut(null);
                setError("");
              }}
              className="mt-2 block w-full max-w-xs rounded-lg border px-3 py-2"
            />
          </div>

          <button
            onClick={calculate}
            className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Calculate
          </button>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </section>

        {/* Result Section */}
        {out && (
          <section className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-zinc-900">
              Calculation Results
            </h2>

            {/* Slopes */}
            <div>
              <h3 className="mb-3 font-semibold">
                1. Slopes (m) of All Intervals
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-zinc-100">
                      <th className="border px-3 py-2">Interval</th>
                      <th className="border px-3 py-2">Slope (m)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {out.m.map((slope, i) => (
                      <tr key={i}>
                        <td className="border px-3 py-2 text-center">
                          {format(out.points[i].x)} ≤ x ≤ {format(out.points[i + 1].x)}
                        </td>

                        <td className="border px-3 py-2">
                          {format(slope)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Interval */}
            <div>
              <h3 className="mb-2 font-semibold">
                2. Selected Interval
              </h3>

              <div className="rounded-lg bg-zinc-100 p-4">
                <p className="text-sm text-zinc-600">
                  Target X = {format(out.Xn)}
                </p>

                <p className="mt-1 font-semibold text-zinc-900">
                  {format(out.x1)} ≤ x ≤ {format(out.x2)}
                </p>
              </div>
            </div>

            {/* Equation */}
            <div>
              <h3 className="mb-2 font-semibold">
                3. Linear Spline Equation
              </h3>

              <div className="overflow-x-auto rounded-lg bg-zinc-100 p-4">
                <p className="break-words font-mono text-sm leading-7">
                  P(x) = {format(out.y1)} + ({format(out.substitution.slope)}) (x - {format(out.x1)})
                </p>
              </div>
            </div>

            {/* Substitution */}
            <div>
              <h3 className="mb-2 font-semibold">
                4. Numerical Substitution
              </h3>

              <div className="overflow-x-auto rounded-lg bg-zinc-100 p-4">
                <p className="break-words font-mono text-sm leading-7">
                  P({format(out.Xn)}) = {out.substitution.calculation}
                </p>
              </div>
            </div>

            {/* Final Result */}
            <div className="rounded-xl bg-blue-50 p-5">
              <p className="text-sm font-medium text-blue-800">
                Final Result
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-900">
                f({format(out.Xn)}) = {format(out.result)}
              </p>
            </div>

          </section>
        )}

      </div>
    </main>
  );
}
