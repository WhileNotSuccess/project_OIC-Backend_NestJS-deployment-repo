export class Carousel{
    constructor(
        public image:string,
        public postId:number,
        public KoreanTitle:string,
        public KoreanDescription:string,
        public EnglishTitle:string,
        public EnglishDescription:string,
        public JapaneseTitle:string,
        public JapaneseDescription:string,
        public id?:number
    ){}
    
    isImage(){
        return this.image==='/123456-image.jpg'
    }
}