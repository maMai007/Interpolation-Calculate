
export function spline(points, X) {
    // 1. Validate input
    if (points.length < 2) {
        throw new Error("ต้องมีอย่างน้อย 2 จุด");
    }

    const xs = points.map((p) => p.x);

    if (new Set(xs).size !== xs.length) {
        throw new Error("ค่า x ห้ามซ้ำกัน");
    }

    // 2. Sort points by x
    const p = [...points].sort((a, b) => a.x - b.x);

    const n = p.length;
    const m = [];

    // 3. Calculate slope of every interval
    for (let i = 0; i < n - 1; i++) {
        const slope =
            (p[i + 1].y - p[i].y) /
            (p[i + 1].x - p[i].x);

        m.push(slope);
    }

    // 4. Find the interval containing X
    let interval = -1;

    for (let i = 0; i < n - 1; i++) {
        if (X >= p[i].x && X <= p[i + 1].x) {
            interval = i;
            break;
        }
    }

    if (interval === -1) {
        throw new Error("ค่า X อยู่นอกช่วงข้อมูล");
    }

    // 5. Calculate interpolation
    const x1 = p[interval].x;
    const y1 = p[interval].y;
    const slope = m[interval];

    const result = y1 + slope * (X - x1);

    // 6. Return calculation details
    return {
        result,
        m,
        interval,
        x1,
        y1,
        x2: p[interval + 1].x,
        y2: p[interval + 1].y,
        targetX: X,
        substitution: {
            y1,
            slope,
            targetX: X,
            x1,
            calculation: `${y1} + (${slope}) * (${X} - ${x1})`
        }
    };
}
