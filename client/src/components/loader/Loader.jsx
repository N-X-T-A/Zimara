import React from 'react';
import TruckBody from './TruckBody';
import TruckTires from './TruckTires';
import LampPost from './LampPost';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader w-100 h-100vh" style={{height:'100vh'}}>
      <div className="truckWrapper">
        <TruckBody />
        <TruckTires />
        <div className="road"></div>
        <LampPost />
      </div>
    </div>
  );
};

export default Loader;
