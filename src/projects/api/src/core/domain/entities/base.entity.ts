
export class BaseEntity {
  constructor(
    public created_at: string | Date,
    public updated_at: string | Date | null,
    public deleted_at: string | Date | null,
  ) { }

  /**
   * Useful method for creating instances from an object.
   * Each class static implements its own way of initializing the instance through the object.
   */
  static NewWithInput (input: any) {
    throw new Error('Method not implemented')
  }
  
  // // Static method of generic construction
  // static fromObject<T extends BaseEntity>(obj: any, cls: new (...args: any[]) => T): T {
  //   const { created_at, updated_at, deleted_at, ...rest } = obj;
  //   return new cls(created_at, updated_at, deleted_at, ...Object.values(rest));
  // }
}

