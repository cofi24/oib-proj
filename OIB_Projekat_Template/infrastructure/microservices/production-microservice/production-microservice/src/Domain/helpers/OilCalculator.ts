export class OilCalculator {
  private static readonly MAX_OIL = 4.0;
  private static readonly PRECISION = 100;

  static autoBalance(originalOil: number, processedOil: number): number {
    if (processedOil <= this.MAX_OIL) {
      return originalOil;
    }

    const overflow = processedOil - this.MAX_OIL;
    const factor = overflow*0.5;

    return Math.round(originalOil * factor * this.PRECISION) / this.PRECISION;
  }

  static adjustByPercent(currentOil: number, percent: number): number {
    if (percent === 100) {
      return currentOil;
    }

    if (percent < 100) {
      return Math.round(currentOil * (1 - percent / 100) * this.PRECISION) / this.PRECISION;
    }

    const increase = percent - 100;
    return Math.round(currentOil * (1 + increase / 100) * this.PRECISION) / this.PRECISION;
  }

  static getBalanceFactor(processedOil: number): number {
    const overflow = processedOil - this.MAX_OIL;
    return Math.round(overflow * 100);
  }

  static needsAutoBalance(oil: number): boolean {
    return oil > this.MAX_OIL;
  }
}