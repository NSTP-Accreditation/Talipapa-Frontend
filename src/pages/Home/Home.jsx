import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <>
      {/* Breadcrumb */}
      <div style={{backgroundColor: '#f9fafb', padding: '0.75rem 1.5rem', borderBottom: '1px solid #e5e7eb'}}>
        <div style={{maxWidth: '80rem', margin: '0 auto'}}>
          <nav style={{fontSize: '0.875rem', color: '#4b5563'}}>
            <span>Home</span>
          </nav>
        </div>
      </div>
      
      <div className={styles.container}>
        <header className={styles.header}>
        <h1>Welcome to Talipapa Web</h1>
        <p>Your marketplace solution</p>
      </header>
      
      <main className={styles.main}>
        <section className={styles.hero}>
          <h2>Get Started</h2>
          <p>This is your home page. Start building your application here!</p>
        </section>
      </main>
      </div>
    </>
  );
};

export default Home;