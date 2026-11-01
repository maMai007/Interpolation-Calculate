
export function lagrange(points, X) {
    // 1. Validate input
    if (points.length < 2) {
        throw new Error("ต้องมีอย่างน้อย 2 จุด");
    }

    const xs = points.map((p) => p.x);

    if (new Set(xs).size !== xs.length) {
        throw new Error("ค่า x ห้ามซ้ำกัน");
    }

    const n = points.length;
    const L = [];
    const terms = [];

    let fx = 0;

    // 2. Calculate Lagrange basis
    for (let i = 0; i < n; i++) {
        let numerator = 1;
        let denominator = 1;

        const factors = [];

        for (let j = 0; j < n; j++) {
            if (j !== i) {
                numerator *= X - points[j].x;
                denominator *= points[i].x - points[j].x;

                factors.push({
                    xj: points[j].x,
                    numerator: X - points[j].x,
                    denominator: points[i].x - points[j].x
                });
            }
        }

        const li = numerator / denominator;

        L.push(li);

        const term = li * points[i].y;
        fx += term;

        terms.push({
            i,
            xi: points[i].x,
            yi: points[i].y,
            numerator,
            denominator,
            L: li,
            term,
            factors
        });
    }

    // 3. Return calculation details
    return {
        result: fx,
        L,
        terms,
        x: points.map((p) => p.x),
        targetX: X
    };
}
