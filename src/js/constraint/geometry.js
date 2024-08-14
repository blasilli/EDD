import * as d3 from 'd3'

export class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
}

export class Line {
  // equation: y = m*x + q
  constructor (m, q) {
    this.m = m
    this.q = q
  }

  pointGivenX (x) {
    const y = this.m * x + this.q
    return new Point(x, y)
  }

  pointGivenY (y) {
    const x = (y - this.q) / this.m
    return new Point(x, y)
  }

  perpendicularLineIn (p) {
    if (!(p instanceof Point)) throw new Error('p is not instance of class Point')
    const m1 = -1 / this.m
    const q1 = p.y - (m1 * p.x)
    return new Line(m1, q1)
  }

  static passingThroughPoints (p1, p2) {
    if (!(p1 instanceof Point)) throw new Error('p1 is not instance of class Point')
    if (!(p2 instanceof Point)) throw new Error('p2 is not instance of class Point')

    const m = (p1.y - p2.y) / (p1.x - p2.x)
    const q = p1.y - m * p1.x
    return new Line(m, q)
  }
}

export class Circumference {
  // equation: (x - cx)^2 + (y - cy)^2 = r^2
  constructor (center, radius) {
    if (!(center instanceof Point)) throw new Error('center is not instance of class Point')
    this.center = center
    this.radius = radius
  }

  lineIntersection (line) {
    if (!(line instanceof Line)) throw new Error('line is not instance of class Line')

    const sq = (x) => x * x
    const sqrt = (x) => Math.sqrt(x)

    // get a, b, c values
    const a = 1 + sq(line.m)
    const b = -this.center.x * 2 + (line.m * (line.q - this.center.y)) * 2
    const c = sq(this.center.x) + sq(line.q - this.center.y) - sq(this.radius)
    const delta = sq(b) - 4 * a * c

    if (delta >= 0) {
      const x1 = (-b + sqrt(sq(b) - 4 * a * c)) / (2 * a)
      const x2 = (-b - sqrt(sq(b) - 4 * a * c)) / (2 * a)
      const p1 = line.pointGivenX(x1)
      const p2 = line.pointGivenX(x2)
      return [p1, p2]
    } else return null
  }
}

export function straightLine (start, end) {
  const generator = d3.line().curve(d3.curveBasis).x(d => d.x).y(d => d.y)

  const midPoint = new Point(
    (start.x + end.x) / 2,
    (start.y + end.y) / 2
  )

  const path = generator([start, end])

  return { midPoint, path }
}

export function curveLineA (start, end, distance) {
  const s = new Point(start.x, start.y)
  const e = new Point(end.x, end.y)

  const m = new Point(
    (s.x + e.x) / 2,
    (s.y + e.y) / 2
  )

  const line = Line.passingThroughPoints(s, e).perpendicularLineIn(m)
  const circumference = new Circumference(m, distance)
  const intersections = circumference.lineIntersection(line)
  const midPoint = intersections[0]

  /*
  const path = d3.path()
  path.moveTo(source.x, source.y)
  path.bezierCurveTo(p.x, p.y, p.x, p.y, target.x, target.y)
  return path.toString()
  */

  const generator = d3.line().curve(d3.curveCardinal).x(d => d.x).y(d => d.y)
  const path = generator([s, midPoint, e])

  return { midPoint, path }
}

export function curveLineB (start, end, distance) {
  const s = new Point(start.x, start.y)
  const e = new Point(end.x, end.y)

  const m = new Point(
    (s.x + e.x) / 2,
    (s.y + e.y) / 2
  )

  const line = Line.passingThroughPoints(s, e).perpendicularLineIn(m)
  const circumference = new Circumference(m, distance)
  const intersections = circumference.lineIntersection(line)

  const midPoint = intersections[1]

  /*
  const path = d3.path()
  path.moveTo(source.x, source.y)
  path.bezierCurveTo(p.x, p.y, p.x, p.y, target.x, target.y)
  return path.toString()
  */

  const generator = d3.line().curve(d3.curveCardinal).x(d => d.x).y(d => d.y)
  const path = generator([s, midPoint, e])

  return { midPoint, path }
}
