// import axios from 'axios';

// export const sendOrderToTelegram = async (orderDetails: string) => {
//   const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;
//   const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

//   const orderDetailsWithDate = `Нове замовлення:\n${orderDetails}\nДата заповнення: ${new Date().toLocaleString()}`;
//   try {
//     const response = await axios.post(url, {
//       chat_id: TELEGRAM_CHAT_ID,
//       text: orderDetailsWithDate,
//     });
//     console.log('Message sent:', response.data);
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error(
//         'Error sending message:',
//         error.response?.data || error.message
//       );
//     } else {
//       console.error('Unexpected error:', error);
//     }
//   }
// };
