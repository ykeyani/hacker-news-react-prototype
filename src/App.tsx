import React from 'react';
import './App.scss';
import NewsList from "./NewsList";

function App() {
  return (
      <div className="App">
        <header>
          <h1>Hacker News</h1>
        </header>
        <main>
          <NewsList />
        </main>
      </div>
  );
}

export default App;
