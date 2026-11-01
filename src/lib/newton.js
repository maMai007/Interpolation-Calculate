
export function newtonTopDown(points, X) {
    // 1. Validate input
    if (points.length < 2) {
        throw new Error("ต้องมีอย่างน้อย 2 จุด");
    }

    const xs = points.map((p) => p.x);

    if (new Set(xs).size !== xs.length) {
        throw new Error("ค่า x ห้ามซ้ำกัน");
    }

    const n = points.length;
    const x = points.map((p) => p.x);
    const y = points.map((p) => p.y);

    // 2. Memoization table
    const M = Array.from(
        { length: n },
        () => Array(n).fill(null)
    );

    // 3. Recursive Divided Difference
    function findC(L, R) {
        if (L === R) return y[L];

        if (M[L][R] !== null) {
            return M[L][R];
        }

        M[L][R] =
            (findC(L + 1, R) - findC(L, R - 1)) /
            (x[R] - x[L]);

        return M[L][R];
    }

    // 4. Calculate Newton coefficients
    let sum = 0;
    let mul = 1;

    const C = [];
    const terms = [];

    for (let i = 0; i < n; i++) {
        const c = findC(0, i);

        C.push(c);

        if (i > 0) {
            mul *= X - x[i - 1];
        }

        const term = c * mul;
        sum += term;

        terms.push({
            i,
            C: c,
            multiplier: mul,
            term
        });
    }

    // 5. Return calculation details
    return {
        result: sum,
        C,
        table: M,
        terms,
        x: [...x],
        targetX: X
    };
}
