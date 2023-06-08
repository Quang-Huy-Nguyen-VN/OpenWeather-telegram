
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require('express');
const app = express();
const huyen = [
  {'id': 2, 'name': 'Phủ Lý', 'lat': '20.5411', 'lon': '105.9139', 'telegram_id': '-819622414'},
  {'id': 3, 'name': 'Bình Lục', 'lat': '20.48944', 'lon': '106.00917', 'telegram_id': '-819622414'},
  {'id': 4, 'name': 'Duy Tiên', 'lat': '20.625808', 'lon': '105.963256', 'telegram_id': '-819622414'},
  {'id': 5, 'name': 'Lý Nhân', 'lat': '20.585867', 'lon': '106.073996', 'telegram_id': '-819622414'},
  {'id': 6, 'name': 'Kim Bảng', 'lat': '20.581667', 'lon': '105.873333', 'telegram_id': '-819622414'},
  {'id': 7, 'name': 'Thanh Liêm', 'lat': '20.54389', 'lon': '105.9119', 'telegram_id': '-819622414'}
];
app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/*
/
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FUNCTION SEARCHING//
/*
const GOOGLE_API_KEY = 'AIzaSyDWfmdHdFTwsVOlSJdIkmf0q-gIR7mvqCQ'; //API KEY GOOGLE
const SEARCH_ENGINE_ID = 'a0390e5337ea64b5e'; //API KEY GOOGLE SEARCHING ENGINE

bot.onText(/\/timkiem (.+)/, async (message, match) => {
  const chatId = message.chat.id;
  const searchQuery = match[1];

  axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: GOOGLE_API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: searchQuery,
      },
    })
    .then((response) => {
      const searchResults = response.data.items;

      if (searchResults && searchResults.length > 0) {
        let message = '';

        for (const result of searchResults) {
          message += `${result.title}\n${result.link}\n\n`;
        }

        bot.sendMessage(chatId, message);
      } else {
        bot.sendMessage(chatId, 'Không tìm thấy kết quả.');
      }
    })
    .catch((error) => {
      console.error('Lỗi tìm kiếm:', error);
      bot.sendMessage(chatId, 'Đã xảy ra lỗi khi tìm kiếm dữ liệu.');
    });
});
*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////
const token = "6268224794:AAEFT_tGfmMt-DqKSjqpWkUy_9cDHl5a9DM";

const bot = new TelegramBot(token, { polling: true });

function index(request) {
   for (var a = 0; a < huyen.length; a++) {
    var item = huyen[a];
    var coordinate = [item.lat, item.lon, item.name, item.telegram_id];
    getWeatherData(coordinate);
  }
}

bot.onText(/\/weather/, async (msg, match) => {
  const chatId = msg.chat.id;
  const response = await getWeatherData();

  if (response.success) {
    bot.sendMessage(chatId, response.message);
  } else {
    bot.sendMessage(chatId, 'Không thể lấy dữ liệu thời tiết.');
  }
});

//TỰ ĐỘNG CHẠY TIN NHẮN THÔNG BÁO
const cron = require('node-cron');
cron.schedule('7 9 * * *', async () => {
  for (var a = 0; a < huyen.length; a++) {
    var item = huyen[a];
    var coordinate = [item.lat, item.lon, item.name, item.telegram_id];
    getWeatherData(coordinate);
  }
}, {
  timezone: 'Asia/Ho_Chi_Minh'
});

async function getWeatherData(item) {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${item.lat}&lon=${item.lon}&units=metric&lang=vi&appid=6599a7ee10534ac937d4a6ce1e8f73a3&units=metric`);
      const weatherData = response.data;

      // Lấy thời gian thực
      var today = new Date();
      var currentHour = today.getHours();
      var currentMinute = today.getMinutes();
      var currentSecond = today.getSeconds();

      // Thêm các số 0 vào đầu nếu chỉ có một chữ số
      var formHour = ("0" + currentHour).slice(-2);
      var formMinute = ("0" + currentMinute).slice(-2);
      var formSecond = ("0" + currentSecond).slice(-2);

      var currentTime = formHour + ":" + formMinute + ":" + formSecond;

      let i;
      if (currentTime < "03:00:00") {
        i = 0;
      }
      else if (currentTime >= "03:00:00" && currentTime < "06:00:00") {
        i = 1;
      }
      else if (currentTime >= "06:00:00" && currentTime < "09:00:00") {
        i = 2;
      }
      else if (currentTime >= "09:00:00" && currentTime < "12:00:00") {
        i = 3;
      }
      else if (currentTime >= "12:00:00" && currentTime < "15:00:00") {
        i = 4;
      }
      else if (currentTime >= "15:00:00" && currentTime < "18:00:00") {
        i = 5;
      }
      else if (currentTime >= "18:00:00" && currentTime < "21:00:00") {
        i = 6;
      }
      else if (currentTime >= "21:00:00" && currentTime <= "23:59:59") {
        i = 7;
      }

      if (weatherData.list) {
        const temperature = weatherData.list[i].main.temp;
        const weatherDescription = weatherData.list[i].weather[0].description;
        const temperatureFeelsLike = weatherData.list[i].feels_like;
        const temperatureMin = weatherData.list[i].main.temp_min;
        const temperatureMax = weatherData.list[i].main.temp_max;
        const humidity = weatherData.list[i].main.humidity;
        const windSpeed = weatherData.list[i].wind.speed;
        const clouds = weatherData.list[i].clouds.all;
        const pop = Math.round(weatherData.list[i].pop * 100);
        const icon = weatherData.list[i].weather[0].icon;
        const imageUrl = `http://api.openweathermap.org/img/w/${icon}.png`;
        const message = `Thời tiết tại ${item.name}: ${weatherDescription} \n Nhiệt độ hiện tại : ${temperature}°C \n Nhiệt độ cảm nhận: ${temperatureFeelsLike}°C \n Nhiệt độ thấp nhất trong ngày : ${temperatureMin}°C \n Nhiệt độ cao nhất trong ngày : ${temperatureMax}°C \n Độ ẩm : ${humidity}% \n Vận tốc gió : ${windSpeed}m/s  \n Mây che phủ : ${clouds}% \n Xác suất mưa (trong 3h tới): ${pop}%` ;
        bot.sendPhoto(item.telegram_id, imageUrl, { caption: message });
      }
      return 1;
}
