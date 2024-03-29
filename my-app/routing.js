import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}