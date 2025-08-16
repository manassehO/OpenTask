// // ~/lib/client-otp.ts
// type SendOTPResponse = {
//   success: boolean;
//   message?: string;
//   error?: string;
// };

// // Send OTP client function
// export async function sendOTPClient(email: string): Promise<SendOTPResponse> {
//   const res = await fetch('/api/send-otp', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email }),
//   });
//   if (!res.ok) {
//     const body = (await res.json().catch(() => ({}))) as { error?: string };
//     throw new Error(body?.error ?? 'Failed to send OTP');
//   }
//   const response = (await res.json()) as SendOTPResponse;
//   return response;
// }

// // Verify OTP client function
// export async function verifyOTPClient(
//   email: string,
//   otp: string,
// ): Promise<boolean> {
//   const res = await fetch('/api/verify-otp', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, otp }),
//   });
//   if (!res.ok) {
//     const body = (await res.json().catch(() => ({}))) as { error?: string };
//     throw new Error(body?.error ?? 'Failed to verify OTP');
//   }
//   const body = (await res.json()) as { valid?: boolean };
//   return body.valid === true;
// }



// lib/client-otp.ts
type OTPResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function sendOTPClient(email: string): Promise<OTPResponse> {
  try {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    const data = (await res.json()) as OTPResponse;
    return data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function verifyOTPClient(email: string, otp: string): Promise<boolean> {
  try {
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    
    if (!res.ok) return false;
    
    const data = (await res.json()) as { valid?: boolean };
    return data.valid === true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
}