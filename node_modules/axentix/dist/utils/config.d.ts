export { version } from '../../package.json';
interface RegisterElement {
    name: string;
    dataDetection?: boolean;
    autoInit?: {
        enabled?: boolean;
        selector?: string;
    };
    class: any;
}
export declare const instances: any[];
interface Config {
    components: Array<RegisterElement>;
    plugins: Array<RegisterElement>;
    prefix: string;
    mode: '' | 'prefixed';
}
export declare const config: Config;
export declare const getCssVar: (variable: string) => string;
export declare const getComponentClass: (component: string) => any;
export declare const getDataElements: () => string[];
export declare const getAutoInitElements: () => {};
export declare const registerComponent: (component: RegisterElement) => void;
export declare const registerPlugin: (plugin: RegisterElement) => void;
export declare const exportToWindow: () => void;
