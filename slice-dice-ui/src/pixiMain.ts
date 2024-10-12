import { Application, Graphics, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { setSharedData, sharedData } from "./shared";
let bgSprite: Sprite;
let cursor: Graphics;
let graphics: Graphics;
let app: Application;

export async function pixiInit() {
    const canvas = document.getElementsByTagName("canvas")[0];
    app = new Application();
    await app.init({ canvas: canvas, antialias: true });

    bgSprite = new Sprite();
    bgSprite.alpha = 0.5;
    graphics = new Graphics();
    cursor = new Graphics();
    app.stage.addChild(bgSprite);
    app.stage.addChild(graphics);
    app.stage.addChild(cursor);
    cursor.moveTo(0, 10);
    cursor.lineTo(10, 10);
    cursor.lineTo(0, 0);
    cursor.lineTo(0, 10);
    cursor.fill({ color: 0xffffff, alpha: 0.5 });

    canvas.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });

    canvas.addEventListener("drop", (e) => {
        e.preventDefault();
        processDrop(e);
    });

    canvas.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    setupSplitMouse(canvas);
    setupMouseCanvasMovement(canvas);

    app.ticker.add(() => {
        update(app);
    });
}

function processDrop(ev: DragEvent) {
    if (ev.dataTransfer == null) {
        return;
    }

    if (ev.dataTransfer.items) {
        [...ev.dataTransfer.items].forEach((item) => {
            if (item.kind === "file") {
                const file = item.getAsFile()!;
                const src = URL.createObjectURL(file);
                const image = new Image();
                image.src = src;
                camera.zoom = 1;
                camera.x = 0;
                camera.y = 0;
                image.addEventListener("load", () => {
                    bgSprite.texture = Texture.from(image);
                });
            }
        });
    }
}

const camera = {
    x: 0,
    y: 0,
    zoom: 1,
};

function setupMouseCanvasMovement(canvas: HTMLCanvasElement) {
    const dragStart = {
        x: 0,
        y: 0,
    };

    let isDragging = false;

    canvas.addEventListener("mousedown", (e) => {
        if (e.button != 1) return;
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
        isDragging = true;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (isDragging) {
            camera.x += e.clientX - dragStart.x;
            camera.y += e.clientY - dragStart.y;
            dragStart.x = e.clientX;
            dragStart.y = e.clientY;
        }
    });

    canvas.addEventListener("mouseup", (e) => {
        if (e.button != 1) return;
        isDragging = false;
    });

    canvas.addEventListener("wheel", (e) => {
        e.preventDefault();

        const zoomIntensity = 0.1;
        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;

        // Calculate the world position before the zoom
        const worldXBeforeZoom = (mouseX - camera.x) / camera.zoom;
        const worldYBeforeZoom = (mouseY - camera.y) / camera.zoom;

        // Apply zoom
        if (e.deltaY > 0) {
            camera.zoom = camera.zoom * (1 - zoomIntensity);
        } else {
            camera.zoom = camera.zoom * (1 + zoomIntensity);
        }

        // Calculate the world position after the zoom
        const worldXAfterZoom = (mouseX - camera.x) / camera.zoom;
        const worldYAfterZoom = (mouseY - camera.y) / camera.zoom;

        // Adjust camera position to keep the point under the mouse consistent
        camera.x += (worldXAfterZoom - worldXBeforeZoom) * camera.zoom;
        camera.y += (worldYAfterZoom - worldYBeforeZoom) * camera.zoom;
    });
}

function coords(x: number, y: number) {
    const out = {
        x: 0,
        y: 0,
    };
    out.x = -camera.x / camera.zoom;
    out.y = -camera.y / camera.zoom;
    out.x += x / camera.zoom;
    out.y += y / camera.zoom;
    return out;
}

function gridCoords(x: number, y: number) {
    const out = coords(x, y);
    out.x = Math.round(out.x / gridSize) * gridSize;
    out.y = Math.round(out.y / gridSize) * gridSize;
    return out;
}

let currentSplit: { x1: number; y1: number; x2: number; y2: number } | undefined = undefined;
function setupSplitMouse(canvas: HTMLCanvasElement) {
    canvas.addEventListener("mousedown", (e) => {
        if (e.button == 2) currentSplit = undefined;
        if (e.button != 0) return;
        if (currentSplit == undefined) {
            const { x, y } = e.shiftKey ? coords(e.offsetX, e.offsetY) : gridCoords(e.offsetX, e.offsetY);
            currentSplit = { x1: x, y1: y, x2: x, y2: y };
        }
    });

    canvas.addEventListener("mouseup", (e) => {
        if (e.button == 2) currentSplit = undefined;
        if (e.button != 0) return;
        if (currentSplit != undefined) {
            Split.create(currentSplit);
            currentSplit = undefined;
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        if (currentSplit != undefined) {
            const { x, y } = e.shiftKey ? coords(e.offsetX, e.offsetY) : gridCoords(e.offsetX, e.offsetY);
            currentSplit.x2 = x;
            currentSplit.y2 = y;
        }
        cursor.scale.set(1 / camera.zoom);
        const { x, y } = e.shiftKey ? coords(e.offsetX, e.offsetY) : gridCoords(e.offsetX, e.offsetY);
        cursor.x = x;
        cursor.y = y;
    });

    window.addEventListener("keydown", (e) => {
        if (e.key == "Escape") {
            currentSplit = undefined;
        }
    });
}

let gridSize = 32;

const splits: Set<Split> = new Set();

function update(app: Application) {
    gridSize = sharedData.gridSize;
    graphics.clear();
    app.stage.x = camera.x;
    app.stage.y = camera.y;
    app.stage.scale.set(camera.zoom);
    app.resizeTo = app.canvas;

    if (bgSprite.texture != null) {
        graphics.rect(0, 0, bgSprite.width, bgSprite.height);
        graphics.stroke({ color: 0xffffff, width: 1 / camera.zoom });

        for (let y = 0; y < bgSprite.height; y += gridSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(bgSprite.width, y);
        }

        for (let x = 0; x < bgSprite.height; x += gridSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, bgSprite.height);
        }
        graphics.stroke({ color: 0x999999, width: 1 / camera.zoom, alpha: 0.5 });
    }

    if (currentSplit != undefined) {
        const x = Math.min(currentSplit.x1, currentSplit.x2);
        const y = Math.min(currentSplit.y1, currentSplit.y2);
        const width = Math.abs(currentSplit.x1 - currentSplit.x2);
        const height = Math.abs(currentSplit.y1 - currentSplit.y2);

        graphics.rect(x, y, width, height);
        graphics.stroke({ color: 0xffaa00, width: 1 / camera.zoom, alpha: 1 });
        graphics.fill({ color: 0xffaa00, alpha: 0.1 });
    }

    for (const split of splits) {
        split.update();
    }
}

