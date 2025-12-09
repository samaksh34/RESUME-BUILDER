import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import Home from './pages/Home';
import Editor from './pages/Editor';
import NotFound from './pages/NotFound';

function App() {
    return (
        <ResumeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/editor" element={<Editor />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </ResumeProvider>
    );
}

export default App;

