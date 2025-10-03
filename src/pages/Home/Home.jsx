import React from 'react';
import styles from './Home.module.css';

const Home = () => {
  return (
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
  );
};

export default Home;