let radio;
let submitButton;
let nextButton;
let questionIndex = 0;
let questions = [];
let correctAnswers = 0;
let wrongAnswers = 0;
let result = "";

function preload() {
  questions = loadTable('questions.csv', 'csv', 'header', 
    () => console.log('File loaded successfully'), 
    (err) => console.error('Error loading file:', err)
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 固定画布大小
  setupQuestion();
}

function setupQuestion() {
  // 移除旧的选项和按钮
  if (radio) {
    radio.remove(); // 移除旧的选项
    radio = null;
  }
  
  if (submitButton) {
    submitButton.remove(); // 移除旧的送出按钮
    submitButton = null;
  }

  // 加载下一题
  if (questionIndex < questions.getRowCount()) {
    let row = questions.getRow(questionIndex);
    let question = row.get('question');
    let options = row.get('options') ? row.get('options').split(';') : [];
    let correctAnswer = row.get('correctAnswer');
    console.log('正確答案:', correctAnswer); // 调试日志
    
    if (options.length === 0) {
      result = "選項加載失敗，請檢查數據！";
      console.error("選項加載失敗，請檢查數據！");
      return;
    }
    
    // 绘制问题
    textAlign(CENTER);
    textSize(24);
    text(question, width / 2, height / 2 - 150); // 题目置中
    
    // 创建选项
    radio = createRadio();
    radio.style('font-size', '20px');
    radio.position(300, 300); // 固定位置
    radio.style('line-height', '30px'); // 设置选项的垂直间距
    options.forEach(option => radio.option(option));
    radio.style('opacity', '1'); // 确保新选项可见
    
    // 创建送出按钮
    submitButton = createButton('送出');
    submitButton.style('font-size', '20px');
    submitButton.position(300, 300 + options.length * 40); // 根据选项数量调整按钮位置
    submitButton.style('opacity', '1');
    submitButton.mousePressed(() => {
      console.log('送出按鈕被按下'); // 调试日志
      checkAnswer(correctAnswer); // 检查答案并加载下一题
    });
    
    result = ""; // 清空结果
  } else {
    result = `測驗結束！答對: ${correctAnswers} 題，答錯: ${wrongAnswers} 題`;
  }
}

function checkAnswer(correctAnswer) {
  if (!radio) {
    console.log("Radio 狀態:", radio);
    console.log("選擇的答案:", radio ? radio.value() : "未選擇");
    result = "系統錯誤，請重新開始測驗！";
    return;
  }

  let selected = radio.value();
  if (!selected) {
    result = "請選擇一個答案！";
    console.error("未選擇任何選項！");
    return;
  }

  if (selected === correctAnswer) {
    correctAnswers++;
    result = "答對了！";
  } else {
    wrongAnswers++;
    result = "答錯了！";
  }

  // 将选项设置为不可见
  if (radio) {
    radio.style('visibility', 'hidden'); // 隐藏选项
  }

  // 延迟加载下一题，给用户时间查看结果
  setTimeout(() => {
    questionIndex++;
    setupQuestion(); // 加载下一题
  }, 1000); // 延迟 1 秒
}

function draw() {
  // 根据鼠标位置动态设置背景颜色
  let r = map(mouseX, 0, width, 200, 255);
  let g = map(mouseY, 0, height, 200, 255);
  let b = map(mouseX + mouseY, 0, width + height, 200, 255);
  background(r, g, b); // 设置背景颜色

  textAlign(CENTER);
  textSize(24);
  
  // 绘制问题
  if (questionIndex < questions.getRowCount()) {
    let question = questions.getString(questionIndex, 'question');
    text(question, width / 2, height / 2 - 150); // 题目置中
  }
  
  // 绘制结果
  if (result) {
    text(result, width / 2, height / 2 + 150); // 结果置中
  }
  
  // 顯示左上角的文字
  textAlign(LEFT);
  textSize(20);
  text("413730481 張瑋玲", 10, 20);
}