type DePromise<T> = T extends Promise<infer R> ? R : T;

const Async = {
  async map<T, R = any>(
    array: T[],
    cb: (value: T, index: number, array: T[]) => R | Promise<R>
  ): Promise<DePromise<R>[]> {
    return (await Promise.all(array.map(cb))) as any;
  },
  async forEach<T>(
    array: T[],
    cb: (value: T, index: number, array: T[]) => any
  ) {
    await Promise.all(array.map(cb));
  },
  async filter<T>(
    array: T[],
    cb: (value: T, index: number, array: T[]) => boolean | Promise<boolean>
  ) {
    const res = await Promise.all(array.map(cb));
    return array.filter((v, i) => res[i]);
  },
};

export default Async;
