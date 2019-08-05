import axios from "axios";

export function sendEmail(emailReceiver, emailSubject, emailContent) {
  return axios.post(`https://hug-a-pet.herokuapp.com/emails/send-email`, {
    emailReceiver: emailReceiver,
    emailSubject: emailSubject,
    emailContent: emailContent
  });
}

export function sendEmailToAdmin(emailReceiver, emailSubject, emailContent) {
    return axios.post(`https://hug-a-pet.herokuapp.com/emails/send-email-to-admin-after-verfication`, {
      emailReceiver: emailReceiver,
      emailSubject: emailSubject,
      emailContent: emailContent
    });
  }
  