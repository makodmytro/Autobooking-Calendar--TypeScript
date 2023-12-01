import { WebDriver, Builder, By, until } from 'selenium-webdriver';
import axios from 'axios';

const access_token = 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzAxMTEwNTgyLCJqdGkiOiI1ZTA5OGFmYS0wZGNiLTQxNTEtYmU5Ni03ZmU3OTM5YWE2MjgiLCJ1c2VyX3V1aWQiOiIwZWRiZGFlMS03NTk1LTRmOGYtODk3Zi0zMDA2MWZjNjRlYTgifQ.fx_ImaAFuPRfaeIO2cM_vHGc_lSTPh7EKPFF5puAjo573SE3nZRQ_pQ_-tEXSmReZ9YWuvGWgXwc17NHhESFqQ';
const event_type = 'https://api.calendly.com/event_types/3f1111db-eccb-4b66-b37c-8ded1451f6db';
const test_start_time = '2023-12-21T20:00.00Z';
const test_end_time = '2023-12-25T24:00.00Z';

const thomas_timezone = 'CET';

const test_userTimezone = 'America/Phoenix';
const test_datetime = '2023-12-22T17:00:00Z';

// cache config setting
var cache_key = '';
const cache: Map<string, any[]> = new Map();

// Custom exception class for "Slot Already Booked" scenario
class SlotAlreadyBookedException extends Error {
  constructor(message?: string) {
    super(message || 'Slot is already booked.');
    this.name = 'SlotAlreadyBookedException';
  }
}


// get your available times on UTC
async function get_available_times(timezone: string/* No need */): Promise<any[] | any> {
  //  get start datetime and end datetime
  // const startDate = new Date();
  // const formattedStartDate: string = startDate.toISOString();
  // const daysToAdd = 5;
  // const endDate = new Date(startDate);
  // endDate.setDate(startDate.getDate() + daysToAdd);
  // const formattedEndDate: string = endDate.toISOString();

  const today = new Date();

  // for test
  var cache_key = `${event_type}_${test_start_time}_${test_end_time}_${today.toISOString().split('T')[0]}`;
  
  // for real
  // const cache_key = `${event_type}_${formattedStartDate}_${formattedEndDate}`;

  // Check if data is already in the cache for today
  if (cache.has(cache_key)) {
    console.log('Data retrieved from cache.');
    return cache.get(cache_key);
  }

  // If not in the cache, make the API request
  const url = 'https://api.calendly.com/event_type_available_times';

  const options = {
    method: 'GET',
    url: url,
    // for test
    params: {
      event_type: event_type,
      start_time: test_start_time,
      end_time: test_end_time
    },

    // for real
    // params: {
    //   event_type: event_type,
    //   start_time: formattedStartDate,
    //   end_time: formattedEndDate
    // },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };
  try {
    const response = await axios.request(options);
    const available_days = await response.data.collection;
  
    // Update the cache with the current data
    cache.set(cache_key, available_days);
  
    return available_days;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function book_appointment(tdatetime: string, timezone: string): Promise<void> {
  var available_times = await get_available_times(thomas_timezone) as any;
  if(!available_times){
    return ;
  }

  // convert datetime to UTC
  const usertime = new Date(tdatetime);
  const formattedUsertime: string = usertime.toISOString();
  var booking_point;
  for (var day of available_times) {
    console.log(day['start_time'])
    if (new Date(day['start_time']).toISOString() == formattedUsertime) {
      booking_point = day;
      day['invitees_remaining'] = day['invitees_remaining'] - 1;
      // remove unavailable day
      if (day['invitees_remaining'] === 0) {
        available_times.splice(available_times.indexOf(day), 1);
        cache.set(cache_key, available_times);
      }
      break;
    }
  }

  console.log(booking_point)

  if(!booking_point){
    throw new SlotAlreadyBookedException('Slot is already booked.');
  }

  try {
    const calendly_url = booking_point['scheduling_url'];
    
    // Use the appropriate webdriver for your browser (e.g., ChromeDriver, GeckoDriver for Firefox)
    const driver: WebDriver = new Builder()
      .forBrowser('chrome')
      .build();

    try {
      // Open the Calendly URL
      driver.get(calendly_url);

      // Wait for the page to load
      const element = await driver.wait(
        until.elementLocated(By.css('[id="onetrust-accept-btn-handler"]')),
        10000 // Adjust the timeout as needed
      );
      
      if(element){
        element.click();
      }

      const name_element = await driver.findElement(By.css('[name="full_name"]'));
      name_element.clear();
      name_element.sendKeys('Thomas');

      const email_element = await driver.findElement(By.css('[name="email"]'));
      email_element.clear();
      email_element.sendKeys('t@air.ai');

      const submit_button = await driver.findElement(By.xpath('//button[@type="submit"]'));
      submit_button.click();

      // Wait for the confirmation page to load
      console.log('Booking successful!');
    } catch (e) {
      console.log(`Error: ${e}`);
    } finally {
      // Close the browser
      await driver.quit();
    }
  } catch (e) {
    console.log(`Error: ${e}`);
  }
}

book_appointment(test_datetime, test_userTimezone);