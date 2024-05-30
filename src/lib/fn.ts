export const groupBy = <T, R>(f: (x: T) => R, xs: Array<T>): Array<Array<T>> => {
	if (xs.length === 0) {
		return [];
	}

	const [y, ...ys] = xs;
	const index = ys.findIndex(item => f(item) !== f(y));

	if (index === -1) {
		return [xs];
	}
	else if (index === 0) {
		return [[y], ...groupBy(f, ys)];
	}

	const ps1 = ys.slice(0, index);
	const ps2 = ys.slice(index, ys.length);
	return [[y, ...ps1], ...groupBy(f, ps2)];
};
