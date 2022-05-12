import { AxentixComponent, Component } from '../../utils/component';
interface ITooltipOptions {
    content: string;
    animationDelay: number;
    offset: string;
    animationDuration: number;
    classes: string;
    position: 'top' | 'left' | 'right' | 'bottom';
}
export declare class Tooltip extends AxentixComponent implements Component {
    #private;
    static getDefaultOptions: () => ITooltipOptions;
    options: ITooltipOptions;
    constructor(element: string, options?: ITooltipOptions);
    setup(): void;
    setupListeners(): void;
    removeListeners(): void;
    /** Update current tooltip position */
    updatePosition(): void;
    /** Show tooltip */
    show(): void;
    /** Hide tooltip */
    hide(): void;
    /** Change current options */
    change(options?: ITooltipOptions): void;
}
export {};
