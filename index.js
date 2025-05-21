/**
 * 专注学习定时提示程序
 * @module index
 */

const player = require('play-sound')();
const path = require('path');

// 三种提示音文件路径
const SHORT_BREAK_SOUND = path.join(__dirname, 'ding.mp3'); // 短休息提示音
const START_SOUND = path.join(__dirname, 'start.mp3');      // 学习开始提示音
const LONG_BREAK_SOUND = path.join(__dirname, 'long_break.mp3'); // 长休息提示音

// 时间常量（毫秒）
const SHORT_BREAK_DURATION = 20 * 1000;      // 短休息20秒
const LONG_BREAK_DURATION = 20 * 60 * 1000;  // 长休息20分钟
const STUDY_CYCLE = 90 * 60 * 1000;          // 学习90分钟
const MIN_INTERVAL = 3 * 60 * 1000;          // 3分钟
const MAX_INTERVAL = 5 * 60 * 1000;          // 5分钟

/**
 * 播放指定提示音
 * @param {string} soundPath 音频文件路径
 */
function playSound(soundPath) {
  player.play(soundPath, function(err){
    if (err) console.error('播放失败:', err);
  });
}

let studyStartTime = Date.now(); // 当前学习周期的起始时间
let accumulatedStudyTime = 0;    // 累计学习时间
let studyTimer = null;           // 学习阶段定时器
let isLongBreak = false;         // 是否处于长休息

/**
 * 开始学习阶段
 */
function startStudy() {
  isLongBreak = false;
  studyStartTime = Date.now();
  accumulatedStudyTime = 0;
  playSound(START_SOUND);
  console.log('开始学习！（已播放开始提示音）');
  scheduleNextShortBreak();
}

/**
 * 安排下一个短休息
 */
function scheduleNextShortBreak() {
  // 计算下次短休息的随机间隔
  const delay = Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1)) + MIN_INTERVAL;
  console.log(`下次短休息将在${(delay/1000/60).toFixed(2)}分钟后`);
  studyTimer = setTimeout(() => {
    accumulatedStudyTime += delay;
    // 检查是否到达90分钟
    if (accumulatedStudyTime >= STUDY_CYCLE) {
      startLongBreak();
    } else {
      startShortBreak();
    }
  }, delay);
}

/**
 * 开始短休息
 */
function startShortBreak() {
  console.log('短休息开始，休息20秒');
  playSound(SHORT_BREAK_SOUND);
  setTimeout(() => {
    console.log('短休息结束，继续学习');
    playSound(START_SOUND);
    scheduleNextShortBreak();
  }, SHORT_BREAK_DURATION);
}

/**
 * 开始长休息
 */
function startLongBreak() {
  console.log('学习90分钟已完成，开始长休息20分钟');
  playSound(LONG_BREAK_SOUND);
  isLongBreak = true;
  setTimeout(() => {
    console.log('长休息结束，重新开始学习');
    playSound(START_SOUND);
    startStudy(); // 重新开始学习，累计时间清零
  }, LONG_BREAK_DURATION);
}

// 程序入口
startStudy();