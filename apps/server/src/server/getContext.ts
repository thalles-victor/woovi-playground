import { getDataloaders } from '../modules/loader/loaderRegister';

const getContext = (req?: any) => {
	const dataloaders = getDataloaders();
	const headers = req?.headers;

	return {
		dataloaders,
		headers
	} as const;
};

export { getContext };
