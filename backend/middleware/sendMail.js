import { createTransport } from "nodemailer"; //send otp on email
const sendMail = async (email, subject, data) => {
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.Gmail,
            pass: process.env.Password
        }
    })

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: red;
        }
        p {
            margin-bottom: 20px;
            color: #666;
        }
        .otp {
            font-size: 36px;
            color:rgb(6, 193, 118); /* Purple text */
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${data.name} your (One-Time Password) for your account verification is.</p>
        <p class="otp">${data.otp}</p> 
    </div>
</body>
</html>
`;

    await transport.sendMail({
        from: process.env.Gmail,
        to: email,
        subject,
        html
    })
}


///---------------------------

export const sendForgotMail = async (subject, data) => {
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.Gmail,
            pass: process.env.Password,
        },
    });

    const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Your OTP Code</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f3f3f3;
        padding: 20px;
      }
      .container {
        background-color: #fff;
        padding: 30px;
        max-width: 600px;
        margin: auto;
        border-radius: 8px;
        box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
      }
      h2 {
        color: #5a2d82;
      }
      p {
        font-size: 16px;
        color: #555;
      }
      .otp {
        font-size: 28px;
        font-weight: bold;
        color: #5a2d82;
        margin: 20px 0;
        text-align: center;
        letter-spacing: 4px;
      }
      .footer {
        margin-top: 30px;
        font-size: 14px;
        text-align: center;
        color: #aaa;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>OTP to Reset Your Password</h2>
      <p>Hello,</p>
      <p>You requested to reset your password. Use the OTP below to proceed:</p>
      <div class="otp">${data.otp}</div>
      <p>This OTP is valid for only 5 minutes. If you did not make this request, please ignore this email.</p>
      <div class="footer">
        <p>© ${new Date().getFullYear()} E-Learning Platform</p>
      </div>
    </div>
  </body>
  </html>
  `;

    await transport.sendMail({
        from: process.env.Gmail,
        to: data.email,
        subject,
        html,
    });
};


export default sendMail;