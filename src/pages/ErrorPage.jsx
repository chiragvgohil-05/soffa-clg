// pages/ErrorPage.jsx
import { Link, useLocation } from 'react-router-dom';
import '../styles/ErrorPage.css';

const ErrorPage = ({ errorCode, errorMessage }) => {
    const location = useLocation();

    // Extract error info from location state or props
    const status = errorCode || location.state?.errorCode || 404;
    const message = errorMessage || location.state?.errorMessage || 'Page not found';

    // Error messages based on status code
    const getErrorTitle = () => {
        switch(status) {
            case 404:
                return "Page Not Found";
            case 403:
                return "Access Denied";
            case 401:
                return "Unauthorized";
            case 500:
                return "Server Error";
            default:
                return "Oops! Something went wrong";
        }
    };

    const getErrorDescription = () => {
        switch(status) {
            case 404:
                return "The page you're looking for doesn't exist or has been moved.";
            case 403:
                return "You don't have permission to access this page.";
            case 401:
                return "You need to be logged in to access this page.";
            case 500:
                return "Our server encountered an error. Please try again later.";
            default:
                return message;
        }
    };

    return (
        <div className="error-container">
            <div className="error-content">
                <div className="error-graphic">
                    <div className="error-number">{status}</div>
                    <div className="error-icon">⚠️</div>
                </div>
                <h1 className="error-title">{getErrorTitle()}</h1>
                <p className="error-description">{getErrorDescription()}</p>
                <div className="error-actions">
                    <Link to="/" className="btn btn-primary">
                        Go Home
                    </Link>
                    <button
                        className="btn btn-secondary"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;