import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./Dashboard";
import AddExpense from './AddExpense';  
import AddCategory from './AddCategory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/add-category" element={<AddCategory />} />
      </Routes>
    </Router>
  );
}

export default App;
