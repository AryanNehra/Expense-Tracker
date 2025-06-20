import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        if (res.data.profilePhoto) {
          setPreviewUrl(res.data.profilePhoto);
        }
      } catch (err) {
        showNotification('Error fetching profile');
      }
    };
    fetchProfile();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('budget');
    navigate('/login');
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (user.newPhoto) {
        formData.append('profilePhoto', user.newPhoto);
      }

      const res = await axios.put('/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(res.data);
      showNotification('Profile updated!');
      setEditing(false);
    } catch (err) {
      showNotification(err.response?.data?.error || 'Profile update failed');
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) return;
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        '/profile/change-password',
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification('Password updated!');
      setNewPassword('');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Password update failed');
    }
    setPasswordLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Notification Box */}
      {notification && (
        <div className="absolute top-6 right-6 bg-white text-black px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeInOut">
          {notification}
        </div>
      )}

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        </div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md transition-all duration-500 hover:shadow-purple-500/25">
        {user ? (
          <>
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-6 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                {previewUrl || user?.profilePhoto ? (
                  <img
                    src={previewUrl || user.profilePhoto}
                    alt="Profile"
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-xl transition-all duration-300 group-hover:scale-105 opacity-0 animate-fade-in"
                    onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
                  />
                ) : (
                  <div className="relative w-32 h-32 rounded-full bg-white/20 border-4 border-white/30 shadow-xl flex items-center justify-center">
                    <User className="w-10 h-10 text-white/50" />
                  </div>
                )}
                {editing && (
                  <label className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setUser({ ...user, newPhoto: file });
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {editing ? (
                <div className="w-full space-y-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full text-lg font-medium text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/60 outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full text-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/60 outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                    {user.name}
                  </h2>
                  <p className="text-white/70 text-lg">{user.email}</p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              {editing ? (
                <>
                  <button onClick={handleUpdateProfile} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105">
                    Save Changes
                  </button>
                  <button onClick={() => setEditing(false)} className="w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105">
                  Edit Profile
                </button>
              )}

              {/* Password */}
              <div className="pt-6 border-t border-white/20 space-y-3">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 px-4 text-white placeholder-white/60 outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                />
                <button
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${passwordLoading
                    ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                    : 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-red-500/25'
                    }`}
                >
                  {passwordLoading ? 'Updating...' : 'Change Password'}
                </button>
              </div>

              {/* Navigation */}
              <div className="pt-4 space-y-3">
                <button onClick={handleLogout} className="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg transform hover:scale-105">
                  Logout
                </button>
                <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
                  Back to Dashboard
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-white/80 text-lg">Loading profile...</p>
          </div>
        )}
      </div>
    </div>
  );
}
