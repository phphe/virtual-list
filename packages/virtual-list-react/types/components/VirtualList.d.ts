import React, { ReactNode } from 'react';
export declare type Props<ITEM> = {
    items: ITEM[];
    disabled?: boolean;
    horizontal?: boolean;
    itemKey?: (item: ITEM, index: number) => number | string;
    itemSize?: (item: ITEM, index: number) => number | null | undefined;
    table?: boolean;
    prepend?: ReactNode;
    append?: ReactNode;
    node?: (item: ITEM, index: number, key: string) => ReactNode;
} & typeof defaultProps;
export declare const defaultProps: {
    firstRender: number;
    buffer: number;
};
export declare function VirtualList<ITEM>(props: Props<ITEM> & React.HTMLProps<HTMLElement>): JSX.Element;
export declare namespace VirtualList {
    var defaultProps: {
        firstRender: number;
        buffer: number;
    };
}
