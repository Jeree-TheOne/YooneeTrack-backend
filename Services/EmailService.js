const nodemailer = require('nodemailer')

class EmailService {

  constructor() {
    this.transporter = new nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD 
      }
    })
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на ' + process.env.API_URL,
      text: '',
      html: 
          `
          <div>
            <h1>Для активации аккаунта перейдите по ссылке:</h1></br>
            <a href="${link}">${link}</a>
          </div>

          `
    })
  }
}

module.exports = new EmailService();