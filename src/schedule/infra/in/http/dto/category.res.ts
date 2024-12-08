export class CategoryResDto {
  constructor(
    public readonly aggregateId: string,
    public readonly id: number,
    public readonly userId: number,
    public readonly name: string,
    public readonly color: string,
  ) {}
  // constructor(props: CategoryResDto) {
  //   this.aggregateId = props.aggregateId;
  //   this.id = props.id
  //   this.userId = prop.
  // }
}
