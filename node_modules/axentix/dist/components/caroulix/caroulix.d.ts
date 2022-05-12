import { AxentixComponent, Component } from '../../utils/component';
export interface ICaroulixOptions {
    animationDuration?: number;
    height?: string;
    backToOpposite?: boolean;
    enableTouch?: boolean;
    indicators?: {
        enabled?: boolean;
        isFlat?: boolean;
        customClasses?: string;
    };
    autoplay?: {
        enabled?: boolean;
        interval?: number;
        side?: 'right' | 'left';
    };
}
export declare const CaroulixOptions: ICaroulixOptions;
export declare class Caroulix extends AxentixComponent implements Component {
    #private;
    static getDefaultOptions: () => ICaroulixOptions;
    options: ICaroulixOptions;
    activeIndex: number;
    constructor(element: string, options?: ICaroulixOptions);
    setup(): void;
    setupListeners(): void;
    removeListeners(): void;
    goTo(number: number): void;
    play(): void;
    stop(): void;
    next(step?: number, resetAutoplay?: boolean): void;
    prev(step?: number, resetAutoplay?: boolean): void;
}
