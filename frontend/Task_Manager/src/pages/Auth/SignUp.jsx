import React from 'react';
import AuthLayout from '../../components/layout/AuthLayout';
import AuthHeader from '../../components/layout/AuthHeader';
import Input from '../../components/inputs/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [inviteToken, setInviteToken] = React.useState('');

  const navigate = useNavigate();
  const [profilePreview, setProfilePreview] = React.useState(null);
  const [errors, setErrors] = React.useState({
    fullName: '',
    email: '',
    password: '',
    inviteToken: '',
  });
  const [apiError, setApiError] = React.useState('');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfilePreview(null);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setApiError('');

    const nextErrors = {
      fullName: '',
      email: '',
      password: '',
      inviteToken: '',
    };
    let hasError = false;

    if (!fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name';
      hasError = true;
    }

    if (!validateEmail(email)) {
      nextErrors.email = 'Please enter a valid email address';
      hasError = true;
    }

    if (!password) {
      nextErrors.password = 'Please enter your password';
      hasError = true;
    }

    setErrors(nextErrors);
    if (hasError) {
      return;
    }

    try {
      const payload = {
        name: fullName,
        email,
        password,
        ...(inviteToken ? { adminInviteToken: inviteToken } : {}),
      };

      await axiosInstance.post(API_PATHS.AUTH.REGISTER, payload);
      navigate('/login');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to signup. Please try again.';
      setApiError(message);
    }
  };

  const formErrors = Object.values(errors).filter(Boolean);

  return (
    <AuthLayout>
      <div className="w-full max-w-xl h-full flex items-start justify-center px-3 sm:px-4 py-4 overflow-y-auto">
        <Card className="w-full overflow-hidden">
          <div className="p-5 md:p-6">
            <AuthHeader
              title="Create Account"
              subtitle="Join us today by entering your details below."
            />

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid gap-4">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Profile Image</p>
                      <p className="text-xs text-slate-500 mt-1">Upload an avatar for your profile.</p>
                    </div>
                    {profilePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-sm text-red-600 transition hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <label className="mt-4 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white text-center text-slate-500 transition hover:border-blue-400 hover:text-blue-600">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Selected profile"
                        className="h-full w-full rounded-3xl object-cover"
                      />
                    ) : (
                      <>
                        <span className="text-base font-medium">Click to upload a profile image</span>
                        <span className="text-xs text-slate-400 mt-2">PNG, JPG, GIF up to 5MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Full Name"
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={errors.fullName}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="johndoe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    showToggle
                  />

                  <Input
                    label="Admin Invite Token (optional)"
                    type="text"
                    name="inviteToken"
                    placeholder="Enter invite token if you have one"
                    value={inviteToken}
                    onChange={(e) => setInviteToken(e.target.value)}
                    error={errors.inviteToken}
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full py-4 text-base">
                Signup
              </Button>

              {formErrors.length > 0 && (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mt-4">
                  {formErrors.map((message, index) => (
                    <p key={index}>{message}</p>
                  ))}
                </div>
              )}

              {apiError && (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mt-4">
                  <p>{apiError}</p>
                </div>
              )}

              <p className="text-sm text-slate-600 dark:text-slate-200 text-center mt-3">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 dark:text-cyan-300 hover:underline">
                  Login
                </a>
              </p>
            </form>
          </div>
        </Card>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
