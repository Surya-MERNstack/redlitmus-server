const UserRegistration = require("../Models/UserRegistration");
const { sendMail } = require("../Controller/SendMail");
const bcrypt = require("bcryptjs");

async function ForgetPassword(email) {
  try {
    const user = await UserRegistration.findOne({ email });
    if (user) {
      user.forgetPassword = {};
      const otp = generateOTP();
      const salt = await bcrypt.genSalt(10);
      const hashedOTP = await bcrypt.hash(otp, salt);
      user.forgetPassword = {
        time: new Date(),
        otp: hashedOTP,
      };
      await user.save();
      const content = `
        <h4>Hi there,</h4>
        <p>Your OTP is: ${otp}</p>
        <p><b>Regards</b>,</p>
        <P> Swiggy</p>
      `;
      sendMail(email, "Forget Password - OTP", content);
    }
    return true;
  } catch (error) {
    return "Server busy";
  }
}

function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}
async function NewPassword(email, otp, newPassword) {
  try {
    const user = await UserRegistration.findOne({ email });
    if (user) {
      const validOTP = await bcrypt.compare(otp, user.forgetPassword.otp  );
      if (validOTP) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.forgetPassword = {};
        user.password = hashedPassword;
        await user.save();
        const content = `
        <h4>Hi there,</h4>
        <p>Password changed successfully</p>
        <p><b>Regards</b>,</p>
        <P>Swiggy </p>
      `;
        sendMail(email, "New Password", content);
        return true;
      } else {
        return "Invalid OTP";
      }
    } else {
      return "Invalid User";
    }
  } catch (error) {
    return "Invalid User";
  }
}
module.exports = { ForgetPassword, NewPassword };
