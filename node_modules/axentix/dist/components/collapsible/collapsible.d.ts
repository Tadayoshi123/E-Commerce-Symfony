import { AxentixComponent, Component } from '../../utils/component';
interface ICollapsibleOptions {
    animationDuration?: number;
    sidenav?: {
        activeClass?: boolean;
        activeWhenOpen?: boolean;
        autoClose?: boolean;
    };
}
export declare class Collapsible extends AxentixComponent implements Component {
    #private;
    static getDefaultOptions: () => ICollapsibleOptions;
    options: ICollapsibleOptions;
    constructor(element: string, options?: ICollapsibleOptions);
    setup(): void;
    setupListeners(): void;
    removeListeners(): void;
    /** Open collapsible */
    open(): void;
    /** Close collapsible */
    close(): void;
}
export {};
