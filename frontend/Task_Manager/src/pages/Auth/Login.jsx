import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../../components/layout/AuthLayout';
import AuthHeader from '../../components/layout/AuthHeader';
import Input from '../../components/inputs/Input';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [errors, setErrors] = React.useState({
    email: '',
    password: '',
  });

  const [apiError, setApiError] = React.useState('');

  const handleLogin = async (e) => {

    e.preventDefault();

    setApiError('');

    const nextErrors = {
      email: '',
      password: '',
    };

    let hasError = false;

    if (!validateEmail(email)) {
      nextErrors.email = 'Please enter a valid email address';
      hasError = true;
    }

    if (!password) {
      nextErrors.password = 'Please enter your password';
      hasError = true;
    }

    setErrors(nextErrors);

    if (hasError) return;

    try {

      const response = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN,
        {
          email,
          password,
        }
      );

      const { token, role } = response.data;

      if (token) {

        localStorage.setItem('token', token);

        updateUser(response.data);

        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }

    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred. Please try again.';
      setApiError(message);
    }
  };

  const formErrors = Object.values(errors).filter(Boolean);

  return (
    <AuthLayout>

      <div className="w-full max-w-md h-full flex items-center justify-center px-4 sm:px-6">

        <Card className="w-full overflow-hidden">

          <div className="p-6 md:p-8">

            <AuthHeader
              title="Welcome Back"
              subtitle="Enter your details to login to your account."
            />

            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-5"
            >

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                error={errors.email}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                error={errors.password}
                showToggle
              />

              <Button type="submit" variant="primary" className="w-full py-3 text-base">
                Login
              </Button>

              {(formErrors.length > 0 || apiError) && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                  {formErrors.map((message, index) => (
                    <p key={index}>
                      {message}
                    </p>
                  ))}

                  {apiError && (
                    <p>{apiError}</p>
                  )}

                </div>
              )}

              <p className="text-sm text-slate-600 dark:text-slate-200 text-center mt-2">

                Don't have an account?{' '}

                <Link
                  to="/signup"
                  className="text-blue-600 dark:text-cyan-300 hover:text-blue-500 hover:underline"
                >
                  Signup
                </Link>

              </p>

            </form>

          </div>

        </Card>

      </div>

    </AuthLayout>
  );
};

export default Login;