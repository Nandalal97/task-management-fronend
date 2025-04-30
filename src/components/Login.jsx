import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ phone: "", password: "" });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("https://taskmanagement-15uh.onrender.com/api/v1/auth/login", formData);
            if (response.data.status === 1) {
                // alert("Login successful");
                console.log(response.data);
                // Save token or redirect here
              } else {
                setError(response.data.msg || "Invalid credentials");
              }
            const { status, msg, access_token } = response.data;

            if (response.data.status === 1) {
                try {
                    // Try to set cookie
                    document.cookie = `token=${access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;
                    const cookieSet = document.cookie.includes("token=");
                    if (!cookieSet) {
                        sessionStorage.setItem("token", access_token);
                    }
                } catch (cookieError) {
                    sessionStorage.setItem("token", access_token);
                }
                Swal.fire({
                    icon: 'success',
                    // title: 'Login Successful',
                    text: response.data.msg,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    toast: true,
                    confirmButtonColor: '#3085d6',
                }).then(() => {
                    // Redirect after toast disappears
                    navigate("/");
                  });
            };
            if (response.data.status === 0) {

                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: response.data.msg || 'Invalid login credentials',
                    position: 'top-end',
                    showConfirmButton: false,
                    toast: true,
                    confirmButtonColor: '#d33',
                    timer: 20000,
                });
            }
        } catch (err) {
            // Handle server error
            // console.log('Error:', err.response.data);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.response.data.msg || 'Invalid login credentials',
                position: 'top-end',
                showConfirmButton: false,
                toast: true, 
                confirmButtonColor: '#d33',
                timerProgressBar: true,
                timer: 2000,
            });
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h4 className="text-center mb-4">Login</h4>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            className="form-control"
                            placeholder="Enter phone number"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        <i className="fas fa-sign-in-alt me-2"></i>Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
