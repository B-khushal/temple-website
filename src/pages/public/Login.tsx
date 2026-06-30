import React, { useState } from 'react';
import { useAuth, api } from '../../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { LogIn, HelpCircle, Mail, Lock, ShieldAlert } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!otpSent) {
        const data = await api.post('/api/auth/forgot-password', { email: forgotEmail });
        if (data.success) {
          setOtpSent(true);
          setSuccessMsg('OTP code sent to email successfully.');
        } else {
          setError(data.message || 'Failed to send OTP');
        }
      } else {
        const data = await api.post('/api/auth/reset-password', { email: forgotEmail, otp, newPassword });
        if (data.success) {
          setSuccessMsg('Password reset successful. You can log in now.');
          setTimeout(() => {
            setIsForgotMode(false);
            setOtpSent(false);
            setEmail(forgotEmail);
            setSuccessMsg('');
          }, 3000);
        } else {
          setError(data.message || 'Failed to reset password');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F7F1E5] px-4 py-16 font-serif">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur border-2 border-[#EEDCC1] shadow-2xl overflow-hidden rounded-2xl">
        <div className="h-4 bg-gradient-to-r from-[#9B2226] via-[#CFB53B] to-[#9B2226]"></div>
        
        <CardHeader className="pt-8 pb-4 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#FF8C00, #F9A825, #FF8C00)', border: '2px solid #CFB53B' }}>
            <span className="text-white font-bold text-3xl">ॐ</span>
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-[#9B2226]">
            Sri Durga Mata Temple
          </h2>
          <h3 className="text-sm font-bold text-[#F9A825] mt-1">శ్రీశ్రీశ్రీ దుర్గా మాత ఆలయం</h3>
          <p className="text-[10px] text-gray-500 tracking-[0.15em] uppercase font-sans mt-2">
            {isForgotMode ? 'Password Reset Portal' : 'Enterprise Administration Sign In'}
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-4">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded-lg flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-sans rounded-lg">
              {successMsg}
            </div>
          )}

          {!isForgotMode ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5 font-sans">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@sridurgamatatemple.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-[#EEDCC1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#FDFBF7]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="text-[11px] text-[#9B2226] hover:underline font-bold"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-[#EEDCC1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#FDFBF7]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 mt-4 bg-[#9B2226] hover:bg-[#7a181b] text-white rounded-lg flex justify-center items-center gap-2 font-bold tracking-widest text-xs uppercase"
              >
                <LogIn className="w-4 h-4" /> {loading ? 'Signing In...' : 'Verify & Enter'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-5 font-sans">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Admin Email</label>
                <input
                  type="email"
                  required
                  disabled={otpSent}
                  placeholder="admin@sridurgamatatemple.org"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#EEDCC1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#FDFBF7]"
                />
              </div>

              {otpSent && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Enter 6-digit OTP</label>
                    <input
                      type="text"
                      required
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EEDCC1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#FDFBF7] tracking-[0.2em] text-center font-bold font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">New Secure Password</label>
                    <input
                      type="password"
                      required
                      placeholder="New password (min 8 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EEDCC1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#FDFBF7]"
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 mt-4 bg-[#9B2226] hover:bg-[#7a181b] text-white rounded-lg flex justify-center items-center gap-2 font-bold tracking-widest text-xs uppercase"
              >
                {loading ? 'Processing...' : otpSent ? 'Reset Password' : 'Send Reset Link (OTP)'}
              </Button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(false);
                    setOtpSent(false);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-[#9B2226] hover:underline font-bold"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default Login;
