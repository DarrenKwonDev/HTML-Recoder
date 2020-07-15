import "./styles.css";
import "regenerator-runtime/runtime";

const RecodingButton = document.querySelector("button");
const recodingTime = document.querySelector(".recodingTime");

let time = 0;
let audioData = [];
let mediaRecorder;

const onRecodingStopClick = function (e) {
  // 우선 녹화를 멈춥니다.
  mediaRecorder.stop();
  // 정지 이벤트를 지우고 재녹화 이벤트를 달아줍니다.
  RecodingButton.removeEventListener("click", onRecodingStopClick);
  RecodingButton.addEventListener("click", onRecodingClick);

  // 텍스트 변화
  RecodingButton.innerHTML = "Start Recoding";
  recodingTime.innerHTML = "";
  time = 0;
  console.log(audioData);

  // 받은 audioData를 전부 합쳐서 하나의 Blob으로 만듦
  let fullBlob = new Blob(audioData, {
    mimeType: "audio/webm;codecs=opus",
  });

  // // 다운로드
  // const audioDownloadLink = document.createElement("a");
  // audioDownloadLink.href = URL.createObjectURL(fullBlob);
  // audioDownloadLink.download = "Audio.webm";
  // document.body.appendChild(audioDownloadLink);
  // audioDownloadLink.click();
};

const onRecodingClick = function (e) {
  // stream을 만들어냅니다.
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      // mediaRecoder로 녹음을 시작합니다.
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      // 녹화가 시작되었으므로 버튼에서 녹화 이벤트를 제거하고 녹화 중지 이벤트를 달아줍니다.
      RecodingButton.removeEventListener("click", onRecodingClick);
      RecodingButton.addEventListener("click", onRecodingStopClick);

      // 버튼의 글을 바꿉니다.
      RecodingButton.innerHTML = "Stop Recoding";

      // 녹화 시작. 1초마다 chunk를 생성
      mediaRecorder.start(1000);

      // start에 설정한 timeslice에 따라 1초 마다 dataavailable한 blob 추출됨

      mediaRecorder.addEventListener("dataavailable", (e) => {
        time++;
        recodingTime.innerHTML = `Recoding for ${time}`;
        console.log(e.data);
        audioData.push(e.data);
      });
    })
    .catch((err) => {
      RecodingButton.innerHTML = "Error!";
      RecodingButton.removeEventListener("click", onRecodingClick);
    });
};

RecodingButton.addEventListener("click", onRecodingClick);
