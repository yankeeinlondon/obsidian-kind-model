import { EventRef, Stat,  Vault } from "obsidian";

export interface TFile extends TAbstractFile {
	/** file `Stat` metadata */
	stat: Stat;

	/** the file extension */
	extension: string;

	/** whether file is being saved  */
	saving: boolean;

	/**
	 * whether the file was deleted or not
	 */
	deleted: boolean;

}

export interface TFolder extends TAbstractFile {
    /**
     * files in the directory
     */
    children: TAbstractFile[];

    /**
     * is the root of the vault
     */
    isRoot(): boolean;
}



/**
 * This can be either a `TFile` or a `TFolder`.
 */
export interface TAbstractFile {
	/**
	 * The name including file extension
	 */
	name: string;

    /**
     * @public
     */
    vault: Vault;
    /**
     * the full path to the file
     */
    path: string;
    /**
     * the name without the file extension
     */
    basename: string;

	/**
     * the parent folder
     */
	parent: TFolder | null;

}


export interface ObsidianComponent {
	/**
	 * Load this component and its children
	 */
	load(): void;
	/**
	 * Override this to load your component
	 */
	onload(): void;
	/**
	 * Unload this component and its children
	 */
	unload(): void;
	/**
	 * Override this to unload your component
	 */
	onunload(): void;
	/**
	 * Adds a child component, loading it if this component is loaded
	 */
	addChild<T extends ObsidianComponent>(component: T): T;
	/**
	 * Removes a child component, unloading it
	 */
	removeChild<T extends ObsidianComponent>(component: T): T;
	/**
	 * Registers a callback to be called when unloading
	 */
	register(cb: () => any): void;
	/**
	 * Registers an event to be detached when unloading
	 */
	registerEvent(eventRef: EventRef): void;
	/**
	 * Registers an DOM event to be detached when unloading
	 */
	registerDomEvent<K extends keyof WindowEventMap>(
		el: Window, 
		type: K, 
		callback: (this: HTMLElement, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions
	): void;
	/**
	 * Registers an DOM event to be detached when unloading
	 */
	registerDomEvent<K extends keyof DocumentEventMap>(el: Document, type: K, callback: (
		this: HTMLElement, 
		ev: DocumentEventMap[K]
	) => any, options?: boolean | AddEventListenerOptions): void;
	/**
	 * Registers an DOM event to be detached when unloading
	 */
	registerDomEvent<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, callback: (
		this: HTMLElement, 
		ev: HTMLElementEventMap[K]
	) => any, options?: boolean | AddEventListenerOptions): void;

	/**
	 * Registers an interval (from setInterval) to be cancelled when unloading
	 * Use {@link window.setInterval} instead of {@link setInterval} to 
	 * avoid TypeScript confusing between NodeJS vs Browser API
	 */
	registerInterval(id: number): number;
}





export interface ObsidianSvgElement extends SVGGraphicsElement, SVGFitToViewBox, WindowEventHandlers {
    currentScale: number;
    readonly currentTranslate: DOMPointReadOnly;
    readonly height: SVGAnimatedLength;
    readonly width: SVGAnimatedLength;
    readonly x: SVGAnimatedLength;
    readonly y: SVGAnimatedLength;
    animationsPaused(): boolean;
    checkEnclosure(element: SVGElement, rect: DOMRectReadOnly): boolean;
    checkIntersection(element: SVGElement, rect: DOMRectReadOnly): boolean;
    createSVGAngle(): SVGAngle;
    createSVGLength(): SVGLength;
    createSVGMatrix(): DOMMatrix;
    createSVGNumber(): SVGNumber;
    createSVGPoint(): DOMPoint;
    createSVGRect(): DOMRect;
    createSVGTransform(): SVGTransform;
    createSVGTransformFromMatrix(matrix?: DOMMatrix2DInit): SVGTransform;
    deselectAll(): void;
    /** @deprecated */
    forceRedraw(): void;
    getCurrentTime(): number;
    getElementById(elementId: string): Element;
    getEnclosureList(rect: DOMRectReadOnly, referenceElement: SVGElement | null): NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>;
    getIntersectionList(rect: DOMRectReadOnly, referenceElement: SVGElement | null): NodeListOf<SVGCircleElement | SVGEllipseElement | SVGImageElement | SVGLineElement | SVGPathElement | SVGPolygonElement | SVGPolylineElement | SVGRectElement | SVGTextElement | SVGUseElement>;
    pauseAnimations(): void;
    setCurrentTime(seconds: number): void;
    /** @deprecated */
    suspendRedraw(maxWaitMilliseconds: number): number;
    unpauseAnimations(): void;
    /** @deprecated */
    unsuspendRedraw(suspendHandleID: number): void;
    /** @deprecated */
    unsuspendRedrawAll(): void;
    addEventListener<K extends keyof SVGSVGElementEventMap>(type: K, listener: (this: ObsidianSvgElement, ev: SVGSVGElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof SVGSVGElementEventMap>(type: K, listener: (this: ObsidianSvgElement, ev: SVGSVGElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}


export type GetIconFromObsidian = (iconId: string) => ObsidianSvgElement | null;
