import { AxentixComponent, Component } from '../../utils/component';
import { ICaroulixOptions } from '../caroulix/caroulix';
interface ITabOptions {
    animationDuration?: number;
    animationType?: 'none' | 'slide';
    disableActiveBar?: boolean;
    caroulix?: ICaroulixOptions;
}
export declare class Tab extends AxentixComponent implements Component {
    #private;
    static getDefaultOptions: () => ITabOptions;
    options: ITabOptions;
    constructor(element: string, options?: ITabOptions);
    setup(): void;
    setupListeners(): void;
    removeListeners(): void;
    /** Select tab */
    select(itemId: string): void;
    /** Detect active element & update component */
    updateActiveElement(): void;
    /** Go to previous tab */
    prev(step?: number): void;
    /** Go to next tab */
    next(step?: number): void;
}
export {};
