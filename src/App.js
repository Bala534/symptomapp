import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatGpt from './ChatGpt';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/' element={<ChatGpt/>} />
          {/* <Route path='/getdata' element={<GetData/>} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
