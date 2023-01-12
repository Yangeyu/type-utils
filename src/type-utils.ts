// 展开类型变量
export type Spread<T> = isUnion<T> extends true
  ? UnionVarToUnion<T>
  : T extends Function ? T : T extends object
  ? { [K in keyof T]: Spread<T[K]> }
  : T

export type Prepend<Tuple extends unknown[], First> = [First, ...Tuple];

// 合并对象
export type Merge<T extends Record<string, unknown>, U extends Record<string, unknown>> =
  { [K in keyof T | keyof U]: K extends keyof U ? U[K] : K extends keyof T ? T[K] : never }

// 合并多个对象
export type Assign<T extends Record<string, unknown>, U> =
  U extends [infer F, ...infer O] ? F extends Record<string, unknown> ? Assign<Merge<T, F>, O> : T : T

// 小驼峰转下划线
export type UpperCaseToFormat<C extends string> = C extends Uppercase<C> ? `_${Lowercase<C>}` : C
export type SnakeCase<S> = S extends `${infer F}${infer R}` ? `${UpperCaseToFormat<F>}${SnakeCase<R>}` : S
export type CamelToUnderline<T> = { [P in keyof T as SnakeCase<P>]: T[P] }

// 添加属性
export type AppendToObject<T, U extends string, V, O extends Record<string, any> = Record<U, V> & T> = { [K in keyof O]: O[K] }
// 判断union类型
export type isUnion<T, Copy = T> = T extends Copy
  ? [Copy] extends [T] ? false : true : never

// 展开union变量
export type UnionVarToUnion<U> = (U extends unknown ? (k: U) => void : never) extends infer F
  ? F extends (k: infer I) => void
  ? I
  : never
  : never

// 联合类型转交叉类型
export type UnionToIntersectionFn<U> = (
  U extends unknown ? (k: () => U) => void : never
) extends (k: infer I) => void ? I : never;

// 联合类型转元组
export type UnionToTuple<
  Union,
  T extends unknown[] = [],
  Last = GetUnionLast<Union>
> = [Union] extends [never]
  ? T
  : UnionToTuple<Exclude<Union, Last>, Prepend<T, Last>>;

// 获取联合类型的最后一个元素
export type GetUnionLast<U> = UnionToIntersectionFn<U> extends () => infer I
  ? I : never;

// Union类型替换
export type ReplaceOne<S, T extends [any, any][]> =
  T extends [infer A extends [any, any], ...infer O extends [any, any][]]
  ? S extends A[0]
  ? A[1]
  : ReplaceOne<S, O>
  : S
export type UnionReplace<T, U extends [any, any][]> =
  T extends T
  ? ReplaceOne<T, U>
  : never
