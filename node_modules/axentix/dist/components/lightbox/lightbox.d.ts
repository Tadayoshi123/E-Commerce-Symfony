import { AxentixComponent, Component } from '../../utils/component';
interface ILightboxOptions {
    animationDuration?: number;
    overlayClass?: string;
    offset?: number;
    mobileOffset?: number;
    caption?: string;
}
export declare class Lightbox extends AxentixComponent implements Component {
    #private;
    static getDefaultOptions: () => ILightboxOptions;
    options: ILightboxOptions;
    constructor(element: string, options?: ILightboxOptions);
    setup(): void;
    setupListeners(): void;
    removeListeners(): void;
    /** Open lightbox */
    open(): void;
    /** Close lightbox */
    close(e?: any): void;
}
export {};
