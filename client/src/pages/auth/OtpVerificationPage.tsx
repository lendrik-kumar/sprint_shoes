import React, { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { apiClient } from '@/api/client';

const OTP_LENGTH = 6;

const OtpVerificationPage: React.FC = memo(() => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
    const newOtp = [...Array(OTP_LENGTH).fill('')];
    digits.forEach((d, i) => { newOtp[i] = d; });
    setOtp(newOtp);
    inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) { setError('Enter all 6 digits'); return; }
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/phone/otp/verify', { otp: code });
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await apiClient.post('/auth/phone/otp/send', {});
      setResendTimer(60);
      setError(null);
    } catch {
      setError('Could not resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Your Phone</h1>
          <p className="text-gray-500 mt-1">
            Enter the 6-digit OTP sent to your registered phone number
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {success ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-xl font-bold text-green-600">Verified!</h2>
              <p className="text-gray-500 mt-1">Redirecting to your profile…</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                disabled={isLoading || otp.join('').length !== OTP_LENGTH}
                className="w-full py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying…
                  </span>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <p className="mt-4 text-sm text-gray-500">
                {resendTimer > 0 ? (
                  <>Resend in <span className="font-semibold text-orange-600">{resendTimer}s</span></>
                ) : (
                  <button onClick={handleResend} className="text-orange-600 font-medium hover:text-orange-700">
                    Resend OTP
                  </button>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
OtpVerificationPage.displayName = 'OtpVerificationPage';

export default OtpVerificationPage;
