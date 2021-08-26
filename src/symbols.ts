import { updateItemType, removeItemType, handleShowType } from './types';
import { InjectionKey } from 'vue';

export const updateItemKey: InjectionKey<updateItemType> = Symbol();

export const removeItemKey: InjectionKey<removeItemType> = Symbol();

export const handleShowKey: InjectionKey<handleShowType> = Symbol();
