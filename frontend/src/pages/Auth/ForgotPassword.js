import React, { useState } from 'react';
import Layout from './../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();
    const newPassword = watch('newPassword');
    const [showPassword, setShowPassword] = useState(false)

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:8080/api/auth/forgot-password', data);
            console.log(`Updated Password: ${data.newPassword}`);
            if (res && res.data.success) {
                console.log(res.data);
                toast.success(res.data.message);
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                // Handle server errors
                toast.error(error.response.data.message || 'Server error occurred');
            } else if (error.request) {
                // Handle network errors
                toast.error('Network error occurred');
            } else {
                // Handle other errors
                toast.error('An error occurred');
            }
        }
    };
    document.title = 'Play Store - Reset Password'
    return (
        <>
            <Layout title={'Forgot Password - Ecommerce APP'}>
                <div className='container mt-5'>
                    <div className='row justify-content-center'>
                        <div className='col-md-5'>
                            <div className='card'>
                                <div className='card-header text-center'>
                                    <img src={require('../../Images/google-play.png')} alt='' className='logo' />
                                    <h4>Reset Password</h4>
                                </div>
                                <div className='card-body'>
                                    <form onSubmit={handleSubmit(onSubmit)} id='forgotPasswordForm'>
                                        <div className='mb-3'>
                                            <label htmlFor='email' className='form-label'>Enter your Email</label>
                                            <input
                                                type='email'
                                                {...register('email', { required: 'Email is required' })}
                                                className='form-control'
                                                id='email'
                                                placeholder='Enter Your Email'
                                            />
                                            {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='dateOfBirth' className='form-label'>Enter your DoB?</label>
                                            <input
                                                type='text'
                                                {...register('answer', { required: 'Answer is required' })}
                                                className='form-control'
                                                id='dateOfBirth'
                                                placeholder='Enter Your Correct Date Of Birth'
                                            />
                                            {errors.answer && <p style={{ color: 'red' }}>{errors.answer.message}</p>}
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='newPassword' className='form-label'>Set a new Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    {...register('newPassword', {
                                                        required: 'Password is required',
                                                        minLength: {
                                                            value: 8,
                                                            message: 'Password should be at least 8 characters',
                                                        },
                                                    })}
                                                    className='form-control'
                                                    id='newPassword'
                                                    placeholder='Enter Your New Password'
                                                />
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                                </button>
                                            </div>
                                            {errors.newPassword && <p style={{ color: 'red' }}>{errors.newPassword.message}</p>}
                                        </div>
                                        <div className='mb-3'>
                                            <label htmlFor='confirmPassword' className='form-label'>Confirm New Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    {...register('confirmPassword', {
                                                        required: 'Confirm password is required',
                                                        validate: (value) => value === newPassword || 'Passwords do not match',
                                                    })}
                                                    className='form-control'
                                                    id='confirmPassword'
                                                    placeholder='Confirm Your New Password'
                                                />
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}
                                        </div>
                                        <button type='submit' className='btn btn-primary w-100'>
                                            Reset Password
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default ForgotPassword;
