import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Editor from './pages/Editor';
import NotFound from './pages/NotFound';
import Templates from './pages/Templates';

function App() {
    return (
        <ThemeProvider>
            <ResumeProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/templates" element={<Templates />} />
                        <Route path="/editor" element={<Editor />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </ResumeProvider>
        </ThemeProvider>
    );
}

export default App;



