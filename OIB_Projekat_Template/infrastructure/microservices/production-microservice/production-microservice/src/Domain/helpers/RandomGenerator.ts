export class RandomGenerator {
  static generateOilStrength(): number {
    return Math.round((1 + Math.random() * 4) * 100) / 100;
  }
}