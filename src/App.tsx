import './App.css';
import Cellphone from './components/Celphone';

function App() {
  return (
    <>
      <div
        style={{
          width: '100vw',
          height: '70vh',
          display: 'grid',
          placeContent: 'center',
          gap: '10px',
        }}
      >
        <Cellphone />
      </div>
    </>
  );
}

export default App;
