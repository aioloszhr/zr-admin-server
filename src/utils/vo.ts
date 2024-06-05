export interface VO<T> extends Function {
	new (): T;
}

export function PickVO<T, k extends keyof T>(
	vo: VO<T>,
	keys: k[]
): VO<Pick<T, (typeof keys)[number]>> {
	const pickedVO: any = function () {};
	pickedVO.prototype = vo.prototype;
	return pickedVO as VO<Pick<T, (typeof keys)[number]>>;
}

export function OmitVO<T, K extends keyof T>(
	dto: VO<T>,
	keys: K[]
): VO<Omit<T, (typeof keys)[number]>> {
	const pickedVO: any = function () {};
	pickedVO.prototype = dto.prototype;
	return pickedVO as VO<Omit<T, (typeof keys)[number]>>;
}
