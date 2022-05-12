import { AxentixComponent, Component } from '../../utils/component';
interface IScrollSpyOptions {
    offset?: number;
    linkSelector?: string;
    classes?: string | Array<string>;
    auto?: {
        enabled?: boolean;
        classes?: string | Array<string>;
        selector?: string;
    };
}
export declare class ScrollSpy extends AxentixComponent implements Component {
    #private;
    static getDefaultOptions: () => IScrollSpyOptions;
    options: IScrollSpyOptions;
    constructor(element: string, options?: IScrollSpyOptions);
    setup(): void;
    setupListeners(): void;
    removeListeners(): void;
}
export {};
