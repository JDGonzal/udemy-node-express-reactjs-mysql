const nodemailer = require("nodemailer");

function messageMail(email, urlRoute, iPos) {
  const aMessage=[`<div>
	<tr>
      <td>
        <div style="background-size: initial !important; background-repeat: initial !important; background-attachment: initial !important; background-origin: initial !important; background-clip: initial !important; background-color: rgba(255, 255, 255, 1) !important; border-radius: 6px; max-width: 800px; min-width: 600px; padding: 20px 30px">
          <div style="width: 100%; padding: 10px 0; text-align: center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
			  <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
			  <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
			</svg>
          </div>
          <div style="width: 100%; height: 1px; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgba(215, 222, 234, 1)"></div>
          <div style="text-align: center">
            <h2 style="font-size: 18px; color: rgba(0, 104, 175, 1); margin-top: 50px">Welcome!</h2>
            <p style="margin-top: 60px; color: rgba(35, 31, 32, 1); font-size: 16px; padding: 0 130px">
              Hi <b>${email}</b>,
            </p>
            <p style="color: rgba(35, 31, 32, 1); font-size: 16px; font-weight: 500; margin: 35px 0 25px">
              An account has been created for you. To gain access please click the button below.
            </p>
            <div style="margin: 60px 0 120px">
              <a href="${urlRoute}" style="font-size: 14px; color: rgba(255, 255, 255, 1); background-color: rgba(78, 138, 201, 1); padding: 10px 60px; border-radius: 6px; text-decoration: none">
                Activate Account
              </a>
            </div>
          </div>
          <div style="width: 100%; height: 1px; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: rgba(215, 222, 234, 1)"></div>
          <div style="text-align: center">
            <p style="color: rgba(158, 160, 165, 1); font-size: 12px; font-weight: 500; margin: 35px 0 25px">
              This email and its contents (including any attachments, the "information") are intended only for the
              person or entity to which the information is addressed. if you are not the intended recipient of the
              information, be aware that any use, review retransmission, distribution, or reproduction of, or any action
              taken in reliance on the contents of, the information is strictly prohibited. if you have received this
              communication in error, please notify the sender immediately and delete the information entirely and
              permanently from all systems.
            </p>
          </div>
        </div>
      </td>
    </tr>
 </div>`];
  return aMessage[iPos]
}
const sendEmail = async (email, subject, urlRoute, iPos) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE, //EMAIL_SERVICE=gmail
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: messageMail(email, urlRoute, iPos),
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
