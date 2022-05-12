import { AxentixComponent, Component } from '../../utils/component';
interface IModalOptions {
    overlay?: boolean;
    bodyScrolling?: boolean;
    animationDuration?: number;
}
export declare class Modal extends AxentixComponent implements Component {
    #private;
    static getDefaultOptions: () => IModalOptions;
    options: IModalOptions;
    overlayElement: HTMLElement;
    constructor(element: string, options?: IModalOptions);
    setup(): void;
    setupListeners(): void;
    removeListeners(): void;
    /** Open Modal */
    open(): void;
    /** Close Modal */
    close(): void;
}
export {};
