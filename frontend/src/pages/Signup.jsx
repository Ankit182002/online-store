import React from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()

    const onSubmit = data => {
        api.post('/auth/signup', data)
            .then(() => {
                alert('Account created. Please sign in')
                navigate('/login')
            })
            .catch(err => alert('Error creating account'))
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                    <input
                        style={styles.input}
                        {...register('name')}
                        placeholder="Full Name"
                        required
                    />
                    <input
                        style={styles.input}
                        {...register('email')}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        {...register('password')}
                        placeholder="Password"
                        required
                    />
                    <button style={styles.button}>Create Account</button>
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
        transition: 'border 0.2s',
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
