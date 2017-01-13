import React from 'react';

const date = new Date();
const Footer = () => (
  <footer className="app__footer">
    <div className="app__container">
      <div>
        <i className="i-creative-commons" />
        <span>{`${date.getFullYear()} django-golem`}</span>
      </div>
    </div>
  </footer>
);

export default Footer;
