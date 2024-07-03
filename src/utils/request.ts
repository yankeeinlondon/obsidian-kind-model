/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyFunction } from "inferred-types";
import type {Request, Response, CoreOptions, RequestCallback} from "request";

/**
 * Provides the globally available [Request API](https://github.com/request/request).
 */
export const globalRequest = (globalThis as any).request as {
	get<TRequest extends Promise<string>, TOptions extends CoreOptions>(
		uri: string, 
		options?: TOptions, 
		callback?: RequestCallback
	): TRequest;
	on: (evt: string, cb: AnyFunction) => void;
	put<TRequest extends Request, TOptions extends CoreOptions>(
		uri: string, 
		options?: TOptions, 
		callback?: RequestCallback
	): TRequest;
	post<TRequest extends Request, TOptions extends CoreOptions>(
		uri: string, 
		options?: TOptions, 
		callback?: RequestCallback
	): TRequest;
	head<TRequest extends Request, TOptions extends CoreOptions>(
		uri: string, 
		options?: TOptions, 
		callback?: RequestCallback
	): TRequest;
	patch<TRequest extends Request, TOptions extends CoreOptions>(
		uri: string, 
		options?: TOptions, 
		callback?: RequestCallback
	): TRequest;
	delete<TRequest extends Request, TOptions extends CoreOptions>(
		uri: string, 
		options?: TOptions, 
		callback?: RequestCallback
	): TRequest;

} & (
	(request: Request) => Response
);


// findParent: <E extends string | undefined>(
// 	sel: string,
// 	errorMsg?: E
//   ): undefined extends E ? IElement | null : IElement  => {
// 	let el = rootNode as IElement;
// 	while(el.parentElement && !el.parentElement.matches(sel)) {
// 	  el = el.parentElement as IElement;
// 	}
// 	if(el.matches(sel)) {
// 	  return el as IElement;
// 	} else if(errorMsg) {
// 	  throw new HappyMishap(
// 		`${errorMsg}.\n\nThe HTML ${toHtml(rootNode)}`,
// 		{ name: "select.findParent()", inspect: rootNode }
// 	  );
// 	} else {
// 	  return null as undefined extends E ? IElement | null : IElement ;
// 	}
//   },
