import './App.css';
import Bridge from './components/bridge';
import { TEST } from './utils/addresses';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="uppercase text-center">MKC bridge{TEST ? ' (TEST VERSION)' : ''}</h1>
        <Bridge />
      </header>
    </div>
  );
}

export default App;
