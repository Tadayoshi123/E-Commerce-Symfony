import { AxentixComponent, Component } from '../../utils/component';
interface ISidenavOptions {
    overlay?: boolean;
    bodyScrolling?: boolean;
    animationDuration?: number;
}
export declare class Sidenav extends AxentixComponent implements Component {
    #private;
    static getDefaultOptions: () => ISidenavOptions;
    options: ISidenavOptions;
    constructor(element: string, options?: ISidenavOptions);
    setup(): void;
    setupListeners(): void;
    removeListeners(): void;
    destroy(): void;
    /** Open Sidenav */
    open(): void;
    /** Close Sidenav */
    close(): void;
}
export {};
