import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()
    const { signin } = useContext(AuthContext)

    const onSubmit = async (data) => {
        try {
            const res = await api.post('/auth/signin', {
                email: data.email,
                password: data.password
            });

            signin(res.data.token);
            navigate('/');
        } catch (err) {
            console.error(err.response?.data || err);
            alert('Invalid credentials');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Sign In</h2>
                <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                    <input
                        style={styles.input}
                        {...register('email', { required: true })}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <input
                        style={styles.input}
                        {...register('password', { required: true })}
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <button style={styles.button}>Sign In</button>
                </form>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        background: '#f4f4f8',
        padding: '20px',
    },
    card: {
        width: '100%',
        maxWidth: '420px',
        background: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    },
    title: {
        textAlign: 'center',
        marginBottom: '24px',
        fontSize: '24px',
        fontWeight: '600',
        color: '#4b0082',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    input: {
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
        transition: 'border 0.2s, box-shadow 0.2s',
    },
    button: {
        padding: '10px 14px',
        border: 'none',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #916aff, #5a0db2)',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        boxShadow: '0 6px 14px rgba(75, 0, 130, 0.25)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
}
