import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
            <h1 className="text-9xl font-bold text-primary/20">404</h1>
            <h2 className="text-3xl font-bold text-slate-800 mt-4">Page Not Found</h2>
            <p className="text-slate-600 mt-2 mb-8">The page you are looking for doesn't exist or has been moved.</p>
            <Link to="/" className="btn-primary">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
