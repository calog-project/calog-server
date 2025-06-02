/**
 * 페이징 처리
 * @template T items 타입
 * @template M 페이징 키 타입 , 키 = offset, cursor ...
 */
export interface PageResult<T, M> {
  items: T[];
  limit: number;
  //다음 페이지 키
  marker: M;
}

//오프셋 전용
export type OffsetPageResult<T> = PageResult<T, number>;
