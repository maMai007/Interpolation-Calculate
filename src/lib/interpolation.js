// src/lib/interpolation.js
// points = [{ x: 0, y: 9.81 }, { x: 2, y: 9.7487 }, ...]

function validate(points) {
  if (points.length < 2) throw new Error("ต้องมีอย่างน้อย 2 จุด");
  const xs = points.map((p) => p.x);
  if (new Set(xs).size !== xs.length) throw new Error("ค่า x ห้ามซ้ำกัน");
}

// ---------- Newton Divided Difference ----------
// ใช้ตาราง (dynamic programming) แทน recursive เพื่อไม่คำนวณซ้ำ
export function newtonDividedDifference(points, X) {
  validate(points);
  const n = points.length;
  const x = points.map((p) => p.x);
  // table[i][j] = f[x_i, ..., x_{i+j}]
  const table = Array.from({ length: n }, (_, i) => [points[i].y]);
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / (x[i + j] - x[i]);
    }
  }
  const C = table[0]; // C[0..n-1]

  let sum = 0;
  let mul = 1;
  const terms = [];
  for (let i = 0; i < n; i++) {
    if (i > 0) mul *= X - x[i - 1];
    sum += C[i] * mul;
    terms.push({ i, C: C[i], term: C[i] * mul });
  }
  return { result: sum, C, table, terms };
}



// ---------- Lagrange ----------
export function lagrange(points, X) {
  validate(points);
  const n = points.length;
  const L = [];
  let fx = 0;
  for (let i = 0; i < n; i++) {
    let li = 1;
    for (let j = 0; j < n; j++) {
      if (j !== i) 
        li *= (points[j].x - X) / (points[j].x - points[i].x);
    }
    L.push(li);
    fx += li * points[i].y;
  }
  return { result: fx, L };
}

// ---------- Linear Spline ----------
export function linearSpline(points, X) {
  validate(points);
  const p = [...points].sort((a, b) => a.x - b.x); // เรียง x ก่อนหาช่วง
  const m = [];
  for (let i = 0; i < p.length - 1; i++) {
    m.push((p[i + 1].y - p[i].y) / (p[i + 1].x - p[i].x));
  }
  for (let i = 0; i < p.length - 1; i++) {
    if (X >= p[i].x && X <= p[i + 1].x) {
      return { result: p[i].y + m[i] * (X - p[i].x), m, interval: i };
    }
  }
  throw new Error(`X = ${X} อยู่นอกช่วงข้อมูล [${p[0].x}, ${p[p.length - 1].x}]`);
}

// ทดสอบเร็วๆ ด้วยค่าเดียวกับไฟล์ cpp:
// const pts = [0,2,4,6,8].map((x,i)=>({x, y:[9.81,9.7487,9.6879,9.6879,9.5682][i]}));
// newtonDividedDifference(pts, 4.2).result ควรเท่ากับ lagrange(pts, 4.2).result
