import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import CardItem from '../../components/ComponentesReutilizables/CardItem';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const resumen = [
    { icon: 'bi-box-seam', label: 'Productos', value: 150, bg: 'bg-productos', path: '/productos' },
    { icon: 'bi-cart', label: 'Compras', value: 78, bg: 'bg-compras', path: '/compras' },
    { icon: 'bi-person', label: 'Clientes', value: 94, bg: 'bg-clientes', path: '/clientes' },
    { icon: 'bi-truck', label: 'Pedidos', value: 26, bg: 'bg-pedidos', path: '/pedidos' },
  ];

  const chartCompras = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Compras Mensuales',
        data: [1200, 1500, 1400, 1800, 1600, 1900],
        backgroundColor: '#0d6efd',
      },
    ],
  };

  const chartClientes = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Clientes Nuevos',
        data: [10, 15, 12, 20, 18, 25],
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.2)',
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3 fw-bold">
        <i className="bi bi-speedometer2 me-2"></i>Dashboard General
      </h4>

      <div className="row g-4 mb-4">
        {resumen.map((card, idx) => (
          <CardItem key={idx} {...card} />
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title mb-3">Compras por Mes</h5>
              <Bar data={chartCompras} />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title mb-3">Clientes Nuevos</h5>
              <Line data={chartClientes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
