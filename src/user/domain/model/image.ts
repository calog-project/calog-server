import { ValueObject } from 'src/common/domain/value-object';

interface ImageProps {
  image: string;
}
export class Image extends ValueObject<ImageProps> {
  constructor(props: ImageProps) {
    super(props);
  }

  getValue(): string {
    return this.props.image;
  }

  private static isValidImageUrl(imageUrl: string): boolean {
    const urlRegex = new RegExp(
      '^(http|https):\\/\\/[\\w-]+(\\.[\\w-]+)+[\\/\\#\\?]?.*$',
    );
    return urlRegex.test(imageUrl);
  }

  static create(image: string): Image {
    if (image === '') return new Image({ image });
    if (this.isValidImageUrl(image)) return new Image({ image });
    else throw new Error('이미지 url 형식이 잘못되었습니다.');
  }
}
