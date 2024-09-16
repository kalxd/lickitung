interface ReaderResult<R> {
	run: () => R;
}

interface Reader<T, R> {
	(env: Readonly<T>): ReaderResult<R>;
}

interface ReaderHelper<T> {
	ask: () => Readonly<T>;
	bindFrom: <A>(reader: Reader<T, A>) => A;
}

export const reader = <T, R>(action: (helper: ReaderHelper<T>) => R): Reader<T, R> => {
	return env => {
		const helper: ReaderHelper<T> = {
			ask: () => env,
			bindFrom: r => r(env).run()
		};

		const run: ReaderResult<R>["run"] = () =>
			action(helper);

		return {
			run
		};
	};
};

export const runReader = <T, R>(reader: Reader<T, R>, r: Readonly<T>): R => {
	const result = reader(r);
	return result.run();
};
