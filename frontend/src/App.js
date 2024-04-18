import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UserManager from './components/UserManager';
import DatabaseManager from './components/DatabaseManager';
import MovieImporter from './components/MovieImporter';
import TopBar from './components/TopBar';


function MainPage() {
  return (
    <div>
      <h1>Welcome!</h1>
      <p>Please select one of the following options:</p>
      <ul>
        <li><Link to="/import">Movie Importer</Link></li>
        <li><Link to="/user">User Manager</Link></li>
        <li><Link to="/database-manager">Database Manager</Link></li>
      </ul>
    </div>
  );
}


function App() {
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/user" element={<UserManager />} />
        <Route path="/import" element={<MovieImporter />} />
        <Route path="/database-manager" element={<DatabaseManager />} />
      </Routes>
    </Router>
  );
}

export default App;