export class Split {
    static reset() {
        for (const split of splits) {
            split.destroy();
        }
        splits.clear();
    }
    static selected: Split | undefined;
    rectangle: Rectangle;
    name = "";
    graphics: Graphics;
    text: Text;
    dims: Text;
    hover = false;

    public get selected(): boolean {
        return Split.selected == this;
    }

    constructor(coords: { x1: number; y1: number; x2: number; y2: number }) {
        const x = Math.min(coords.x1, coords.x2);
        const y = Math.min(coords.y1, coords.y2);
        const width = Math.abs(coords.x1 - coords.x2);
        const height = Math.abs(coords.y1 - coords.y2);
        this.rectangle = new Rectangle(x, y, width, height);
        this.graphics = new Graphics();
        app.stage.addChild(this.graphics);
        this.text = new Text({ text: "", style: { fontSize: 24, fill: 0xffffff, wordWrap: true, wordWrapWidth: width } });
        this.text.x = x;
        this.text.y = y;
        app.stage.addChild(this.text);
        this.dims = new Text({ text: `${width}x${height}`, style: { fontSize: 24, fill: 0xffffff } });
        this.dims.x = x + width;
        this.dims.y = y + height;
        this.dims.anchor.set(1, 1);
        app.stage.addChild(this.dims);
        this.graphics.interactive = true;
        this.graphics.on("mouseenter", () => {
            this.hover = true;
        });

        this.graphics.on("mouseleave", () => {
            this.hover = false;
        });

        this.graphics.on("click", (e) => {
            if (e.button != 0) return;
            currentSplit = undefined;
            e.preventDefault();
            e.stopPropagation();
            this.triggerRename();
        });
    }

    validate() {
        if (this.rectangle.width <= 0 || this.rectangle.height <= 0) {
            this.destroy();
            if (this.selected) Split.selected = undefined;
        } else {
            if (sharedData.selectNewRectangles) {
                this.triggerRename();
            }
        }
    }

    toNamedRectangle(): NamedRectangle {
        return {
            name: this.name,
            x: this.rectangle.x,
            y: this.rectangle.y,
            width: this.rectangle.width,
            height: this.rectangle.height,
        };
    }

    static create(coords: { x1: number; y1: number; x2: number; y2: number }) {
        const split = new Split(coords);
        splits.add(split);
        split.validate();
        this.updateTargetData();
    }

    static load(coords: { x1: number; y1: number; x2: number; y2: number }, name: string) {
        const split = new Split(coords);
        splits.add(split);
        split.name = name;
    }

    triggerRename() {
        this.select();
        let copy = { ...sharedData };
        copy.rename = {
            ...sharedData,
            name: this.name,
            onChange: (value: string) => {
                copy = { ...sharedData };
                this.name = value;
                copy.rename.name = value;
                setSharedData(copy);
                Split.updateTargetData();
            },
            onClose: () => {
                copy = { ...sharedData };
                copy.rename.open = false;
                setSharedData(copy);
                Split.selected = undefined;
            },
            onDelete: () => {
                this.destroy();
                Split.selected = undefined;
                copy = { ...sharedData };
                copy.rename.open = false;
                setSharedData(copy);
                Split.updateTargetData();
            },
            open: true,
            description: "Rename Rectangle",
        };
        setSharedData(copy);
    }

    static updateTargetData() {
        targetData.splice(0, targetData.length);
        for (const rect of splits) {
            targetData.push(rect.toNamedRectangle());
        }
        console.log(targetData);
    }

    destroy() {
        this.graphics.destroy();
        this.text.destroy();
        this.dims.destroy();
        splits.delete(this);
    }

    select() {
        Split.selected = this;
    }

    update() {
        this.text.text = this.name;
        this.graphics.clear();
        this.graphics.rect(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
        let color = 0xffaa00;
        let alpha = 0.5;
        if (this.hover) {
            alpha = 1;
        }

        if (this.name != "") {
            color = 0x55ff55;
        }

        if (this.selected) {
            color = 0x5555ff;
        }

        this.graphics.stroke({ color, width: 1 / camera.zoom, alpha });
        this.graphics.fill({ color, alpha: alpha * 0.5 });
    }
}

export type NamedRectangle = {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
};

let targetData: Array<NamedRectangle> = [];

export function loadSplits(data: Array<NamedRectangle>) {
    console.log(data);

    targetData = data;
    Split.reset();
    for (const rectangle of [...data]) {
        Split.load({ x1: rectangle.x, y1: rectangle.y, x2: rectangle.x + rectangle.width, y2: rectangle.y + rectangle.height }, rectangle.name);
    }
}
