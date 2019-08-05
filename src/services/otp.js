import axios from "axios";

export function sendOtp(number) {
  let twilioFormat = number.split(" ");
  return axios.post(`https://hug-a-pet.herokuapp.com/users/send-otp`, {
    phoneNumber: twilioFormat[1] + twilioFormat[2]
  });
}


export function verifyOtp(number, token) {
  let twilioFormat = number.split(" ");
  return axios.post(`https://hug-a-pet.herokuapp.com/users/verify-otp`, {
    token: token,
    phoneNumber: twilioFormat[1] + twilioFormat[2]
  });
}