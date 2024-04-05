export class SentenceDetails {
    public content: string;
    public startPos: number;
    public endPos: number;
    public lineNum: number;
    public replaceText: string;

    public constructor(content: string, startPos: number, endPos: number, lineNum: number){
        this.content = this.replaceText = content;
        this.startPos = startPos;
        this.endPos = endPos;
        this.lineNum = lineNum;
    }
    public replace(replacedText: string): string{
        this.replaceText = replacedText;
        return replacedText;
    }
}