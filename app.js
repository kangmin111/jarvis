// 1. 서비스 워커 등록 (PWA 설치 활성화용)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

const core = document.getElementById('core');
const startBtn = document.getElementById('startBtn');
const log = document.getElementById('log');

// 2. 음성 인식(STT) 설정
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'ko-KR';
recognition.continuous = true;
recognition.interimResults = false;

let isSystemActive = false;

// 3. 음성 합성(TTS - 자비스 목소리)
function speak(text) {
  log.innerText = `JARVIS: ${text}`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 1.05; // 말하는 속도
  window.speechSynthesis.speak(utterance);
}

// 4. 명령어 처리기 (여기에 나중에 Gemini API를 연결하면 됨)
function processCommand(command) {
  log.innerText = `명령 인식됨: "${command}"`;

  if (command.includes('지메일') || command.includes('gmail') || command.includes('메일')) {
    speak('네, 지메일을 열겠습니다.');
    window.open('https://mail.google.com', '_blank');
  } 
  else if (command.includes('유튜브')) {
    speak('유튜브를 실행합니다.');
    window.open('https://www.youtube.com', '_blank');
  } 
  else if (command.includes('클래스룸')) {
    speak('구글 클래스룸으로 이동합니다.');
    window.open('https://classroom.google.com', '_blank');
  }
  else if (command.includes('검색')) {
    // 예: "자비스 고양이 검색해줘" -> "고양이" 추출
    const query = command.replace('검색해줘', '').replace('검색', '').trim();
    speak(`${query}에 대해 검색하겠습니다.`);
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  }
  else if (command.includes('안녕') || command.includes('불렀어')) {
    speak('네, 말씀하십시오.');
  }
  else {
    speak('해당 명령은 아직 학습되지 않았습니다.');
  }
}

// 5. 음성 인식 결과 처리
recognition.onresult = (event) => {
  const lastIndex = event.results.length - 1;
  const transcript = event.results[lastIndex][0].transcript.trim();
  console.log('들린 소리:', transcript);

  // "자비스" 호출어 감지
  if (transcript.includes('자비스')) {
    // "자비스" 이후의 실제 명령어만 잘라내기
    const command = transcript.split('자비스')[1].trim();
    if (command.length === 0) {
      speak('네, 부르셨습니까?');
    } else {
      processCommand(command);
    }
  }
};

// 6. 음성 인식이 자동으로 꺼지는 현상 방지 (상시 대기 유지)
recognition.onend = () => {
  if (isSystemActive) {
    recognition.start();
  }
};

// 7. 시스템 가동 버튼 클릭
startBtn.addEventListener('click', () => {
  isSystemActive = true;
  recognition.start();
  startBtn.style.display = 'none';
  core.innerText = 'ONLINE';
  core.classList.add('listening');
  speak('자비스 시스템을 가동합니다. 언제든 불러주십시오.');
});