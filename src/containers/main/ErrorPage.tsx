import '../../css/less/ErrorPage.css';
import {useRouteError, isRouteErrorResponse} from 'react-router-dom';

const ErrorPage = () => {
	const error: unknown = useRouteError();
	console.error(error);

	const getErrorMessage = () => {
		let errorMessage: string;
		if (isRouteErrorResponse(error)) {
			errorMessage = error.error?.message || error.statusText;
		} else if (error instanceof Error) {
			errorMessage = error.message;
		} else if (typeof error === 'string') {
			errorMessage = error;
		} else {
			console.error(error);
			errorMessage = 'Unknown error';
		}
		return errorMessage;
	};

	return (
		<div className={'ErrorPage'}>
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{getErrorMessage()}</i>
			</p>
		</div>
	);
};

export default ErrorPage;
