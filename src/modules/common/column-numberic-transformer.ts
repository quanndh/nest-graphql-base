export class ColumnNumericTransformer {
  to(data?: number): number {
    return data || 0;
  }
  from(data?: string): number {
    return !!data ? parseFloat(data) : 0;
  }
}
