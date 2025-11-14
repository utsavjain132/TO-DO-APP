export const resetPasswordTemplate = (resetUrl: string) => {
  return `
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>This link will expire in 15 minutes.</p>
  `;
};
