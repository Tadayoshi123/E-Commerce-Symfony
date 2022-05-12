import { AxentixComponent, Component } from '../../utils/component';
interface IFabOptions {
    animationDuration?: number;
    hover?: boolean;
    direction?: 'top' | 'bottom' | 'left' | 'right';
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    offsetX?: string;
    offsetY?: string;
}
export declare class Fab extends AxentixComponent implements Component {
    #private;
    static getDefaultOptions: () => IFabOptions;
    options: IFabOptions;
    constructor(element: string, options?: IFabOptions);
    setup(): void;
    setupListeners(): void;
    removeListeners(): void;
    /** Open fab */
    open(): void;
    /** Close fab */
    close(): void;
}
export {};
