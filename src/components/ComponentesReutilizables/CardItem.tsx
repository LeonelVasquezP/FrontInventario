import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/CardItems.css';

interface CardItemProps {
  icon: string;
  label: string;
  value: number;
  path: string;
  bg: string;
}

const CardItem: React.FC<CardItemProps> = ({ icon, label, value, path, bg }) => {
  return (
    <div className="col-md-3">
      <Link to={path} className="text-decoration-none">
        <div className={`card card-dashboard ${bg} h-100`}>
          <div className="card-body d-flex flex-column align-items-center text-center">
            <i className={`bi ${icon} icon`}></i>
            <h5 className="card-title">{label}</h5>
            <p className="fs-4 fw-semibold">{value}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardItem;