import { AxentixComponent, Component } from '../../utils/component';
interface IDropdownOptions {
    animationDuration?: number;
    animationType?: 'none' | 'fade';
    hover?: boolean;
    autoClose?: boolean;
    preventViewport?: boolean;
    closeOnClick?: boolean;
}
export declare class Dropdown extends AxentixComponent implements Component {
    #private;
    static getDefaultOptions: () => IDropdownOptions;
    options: IDropdownOptions;
    constructor(element: string, options?: IDropdownOptions);
    setup(): void;
    setupListeners(): void;
    removeListeners(): void;
    /** Open dropdown */
    open(): void;
    /** Close dropdown */
    close(): void;
}
export {};
