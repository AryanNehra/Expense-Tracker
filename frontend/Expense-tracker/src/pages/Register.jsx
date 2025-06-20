import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Upload, Check, X, AlertCircle } from 'lucide-react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [photo, setPhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return checks;
  };

  const getPasswordStrength = (password) => {
    const checks = validatePassword(password);
    const score = Object.values(checks).filter(Boolean).length;
    if (score < 2) return { level: 'weak', color: 'bg-red-500', text: 'Weak' };
    if (score < 4) return { level: 'medium', color: 'bg-yellow-500', text: 'Medium' };
    return { level: 'strong', color: 'bg-green-500', text: 'Strong' };
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else {
      const checks = validatePassword(form.password);
      if (!checks.length || !checks.uppercase || !checks.lowercase || !checks.number) {
        newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'File size must be less than 5MB' });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, photo: 'Please select a valid image file' });
        return;
      }
      
      setPhoto(file);
      setErrors({ ...errors, photo: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('email', form.email.trim());
    formData.append('password', form.password);
    if (photo) formData.append('profilePhoto', photo);

    try {
      await axios.post('/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      localStorage.setItem('isNewUser', 'true');
      setShowSuccess(true);
      
      setForm({ name: '', email: '', password: '' });
      setPhoto(null);
      setTouched({});
      
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/login');
      }, 1000);
      
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.error || 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = form.password ? getPasswordStrength(form.password) : null;
  const passwordChecks = form.password ? validatePassword(form.password) : {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md relative">
        {/* Floating elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-200 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-60 animate-pulse"></div>
        
        <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 text-sm">Join us and start your journey</p>
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.name && touched.name
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-gray-200 focus:ring-purple-200 focus:border-purple-400'
                  }`}
                />
                {errors.name && touched.name && (
                  <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                )}
              </div>
              {errors.name && touched.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.email && touched.email
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-gray-200 focus:ring-purple-200 focus:border-purple-400'
                  }`}
                />
                {errors.email && touched.email && (
                  <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                )}
              </div>
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.password && touched.password
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'border-gray-200 focus:ring-purple-200 focus:border-purple-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-300 ${passwordStrength?.color} ${
                        passwordStrength?.level === 'weak' ? 'w-1/3' :
                        passwordStrength?.level === 'medium' ? 'w-2/3' : 'w-full'
                      }`}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{passwordStrength?.text}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries({
                      'At least 8 characters': passwordChecks.length,
                      'One uppercase letter': passwordChecks.uppercase,
                      'One lowercase letter': passwordChecks.lowercase,
                      'One number': passwordChecks.number
                    }).map(([label, valid]) => (
                      <div key={label} className={`flex items-center gap-1 transition-colors duration-200 ${valid ? 'text-green-600' : 'text-gray-400'}`}>
                        {valid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.password && touched.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo (Optional)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-purple-100 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                    {photo ? (
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-purple-400" />
                    )}
                  </div>
                  {photo && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 transform hover:scale-105">
                    <Upload className="w-4 h-4" />
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
                </div>
              </div>
              {errors.photo && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.photo}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-bounce">
              <Check className="w-5 h-5" />
              Account created successfully!
            </div>
          )}

          {/* Footer Links */}
          <div className="mt-8 space-y-4">
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors">
                Sign in here
              </Link>
            </div>

            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}