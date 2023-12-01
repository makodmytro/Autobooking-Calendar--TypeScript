"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var selenium_webdriver_1 = require("selenium-webdriver");
var axios_1 = require("axios");
var access_token = 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzAxMTEwNTgyLCJqdGkiOiI1ZTA5OGFmYS0wZGNiLTQxNTEtYmU5Ni03ZmU3OTM5YWE2MjgiLCJ1c2VyX3V1aWQiOiIwZWRiZGFlMS03NTk1LTRmOGYtODk3Zi0zMDA2MWZjNjRlYTgifQ.fx_ImaAFuPRfaeIO2cM_vHGc_lSTPh7EKPFF5puAjo573SE3nZRQ_pQ_-tEXSmReZ9YWuvGWgXwc17NHhESFqQ';
var event_type = 'https://api.calendly.com/event_types/3f1111db-eccb-4b66-b37c-8ded1451f6db';
var test_start_time = '2023-12-21T20:00.00Z';
var test_end_time = '2023-12-25T24:00.00Z';
var thomas_timezone = 'CET';
var test_userTimezone = 'America/Phoenix';
var test_datetime = '2023-12-22T17:00:00Z';
// cache config setting
var cache_key = '';
var cache = new Map();
// Custom exception class for "Slot Already Booked" scenario
var SlotAlreadyBookedException = /** @class */ (function (_super) {
    __extends(SlotAlreadyBookedException, _super);
    function SlotAlreadyBookedException(message) {
        var _this = _super.call(this, message || 'Slot is already booked.') || this;
        _this.name = 'SlotAlreadyBookedException';
        return _this;
    }
    return SlotAlreadyBookedException;
}(Error));
// get your available times on UTC
function get_available_times(timezone /* No need */) {
    return __awaiter(this, void 0, void 0, function () {
        var today, cache_key, url, options, response, available_days, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    today = new Date();
                    cache_key = "".concat(event_type, "_").concat(test_start_time, "_").concat(test_end_time, "_").concat(today.toISOString().split('T')[0]);
                    // for real
                    // const cache_key = `${event_type}_${formattedStartDate}_${formattedEndDate}`;
                    // Check if data is already in the cache for today
                    if (cache.has(cache_key)) {
                        console.log('Data retrieved from cache.');
                        return [2 /*return*/, cache.get(cache_key)];
                    }
                    url = 'https://api.calendly.com/event_type_available_times';
                    options = {
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
                            Authorization: "Bearer ".concat(access_token),
                        },
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.request(options)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.data.collection];
                case 3:
                    available_days = _a.sent();
                    // Update the cache with the current data
                    cache.set(cache_key, available_days);
                    return [2 /*return*/, available_days];
                case 4:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function book_appointment(tdatetime, timezone) {
    return __awaiter(this, void 0, void 0, function () {
        var available_times, usertime, formattedUsertime, booking_point, _i, available_times_1, day, calendly_url, driver, element, name_element, email_element, submit_button, e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get_available_times(thomas_timezone)];
                case 1:
                    available_times = _a.sent();
                    if (!available_times) {
                        return [2 /*return*/];
                    }
                    usertime = new Date(tdatetime);
                    formattedUsertime = usertime.toISOString();
                    for (_i = 0, available_times_1 = available_times; _i < available_times_1.length; _i++) {
                        day = available_times_1[_i];
                        console.log(day['start_time']);
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
                    console.log(booking_point);
                    if (!booking_point) {
                        throw new SlotAlreadyBookedException('Slot is already booked.');
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 12, , 13]);
                    calendly_url = booking_point['scheduling_url'];
                    driver = new selenium_webdriver_1.Builder()
                        .forBrowser('chrome')
                        .build();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 8, 9, 11]);
                    // Open the Calendly URL
                    driver.get(calendly_url);
                    return [4 /*yield*/, driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css('[id="onetrust-accept-btn-handler"]')), 10000 // Adjust the timeout as needed
                        )];
                case 4:
                    element = _a.sent();
                    if (element) {
                        element.click();
                    }
                    return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.css('[name="full_name"]'))];
                case 5:
                    name_element = _a.sent();
                    name_element.clear();
                    name_element.sendKeys('Thomas');
                    return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.css('[name="email"]'))];
                case 6:
                    email_element = _a.sent();
                    email_element.clear();
                    email_element.sendKeys('t@air.ai');
                    return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.xpath('//button[@type="submit"]'))];
                case 7:
                    submit_button = _a.sent();
                    submit_button.click();
                    // Wait for the confirmation page to load
                    console.log('Booking successful!');
                    return [3 /*break*/, 11];
                case 8:
                    e_1 = _a.sent();
                    console.log("Error: ".concat(e_1));
                    return [3 /*break*/, 11];
                case 9: 
                // Close the browser
                return [4 /*yield*/, driver.quit()];
                case 10:
                    // Close the browser
                    _a.sent();
                    return [7 /*endfinally*/];
                case 11: return [3 /*break*/, 13];
                case 12:
                    e_2 = _a.sent();
                    console.log("Error: ".concat(e_2));
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
book_appointment(test_datetime, test_userTimezone);
