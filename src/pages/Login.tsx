import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';  

function Login() {
const [email, setEmail] = useState('');
const [inputError, setInputError] = useState<string | null>(null);
const navigate = useNavigate();

const handleOnClick =()=>{
    console.log("valor de email: " + email);
}
const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  navigate('/');
}
const handleOnBlur = () => {
    if(email.includes('@')) {
        setInputError(null);
    } else{
        setInputError('Correo invalido.');
    }
}
    return (
        <div 
            className="d-flex align-items-center justify-content-center" 
            style={{ height: '100vh' }}>
            <div className="card p-4" style={{ width: '300px' }}>
                <h2 className="text-center mb-3"> Iniciar Sesion</h2>
                <form onSubmit={handleOnSubmit}>
                    <input
                        type="email"
                        className="form-control mb-3"
                        placeholder="Ingrese su correo"
                        value={email}
                        onChange={(event) => { setEmail(event.target.value)}} 
                        onBlur={handleOnBlur}
                        />
                   { inputError && <div className="text-danger mb-3">{inputError}</div>}
                    <button
                        className="btn btn-primary w-100"
                        type="submit"
                        onClick={handleOnClick}
                        >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>

    );
}

export default Login;