import { UpdateItemType, RemoveItemType, HandleShowType } from './types';
import { InjectionKey } from 'vue';

export const updateItemKey: InjectionKey<UpdateItemType> = Symbol();

export const removeItemKey: InjectionKey<RemoveItemType> = Symbol();

export const handleShowKey: InjectionKey<HandleShowType> = Symbol();
