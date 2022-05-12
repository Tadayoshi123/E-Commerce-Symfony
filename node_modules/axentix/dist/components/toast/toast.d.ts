interface IToastOptions {
    animationDuration?: number;
    duration?: number;
    classes?: string;
    position?: 'right' | 'left';
    direction?: 'top' | 'bottom';
    mobileDirection?: 'bottom' | 'top';
    offset?: {
        x?: string;
        y?: string;
        mobileX?: string;
        mobileY?: string;
    };
    isClosable?: boolean;
    closableContent?: string;
    loading?: {
        enabled?: boolean;
        border?: string;
    };
}
export declare class Toast {
    #private;
    static getDefaultOptions: () => IToastOptions;
    options: IToastOptions;
    id: string;
    constructor(content: string, options?: IToastOptions);
    destroy(): void;
    /** Showing the toast */
    show(): void;
    /** Change */
    change(content: string, options?: IToastOptions): void;
}
export {};
