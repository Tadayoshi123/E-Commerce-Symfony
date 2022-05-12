import { AxentixComponent, Component } from '../../utils/component';
interface ISelectOptions {
    inputClasses?: string;
}
export declare class Select extends AxentixComponent implements Component {
    #private;
    static getDefaultOptions: () => ISelectOptions;
    el: HTMLSelectElement;
    options: ISelectOptions;
    constructor(element: string, options?: ISelectOptions);
    setup(): void;
    reset(): void;
    destroy(withoutSuperCall?: boolean): void;
}
export {};
