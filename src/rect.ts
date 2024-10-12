export class Rectangle {
    constructor(public x: number, public y: number, public width: number, public height: number) {}

    get top(): number {
        return this.y;
    }

    get bottom(): number {
        return this.y + this.height;
    }

    get left(): number {
        return this.x;
    }

    get right(): number {
        return this.x + this.width;
    }
}
