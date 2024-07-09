exports.generateResetEmail = (resetUrl) => {
    return `
      <p>You requested a password reset.</p>
      <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;
  };
  