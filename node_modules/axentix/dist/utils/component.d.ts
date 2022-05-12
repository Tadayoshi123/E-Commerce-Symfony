export interface Component {
    el: HTMLElement;
    /** Synchronize all listeners */
    sync(): void;
    /** Reset component */
    reset(): void;
    /** Destroy component */
    destroy(): void;
    removeListeners(): void;
    setupListeners(): void;
    setup(): void;
}
export declare class AxentixComponent {
    el: HTMLElement;
    removeListeners(): void;
    setupListeners(): void;
    setup(): void;
    preventDbInstance(element: string): void;
    sync(): void;
    reset(): void;
    destroy(): void;
}
